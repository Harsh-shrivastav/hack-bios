import React, { useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate } from 'react-router-dom';
import './HackBiosIDCard.css';

// The graphics team's card design (1080 x 1501 PNG). Its photo window is
// TRANSPARENT and fades to black at the bottom, so the visitor's photo is
// simply placed behind it; the name / GitHub / UID are written over the empty
// black area at the bottom. Put the files in public/id-card/.
const CARD_ART = '/id-card/hackbios-id.png';
// The HackBiOS logo, cut out of that artwork, used on the back of the card.
const CARD_LOGO = '/id-card/hackbios-logo.png';
// Standalone HackBIOS participation badge. Put badge.png in public/.
const BADGE_ART = '/badge.png';

const EVENT_NAME = 'HACKBIOS 2026';
// Any button on the site can open this modal by firing this window event
// (the "Create your ID" section does). The listener is set up in the widget below.
const OPEN_EVENT = 'hackbios:open-id';
// What the LinkedIn / WhatsApp buttons pre-fill (the site link is added after it).
const SHARE_TEXT = 'I’m participating in HackBIOS 2026! 🚀 Here’s my ID card. #HackBIOS2026';
const BADGE_SHARE_TEXT = 'I’m participating in HackBIOS 2026! 🚀 Proud to be part of the HackBIOS community. #HackBIOS2026';

// Cards are generated from what the visitor types in and kept on THEIR device
// only (localStorage) — nothing is sent anywhere. If you later have a backend,
// pass a `participant` prop (name, github, photo, uid) and the card will show
// that person directly, with no form.
const STORAGE_KEY = 'hackbios-id-card-v2';

// A GitHub picture shows fine on screen, but to SAVE it into the downloaded image the browser needs GitHub's permission.
// GitHub grants it for the picture's direct address, which its public API tells us. So when someone types a GitHub name
// we look that address up once, fetch the picture, and keep a copy on their device (downloads then always include it).
const PHOTO_MISSING_NOTE = ' Your GitHub picture couldn’t be included — upload a photo to add it.';
const AVATAR_NOTICE = 'We couldn’t fetch your GitHub picture for downloads (your network or GitHub may be blocking it). It still shows on the card here — upload a photo to include a picture in downloaded images.';

const GITHUB_RE = /^[a-z\d](?:[a-z\d]|-(?=[a-z\d])){0,38}$/i;

// ---------------------------------------------------------------------------
// Small helpers
// ---------------------------------------------------------------------------
function extractGithubUsername(value = '') {
  const trimmed = value.trim().replace(/\/$/, '');
  if (!trimmed) return '';
  if (trimmed.includes('github.com/')) {
    return trimmed.split('github.com/')[1].split('/')[0];
  }
  return trimmed.replace(/^@/, '').split('/')[0];
}

// Split into user-perceived characters, so emoji / accented letters aren't cut in half.
function graphemes(text = '') {
  if (typeof Intl !== 'undefined' && Intl.Segmenter) {
    return Array.from(new Intl.Segmenter(undefined, { granularity: 'grapheme' }).segment(text), (s) => s.segment);
  }
  return Array.from(text);
}

// "Aarav Sharma" -> "AS", "Aarav" -> "AA"
function initialsOf(name = '') {
  const words = name.trim().split(/\s+/).filter(Boolean);
  if (words.length >= 2) return (graphemes(words[0])[0] + graphemes(words[words.length - 1])[0]).toUpperCase();
  return graphemes(words[0] || '?').slice(0, 2).join('').toUpperCase();
}

// UID = HB26-<FIRST NAME>-<4 random characters>. The random part is created once
// and kept, so two people with the same name still get different IDs, and a
// person's UID stays the same when they edit their card.
const TAG_CHARS = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
function makeTag() {
  const bytes = new Uint8Array(4);
  if (window.crypto?.getRandomValues) window.crypto.getRandomValues(bytes);
  else for (let i = 0; i < 4; i += 1) bytes[i] = Math.floor(Math.random() * 256);
  return Array.from(bytes, (b) => TAG_CHARS[b % TAG_CHARS.length]).join('');
}
function makeUid(name, tag) {
  // "Åsa" -> "ASA": strip accents before keeping only A-Z / 0-9
  const slug = (name.trim().split(/\s+/)[0] || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 8) || 'HACKER';
  return `HB26-${slug}-${tag}`;
}
const TAG_RE = /^[A-Z0-9]{4}$/;

function loadSaved() {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const v = JSON.parse(raw);
    if (!v || typeof v.name !== 'string' || !v.name.trim()) return null;
    const tag = TAG_RE.test(v.tag || '') ? v.tag : (String(v.uid || '').split('-').pop() || '').toUpperCase();
    const safeTag = TAG_RE.test(tag) ? tag : makeTag();
    return {
      name: v.name,
      github: typeof v.github === 'string' ? v.github : '',
      photo: typeof v.photo === 'string' && v.photo.startsWith('data:image/') ? v.photo : '',
      avatarData: typeof v.avatarData === 'string' && v.avatarData.startsWith('data:image/') ? v.avatarData : '',
      avatarFor: typeof v.avatarFor === 'string' ? v.avatarFor : '',
      tag: safeTag,
      team: sanitizeTeam(v.team),
      uid: makeUid(v.name, safeTag),
    };
  } catch {
    return null;
  }
}

function persist(value) {
  try {
    if (value) window.localStorage.setItem(STORAGE_KEY, JSON.stringify(value));
    else window.localStorage.removeItem(STORAGE_KEY);
    return true;
  } catch {
    return false; // storage full, or blocked (private mode)
  }
}

// In-app browsers (LinkedIn, Instagram, WhatsApp...) often ignore file downloads.
function isInAppBrowser() {
  const ua = navigator.userAgent || '';
  if (/(FBAN|FBAV|FB_IAB|Instagram|LinkedInApp|Snapchat|MicroMessenger|WhatsApp|Line\/|Twitter|GSA\/|; wv\))/i.test(ua)) return true;
  return /(iPhone|iPad|iPod)/.test(ua) && !/Safari\//.test(ua); // iOS web view: no "Safari" token
}

// Shrinks an uploaded photo so it stays small enough to keep on the device.
function fileToDataUrl(file, maxSide = 720) {
  return new Promise((resolve, reject) => {
    if (!file.type.startsWith('image/')) {
      reject(new Error('Please choose an image file.'));
      return;
    }
    if (file.size > 8 * 1024 * 1024) {
      reject(new Error('That image is too large (max 8 MB).'));
      return;
    }
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      const scale = Math.min(1, maxSide / Math.max(img.width, img.height));
      const canvas = document.createElement('canvas');
      canvas.width = Math.round(img.width * scale);
      canvas.height = Math.round(img.height * scale);
      canvas.getContext('2d').drawImage(img, 0, 0, canvas.width, canvas.height);
      URL.revokeObjectURL(url);
      resolve(canvas.toDataURL('image/jpeg', 0.86));
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('Could not read that image — try a JPG or PNG.'));
    };
    img.src = url;
  });
}

function getAvatarUrl(participant) {
  if (participant.photo) return participant.photo; // an uploaded photo always wins
  const username = extractGithubUsername(participant.github);
  if (!username) return '';
  if (participant.avatarData && participant.avatarFor === username) return participant.avatarData; // our saved copy
  return `https://github.com/${username}.png?size=512`; // live picture: fine on screen, can't be saved into an image
}

const withTimeout = (promise, ms) =>
  Promise.race([promise, new Promise((_, reject) => setTimeout(() => reject(new Error('timeout')), ms))]);

// Loads a picture from `url` in CORS mode and returns it as a small JPEG data URL.
// This only succeeds if the server that holds the picture permits it (that's the browser's rule, not ours).
async function pictureToDataUrl(url, ms = 7000) {
  const img = await withTimeout(loadImage(url, true), ms);
  const scale = Math.min(1, 720 / Math.max(img.naturalWidth, img.naturalHeight));
  const canvas = document.createElement('canvas');
  canvas.width = Math.round(img.naturalWidth * scale);
  canvas.height = Math.round(img.naturalHeight * scale);
  canvas.getContext('2d').drawImage(img, 0, 0, canvas.width, canvas.height);
  return canvas.toDataURL('image/jpeg', 0.86); // throws if the browser considers the canvas "tainted"
}

// GitHub's public API allows browsers to ask it questions, and it tells us the picture's DIRECT address. Using that
// address (instead of github.com/<name>.png, which goes through a redirect the browser won't accept) is the key.
async function pictureViaGithubApi(username) {
  const response = await withTimeout(
    fetch(`https://api.github.com/users/${encodeURIComponent(username)}`, { headers: { Accept: 'application/vnd.github+json' } }),
    7000
  );
  if (!response.ok) throw new Error(`GitHub API answered ${response.status}`);
  const { avatar_url: direct } = await response.json();
  if (typeof direct !== 'string' || !direct.startsWith('https://')) throw new Error('no picture address');
  return pictureToDataUrl(`${direct}${direct.includes('?') ? '&' : '?'}s=512`);
}

// Runs the routes side by side and takes the first one that works, so a slow or blocked route doesn't hold the others up.
async function firstWorking(routes) {
  try {
    return await Promise.any(
      routes.map(([name, run]) =>
        run().then(
          (dataUrl) => {
            // eslint-disable-next-line no-console
            console.info(`[HackBiosIDCard] GitHub picture fetched via "${name}"`);
            return dataUrl;
          },
          (error) => {
            // eslint-disable-next-line no-console
            console.info(`[HackBiosIDCard] GitHub picture route "${name}" didn’t work`);
            throw error;
          }
        )
      )
    );
  } catch {
    return null;
  }
}

// Fetches someone's GitHub picture as a data URL that can safely be drawn into the downloaded image.
// The API route is the one that matters; the other two are cheap extra chances. Returns null if all of them fail.
async function fetchGithubAvatar(username) {
  const enc = encodeURIComponent(username);
  return firstWorking([
    ['github-api', () => pictureViaGithubApi(username)],
    ['github-avatars', () => pictureToDataUrl(`https://avatars.githubusercontent.com/${enc}?size=512`)],
    ['github-png', () => pictureToDataUrl(`https://github.com/${enc}.png?size=512`)],
  ]);
}

// ---- Team info (the back of the card) ------------------------------------------------------------
// Just four things: team name, YOUR role in the team, track, college. (Tracks are the ones on your site.)
const TRACKS = ['Healthcare', 'Web3 / Blockchain', 'Web Development', 'Cybersecurity', 'AI / ML', 'FinTech', 'EdTech', 'Open Innovation'];
const ROLE_SUGGESTIONS = ['Team Leader', 'Developer', 'Frontend Developer', 'Backend Developer', 'Full-Stack Developer', 'AI / ML Engineer', 'Designer', 'UI/UX Designer', 'Presenter', 'Researcher', 'Hardware / IoT'];

const cleanText = (value, max) => (typeof value === 'string' ? value.replace(/\s+/g, ' ').trim().slice(0, max) : '');

function sanitizeTeam(team) {
  const src = team && typeof team === 'object' ? team : {};
  return {
    name: cleanText(src.name, 24),
    // cards saved by the previous version had a "team leader" tick-box instead of a role
    role: cleanText(src.role, 24) || (src.lead ? 'Team Leader' : ''),
    track: TRACKS.includes(src.track) ? src.track : '',
    college: cleanText(src.college, 36),
  };
}
const hasTeam = (team) => !!(team.name || team.role || team.track || team.college);
const teamTitleFor = (team) => (team.name || (hasTeam(team) ? 'Unnamed team' : 'No team yet')).toUpperCase();

// TEAM ID: made from the team NAME only (ignoring capitals, spaces and punctuation), so every teammate who types the
// same name gets the same Team ID — no server needed. e.g. "Bug Slayers" -> TM26-7K2Q9X. (Two different teams that
// choose exactly the same name would share an ID.)
const TEAM_ID_CHARS = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
function teamIdFor(name) {
  const key = (name || '').toLowerCase().normalize('NFKD').replace(/[^\p{L}\p{N}]/gu, '');
  if (!key) return '';
  let h = 2166136261; // FNV-1a
  for (const ch of key) {
    h ^= ch.codePointAt(0);
    h = Math.imul(h, 16777619) >>> 0;
  }
  let code = '';
  for (let i = 0; i < 6; i += 1) code += TEAM_ID_CHARS[(h >>> (i * 5)) & 31];
  return `TM26-${code}`;
}

// Long names get a smaller size so they stay on one or two lines.
function nameSizeFor(name = '') {
  const n = name.length;
  if (n <= 12) return 7.4;
  if (n <= 18) return 6;
  return 4.9;
}

const useReducedMotion = () => {
  const query = '(prefers-reduced-motion: reduce)';
  const [reduced, setReduced] = useState(
    () => typeof window !== 'undefined' && !!window.matchMedia?.(query).matches
  );
  useEffect(() => {
    const mq = window.matchMedia(query);
    const on = () => setReduced(mq.matches);
    mq.addEventListener('change', on);
    return () => mq.removeEventListener('change', on);
  }, []);
  return reduced;
};

// ---------------------------------------------------------------------------
// Code 39 barcode (n = narrow, w = wide). Covers A-Z, 0-9 and "-", which is
// everything a UID is made of.
// ---------------------------------------------------------------------------
const CODE39 = {
  '0': 'nnnwwnwnn', '1': 'wnnwnnnnw', '2': 'nnwwnnnnw', '3': 'wnwwnnnnn', '4': 'nnnwwnnnw',
  '5': 'wnnwwnnnn', '6': 'nnwwwnnnn', '7': 'nnnwnnwnw', '8': 'wnnwnnwnn', '9': 'nnwwnnwnn',
  A: 'wnnnnwnnw', B: 'nnwnnwnnw', C: 'wnwnnwnnn', D: 'nnnnwwnnw', E: 'wnnnwwnnn',
  F: 'nnwnwwnnn', G: 'nnnnnwwnw', H: 'wnnnnwwnn', I: 'nnwnnwwnn', J: 'nnnnwwwnn',
  K: 'wnnnnnnww', L: 'nnwnnnnww', M: 'wnwnnnnwn', N: 'nnnnwnnww', O: 'wnnnwnnwn',
  P: 'nnwnwnnwn', Q: 'nnnnnnwww', R: 'wnnnnnwwn', S: 'nnwnnnwwn', T: 'nnnnwnwwn',
  U: 'wwnnnnnnw', V: 'nwwnnnnnw', W: 'wwwnnnnnn', X: 'nwnnwnnnw', Y: 'wwnnwnnnn',
  Z: 'nwwnwnnnn', '-': 'nwnnnnwnw', '.': 'wwnnnnwnn', ' ': 'nwwnnnwnn', '*': 'nwnnwnwnn',
};

// -> { bars: [{ x, w }], total }   (units: narrow = 1, wide = 3)
function code39Bars(value) {
  const text = `*${value.toUpperCase().replace(/[^A-Z0-9. -]/g, '-')}*`; // * = start / stop
  const bars = [];
  let x = 0;
  for (const ch of text) {
    const pattern = CODE39[ch];
    for (let i = 0; i < 9; i += 1) {
      const w = pattern[i] === 'w' ? 3 : 1;
      if (i % 2 === 0) bars.push({ x, w }); // even slots are bars, odd are gaps
      x += w;
    }
    x += 1; // narrow gap between characters
  }
  return { bars, total: x - 1 };
}

function Code39({ value }) {
  const { bars, total } = code39Bars(value);
  return (
    <svg viewBox={`0 0 ${total} 1`} preserveAspectRatio="none" shapeRendering="crispEdges" aria-hidden="true">
      {bars.map((b) => (
        <rect key={b.x} x={b.x} y="0" width={b.w} height="1" />
      ))}
    </svg>
  );
}

// ---------------------------------------------------------------------------
// Save / share as an image: the card is redrawn on a canvas (1080 x 1501, same
// size as the artwork) so the PNG is sharp and doesn't depend on the screen.
// ---------------------------------------------------------------------------
const W = 1080;
const H = 1501;
const FONT = '"Share Tech Mono", "JetBrains Mono", monospace';

function loadImage(src, cors) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    if (cors) img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error(`Could not load ${src.slice(0, 40)}`));
    img.src = src;
  });
}

// Arabic/Hebrew (right-to-left) and Indic/Thai scripts join their letters, so they must be drawn as ONE run
// (no letter-spacing) or the letters come out unjoined and in the wrong order.
const NEEDS_SHAPING = /[\u0590-\u08FF\u0900-\u0DFF\u0E00-\u0EFF\u1000-\u109F]/;
const IS_RTL = /[\u0590-\u08FF]/;

// Draws text with letter-spacing (character by character, so it works in every browser).
function spaced(ctx, text, x, y, spacing) {
  if (NEEDS_SHAPING.test(text)) {
    ctx.direction = IS_RTL.test(text) ? 'rtl' : 'ltr';
    ctx.fillText(text, x, y);
    ctx.direction = 'ltr';
    return;
  }
  let cx = x;
  for (const ch of graphemes(text)) {
    ctx.fillText(ch, cx, y);
    cx += ctx.measureText(ch).width + spacing;
  }
}
function spacedWidth(ctx, text, spacing) {
  if (NEEDS_SHAPING.test(text)) return ctx.measureText(text).width;
  return graphemes(text).reduce((sum, ch) => sum + ctx.measureText(ch).width + spacing, 0) - spacing;
}

// Word-wraps into at most `maxLines` lines (breaking very long words), adding "…" if cut.
function wrapText(ctx, text, maxW, maxLines, spacing) {
  const lines = [];
  let line = '';
  const push = () => { if (line) lines.push(line); line = ''; };
  for (const word of text.split(/\s+/).filter(Boolean)) {
    const trial = line ? `${line} ${word}` : word;
    if (spacedWidth(ctx, trial, spacing) <= maxW) {
      line = trial;
      continue;
    }
    push();
    let chunk = '';
    for (const ch of graphemes(word)) {
      if (spacedWidth(ctx, chunk + ch, spacing) > maxW && chunk) {
        lines.push(chunk);
        chunk = ch;
      } else chunk += ch;
    }
    line = chunk;
  }
  push();
  if (lines.length > maxLines) {
    const kept = lines.slice(0, maxLines);
    kept[maxLines - 1] = `${kept[maxLines - 1].replace(/.$/, '')}…`;
    return kept;
  }
  return lines;
}

function fitText(ctx, text, maxW) {
  if (ctx.measureText(text).width <= maxW) return text;
  let t = text;
  while (t.length > 1 && ctx.measureText(`${t}…`).width > maxW) t = t.slice(0, -1);
  return `${t}…`;
}

function roundRectPath(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

async function drawFront(ctx, data) {
  const cw = W / 100; // 1 "cqw"
  const username = extractGithubUsername(data.github);
  const avatar = getAvatarUrl(data);
  let photo = null;
  if (avatar) {
    try {
      photo = await loadImage(avatar, !avatar.startsWith('data:'));
    } catch {
      photo = null;
    }
  }

  // photo, behind the artwork's transparent window
  const px = 0.2111 * W;
  const py = 0.0859 * H;
  const pw = 0.5759 * W;
  const ph = 0.5803 * H;
  ctx.save();
  ctx.beginPath();
  ctx.rect(px, py, pw, ph);
  ctx.clip();
  ctx.fillStyle = '#050805';
  ctx.fillRect(px, py, pw, ph);
  if (photo) {
    const s = Math.max(pw / photo.width, ph / photo.height);
    ctx.drawImage(photo, px + (pw - photo.width * s) / 2, py, photo.width * s, photo.height * s); // cover, top-aligned
  } else {
    const g = ctx.createRadialGradient(px + pw / 2, py + ph * 0.38, 0, px + pw / 2, py + ph * 0.38, pw * 0.75);
    g.addColorStop(0, 'rgba(118,247,21,.2)');
    g.addColorStop(1, '#050805');
    ctx.fillStyle = g;
    ctx.fillRect(px, py, pw, ph);
    ctx.fillStyle = '#76f715';
    ctx.font = `${22 * cw}px ${FONT}`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(initialsOf(data.name), px + pw / 2, py + ph * 0.44);
    ctx.textAlign = 'left';
    ctx.textBaseline = 'alphabetic';
  }
  ctx.restore();

  // the graphics team's artwork on top
  ctx.drawImage(await loadImage(CARD_ART), 0, 0, W, H);

  // details, over the empty black area
  const left = 0.15 * W;
  const maxW = W * (1 - 0.15 - 0.07);
  const top = 0.755 * H;
  const bottom = H * (1 - 0.046);
  ctx.textBaseline = 'alphabetic';
  ctx.textAlign = 'left';

  const labelSize = 2 * cw;
  ctx.font = `${labelSize}px ${FONT}`;
  ctx.fillStyle = 'rgba(118,247,21,.85)';
  spaced(ctx, 'IDENTITY', left, top + labelSize * 0.95, 0.3 * labelSize);
  let y = top + labelSize * 1.2 + 1.4 * cw;

  const nameSize = nameSizeFor(data.name) * cw;
  const nameSpacing = 0.02 * nameSize;
  ctx.font = `700 ${nameSize}px ${FONT}`;
  ctx.fillStyle = '#fff';
  const lines = wrapText(ctx, data.name.toUpperCase(), maxW, 2, nameSpacing);
  lines.forEach((ln, i) => spaced(ctx, ln, left, y + nameSize * (0.9 + 1.02 * i), nameSpacing));
  y += nameSize * 1.02 * lines.length;

  if (username) {
    const size = 3.3 * cw;
    y += 1.6 * cw;
    ctx.font = `${size}px ${FONT}`;
    ctx.fillStyle = '#76f715';
    spaced(ctx, `@${username}`, left, y + size * 0.9, 0.04 * size);
  }

  const uidSize = 2.5 * cw;
  ctx.strokeStyle = 'rgba(255,255,255,.14)';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(left, bottom - uidSize * 1.25 - 1.8 * cw);
  ctx.lineTo(left + maxW, bottom - uidSize * 1.25 - 1.8 * cw);
  ctx.stroke();
  ctx.font = `${uidSize}px ${FONT}`;
  ctx.fillStyle = 'rgba(255,255,255,.7)';
  spaced(ctx, `USER ID // ${data.uid}`, left, bottom - uidSize * 0.25, 0.14 * uidSize);

  return !avatar || !!photo; // false = a GitHub picture was wanted but couldn't be loaded
}

async function drawBack(ctx, data) {
  const cw = W / 100;
  const username = extractGithubUsername(data.github);
  const R = 2.6 * cw;

  // background
  ctx.save();
  roundRectPath(ctx, 1, 1, W - 2, H - 2, R);
  ctx.clip();
  ctx.fillStyle = '#030503';
  ctx.fillRect(0, 0, W, H);
  [[0.88, 0.06, 0.16], [0.08, 0.96, 0.08]].forEach(([gx, gy, a]) => {
    const g = ctx.createRadialGradient(W * gx, H * gy, 0, W * gx, H * gy, W * 0.5);
    g.addColorStop(0, `rgba(118,247,21,${a})`);
    g.addColorStop(0.65, 'rgba(118,247,21,0)');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, W, H);
  });
  ctx.restore();
  ctx.strokeStyle = 'rgba(118,247,21,.35)';
  ctx.lineWidth = 2;
  roundRectPath(ctx, 1, 1, W - 2, H - 2, R);
  ctx.stroke();

  // logo
  let logoBottom = 9 * cw;
  try {
    const logo = await loadImage(CARD_LOGO);
    const lw = 0.78 * (W - 16 * cw);
    const lh = (lw * logo.height) / logo.width;
    ctx.drawImage(logo, (W - lw) / 2, 9 * cw, lw, lh);
    logoBottom = 9 * cw + lh;
  } catch {
    /* the back still works without the logo */
  }

  // Team ID barcode, pinned to the bottom (only when the team has a name — that's what the Team ID is made from)
  const padX = 8 * cw;
  const team = sanitizeTeam(data.team);
  const teamId = teamIdFor(team.name);
  const footSize = 2.3 * cw;
  const footBase = H - 5.5 * cw;
  const idSize = 2.5 * cw;
  const idBase = footBase - footSize - 4 * cw;
  const barBottom = idBase - idSize - 2 * cw;
  const barH = 12 * cw;
  const barTop = barBottom - barH;
  let blockBottom = footBase - footSize - 6 * cw; // how far down the team block may reach

  if (teamId) {
    const { bars, total } = code39Bars(teamId);
    const unit = (W - 2 * padX) / total;
    ctx.fillStyle = '#fff';
    bars.forEach((b) => ctx.fillRect(padX + b.x * unit, barTop, b.w * unit, barH));
    ctx.font = `${idSize}px ${FONT}`;
    ctx.fillStyle = 'rgba(255,255,255,.7)';
    ctx.textAlign = 'left';
    const label = `TEAM ID // ${teamId}`;
    spaced(ctx, label, (W - spacedWidth(ctx, label, 0.16 * idSize)) / 2, idBase, 0.16 * idSize);
    blockBottom = barTop;
  }
  ctx.font = `${footSize}px ${FONT}`;
  ctx.fillStyle = 'rgba(255,255,255,.5)';
  ctx.textAlign = 'left';
  const foot = 'SSTC · BHILAI · 2026';
  spaced(ctx, foot, (W - spacedWidth(ctx, foot, 0.3 * footSize)) / 2, footBase, 0.3 * footSize);

  // ----- team block, centred between the logo and the barcode
  const labSize = 2.4 * cw;
  const titleSize = 6.4 * cw;
  const valSize = 3.4 * cw;
  const rowH = 9.6 * cw;
  const contentW = W - 2 * padX;
  const drawLine = (yy) => {
    ctx.strokeStyle = 'rgba(255,255,255,.09)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(padX, yy);
    ctx.lineTo(W - padX, yy);
    ctx.stroke();
  };
  ctx.font = `700 ${titleSize}px ${FONT}`;
  const titleLines = wrapText(ctx, teamTitleFor(team), contentW, 2, 0.02 * titleSize);
  const titleH = titleLines.length * titleSize * 1.08;
  const meta = [['ROLE', team.role], ['TRACK', team.track], ['COLLEGE', team.college]].filter(([, v]) => v);
  const blockH = labSize * 1.5 + 1.6 * cw + titleH + 5 * cw + meta.length * rowH;
  let y = logoBottom + (blockBottom - logoBottom - blockH) / 2;

  ctx.textAlign = 'left';
  ctx.font = `${labSize}px ${FONT}`;
  ctx.fillStyle = 'rgba(118,247,21,.85)';
  spaced(ctx, 'TEAM', padX, y + labSize, 0.22 * labSize);
  y += labSize * 1.5 + 1.6 * cw;
  ctx.font = `700 ${titleSize}px ${FONT}`;
  ctx.fillStyle = '#fff';
  titleLines.forEach((ln, i) => spaced(ctx, ln, padX, y + titleSize * (0.9 + 1.08 * i), 0.02 * titleSize));
  y += titleH + 5 * cw;

  if (meta.length) drawLine(y);
  meta.forEach(([label, value]) => {
    const base = y + rowH / 2 + valSize * 0.35;
    ctx.font = `${labSize}px ${FONT}`;
    ctx.fillStyle = 'rgba(118,247,21,.85)';
    spaced(ctx, label, padX, base, 0.22 * labSize);
    ctx.font = `${valSize}px ${FONT}`;
    ctx.fillStyle = 'rgba(255,255,255,.92)';
    ctx.fillText(fitText(ctx, value, contentW - 21 * cw), padX + 21 * cw, base);
    y += rowH;
    drawLine(y);
  });
}

// ---- Story-fan composition -------------------------------------------------------------
// A portrait 9:16 composition (1080 x 1920) for sharing to Stories/Reels — the front card
// sits fully visible on top, the back card peeks out from behind, offset and rotated.
// The offset is DERIVED from drawBack's own layout, not guessed: the back card's logo ends
// at roughly 23% of its height (see `logoBottom` in drawBack above) — everything below that
// is real information (team name, role/track/college, the barcode). So the front card is
// only ever allowed to reach about 20% into the back card, confining the overlap to the
// logo band and leaving every line of text and the barcode fully legible on both sides.
// Verified by computing the actual rotated-rectangle geometry, not just by eye.
const STORY_W = 1080;
const STORY_H = 1920;
const STORY_FRONT_ROTATE = -5; // degrees
const STORY_BACK_ROTATE = 6;
const STORY_OFFSET_X = 0.34; // back card's horizontal nudge, as a fraction of the (scaled) card width
const STORY_OFFSET_Y = 0.8; // vertical nudge — see the note above for why this specific value
const STORY_TOP_MARGIN = 0.07; // fraction of STORY_H kept clear above the fan
const STORY_CAPTION_H = 0.19; // fraction of STORY_H reserved for the caption text below

function drawStoryCard(ctx, canvas, cx, cy, scale, rotateDeg) {
  const w = W * scale;
  const h = H * scale;
  ctx.save();
  ctx.translate(cx, cy);
  ctx.rotate((rotateDeg * Math.PI) / 180);
  ctx.shadowColor = 'rgba(0,0,0,.55)';
  ctx.shadowBlur = 60;
  ctx.shadowOffsetY = 26;
  ctx.drawImage(canvas, -w / 2, -h / 2, w, h);
  ctx.restore();
}

function composeStoryFan(frontCanvas, backCanvas) {
  const canvas = document.createElement('canvas');
  canvas.width = STORY_W;
  canvas.height = STORY_H;
  const ctx = canvas.getContext('2d');

  ctx.fillStyle = '#040804';
  ctx.fillRect(0, 0, STORY_W, STORY_H);
  const g = ctx.createRadialGradient(STORY_W / 2, STORY_H * 0.42, 0, STORY_W / 2, STORY_H * 0.42, STORY_W * 1.1);
  g.addColorStop(0, 'rgba(60,140,20,.30)');
  g.addColorStop(1, 'rgba(60,140,20,0)');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, STORY_W, STORY_H);
  ctx.strokeStyle = 'rgba(118,247,21,.05)';
  ctx.lineWidth = 2;
  for (let x = 0; x < STORY_W; x += 72) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, STORY_H);
    ctx.stroke();
  }
  for (let y = 0; y < STORY_H; y += 72) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(STORY_W, y);
    ctx.stroke();
  }

  const usableH = STORY_H * (1 - STORY_TOP_MARGIN - STORY_CAPTION_H);
  const cardH = usableH / (STORY_OFFSET_Y + 1);
  const scale = cardH / H;
  const centreX = STORY_W / 2;
  const centreY = STORY_H * STORY_TOP_MARGIN + cardH / 2;
  const frontW = W * scale;
  const frontH = H * scale;
  const backCx = centreX + frontW * STORY_OFFSET_X;
  const backCy = centreY + frontH * STORY_OFFSET_Y;

  drawStoryCard(ctx, backCanvas, backCx, backCy, scale, STORY_BACK_ROTATE);
  drawStoryCard(ctx, frontCanvas, centreX, centreY, scale, STORY_FRONT_ROTATE);

  ctx.textAlign = 'left';
  ctx.textBaseline = 'alphabetic';
  ctx.font = `700 44px ${FONT}`;
  ctx.fillStyle = '#ffffff';
  const line1 = 'I’M PARTICIPATING IN';
  const line2 = 'HACKBIOS 2026';
  spaced(ctx, line1, (STORY_W - spacedWidth(ctx, line1, 4)) / 2, STORY_H - 210, 4);
  spaced(ctx, line2, (STORY_W - spacedWidth(ctx, line2, 4)) / 2, STORY_H - 150, 4);
  ctx.font = `28px ${FONT}`;
  ctx.fillStyle = '#76f715';
  const line3 = 'WWW.HACKBIOS.XYZ';
  spaced(ctx, line3, (STORY_W - spacedWidth(ctx, line3, 7)) / 2, STORY_H - 90, 7);

  return canvas;
}

async function renderSide(data, side) {
  const canvas = document.createElement('canvas');
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext('2d');
  let photoIncluded = true;
  if (side === 'front') photoIncluded = await drawFront(ctx, data);
  else await drawBack(ctx, data);
  return { canvas, photoIncluded };
}

// Both sides together: dark branded background (faint grid + lime glow, like the website), the two cards side by side
// with soft shadows, small FRONT / BACK labels, and the website address at the bottom.
const SHEET = { marginX: 170, gap: 150, top: 150, bottom: 330 };

function composeSheet(frontCanvas, backCanvas) {
  const { marginX, gap, top, bottom } = SHEET;
  const sheetW = marginX * 2 + W * 2 + gap;
  const sheetH = top + H + bottom;
  const canvas = document.createElement('canvas');
  canvas.width = sheetW;
  canvas.height = sheetH;
  const ctx = canvas.getContext('2d');
  const xs = [marginX, marginX + W + gap];

  ctx.fillStyle = '#040804';
  ctx.fillRect(0, 0, sheetW, sheetH);
  xs.forEach((x) => {
    const cx = x + W / 2;
    const cy = top + H / 2;
    const g = ctx.createRadialGradient(cx, cy, W * 0.25, cx, cy, W * 1.0);
    g.addColorStop(0, 'rgba(60,140,20,.32)');
    g.addColorStop(1, 'rgba(60,140,20,0)');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, sheetW, sheetH);
  });
  ctx.strokeStyle = 'rgba(118,247,21,.05)';
  ctx.lineWidth = 2;
  for (let x = 0; x < sheetW; x += 90) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, sheetH);
    ctx.stroke();
  }
  for (let y = 0; y < sheetH; y += 90) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(sheetW, y);
    ctx.stroke();
  }

  [frontCanvas, backCanvas].forEach((card, i) => {
    ctx.save();
    ctx.shadowColor = 'rgba(0,0,0,.7)';
    ctx.shadowBlur = 90;
    ctx.shadowOffsetY = 36;
    ctx.drawImage(card, xs[i], top);
    ctx.restore();
  });

  ctx.textAlign = 'left';
  ctx.textBaseline = 'alphabetic';
  ctx.font = `30px ${FONT}`;
  ctx.fillStyle = 'rgba(118,247,21,.9)';
  [['FRONT', xs[0]], ['BACK', xs[1]]].forEach(([label, x]) => {
    const w = spacedWidth(ctx, label, 9);
    spaced(ctx, label, x + (W - w) / 2, top + H + 85, 9);
  });
  // The message and the link are printed on the picture itself, so they travel with it wherever it's shared.
  ctx.font = `700 46px ${FONT}`;
  ctx.fillStyle = '#ffffff';
  const line1 = 'I’M PARTICIPATING IN HACKBIOS 2026';
  spaced(ctx, line1, (sheetW - spacedWidth(ctx, line1, 5)) / 2, sheetH - 128, 5);
  ctx.font = `30px ${FONT}`;
  ctx.fillStyle = '#76f715';
  const line2 = 'WWW.HACKBIOS.XYZ';
  spaced(ctx, line2, (sheetW - spacedWidth(ctx, line2, 8)) / 2, sheetH - 68, 8);

  // corner brackets in the card's lime
  ctx.strokeStyle = '#76f715';
  ctx.lineWidth = 6;
  [[50, 50, 1, 1], [sheetW - 50, 50, -1, 1], [50, sheetH - 50, 1, -1], [sheetW - 50, sheetH - 50, -1, -1]].forEach(([x, y, dx, dy]) => {
    ctx.beginPath();
    ctx.moveTo(x + 90 * dx, y);
    ctx.lineTo(x, y);
    ctx.lineTo(x, y + 90 * dy);
    ctx.stroke();
  });
  return canvas;
}

// Puts the picture on the clipboard, so the person can paste it straight into a post. Returns false if the browser says no.
async function copyImageToClipboard(blob) {
  try {
    if (!navigator.clipboard?.write || typeof ClipboardItem === 'undefined') return false;
    await navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })]);
    return true;
  } catch {
    return false;
  }
}

function downloadBlob(blob, filename) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 2000);
}

const isApplePlatform = () => /Mac|iPhone|iPad|iPod/i.test(navigator.platform || navigator.userAgent || '');

// side: 'both' (front and back together, the default), 'front' or 'back'
// format: 'landscape' (the two cards side by side, the default) or 'portrait' (the diagonal
// Story-shaped fan) — only meaningful when side === 'both'; a single side is always just that
// one card's own native shape.
async function renderCardPng(data, side = 'both', format = 'landscape') {
  try {
    await document.fonts?.load(`700 40px ${FONT}`);
    await document.fonts?.ready;
  } catch {
    /* fall back to whatever monospace font the browser has */
  }
  let canvas;
  let photoIncluded = true;
  if (side === 'both') {
    const front = await renderSide(data, 'front');
    const back = await renderSide(data, 'back');
    canvas = format === 'portrait' ? composeStoryFan(front.canvas, back.canvas) : composeSheet(front.canvas, back.canvas);
    photoIncluded = front.photoIncluded;
  } else {
    const one = await renderSide(data, side);
    canvas = one.canvas;
    photoIncluded = one.photoIncluded;
  }
  const blob = await new Promise((resolve) => canvas.toBlob(resolve, 'image/png'));
  if (!blob) throw new Error('Could not create the image.');
  const slug = data.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'id';
  const suffix = side === 'both' ? (format === 'portrait' ? '-story' : '') : `-${side}`;
  return { blob, photoIncluded, filename: `hackbios-id-${slug}${suffix}.png` };
}

// ---------------------------------------------------------------------------
// Icons (Instagram + LinkedIn are the same ones the site's social column uses)
// ---------------------------------------------------------------------------
const stroke = { fill: 'none', stroke: 'currentColor', strokeWidth: 2, strokeLinecap: 'round', strokeLinejoin: 'round' };
const IconDownload = () => (
  <svg viewBox="0 0 24 24" {...stroke} aria-hidden="true" focusable="false"><path d="M12 3v12m0 0-4-4m4 4 4-4" /><path d="M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2" /></svg>
);
const IconShare = () => (
  <svg viewBox="0 0 24 24" {...stroke} aria-hidden="true" focusable="false"><path d="M4 12v7a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-7" /><path d="m16 6-4-4-4 4M12 2v13" /></svg>
);
const IconFlip = () => (
  <svg viewBox="0 0 24 24" {...stroke} aria-hidden="true" focusable="false"><path d="M21 12a9 9 0 1 1-3-6.7L21 8" /><path d="M21 3v5h-5" /></svg>
);
const IconEdit = () => (
  <svg viewBox="0 0 24 24" {...stroke} aria-hidden="true" focusable="false"><path d="M12 20h9" /><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5z" /></svg>
);
const IconTrash = () => (
  <svg viewBox="0 0 24 24" {...stroke} aria-hidden="true" focusable="false"><path d="M3 6h18" /><path d="M8 6V4a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v2m2 0v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" /><path d="M10 11v6M14 11v6" /></svg>
);
const IconInstagram = () => (
  <svg viewBox="0 0 16 16" fill="currentColor" aria-hidden="true" focusable="false">
    <path d="M8 0C5.829 0 5.556.01 4.703.048 3.85.088 3.269.222 2.76.42a3.9 3.9 0 0 0-1.417.923A3.9 3.9 0 0 0 .42 2.76C.222 3.268.087 3.85.048 4.7.01 5.555 0 5.827 0 8.001c0 2.172.01 2.444.048 3.297.04.852.174 1.433.372 1.942.205.526.478.972.923 1.417.444.445.89.719 1.416.923.51.198 1.09.333 1.942.372C5.555 15.99 5.827 16 8 16s2.444-.01 3.298-.048c.851-.04 1.434-.174 1.943-.372a3.9 3.9 0 0 0 1.416-.923c.445-.445.718-.891.923-1.417.197-.509.332-1.09.372-1.942C15.99 10.445 16 10.173 16 8s-.01-2.445-.048-3.299c-.04-.851-.175-1.433-.372-1.941a3.9 3.9 0 0 0-.923-1.417A3.9 3.9 0 0 0 13.24.42c-.51-.198-1.092-.333-1.943-.372C10.443.01 10.172 0 7.998 0zm-.717 1.442h.718c2.136 0 2.389.007 3.232.046.78.035 1.204.166 1.486.275.373.145.64.319.92.599s.453.546.598.92c.11.281.24.705.275 1.485.039.843.047 1.096.047 3.231s-.008 2.389-.047 3.232c-.035.78-.166 1.203-.275 1.485a2.5 2.5 0 0 1-.599.919c-.28.28-.546.453-.92.598-.28.11-.704.24-1.485.276-.843.038-1.096.047-3.232.047s-2.39-.009-3.233-.047c-.78-.036-1.203-.166-1.485-.276a2.5 2.5 0 0 1-.92-.598 2.5 2.5 0 0 1-.6-.92c-.109-.281-.24-.705-.275-1.485-.038-.843-.046-1.096-.046-3.233s.008-2.388.046-3.231c.036-.78.166-1.204.276-1.486.145-.373.319-.64.599-.92s.546-.453.92-.598c.282-.11.705-.24 1.485-.276.738-.034 1.024-.044 2.515-.045zm4.988 1.328a.96.96 0 1 0 0 1.92.96.96 0 0 0 0-1.92m-4.27 1.122a4.109 4.109 0 1 0 0 8.217 4.109 4.109 0 0 0 0-8.217m0 1.441a2.667 2.667 0 1 1 0 5.334 2.667 2.667 0 0 1 0-5.334" />
  </svg>
);
const IconLinkedIn = () => (
  <svg viewBox="0 0 16 16" fill="currentColor" aria-hidden="true" focusable="false">
    <path d="M0 1.146C0 .513.526 0 1.175 0h13.65C15.474 0 16 .513 16 1.146v13.708c0 .633-.526 1.146-1.175 1.146H1.175C.526 16 0 15.487 0 14.854zm4.943 12.248V6.169H2.542v7.225zm-1.2-8.212c.837 0 1.358-.554 1.358-1.248-.015-.709-.52-1.248-1.342-1.248S2.4 3.226 2.4 3.934c0 .694.521 1.248 1.327 1.248zm4.908 8.212V9.359c0-.216.016-.432.08-.586.173-.431.568-.878 1.232-.878.869 0 1.216.662 1.216 1.634v3.865h2.401V9.25c0-2.22-1.184-3.252-2.764-3.252-1.274 0-1.845.7-2.165 1.193v.025h-.016l.016-.025V6.169h-2.4c.03.678 0 7.225 0 7.225z" />
  </svg>
);
const IconBadge = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
    <circle cx="12" cy="8" r="4" />
    <path d="M9.5 11.2 8 21l4-2.3 4 2.3-1.5-9.8" />
    <path d="M10.4 8.1 12 6.7l1.6 1.4" />
  </svg>
);
const IconWhatsApp = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" focusable="false">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z" />
  </svg>
);

// One round icon in the side rail (same look as the site's social column).
function RailButton({ label, brand, onClick, disabled, children }) {
  return (
    <div className="hb-id-railitem">
      <button type="button" className="hb-id-round interactive" data-brand={brand} aria-label={label} disabled={disabled} onClick={onClick}>
        <span className="filled" />
        {children}
      </button>
      <span className="hb-id-tip" data-brand={brand} aria-hidden="true">{label}</span>
    </div>
  );
}
// ---------------------------------------------------------------------------
// The form the visitor fills in
// ---------------------------------------------------------------------------
function IdForm({ initial, active, canCancel, onSubmit, onCancel }) {
  const [name, setName] = useState(initial?.name || '');
  const [github, setGithub] = useState(initial?.github || '');
  const [photo, setPhoto] = useState(initial?.photo || '');
  const [tab, setTab] = useState('you'); // 'you' (the front of the card) | 'team' (the back)
  const start = sanitizeTeam(initial?.team);
  const [teamName, setTeamName] = useState(start.name);
  const [teamRole, setTeamRole] = useState(start.role);
  const [track, setTrack] = useState(start.track);
  const [college, setCollege] = useState(start.college);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const nameRef = useRef(null);
  const fileRef = useRef(null);
  const tagRef = useRef(initial?.tag || makeTag()); // kept for the life of this card

  // Put the cursor in the first field when the popup opens.
  useEffect(() => {
    if (!active) return undefined;
    const t = setTimeout(() => nameRef.current?.focus(), 80);
    return () => clearTimeout(t);
  }, [active]);

  const handleFile = async (event) => {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;
    setBusy(true);
    setError('');
    try {
      setPhoto(await fileToDataUrl(file));
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  const submit = (event) => {
    event.preventDefault();
    const cleanName = name.trim().replace(/\s+/g, ' ');
    if (cleanName.length < 2) {
      setTab('you');
      setError('Enter your name (at least 2 characters).');
      return;
    }
    const username = extractGithubUsername(github);
    if (github.trim() && !GITHUB_RE.test(username)) {
      setTab('you');
      setError('That doesn’t look like a GitHub username.');
      return;
    }
    setError('');
    const team = sanitizeTeam({ name: teamName, role: teamRole, track, college });
    onSubmit({ name: cleanName, github: username, photo, team, tag: tagRef.current, uid: makeUid(cleanName, tagRef.current) });
  };

  return (
    <div className="hb-id-form-wrap">
      <form className="hb-id-form" onSubmit={submit} noValidate>
        <div className="hb-id-form-head">
          <span className="hb-id-label">HACKBIOS://NEW_ID</span>
          <h2>{canCancel ? 'EDIT YOUR ID' : 'GENERATE YOUR ID'}</h2>
        </div>

        <div className="hb-id-tabs" role="tablist" aria-label="Which side of the card">
          <button type="button" role="tab" aria-selected={tab === 'you'} className={`hb-id-tab interactive${tab === 'you' ? ' is-active' : ''}`} onClick={() => setTab('you')}>
            YOU · FRONT
          </button>
          <button type="button" role="tab" aria-selected={tab === 'team'} className={`hb-id-tab interactive${tab === 'team' ? ' is-active' : ''}`} onClick={() => setTab('team')}>
            TEAM · BACK
          </button>
        </div>

        {tab === 'you' && (
          <>
        <label className="hb-id-field">
          <span>NAME</span>
          <input
            ref={nameRef}
            className="interactive"
            type="text"
            value={name}
            maxLength={26}
            autoComplete="name"
            placeholder="Your full name"
            onChange={(e) => setName(e.target.value)}
          />
        </label>

        <label className="hb-id-field">
          <span>GITHUB <em>optional</em></span>
          <input
            className="interactive"
            type="text"
            value={github}
            maxLength={80}
            autoComplete="off"
            autoCapitalize="none"
            spellCheck={false}
            placeholder="username or profile link"
            onChange={(e) => setGithub(e.target.value)}
          />
        </label>

        <div className="hb-id-field">
          <span>PHOTO <em>optional</em></span>
          <div className="hb-id-photo-row">
            {photo ? (
              <>
                <img src={photo} alt="Your uploaded photo" className="hb-id-thumb" />
                <button type="button" className="hb-id-mini interactive" onClick={() => setPhoto('')}>REMOVE</button>
              </>
            ) : (
              <button type="button" className="hb-id-mini interactive" onClick={() => fileRef.current?.click()} disabled={busy}>
                {busy ? 'LOADING…' : 'UPLOAD PHOTO'}
              </button>
            )}
            {!photo && <span className="hb-id-hint">blank = your GitHub picture</span>}
            <input ref={fileRef} type="file" accept="image/*" hidden onChange={handleFile} />
          </div>
        </div>

          </>
        )}

        {tab === 'team' && (
          <>
            <label className="hb-id-field">
              <span>TEAM NAME <em>optional</em></span>
              <input className="interactive" type="text" value={teamName} maxLength={24} autoComplete="off" placeholder="Your team’s name" onChange={(e) => setTeamName(e.target.value)} />
              <small className="hb-id-help">Your Team ID is made from this name — teammates who type the same name get the same ID.</small>
            </label>

            <label className="hb-id-field">
              <span>YOUR ROLE IN THE TEAM <em>optional</em></span>
              <input
                className="interactive"
                type="text"
                list="hb-id-roles"
                value={teamRole}
                maxLength={24}
                autoComplete="off"
                placeholder="e.g. Team Leader, Developer"
                onChange={(e) => setTeamRole(e.target.value)}
              />
              <datalist id="hb-id-roles">
                {ROLE_SUGGESTIONS.map((r) => (
                  <option key={r} value={r} />
                ))}
              </datalist>
            </label>

            <label className="hb-id-field">
              <span>TRACK <em>optional</em></span>
              <select className="interactive" value={track} onChange={(e) => setTrack(e.target.value)}>
                <option value="">Not decided yet</option>
                {TRACKS.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </label>

            <label className="hb-id-field">
              <span>COLLEGE <em>optional</em></span>
              <input className="interactive" type="text" value={college} maxLength={36} autoComplete="organization" placeholder="Your college" onChange={(e) => setCollege(e.target.value)} />
            </label>
          </>
        )}

        <p className="hb-id-error" role="alert" aria-live="polite">{error}</p>

        <div className="hb-id-form-actions">
          <button type="submit" className="hb-id-submit interactive" disabled={busy}>
            {canCancel ? 'SAVE ID' : 'GENERATE ID'}
          </button>
          {canCancel && (
            <button type="button" className="hb-id-mini interactive" onClick={onCancel}>CANCEL</button>
          )}
        </div>

        <p className="hb-id-note">A fun keepsake, not an entry pass. Stays on this device — nothing is uploaded.</p>
      </form>
    </div>
  );
}

// ---------------------------------------------------------------------------
// The finished card (front = the graphics team's design, back = details + barcode)
// ---------------------------------------------------------------------------
function IdCard({ data, artReady, flipped, onFlip, tiltOn, hintFlip }) {
  const [failedSrc, setFailedSrc] = useState('');
  const [artState, setArtState] = useState('loading'); // loading | ready | error
  const artRef = useRef(null);
  const tiltRef = useRef(null);
  const username = extractGithubUsername(data.github);
  const avatar = getAvatarUrl(data);
  const githubUrl = username ? `https://github.com/${username}` : '';
  const stop = (event) => event.stopPropagation(); // links shouldn't also flip the card
  const team = sanitizeTeam(data.team);
  const teamId = teamIdFor(team.name);

  // The artwork may already be in the cache by the time we look.
  useEffect(() => {
    const el = artRef.current;
    if (el && el.complete && el.naturalWidth > 0) setArtState('ready');
  }, [artReady]);

  const handleClick = (event) => {
    const sel = window.getSelection?.(); // dragging to select text on the card shouldn't flip it
    if (sel && sel.toString() && sel.anchorNode && event.currentTarget.contains(sel.anchorNode)) return;
    onFlip();
  };

  // Desktop only: the card leans toward the mouse and catches a soft light.
  const handleMove = (event) => {
    if (!tiltOn || event.pointerType !== 'mouse' || !tiltRef.current) return;
    const r = event.currentTarget.getBoundingClientRect();
    const px = (event.clientX - r.left) / r.width;
    const py = (event.clientY - r.top) / r.height;
    const el = tiltRef.current;
    el.style.setProperty('--rx', `${((0.5 - py) * 9).toFixed(2)}deg`);
    el.style.setProperty('--ry', `${((px - 0.5) * 11).toFixed(2)}deg`);
    el.style.setProperty('--gx', `${(px * 100).toFixed(1)}%`);
    el.style.setProperty('--gy', `${(py * 100).toFixed(1)}%`);
    el.style.setProperty('--glare', '1');
  };
  const handleLeave = () => {
    const el = tiltRef.current;
    if (!el) return;
    el.style.setProperty('--rx', '0deg');
    el.style.setProperty('--ry', '0deg');
    el.style.setProperty('--glare', '0');
  };

  const stateClass = artState === 'ready' ? ' is-ready' : artState === 'error' ? ' art-missing' : '';

  return (
    <div
      className={`hb-id-scene${flipped ? ' is-flipped' : ''}${stateClass}`}
      style={{ '--hb-name-size': `${nameSizeFor(data.name)}cqw` }}
      onClick={handleClick}
      onPointerMove={handleMove}
      onPointerLeave={handleLeave}
    >
      <div className="hb-id-skeleton" aria-hidden="true" />
      <div ref={tiltRef} className="hb-id-tilt">
        <div className="hb-id-flipper">
          {/* ---------- FRONT ---------- */}
          <div className="hb-id-face hb-id-front" aria-hidden={flipped}>
            {/* 1. the photo — sits BEHIND the artwork, showing through its transparent window */}
            <div className="hb-id-photo-layer">
              {avatar && failedSrc !== avatar ? (
                <img
                  key={avatar}
                  src={avatar}
                  alt=""
                  className="hb-id-photo"
                  draggable={false}
                  onError={() => setFailedSrc(avatar)}
                />
              ) : (
                <div className="hb-id-photo-fallback">{initialsOf(data.name)}</div>
              )}
            </div>

            {/* 2. the graphics team's artwork, on top */}
            <img
              ref={artRef}
              className="hb-id-art"
              src={artReady ? CARD_ART : undefined}
              alt=""
              draggable={false}
              onLoad={() => setArtState('ready')}
              onError={() => {
                // eslint-disable-next-line no-console
                console.error(`[HackBiosIDCard] Could not load ${CARD_ART} — is the file in public/id-card/ ?`);
                setArtState('error');
              }}
            />

            {/* 3. the person's details, written over the empty black area at the bottom */}
            <div className="hb-id-data">
              <span className="hb-id-sr">HackBIOS 2026 participant ID card. </span>
              <div>
                <span className="hb-id-label">IDENTITY</span>
                <h2>{data.name}</h2>
                {githubUrl && (
                  <a
                    className="hb-id-handle interactive"
                    href={githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    tabIndex={flipped ? -1 : 0}
                    onClick={stop}
                  >
                    @{username}
                  </a>
                )}
              </div>
              <div className="hb-id-uid">USER ID // {data.uid}</div>
            </div>
          </div>

          {/* ---------- BACK ---------- */}
          <div className="hb-id-face hb-id-back" aria-hidden={!flipped}>
            <img
              className="hb-id-logo"
              src={artReady ? CARD_LOGO : undefined}
              alt="HackBIOS 2026 — Where ideas boot into reality"
              draggable={false}
            />

            <div className="hb-id-team">
              <div className="hb-id-team-head">
                <span>TEAM</span>
                <h3>{teamTitleFor(team)}</h3>
              </div>
              {(team.role || team.track || team.college) && (
                <div className="hb-id-rows hb-id-team-meta">
                  {team.role && <div className="hb-id-row"><span>ROLE</span><strong>{team.role}</strong></div>}
                  {team.track && <div className="hb-id-row"><span>TRACK</span><strong>{team.track}</strong></div>}
                  {team.college && <div className="hb-id-row"><span>COLLEGE</span><strong>{team.college}</strong></div>}
                </div>
              )}
            </div>

            {teamId && (
              <div className="hb-id-barcode">
                <Code39 value={teamId} />
                <span>TEAM ID // {teamId}</span>
              </div>
            )}
            <div className="hb-id-foot">SSTC · BHILAI · 2026</div>
          </div>
        </div>
        <div className="hb-id-glare" aria-hidden="true" />
      </div>

      {/* Flip button: bottom-right corner of the card, on both sides. */}
      <button
        type="button"
        className={`hb-id-flipfab interactive${hintFlip ? ' is-hint' : ''}`}
        aria-label={flipped ? 'Flip card to the front' : 'Flip card to the back'}
        onClick={(event) => {
          event.stopPropagation();
          onFlip();
        }}
      >
        <IconFlip />
      </button>
    </div>
  );
}

// ---------------------------------------------------------------------------
// The widget
// ---------------------------------------------------------------------------
export default function HackBiosIDCard({ participant, autoOpen = false }) {
  const navigate = useNavigate();
  const locked = !!participant; // a backend-supplied participant: show it, no form
  const reducedMotion = useReducedMotion();
  const [open, setOpen] = useState(false);
  const [artReady, setArtReady] = useState(false); // only download the artwork once it's likely needed
  const [saved, setSaved] = useState(() => (locked ? null : loadSaved()));
  const [flipped, setFlipped] = useState(false);
  const [hasFlipped, setHasFlipped] = useState(false); // stops the flip button's "look here" pulse once used
  const [editing, setEditing] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [status, setStatus] = useState('');
  const [notice, setNotice] = useState(''); // a warning that stays until it's dealt with (e.g. couldn't save)
  const [preview, setPreview] = useState(null); // { url, filename } — the saved image shown on screen
  const [lastExport, setLastExport] = useState(null);
  const [showFormatChoice, setShowFormatChoice] = useState(false); // Landscape / Portrait picker under the Download button
  const [badgeOpen, setBadgeOpen] = useState(false);
  const badgeOpenRef = useRef(false);
  badgeOpenRef.current = badgeOpen;
  const previewRef = useRef(null);
  previewRef.current = preview;
  const pressStartedOnBackdrop = useRef(false);
  const [canShare, setCanShare] = useState(false);
  const [touchShare, setTouchShare] = useState(false); // a phone / tablet that can hand a picture to its share sheet
  const [shareHelper, setShareHelper] = useState(null); // the step-by-step panel for LinkedIn / WhatsApp on a computer
  const [helperThumb, setHelperThumb] = useState('');
  const helperRef = useRef(null);
  helperRef.current = shareHelper;
  const formatChoiceRef = useRef(false);
  formatChoiceRef.current = showFormatChoice;
  const [tiltOn, setTiltOn] = useState(false);
  const launcherRef = useRef(null);
  const dialogRef = useRef(null);
  const closeRef = useRef(null);

  const data = useMemo(() => {
    const src = locked ? participant : saved;
    if (!src) return null;
    return { ...src, uid: src.uid || makeUid(src.name || '', 'X000') };
  }, [locked, participant, saved]);

  const showForm = !locked && (!saved || editing);

  useEffect(() => {
    let can = false;
    try {
      const probe = new File([''], 'id.png', { type: 'image/png' });
      can = !!(navigator.canShare && navigator.canShare({ files: [probe] }));
    } catch {
      can = false;
    }
    setCanShare(can);
    setTouchShare(can && !!window.matchMedia?.('(pointer: coarse)').matches);
  }, []);

  useEffect(() => {
    setTiltOn(!reducedMotion && !!window.matchMedia?.('(hover: hover) and (pointer: fine)').matches);
  }, [reducedMotion]);

  const closeCard = () => {
    setOpen(false);
    setFlipped(false);
    setConfirmDelete(false);
    setShareHelper(null);
    setShowFormatChoice(false);
    setBadgeOpen(false);
  };

  useEffect(() => {
    if (open) setArtReady(true);
  }, [open]);

  // Open the modal when another part of the site asks for it (see OPEN_EVENT).
  // preventDefault() tells the sender the modal answered, so it doesn't need a fallback.
  useEffect(() => {
    const openFromEvent = (event) => {
      event.preventDefault();
      setBadgeOpen(false);
      setOpen(true);
      setFlipped(false);
      setConfirmDelete(false);
      setShowFormatChoice(false);
      setShareHelper(null);
      setArtReady(true);
    };
    window.addEventListener(OPEN_EVENT, openFromEvent);
    return () => window.removeEventListener(OPEN_EVENT, openFromEvent);
  }, []);

  // /create-id is a public entry route for the generator. However the modal is
  // closed (×, backdrop, Esc, or a share button), return to the homepage URL,
  // so visiting /create-id again opens it again.
  const wasOpen = useRef(false);
  useEffect(() => {
    if (wasOpen.current && !open && window.location.pathname === '/create-id') {
      navigate('/', { replace: true });
    }
    wasOpen.current = open;
  }, [open, navigate]);

  // Open the existing Create Your ID modal when the public /create-id URL
  // is visited. This does not create a second modal.
  useEffect(() => {
    if (!autoOpen || locked) return;

    setBadgeOpen(false);
    setOpen(true);
    setEditing(true);
    setFlipped(false);
    setConfirmDelete(false);
    setShowFormatChoice(false);
    setShareHelper(null);
    setArtReady(true);
  }, [autoOpen, locked]);

  // While the card is open: Esc closes it, Tab stays inside it, the page behind
  // it stops scrolling, and focus goes back to the ID button when it closes.
  useEffect(() => {
    if (!open) return undefined;
    const launcher = launcherRef.current;
    const close = () => {
      setOpen(false);
      setFlipped(false);
      setConfirmDelete(false);
      setShowFormatChoice(false);
      setBadgeOpen(false);
    };
    window.__lenis?.stop();
    document.body.classList.add('hb-id-modal-open');

    // The form focuses its own first field; the finished card has none, so
    // focus its close button instead.
    const focusTimer = setTimeout(() => {
      if (!dialogRef.current?.contains(document.activeElement)) closeRef.current?.focus();
    }, 120);

    const onKey = (event) => {
      if (event.key === 'Escape') {
        if (previewRef.current) setPreview(null); // close the image view first, then the popup
        else if (helperRef.current) setShareHelper(null);
        else if (formatChoiceRef.current) setShowFormatChoice(false);
        else if (badgeOpenRef.current) {
          setBadgeOpen(false);
          close();
        }
        else close();
        return;
      }
      if (event.key !== 'Tab' || !dialogRef.current) return;
      const items = Array.from(dialogRef.current.querySelectorAll('button, input, select, a[href]')).filter(
        (el) => !el.disabled && el.tabIndex !== -1 && el.offsetParent !== null
      );
      if (!items.length) return;
      const first = items[0];
      const last = items[items.length - 1];
      const active = document.activeElement;
      const outside = !dialogRef.current.contains(active);
      if (event.shiftKey && (active === first || outside)) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && (active === last || outside)) {
        event.preventDefault();
        first.focus();
      }
    };
    document.addEventListener('keydown', onKey);
    return () => {
      clearTimeout(focusTimer);
      document.removeEventListener('keydown', onKey);
      document.body.classList.remove('hb-id-modal-open');
      window.__lenis?.start();
      launcher?.focus?.();
    };
  }, [open]);

  // If the card is created / edited / deleted in another tab, follow along.
  useEffect(() => {
    if (locked) return undefined;
    const onStorage = (event) => {
      if (event.storageArea !== window.localStorage) return;
      if (event.key === STORAGE_KEY || event.key === null) setSaved(loadSaved());
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, [locked]);

  // A small preview of the picture that will be pasted (freed when the panel closes).
  useEffect(() => {
    if (!shareHelper?.blob) {
      setHelperThumb('');
      return undefined;
    }
    const url = URL.createObjectURL(shareHelper.blob);
    setHelperThumb(url);
    return () => URL.revokeObjectURL(url);
  }, [shareHelper?.blob]);

  // Free the image shown in the preview when it's closed.
  useEffect(() => {
    if (!preview) return undefined;
    return () => URL.revokeObjectURL(preview.url);
  }, [preview]);

  useEffect(() => {
    if (!confirmDelete) return undefined;
    const t = setTimeout(() => setConfirmDelete(false), 3500);
    return () => clearTimeout(t);
  }, [confirmDelete]);

  useEffect(() => {
    if (!status) return undefined;
    const t = setTimeout(() => setStatus(''), 9000);
    return () => clearTimeout(t);
  }, [status]);

  const avatarJob = useRef(0);
  const avatarFetches = useRef({}); // username -> the one attempt in progress / finished, shared by "create" and "download"
  const avatarFailed = useRef(''); // a username whose picture couldn't be fetched (don't make Download wait through it again)
  const getAvatar = (username) => {
    if (!avatarFetches.current[username]) avatarFetches.current[username] = fetchGithubAvatar(username);
    return avatarFetches.current[username];
  };

  // Saves the fetched GitHub picture onto the card (if it's still the same card).
  const attachAvatar = (uid, username, dataUrl) => {
    setSaved((prev) => {
      if (!prev || prev.uid !== uid) return prev;
      const next = { ...prev, avatarData: dataUrl, avatarFor: username };
      if (!persist(next)) persist({ ...next, avatarData: '', avatarFor: '' });
      return next;
    });
  };

  // Fetches the GitHub picture in the background so downloads can include it.
  const resolveAvatar = async (card) => {
    const username = extractGithubUsername(card.github);
    if (!username || card.photo || (card.avatarData && card.avatarFor === username)) return;
    const job = ++avatarJob.current;
    setStatus('Getting your GitHub picture…');
    const dataUrl = await getAvatar(username);
    if (job !== avatarJob.current) return; // the card changed while we were fetching
    setStatus('');
    if (dataUrl) attachAvatar(card.uid, username, dataUrl);
    else {
      avatarFailed.current = username;
      setNotice(AVATAR_NOTICE);
    }
  };

  // Cards saved before this existed: fetch their picture once, quietly.
  useEffect(() => {
    if (saved && !locked) resolveAvatar(saved);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSubmit = (submitted) => {
    // keep the saved copy of the GitHub picture only if the username is unchanged
    const keep = saved && submitted.github && saved.avatarFor === submitted.github;
    const value = { ...submitted, avatarData: keep ? saved.avatarData : '', avatarFor: keep ? saved.avatarFor : '' };
    setSaved(value);
    setEditing(false);
    setFlipped(false);
    setStatus('');
    setLastExport(null);
    avatarJob.current += 1; // cancel any earlier picture fetch
    avatarFetches.current = {};
    avatarFailed.current = '';
    if (persist(value)) {
      setNotice('');
    } else if ((value.photo || value.avatarData) && persist({ ...value, photo: '', avatarData: '', avatarFor: '' })) {
      // The pictures are what take the space — keep everything else.
      setNotice('This browser is short on storage, so your picture can’t be kept. Next time the card will use your GitHub picture (or your initials). Use Download to keep this version.');
    } else {
      setNotice('This browser wouldn’t let us keep your card (private mode or full storage), so it will be gone when you close the page. Use Download to keep it.');
    }
    resolveAvatar(value);
  };

  const handleDelete = () => {
    if (!confirmDelete) {
      setConfirmDelete(true);
      return;
    }
    setSaved(null);
    persist(null);
    setEditing(false);
    setFlipped(false);
    setConfirmDelete(false);
    setStatus('');
    setNotice('');
    setLastExport(null);
  };

  const openPreview = (blob, filename) => setPreview({ url: URL.createObjectURL(blob), filename });

  // ----- Saving and sharing ---------------------------------------------------------------------------
  const shareLink = `${typeof window !== 'undefined' ? window.location.origin : ''}/`;
  const shareMessage = `${SHARE_TEXT} ${shareLink}`;

  // The picture for "front + back together" is built once per (data, format) pair and reused
  // (Download, Share and the post buttons all use it), so a click never has to wait for the
  // drawing.
  const sheetCache = useRef({ key: '', promise: null });
  const sheetKey = (d, format) =>
    [format, d.uid, d.name, d.github, d.avatarFor || '', (d.photo || '').length, (d.photo || '').slice(1000, 1040), (d.avatarData || '').length, JSON.stringify(sanitizeTeam(d.team))].join('|');
  const renderFor = (d, side, format = 'landscape') => {
    if (side !== 'both') return renderCardPng(d, side);
    const key = sheetKey(d, format);
    if (sheetCache.current.key !== key) {
      const promise = renderCardPng(d, 'both', format);
      sheetCache.current = { key, promise };
      promise.catch(() => {
        if (sheetCache.current.promise === promise) sheetCache.current = { key: '', promise: null };
      });
    }
    return sheetCache.current.promise;
  };

  // Makes sure the GitHub picture is available before the front is drawn.
  const prepareExportData = async (side) => {
    let exportData = data;
    const username = extractGithubUsername(data.github);
    const needsAvatar = side === 'back' ? false : !!username && !data.photo && !(data.avatarData && data.avatarFor === username) && avatarFailed.current !== username;
    if (needsAvatar) {
      setStatus('Getting your GitHub picture…');
      const dataUrl = await getAvatar(username);
      if (dataUrl) {
        exportData = { ...data, avatarData: dataUrl, avatarFor: username };
        if (!locked) attachAvatar(data.uid, username, dataUrl);
      } else {
        avatarFailed.current = username;
      }
    }
    return exportData;
  };

  // While the card is showing, quietly get the picture ready so Download / Share are instant.
  useEffect(() => {
    if (!open || showForm || !data) return undefined;
    const username = extractGithubUsername(data.github);
    const waitingForPicture = !!username && !data.photo && !(data.avatarData && data.avatarFor === username) && avatarFailed.current !== username;
    if (waitingForPicture) return undefined;
    const t = setTimeout(() => {
      renderFor(data, 'both').catch(() => {});
    }, 700);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, showForm, data]);

  // Download (or the phone's share sheet) for front + back together, or one side only.
  const exportCard = async (mode, extraNote = '', side = 'both', format = 'landscape') => {
    if (!data || exporting) return;
    setExporting(true);
    setStatus('');
    try {
      const exportData = await prepareExportData(side);
      const { blob, photoIncluded, filename } = await renderFor(exportData, side, format);
      const note = photoIncluded ? '' : PHOTO_MISSING_NOTE;
      if (mode === 'share') {
        const file = new File([blob], filename, { type: 'image/png' });
        await navigator.share({ files: [file], title: 'My HackBIOS 2026 ID', text: shareMessage });
        setStatus(`Shared.${note}`);
      } else if (isInAppBrowser()) {
        openPreview(blob, filename);
        setLastExport({ blob, filename });
        setStatus('Press and hold the image to save it.');
      } else {
        setLastExport({ blob, filename });
        downloadBlob(blob, filename);
        const shape = side === 'both' ? (format === 'portrait' ? 'front and back as a Story image' : 'front and back together') : `the ${side} only`;
        setStatus(`Saved ${shape}.${extraNote ? ` ${extraNote}` : ''}${note}`);
      }
    } catch (err) {
      if (err?.name !== 'AbortError') setStatus('Couldn’t create the image. Try again.');
    } finally {
      setExporting(false);
    }
  };

  // The post buttons. Instagram gets a dedicated Story path on mobile: first create the
  // 9:16 Story image, then try Instagram's Story deep-link. If the browser/Instagram
  // combination cannot accept the hand-off, fall back to the native file share sheet.
  const linkedinUrl = `https://www.linkedin.com/feed/?shareActive&mini=true&text=${encodeURIComponent(shareMessage)}`;
  const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(shareMessage)}`;
  const NETWORK_NAMES = { instagram: 'Instagram', linkedin: 'LinkedIn', whatsapp: 'WhatsApp' };

  // A normal web page cannot reliably attach a generated PNG to Instagram's Story
  // composer on every phone. We can, however, try the native Story entry point first.
  // If Instagram is not installed, or the browser blocks the custom scheme, the page
  // stays usable and we fall back to the native share sheet with the actual image.
  const openInstagramStory = (fallback) => {
    let settled = false;
    let timer = null;

    const cleanup = () => {
      window.removeEventListener('pagehide', onHidden);
      document.removeEventListener('visibilitychange', onHidden);
      window.removeEventListener('blur', onHidden);
      if (timer) window.clearTimeout(timer);
    };

    const onHidden = () => {
      settled = true;
      cleanup();
    };

    window.addEventListener('pagehide', onHidden, { once: true });
    document.addEventListener('visibilitychange', onHidden, { once: true });
    window.addEventListener('blur', onHidden, { once: true });

    const ua = navigator.userAgent || '';
    const isAndroid = /Android/i.test(ua);
    const isIOS = /iPhone|iPad|iPod/i.test(ua) ||
      (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);

    if (isAndroid) {
      window.location.href = 'intent://story-camera#Intent;scheme=instagram;package=com.instagram.android;end';
    } else if (isIOS) {
      window.location.href = 'instagram-stories://share';
    } else {
      cleanup();
      return false;
    }

    timer = window.setTimeout(() => {
      if (!settled) {
        cleanup();
        fallback?.();
      }
    }, 1400);
    return true;
  };

  const shareTo = async (network) => {
    if (!data || exporting) return;
    setExporting(true);
    setStatus('');
    setShareHelper(null);
    try {
      const exportData = await prepareExportData('both');
      // Instagram Stories need the portrait 9:16 composition; the other networks keep
      // using the existing landscape front+back export.
      const instagramStory = network === 'instagram' && touchShare;
      const exportFormat = instagramStory ? 'portrait' : 'landscape';
      const { blob, photoIncluded, filename } = await renderFor(exportData, 'both', exportFormat);
      const note = photoIncluded ? '' : PHOTO_MISSING_NOTE;
      const name = NETWORK_NAMES[network];

      if (instagramStory) {
        const file = new File([blob], filename.replace(/\.png$/i, '-story.png'), { type: 'image/png' });

        // Try to open Instagram's native Story composer first. Browsers cannot guarantee
        // that a generated Blob is accepted by the custom URL scheme, so the fallback
        // hands the same portrait image to the phone's native share sheet.
        const opened = openInstagramStory(async () => {
          try {
            await navigator.share({ files: [file], title: 'My HackBIOS 2026 Story', text: shareMessage });
            setStatus(`Instagram opened via the share sheet.${note}`);
          } catch (err) {
            if (err?.name !== 'AbortError') {
              openPreview(blob, file.name);
              setLastExport({ blob, filename: file.name });
              setStatus(`Save this 9:16 image and add it to your Instagram Story.${note}`);
            }
          }
        });

        if (!opened) {
          await navigator.share({ files: [file], title: 'My HackBIOS 2026 Story', text: shareMessage });
        }
        setStatus(`Opening Instagram Story.${note}`);
        return;
      }

      if (touchShare) {
        const file = new File([blob], filename, { type: 'image/png' });
        await navigator.share({ files: [file], title: 'My HackBIOS 2026 ID', text: shareMessage });
        setStatus(`Shared.${note}`);
        return;
      }
      if (isInAppBrowser()) {
        openPreview(blob, filename);
        setLastExport({ blob, filename });
        setStatus(`Press and hold the image to save it, then add it to your ${name} post.${note}`);
        return;
      }
      if (network === 'instagram') {
        // Instagram has no web post box, so there's nothing to paste into: the person saves the picture and adds it in Instagram.
        setShareHelper({ network, name, blob, filename, copied: false, kind: 'upload', note, url: 'https://www.instagram.com/' });
        return;
      }
      // Computers: a web link can carry the message and link but NOT the picture, so the picture is copied to the
      // clipboard and the person pastes it. The steps are shown first (so the paste step can't be missed);
      // the post box only opens when they click "Open".
      const copied = await copyImageToClipboard(blob);
      setShareHelper({
        network,
        name,
        blob,
        filename,
        copied,
        note,
        url: network === 'linkedin' ? linkedinUrl : whatsappUrl,
      });
    } catch (err) {
      if (err?.name !== 'AbortError') setStatus('Couldn’t create the image. Try again.');
    } finally {
      setExporting(false);
    }
  };

  const badgeShareLink = `${typeof window !== 'undefined' ? window.location.origin : ''}/`;
  const badgeMessage = `${BADGE_SHARE_TEXT} ${badgeShareLink}`;
  const badgeLinkedinUrl = `https://www.linkedin.com/feed/?shareActive&mini=true&text=${encodeURIComponent(badgeMessage)}`;

  const fetchBadgeBlob = async () => {
    const response = await fetch(BADGE_ART);
    if (!response.ok) throw new Error('Badge image could not be loaded');
    return response.blob();
  };

  const downloadBadge = async () => {
    if (exporting) return;
    setExporting(true);
    setStatus('');
    try {
      const blob = await fetchBadgeBlob();
      downloadBlob(blob, 'HackBIOS-2026-Participation-Badge.png');
      setStatus('Badge downloaded.');
    } catch {
      // Direct anchor fallback for environments that block fetches.
      const a = document.createElement('a');
      a.href = BADGE_ART;
      a.download = 'HackBIOS-2026-Participation-Badge.png';
      document.body.appendChild(a);
      a.click();
      a.remove();
      setStatus('Badge download started.');
    } finally {
      setExporting(false);
    }
  };

  const shareBadgeOnLinkedIn = async () => {
    if (exporting) return;
    setExporting(true);
    setStatus('');
    setShareHelper(null);
    try {
      const blob = await fetchBadgeBlob();
      const filename = 'HackBIOS-2026-Participation-Badge.png';
      const file = new File([blob], filename, { type: 'image/png' });
      if (touchShare) {
        await navigator.share({ files: [file], title: 'My HackBIOS 2026 Participation Badge', text: badgeMessage });
        setStatus('Badge shared — choose LinkedIn.');
        return;
      }
      if (isInAppBrowser()) {
        openPreview(blob, filename);
        setLastExport({ blob, filename });
        setStatus('Save the badge, then add it to your LinkedIn post.');
        return;
      }
      const copied = await copyImageToClipboard(blob);
      setBadgeOpen(false);
      setOpen(true);
      setShareHelper({
        network: 'linkedin',
        name: 'LinkedIn',
        blob,
        filename,
        copied,
        kind: 'badge',
        note: '',
        url: badgeLinkedinUrl,
        message: badgeMessage,
      });
    } catch (err) {
      if (err?.name !== 'AbortError') setStatus('Couldn’t prepare the badge for LinkedIn.');
    } finally {
      setExporting(false);
    }
  };

  const flip = () => {
    setFlipped((v) => !v);
    setHasFlipped(true);
  };
  return (
    <>
      <div className="hb-id-widget">
        <button
          ref={launcherRef}
          type="button"
          className="hb-id-launcher interactive"
          aria-haspopup="dialog"
          aria-label={open && !badgeOpen ? 'Close HackBios ID card' : 'Open HackBios ID card'}
          aria-expanded={open && !badgeOpen}
          onPointerEnter={() => setArtReady(true)}
          onFocus={() => setArtReady(true)}
          onClick={() => {
            setBadgeOpen(false);
            setOpen((value) => !value);
          }}
        >
          <span className="hb-id-launcher-dot" />
          <span className="hb-id-launcher-icon">ID</span>
        </button>
      </div>

      {/* The card lives in a portal on <body> so it sits above (and blurs) the
          whole page, including the menu, the mute button and the MLH badge. */}
      {createPortal(
        <div
          className={`hb-id-overlay${open ? ' is-open' : ''}`}
          aria-hidden={!open}
          data-lenis-prevent
          onPointerDown={(event) => {
            pressStartedOnBackdrop.current = event.target === event.currentTarget;
          }}
          onClick={(event) => {
            // dragging to select text inside the popup and letting go over the dark area must NOT close it
            if (event.target === event.currentTarget && pressStartedOnBackdrop.current) closeCard();
            pressStartedOnBackdrop.current = false;
          }}
        >
          <div ref={dialogRef} className={`hb-id-dialog${badgeOpen ? ' hb-id-dialog-badge' : ''}`} role="dialog" aria-modal="true" aria-label={`${EVENT_NAME} ID card`}>
            {!badgeOpen && (
              <button ref={closeRef} type="button" className="hb-id-close interactive" onClick={closeCard} aria-label="Close ID card">
                ×
              </button>
            )}

            {badgeOpen ? (
              <div className="hb-badge-modal" role="dialog" aria-modal="true" aria-label="HackBIOS 2026 participation badge">
                <button type="button" className="hb-id-close interactive" onClick={() => setBadgeOpen(false)} aria-label="Close badge">×</button>
                <div className="hb-badge-header">
                  <span className="hb-badge-kicker">HACKBIOS 2026</span>
                  <h2>YOUR PARTICIPATION BADGE</h2>
                  <p>Show the world you’re part of HackBIOS.</p>
                </div>
                <div className="hb-badge-art-wrap">
                  <div className="hb-badge-orbit hb-badge-orbit-one" />
                  <div className="hb-badge-orbit hb-badge-orbit-two" />
                  <img className="hb-badge-art" src={BADGE_ART} alt="HackBIOS 2026 participation badge" draggable={false} />
                </div>
                <div className="hb-badge-actions">
                  <button type="button" className="hb-badge-action hb-badge-download interactive" disabled={exporting} onClick={downloadBadge}>
                    <IconDownload />
                    <span>{exporting ? 'PREPARING…' : 'DOWNLOAD BADGE'}</span>
                  </button>
                  <button type="button" className="hb-badge-action hb-badge-linkedin interactive" disabled={exporting} onClick={shareBadgeOnLinkedIn}>
                    <IconLinkedIn />
                    <span>SHARE ON LINKEDIN</span>
                  </button>
                </div>



                <p className="hb-badge-note">Your badge is a separate share asset — it won’t use your ID card image.</p>
              </div>
            ) : (
              showForm ? (
                <IdForm
                key={editing ? 'edit' : 'new'}
                initial={editing ? saved : null}
                active={open}
                canCancel={editing}
                onSubmit={handleSubmit}
                onCancel={() => setEditing(false)}
              />
            ) : (
              data && (
                <>
                  <IdCard data={data} artReady={artReady} flipped={flipped} onFlip={flip} tiltOn={tiltOn} hintFlip={!hasFlipped} />

                  {/* Save / share: a column of round icons beside the card (under it on phones) */}
                  <div className="hb-id-rail" role="group" aria-label="Save and share your ID">
                    <RailButton
                      label="Download front + back"
                      brand="download"
                      disabled={exporting}
                      onClick={() => setShowFormatChoice((v) => !v)}
                    >
                      <IconDownload />
                    </RailButton>
                    <RailButton
                      label="Badge"
                      brand="badge"
                      disabled={exporting}
                      onClick={() => {
                        setBadgeOpen(true);
                        setOpen(true);
                        setArtReady(true);
                      }}
                    >
                      <IconBadge />
                    </RailButton>
                    <RailButton label="Instagram" brand="instagram" disabled={exporting} onClick={() => shareTo('instagram')}>
                      <IconInstagram />
                    </RailButton>
                    <RailButton label="LinkedIn" brand="linkedin" disabled={exporting} onClick={() => shareTo('linkedin')}>
                      <IconLinkedIn />
                    </RailButton>
                    <RailButton label="WhatsApp" brand="whatsapp" disabled={exporting} onClick={() => shareTo('whatsapp')}>
                      <IconWhatsApp />
                    </RailButton>
                    {canShare && !touchShare && (
                      <RailButton label="Share…" brand="download" disabled={exporting} onClick={() => exportCard('share')}>
                        <IconShare />
                      </RailButton>
                    )}
                  </div>

                  {showFormatChoice && (
                    <div className="hb-id-formatchoice" role="group" aria-label="Choose a shape for the download">
                      <button
                        type="button"
                        className="hb-id-mini interactive"
                        disabled={exporting}
                        onClick={() => {
                          setShowFormatChoice(false);
                          exportCard('download', '', 'both', 'landscape');
                        }}
                      >
                        LANDSCAPE
                      </button>
                      <button
                        type="button"
                        className="hb-id-mini interactive"
                        disabled={exporting}
                        onClick={() => {
                          setShowFormatChoice(false);
                          exportCard('download', '', 'both', 'portrait');
                        }}
                      >
                        PORTRAIT (STORY)
                      </button>
                    </div>
                  )}

                  <div className="hb-id-tools">
                    {!locked && (
                      <>
                        <button
                          type="button"
                          className="hb-id-iconbtn interactive"
                          aria-label="Edit your ID"
                          title="Edit"
                          onClick={() => { setFlipped(false); setEditing(true); }}
                        >
                          <IconEdit />
                        </button>
                        <button
                          type="button"
                          className={`hb-id-iconbtn hb-id-iconbtn-danger interactive${confirmDelete ? ' is-armed' : ''}`}
                          aria-label={confirmDelete ? 'Confirm: delete my ID' : 'Delete my ID'}
                          title={confirmDelete ? 'Tap again to delete' : 'Delete'}
                          onClick={handleDelete}
                        >
                          <IconTrash />
                        </button>
                      </>
                    )}
                    <p className={`hb-id-status${confirmDelete ? ' is-warning' : ''}`} role="status" aria-live="polite">
                      {confirmDelete ? 'Tap the bin again to delete your ID.' : status}
                      {!confirmDelete && lastExport && status.startsWith('Saved') && (
                        <span className="hb-id-savelinks">
                          <button type="button" className="hb-id-linkbtn interactive" onClick={() => exportCard('download', '', 'front')}>Front only</button>
                          <button type="button" className="hb-id-linkbtn interactive" onClick={() => exportCard('download', '', 'back')}>Back only</button>
                          <button type="button" className="hb-id-linkbtn interactive" onClick={() => openPreview(lastExport.blob, lastExport.filename)}>Not saving? Show image</button>
                        </span>
                      )}
                    </p>
                  </div>
                  {notice && <p className="hb-id-notice" role="status">{notice}</p>}

                  {shareHelper && (
                    <div className="hb-id-preview hb-id-helper" role="group" aria-label={`Share on ${shareHelper.name}`}>
                      <h3>Share on {shareHelper.name}</h3>
                      {helperThumb && <img className="hb-id-helper-thumb" src={helperThumb} alt="The picture that will be shared: front and back of your card" draggable={false} />}
                      {shareHelper.kind === 'upload' ? (
                        <ol>
                          <li>Save your card picture (button below)</li>
                          <li>Open Instagram</li>
                          <li>Click the <strong>+</strong> (Create) button, choose <strong>Post</strong>, and pick the saved picture</li>
                        </ol>
                      ) : shareHelper.kind === 'badge' ? (
                        <ol>
                          <li className={shareHelper.copied ? 'is-done' : 'is-warn'}>
                            {shareHelper.copied ? 'Your participation badge is copied ✓' : 'Couldn’t copy automatically — save the badge instead'}
                          </li>
                          <li>Open LinkedIn — your badge message is ready</li>
                          <li>Click inside the post box and press <strong>{isApplePlatform() ? '⌘ V' : 'Ctrl + V'}</strong> to add the badge</li>
                        </ol>
                      ) : (
                        <ol>
                          <li className={shareHelper.copied ? 'is-done' : 'is-warn'}>
                            {shareHelper.copied ? 'Your card picture is copied ✓' : 'Couldn’t copy automatically — save the picture instead'}
                          </li>
                          <li>Open {shareHelper.name} — your message and link are already typed</li>
                          <li>
                            {shareHelper.name === 'LinkedIn' ? 'Click inside the post box' : 'Pick a chat, click the message box'}, then press <strong>{isApplePlatform() ? '⌘ V' : 'Ctrl + V'}</strong> to add the picture
                          </li>
                        </ol>
                      )}
                      <div className="hb-id-helper-actions">
                        <a
                          className="hb-id-mini hb-id-primary interactive"
                          href={shareHelper.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={closeCard}
                        >
                          OPEN {shareHelper.name.toUpperCase()} ↗
                        </a>
                        {shareHelper.kind !== 'upload' && (
                          <button
                            type="button"
                            className="hb-id-mini interactive"
                            onClick={async () => {
                              const ok = await copyImageToClipboard(shareHelper.blob);
                              setShareHelper((h) => (h ? { ...h, copied: ok } : h));
                            }}
                          >
                            COPY AGAIN
                          </button>
                        )}
                        <button type="button" className={`hb-id-mini interactive${shareHelper.kind === 'upload' ? ' hb-id-strong' : ''}`} onClick={() => downloadBlob(shareHelper.blob, shareHelper.filename)}>
                          SAVE PICTURE
                        </button>
                      </div>
                      <p className="hb-id-helper-note">
                        {shareHelper.kind === 'upload'
                          ? 'Instagram doesn’t let websites post for you, so the picture is saved on your device and you add it yourself.'
                          : 'If the paste doesn’t add the picture, use Save picture and attach the file with the post box’s image button.'}
                        {shareHelper.note}
                      </p>
                      <button type="button" className="hb-id-helper-close interactive" onClick={() => setShareHelper(null)} aria-label="Close">×</button>
                    </div>
                  )}

                  {preview && (
                    <div className="hb-id-preview" role="group" aria-label="Your saved image">
                      <img src={preview.url} alt="Your ID card as an image" draggable={false} />
                      <p>Press and hold the image, then choose “Save”. Or use the button below.</p>
                      <div className="hb-id-preview-actions">
                        <a className="hb-id-mini interactive" href={preview.url} download={preview.filename}>TRY DOWNLOAD</a>
                        <button type="button" className="hb-id-mini interactive" onClick={() => setPreview(null)}>CLOSE</button>
                      </div>
                    </div>
                  )}
                </>
              )
            )
          )}
          </div>
        </div>,
        document.body
      )}
    </>
  );
}