import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";

/*
  HackBIOS Timeline: a giant rotating dial with boot-log cards on its rim.
  - One file only, no new dependencies, App.jsx untouched
  - Cards ride the rim of a large translucent disc; the active one rests at
    9 o'clock (12 o'clock on mobile), its neighbours tilt away and peek in
  - The ring is a true loop: it keeps turning the same way forever, so the
    last event flows into the first one with no spin-back
  - A 24h instrument wheel sits inside the disc, with markers at real times
  - Transparent: the page's own dark space shows through the disc
  - Add `image: "/path.jpg"` to any event to put a photo behind its card
  - The section is pinned: it is taller than the screen and its content is
    sticky, so the page holds on the dial while you scroll through the events
    (scroll position drives the dial). Works with Lenis and native scrolling,
    no ScrollTrigger needed.
  - Left/Right arrow keys (while in view) and swipe (mobile) move the dial;
    the thin line beside the counter shows the auto-advance timer

  Props:
    navHeight  optional number (px). Height of a fixed navbar that overlays
               the top of the page. If omitted, the component detects it
               (and uses 0 when nothing overlays the top of the page).

  Tuning knobs (CSS variables on .hb-tl, set them from outside if needed):
    --hb-nav   height of the fixed site navbar (normally set automatically)
    --hb-rail  width reserved on the left for the social icon rail
    --hb-disc  fill of the dial disc
    --hb-run   scroll distance spent on each event while pinned (default 28svh)
*/

const EVENTS = [
  // time is 24h "HH:MM"; "24:00" means midnight at the end of the day
  { day: 1, time: "07:30", label: "01", code: "CHECK_IN", title: "Check-in & Breakfast", text: "Team check-in, ID verification and breakfast before the event begins." },
  { day: 1, time: "10:00", label: "02", code: "INAUGURATION", title: "Inauguration", text: "The opening ceremony: welcome, rules and a briefing on how the next 24 hours will run." },
  { day: 1, time: "10:30", label: "03", code: "HACK_BEGIN", title: "Hacking Starts", text: "The clock starts: begin building your solution with your team." },
  { day: 1, time: "13:00", label: "04", code: "LUNCH", title: "Lunch", text: "Take a break, eat and recharge before the afternoon sprint." },
  { day: 1, time: "17:00", label: "05", code: "TEA_BREAK", title: "Evening Tea Break", text: "A short tea break to stretch, chat and refocus." },
  { day: 1, time: "18:00", label: "06", code: "JUDGING_R1", title: "Judging Round 1", text: "First round of judging: present your progress to the judges." },
  { day: 1, time: "20:30", label: "07", code: "DINNER", title: "Dinner", text: "Dinner break before the night build." },
  { day: 1, time: "23:00", label: "08", code: "MENTORING", title: "Mentoring Session", text: "Get feedback from mentors, validate your approach and unblock issues." },
  { day: 1, time: "24:00", label: "09", code: "MIDNIGHT_TEA", title: "Midnight Tea", text: "A midnight tea break to keep the energy up through the night." },
  { day: 2, time: "08:00", label: "01", code: "BREAKFAST", title: "Breakfast", text: "Start day two with breakfast and a final push on your project." },
  { day: 2, time: "10:30", label: "02", code: "SUBMIT_CLOSE", title: "Submission Window Closes", text: "Last chance to submit your project, repository and materials." },
  { day: 2, time: "10:45", label: "03", code: "FINAL_JUDGING", title: "Final Judging Round", text: "Present your final solution and answer the judges' questions." },
  { day: 2, time: "13:00", label: "04", code: "LUNCH", title: "Lunch", text: "Take a break and recharge before the results." },
  { day: 2, time: "14:30", label: "05", code: "RESULTS", title: "Results Announcement & Prize Distribution", text: "Winners are announced and prizes are handed out." },
];

/* ---------- geometry (SVG viewBox is 1000 x 1000, dial centre 500,500) ---------- */

const CX = 500;
const CY = 500;
const R_DISC = 480; // outer edge of the disc
const R_INST = 270; // instrument wheel (drawn at INST_SCALE)
const R_TRACK = 190; // instrument event markers
// The instrument is scaled down so the card ring has its own clear band:
// instrument edge = 270 * .76 = 205, cards span 217..452, green ring = 456.
const INST_SCALE = 0.9;
const INST_TRANSFORM = `translate(${CX} ${CY}) scale(${INST_SCALE}) translate(${-CX} ${-CY})`;
const ANCHOR_DESKTOP = 270; // active card rests at 9 o'clock
const ANCHOR_MOBILE = 0; // active card rests at 12 o'clock
const STEP_DESKTOP = 24; // degrees between neighbouring cards
const STEP_MOBILE = 24;
const AUTO_MS = 5200;
// Portrait windows (tablets, tall browser windows) use the mobile layout too:
// the desktop layout needs a landscape stage to fit its left column.
const MOBILE_QUERY = "(max-width: 1024px), (max-aspect-ratio: 1/1)";
const TABLET_QUERY =
  "(min-width: 768px) and (max-width: 1024px), (min-width: 768px) and (max-aspect-ratio: 1/1)";

const fmt = (n) => Number(n.toFixed(2));
const pad = (n) => String(n).padStart(2, "0");
const mod = (n, m) => ((n % m) + m) % m;

// angle in degrees, clockwise from 12 o'clock
function polar(r, deg) {
  const a = (deg * Math.PI) / 180;
  return [CX + r * Math.sin(a), CY - r * Math.cos(a)];
}

function ticksPath(count, r1, r2) {
  let d = "";
  for (let i = 0; i < count; i += 1) {
    const a = (i / count) * 360;
    const [x1, y1] = polar(r1, a);
    const [x2, y2] = polar(r2, a);
    d += `M${fmt(x1)} ${fmt(y1)}L${fmt(x2)} ${fmt(y2)}`;
  }
  return d;
}

function arcPath(r, a1, a2) {
  const [x1, y1] = polar(r, a1);
  const [x2, y2] = polar(r, a2);
  return `M${fmt(x1)} ${fmt(y1)}A${r} ${r} 0 ${a2 - a1 > 180 ? 1 : 0} 1 ${fmt(x2)} ${fmt(y2)}`;
}

const minutesOf = (time) => {
  const [h, m] = time.split(":").map(Number);
  return h * 60 + m;
};

// "24:00" (end of day) is shown as 00:00
const showTime = (time) => (time === "24:00" ? "00:00" : time);

/* Static artwork, built once */
const RIM_MINOR = ticksPath(120, R_DISC, R_DISC - 8);
const RIM_MAJOR = ticksPath(12, R_DISC, R_DISC - 20);
const INST_MINOR = ticksPath(96, R_INST, R_INST - 6);
const INST_HOUR = ticksPath(24, R_INST, R_INST - 13);
const INST_MAJOR = ticksPath(8, R_INST, R_INST - 24);
const INST_SPOKES = ticksPath(24, 100, 176);
const INNER_TICKS = ticksPath(48, 100, 93);
const INNER_ARC_A = arcPath(112, 20, 96);
const INNER_ARC_B = arcPath(112, 200, 252);
const NUMERALS = [0, 3, 6, 9, 12, 15, 18, 21];
// rim band between the outer edge and the green ring (evenodd annulus)
const BAND = (() => {
  const ring = (r) => `M${CX - r} ${CY}a${r} ${r} 0 1 0 ${r * 2} 0a${r} ${r} 0 1 0 ${-r * 2} 0Z`;
  return ring(R_DISC) + ring(456);
})();

// mini 24h strip drawn on every card
const STRIP_TICKS = (() => {
  let d = "";
  for (let h = 0; h <= 24; h += 1) {
    d += `M${h * 10} 14V${h % 6 === 0 ? 3 : 8}`;
  }
  return d;
})();

const durationLabel = (from, to) => {
  const total = Math.max(0, minutesOf(to) - minutesOf(from));
  const h = Math.floor(total / 60);
  const m = total % 60;
  return h && m ? `${h}h ${m}m` : h ? `${h}h` : `${m}m`;
};

function DayStrip({ time, to }) {
  const x = (minutesOf(time) / 1440) * 240;
  const x2 = to ? (minutesOf(to) / 1440) * 240 : null;
  return (
    <svg
      className="hb-tl__strip"
      viewBox="0 0 240 14"
      preserveAspectRatio="none"
      aria-hidden="true"
      focusable="false"
    >
      {x2 !== null && x2 > x ? (
        <rect className="sp" x={fmt(x)} y="6" width={fmt(x2 - x)} height="8" />
      ) : null}
      <path className="st" d={STRIP_TICKS} />
      <path className="sm" d={`M${fmt(x)} 14V0`} />
    </svg>
  );
}

function useMediaQuery(query) {
  const subscribe = useCallback(
    (onChange) => {
      const mq = window.matchMedia(query);
      mq.addEventListener("change", onChange);
      return () => mq.removeEventListener("change", onChange);
    },
    [query]
  );
  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia(query).matches,
    () => false
  );
}

const useIsoLayoutEffect = typeof window !== "undefined" ? useLayoutEffect : useEffect;

/* Finds the bottom edge of a fixed/sticky navbar overlaying the top of the
   page. Returns 0 when nothing overlays it. Tall fixed elements (full-screen
   backgrounds, canvases) are ignored: a navbar is never taller than 200px. */
function detectNavHeight(root) {
  let best = 0;
  const xs = [0.5, 0.25, 0.75, 0.1, 0.9];
  const ys = [2, 40];
  for (const fx of xs) {
    for (const y of ys) {
      let node = document.elementFromPoint(Math.round(window.innerWidth * fx), y);
      while (node && node !== document.body && node !== document.documentElement) {
        if (root.contains(node)) break;
        const style = window.getComputedStyle(node);
        if (style.position === "fixed" || style.position === "sticky") {
          const rect = node.getBoundingClientRect();
          if (rect.top <= 1 && rect.height > 0 && rect.height <= 200) {
            best = Math.max(best, Math.round(rect.bottom));
            break;
          }
        }
        node = node.parentElement;
      }
    }
  }
  return best;
}

export default function Timeline({ navHeight }) {
  const rootRef = useRef(null);
  const pinRef = useRef(null);
  const lastScrollIdx = useRef(0);
  const touchStart = useRef(null);
  // false if the page turns out to stop the section from sticking (some
  // ancestor with overflow): then the scroll runway is dropped, so it can
  // never leave a blank stretch behind
  const [pinOk, setPinOk] = useState(true);
  const [day, setDay] = useState(1);
  // `pos` is a cumulative position on the loop: it only ever counts up or
  // down, never wraps, so the ring never has to spin back across the dial.
  const [pos, setPos] = useState(0);
  const [hovered, setHovered] = useState(false);
  const [inView, setInView] = useState(true);

  const isMobile = useMediaQuery(MOBILE_QUERY);
  const reduceMotion = useMediaQuery("(prefers-reduced-motion: reduce)");

  // dir flips the sense of rotation so the next event always arrives
  // from below on desktop and from the right on mobile
  const dir = isMobile ? 1 : -1;
  const anchor = isMobile ? ANCHOR_MOBILE : ANCHOR_DESKTOP;
  const step = isMobile ? STEP_MOBILE : STEP_DESKTOP;

  const events = useMemo(
    () =>
      EVENTS.filter((event) => event.day === day)
        .sort((a, b) => minutesOf(a.time) - minutesOf(b.time))
        .map((event) => ({
        ...event,
        angle: dir * (minutesOf(event.time) / 1440) * 360,
      })),
    [day, dir]
  );

  const count = events.length;
  const active = mod(pos, count);
  const current = events[active] ?? events[0];
  const upcoming = events[active + 1];

  /* Moving past the last event of a day continues into the next day, and
     moving back from the first event returns to the previous day's last one
     (Day 1 -> Day 2 -> Day 1 ...). Used by autoplay, arrows, keys and swipes.
     A ref keeps the latest day/position so the interval never goes stale. */
  const latest = useRef({ day, pos });
  latest.current = { day, pos };
  const go = useCallback((direction) => {
    const { day: d, pos: p } = latest.current;
    const dayList = [...new Set(EVENTS.map((event) => event.day))].sort((a, b) => a - b);
    const sizeOf = (x) => EVENTS.filter((event) => event.day === x).length;
    const n = sizeOf(d);
    const at = mod(p, n);
    if (dayList.length > 1 && direction > 0 && at === n - 1) {
      setDay(dayList[(dayList.indexOf(d) + 1) % dayList.length]);
      setPos(0);
    } else if (dayList.length > 1 && direction < 0 && at === 0) {
      const prev = dayList[(dayList.indexOf(d) - 1 + dayList.length) % dayList.length];
      setDay(prev);
      setPos(sizeOf(prev) - 1);
    } else {
      setPos(p + direction);
    }
  }, []);

  /* Navbar offset: an explicit prop wins, otherwise it is detected. */
  useIsoLayoutEffect(() => {
    const el = rootRef.current;
    if (!el) return undefined;
    if (typeof navHeight === "number") {
      el.style.setProperty("--hb-nav", `${navHeight}px`);
      return undefined;
    }
    const apply = () => {
      el.style.setProperty("--hb-nav", `${detectNavHeight(el)}px`);
    };
    apply();
    window.addEventListener("resize", apply);
    window.addEventListener("load", apply);
    return () => {
      window.removeEventListener("resize", apply);
      window.removeEventListener("load", apply);
    };
  }, [navHeight]);

  /* This section's height depends on the navbar and the viewport. Once fonts
     and layout have settled, nudge the page's scroll measurements (the site
     listens for "resize" to re-measure its scroll-reveal triggers) so the
     sections below this one reveal at the right place and leave no blank gap. */
  useEffect(() => {
    let dead = false;
    const nudge = () => {
      if (!dead) window.dispatchEvent(new Event("resize"));
    };
    const timer = window.setTimeout(nudge, 600);
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(nudge);
    return () => {
      dead = true;
      window.clearTimeout(timer);
    };
  }, []);

  /* Instrument wheel: cumulative rotation, always the shortest way round.
     Adjusted during render (React's "derive state from props" pattern)
     rather than in an effect, so there is no extra cascading render.
     On a day change it snaps to its new angle (the wheel is re-mounted
     below) instead of spinning while the new markers fade in. */
  const target = anchor - current.angle;
  const [inst, setInst] = useState({ day, target, rot: target });
  let instRot = inst.rot;
  if (inst.day !== day) {
    instRot = target;
    setInst({ day, target, rot: target });
  } else if (inst.target !== target) {
    const delta = ((((target - inst.target) % 360) + 540) % 360) - 180;
    instRot = inst.rot + delta;
    setInst({ day, target, rot: instRot });
  }

  /* Card ring: the rotation follows the cumulative position directly. */
  const cardRot = anchor - dir * pos * step;

  /* Auto-rotation: pauses while the mouse is over a card or button, off-screen,
     or with reduced motion. `pos` is a dependency so any manual move
     restarts the timer. */
  const playing = !hovered && inView && !reduceMotion && count > 1;

  useEffect(() => {
    if (!playing) return undefined;
    const id = window.setInterval(() => {
      go(1);
    }, AUTO_MS);
    return () => window.clearInterval(id);
  }, [playing, count, pos, day, go]);

  /* "In view" is judged on the pinned frame, not the tall section: the section
     is several screens high, so it could never reach the visibility threshold. */
  useEffect(() => {
    const el = pinRef.current;
    if (!el || !("IntersectionObserver" in window)) return undefined;
    const observer = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { threshold: 0.35 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  /* When the pin gives up its scroll runway the section gets ~900px shorter.
     Everything below it (Tracks etc.) moved up by that much, so the page must
     re-measure its scroll-reveal triggers or those sections stay blurred and
     faded for a long stretch of scrolling. */
  useEffect(() => {
    if (pinOk) return undefined;
    const t = window.setTimeout(() => window.dispatchEvent(new Event("resize")), 60);
    return () => window.clearTimeout(t);
  }, [pinOk]);

  /* Scroll drives the dial while the section is pinned. The event only
     changes when the scroll position crosses into a new step, so arrow keys,
     clicks and swipes are never overridden at rest. */
  useEffect(() => {
    const el = rootRef.current;
    const pin = pinRef.current;
    if (!el || !pin || count < 2) return undefined;
    let raf = 0;
    const read = () => {
      raf = 0;
      const rect = el.getBoundingClientRect();
      const runway = rect.height - pin.offsetHeight;
      if (runway <= 0) return;
      // inside the runway the pinned frame must sit at the top of the screen;
      // if it scrolls away instead, sticky is blocked by the page
      if (
        rect.top < -16 &&
        rect.bottom > pin.offsetHeight + 16 &&
        Math.abs(pin.getBoundingClientRect().top) > 16
      ) {
        setPinOk(false);
        return;
      }
      const progress = Math.min(1, Math.max(0, -rect.top / runway));
      // the last event is reached a little before the very end of the runway, so
      // the page never sits still on it before moving on
      const idx = Math.min(count - 1, Math.round((progress * (count - 1)) / 0.92));
      if (idx !== lastScrollIdx.current) {
        lastScrollIdx.current = idx;
        setPos(idx);
      }
    };
    const onScroll = () => {
      if (!raf) raf = window.requestAnimationFrame(read);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    onScroll();
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) window.cancelAnimationFrame(raf);
    };
  }, [count]);

  const move = go;

  const changeDay = (next) => {
    if (next === day) return;
    setDay(next);
    setPos(0);
  };

  /* Arrow keys work anywhere while the section is on screen. Only
     Left/Right: Up/Down belong to page scrolling. */
  useEffect(() => {
    if (!inView) return undefined;
    const onKey = (e) => {
      if (e.defaultPrevented || e.altKey || e.ctrlKey || e.metaKey) return;
      const t = e.target;
      if (
        t instanceof HTMLElement &&
        (t.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName))
      ) {
        return;
      }
      if (e.key === "ArrowRight") move(1);
      else if (e.key === "ArrowLeft") move(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [inView, move]);

  /* Swipe on the mobile layout: left = next, right = previous. */
  const onTouchStart = (e) => {
    const t = e.touches[0];
    touchStart.current = { x: t.clientX, y: t.clientY };
  };

  const onTouchEnd = (e) => {
    const from = touchStart.current;
    touchStart.current = null;
    if (!from || !isMobile) return;
    const t = e.changedTouches[0];
    const dx = t.clientX - from.x;
    const dy = t.clientY - from.y;
    if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy) * 1.3) {
      move(dx < 0 ? 1 : -1);
    }
  };

  const angles = events.map((event) => event.angle);
  const spanPath =
    count > 1
      ? arcPath(R_TRACK, Math.min(...angles), Math.max(...angles))
      : "";

  return (
    <section
      id="timeline"
      ref={rootRef}
      className="hb-tl"
      aria-label="HackBIOS event timeline"
      style={{ "--hb-steps": pinOk ? Math.max(count - 1, 0) : 0 }}
      onPointerOver={(e) => {
        if (e.pointerType === "mouse" && e.target.closest("button")) setHovered(true);
      }}
      onPointerOut={(e) => {
        if (!e.relatedTarget?.closest?.("button")) setHovered(false);
      }}
      onPointerLeave={() => setHovered(false)}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      <style>{CSS}</style>

      <div ref={pinRef} className="hb-tl__pin">
      <div className="hb-tl__stage">
        {/* ---------- left: editorial column ---------- */}
        <div className="hb-tl__left">
          <header className="hb-tl__head">
            <p className="hb-tl__eyebrow">HackBIOS 3.0 / Schedule</p>
            <h2 className="hb-tl__title">Timeline</h2>

            <div className="hb-tl__days" role="group" aria-label="Hackathon day">
              {[1, 2].map((item) => (
                <button
                  key={item}
                  type="button"
                  className={`hb-tl__day${day === item ? " is-active" : ""}`}
                  aria-pressed={day === item}
                  onClick={() => changeDay(item)}
                >
                  Day {pad(item)}
                </button>
              ))}
            </div>

          </header>

          {/* sits exactly on the dial's horizontal axis: the rule runs from the
              edge of the page straight into the active card and on to the index */}
          <div className="hb-tl__now">
            <span className="hb-tl__rule" aria-hidden="true" />
            <div className="hb-tl__now-copy" key={`${day}-${pos}`}>
              <div className="hb-tl__now-top">
                <span className="hb-tl__label">Current phase</span>
                <span className="hb-tl__now-time">
                  {upcoming ? `until ${showTime(upcoming.time)}` : "final phase"}
                </span>
              </div>
            </div>

          {/* mini agenda: every event of the day, click to jump */}
          <ol className="hb-tl__agenda" aria-label="Events of the day" style={{ "--n": count }}>
            {events.map((event, index) => {
              const slot = index + count * Math.round((pos - index) / count);
              return (
                <li key={`${event.day}-${event.time}`}>
                  <button
                    type="button"
                    className={`hb-tl__step${index === active ? " is-active" : ""}${index < active ? " is-past" : ""}`}
                    aria-label={`${event.title}, ${showTime(event.time)}`}
                    aria-current={index === active ? "true" : undefined}
                    onClick={() => setPos(slot)}
                  >
                    <i aria-hidden="true" />
                    <span>{showTime(event.time)}</span>
                  </button>
                </li>
              );
            })}
          </ol>
          </div>

          <div className="hb-tl__foot">
            <button
              type="button"
              className="hb-tl__arrow"
              onClick={() => move(-1)}
              aria-label="Previous event"
            >
              &larr;
            </button>
            <span className="hb-tl__count">
              <b>{pad(active + 1)}</b> / {pad(count)}
            </span>
            <button
              type="button"
              className="hb-tl__arrow"
              onClick={() => move(1)}
              aria-label="Next event"
            >
              &rarr;
            </button>
            <span className="hb-tl__meta">
              <span className="hb-tl__progress" aria-hidden="true">
                <i
                  key={`${day}-${pos}-${playing}`}
                  style={{
                    animationDuration: `${AUTO_MS}ms`,
                    animationPlayState: playing ? "running" : "paused",
                  }}
                />
              </span>
              {count} events on a 24h dial
            </span>
          </div>
        </div>

        {/* ---------- right: the dial ---------- */}
        <div className="hb-tl__dial">
          <svg
            className="hb-tl__svg"
            viewBox="0 0 1000 1000"
            aria-hidden="true"
            focusable="false"
          >
            <defs>
              <radialGradient id="hb-tl-disc" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#0a150b" stopOpacity=".38" />
                <stop offset="62%" stopColor="#0b180d" stopOpacity=".6" />
                <stop offset="100%" stopColor="#102416" stopOpacity=".86" />
              </radialGradient>
            </defs>

            {/* disc and its rim band */}
            <circle className="disc" cx={CX} cy={CY} r={R_DISC} />
            <path className="band" d={BAND} />
            <circle className="r-green" cx={CX} cy={CY} r="456" />

            {/* rim ticks turn with the card ring (re-mounted on day change) */}
            <g
              key={`rim-${day}`}
              className="hb-tl__rot"
              style={{ transform: `rotate(${cardRot}deg)` }}
            >
              <path className="t-minor" d={RIM_MINOR} />
              <path className="t-hour" d={RIM_MAJOR} />

              {/* event times on the rim, riding with the ring */}
              {!isMobile
                ? events.map((event, index) => {
                    const slot = index + count * Math.round((pos - index) / count);
                    const distance = Math.abs(slot - pos);
                    const theta = dir * slot * step;
                    const [dx, dy] = polar(456, theta);
                    return (
                      <g
                        key={`rl-${event.time}`}
                        className={`rl${distance === 0 ? " is-active" : ""}`}
                        style={{ opacity: distance <= 2 ? 1 : 0 }}
                      >
                        <circle className="rl-dot" cx={fmt(dx)} cy={fmt(dy)} r="5" />
                        <text
                          className="rl-txt"
                          x={CX}
                          y={CY - 428}
                          textAnchor="middle"
                          dominantBaseline="central"
                          transform={`rotate(${theta} ${CX} ${CY})`}
                        >
                          {showTime(event.time)}
                        </text>
                      </g>
                    );
                  })
                : null}
            </g>

            {/* the current phase, lit on the rim: from this event to the next */}
            {!isMobile ? (
              <path
                key={`hi-${day}-${pos}`}
                className="hi"
                d={arcPath(456, Math.min(anchor, anchor + dir * step), Math.max(anchor, anchor + dir * step))}
              />
            ) : null}

            {/* instrument: scaled so the card ring sits clear of it */}
            <g transform={INST_TRANSFORM}>
              {/* static rings */}
              <circle className="r-inst" cx={CX} cy={CY} r={R_INST} />
              <circle className="r-track" cx={CX} cy={CY} r={R_TRACK} />
              <circle className="r-soft" cx={CX} cy={CY} r="130" />
              <circle className="r-soft" cx={CX} cy={CY} r="60" />
              <path className="r-cross" d="M484 500H516M500 484V516" />

              {/* main wheel */}
              <g
                key={`wheel-${day}`}
                className="hb-tl__rot"
                style={{ transform: `rotate(${instRot}deg)` }}
              >
                <path className="t-spoke" d={INST_SPOKES} />
                <path className="t-minor" d={INST_MINOR} />
                <path className="t-hour" d={INST_HOUR} />
                <path className="t-major" d={INST_MAJOR} />

                {NUMERALS.map((h) => (
                  <text
                    key={h}
                    className="num"
                    x={CX}
                    y={CY - 226}
                    textAnchor="middle"
                    dominantBaseline="central"
                    transform={`rotate(${dir * h * 15} ${CX} ${CY})`}
                  >
                    {pad(h)}
                  </text>
                ))}

                <g className="hb-tl__markers">
                  {spanPath ? <path className="span" d={spanPath} /> : null}

                  {events.map((event, index) => {
                    const [x, y] = polar(R_TRACK, event.angle);
                    const [sx1, sy1] = polar(124, event.angle);
                    const [sx2, sy2] = polar(184, event.angle);
                    return (
                      <g
                        key={`${event.day}-${event.time}`}
                        className={`ev${index === active ? " is-active" : ""}`}
                      >
                        <line
                          className="spoke"
                          x1={fmt(sx1)}
                          y1={fmt(sy1)}
                          x2={fmt(sx2)}
                          y2={fmt(sy2)}
                        />
                        <circle className="halo" cx={fmt(x)} cy={fmt(y)} r="11" />
                        <circle className="dot" cx={fmt(x)} cy={fmt(y)} r="4.5" />
                      </g>
                    );
                  })}
                </g>
              </g>

              {/* inner wheel turns against the main one, at half speed */}
              <g
                key={`inner-${day}`}
                className="hb-tl__rot"
                style={{ transform: `rotate(${-instRot * 0.5}deg)` }}
              >
                <path className="t-inner" d={INNER_TICKS} />
                <path className="arc" d={INNER_ARC_A} />
                <path className="arc" d={INNER_ARC_B} />
              </g>

              {/* fixed index: the active position on the instrument */}
              <g transform={isMobile ? `rotate(90 ${CX} ${CY})` : undefined}>
                <line className="ix" x1="246" y1="500" x2="296" y2="500" />
                <path className="ix-tri" d="M232 493L245 500L232 507Z" />
              </g>
            </g>
          </svg>

        </div>

        {/* ---------- desktop: the current event card sits in the open space
            between the text and the dial, outside the disc ---------- */}
        {(
          <div className="hb-tl__focus">
            <div className="hb-tl__card is-active is-focus" key={`${day}-${pos}`} aria-live="polite">
              {current.image ? (
                <img className="hb-tl__card-img" src={current.image} alt="" loading="lazy" />
              ) : null}
              <span className="hb-tl__card-top">
                <b>[ {current.label} ]</b>
                <em>{current.code}</em>
                <i aria-hidden="true" />
                <span>D{pad(current.day)}</span>
              </span>
              <span className="hb-tl__card-mid">
                <span className="hb-tl__card-time">{showTime(current.time)}</span>
                <span className="hb-tl__card-title">{current.title}</span>
                <span className="hb-tl__card-text">{current.text}</span>
              </span>
              <span className="hb-tl__card-meta">
                <b>NOW</b>
                {upcoming
                  ? `${showTime(current.time)} \u2192 ${showTime(upcoming.time)} \u00b7 ${durationLabel(current.time, upcoming.time)}`
                  : `from ${showTime(current.time)}`}
              </span>
              <DayStrip time={current.time} to={upcoming?.time} />
            </div>
          </div>
        )}
      </div>
      </div>
    </section>
  );
}

const CSS = `
.hb-tl {
  --hb-green: #00ff41;
  --hb-bg: #050a05;
  --hb-disc: rgba(4,9,4,.55);
  --hb-line: rgba(255,255,255,.16);
  --hb-nav: 96px;
  --hb-rail: 112px;
  --H: max(calc(100svh - var(--hb-nav)), 504px);
  --pad: max(var(--hb-rail), 5vw);
  /* dial size: follows the viewport height, but is capped so the active card
     always leaves at least 300px for the left column (never overlaps it) */
  --S: min(
    max(calc(var(--H) * 1.15), 66vw),
    calc((100vw - var(--pad) - 300px) / .84)
  );
  /* card ring radius and card width, as fractions of the dial size */
  --rc: .335;
  --cwr: .235;
  /* desktop focus card: width as a fraction of the dial size */
  --fw: .3;
  --mono: "Share Tech Mono", ui-monospace, SFMono-Regular, Menlo, monospace;
  --display: "Syne", system-ui, sans-serif;
  --hb-run: 28svh;
  /* empty strip at the bottom of the pinned frame, trimmed so no blank band
     is left before the next section */
  --hb-trim: clamp(40px, 8svh, 88px);
  position: relative;
  isolation: isolate;
  /* breathing room above, so the section is not glued to the one before it */
  margin-top: clamp(48px, 9svh, 110px);
  /* one screen for the dial, plus scroll room for every step between events */
  height: calc(var(--H) + var(--hb-nav) - var(--hb-trim) + var(--hb-steps, 0) * var(--hb-run));
  color: #fff;
  background: transparent;
  font-family: var(--display);
  /* vertical scrolling stays with the page, horizontal swipes go to the dial */
  touch-action: pan-y;
}

/* the site's global scroll-reveal class must never clip, contain or filter this
   section, or the sticky pin below would silently stop working */
.hb-tl.section-reveal, .hb-tl.section-reveal.revealed {
  overflow: visible !important;
  contain: none !important;
  filter: none !important;
  will-change: auto !important;
}

/* the pinned frame: stays on screen while the section scrolls past. It clips
   the dial itself (the section must not clip, or sticky would stop working). */
.hb-tl__pin {
  position: sticky;
  top: 0;
  height: calc(var(--H) + var(--hb-nav) - var(--hb-trim));
  overflow: hidden;
  overflow: clip;
}

/* soft dark scrim over the page's busy circuit background, so the title and
   text read cleanly; the page still shows through */
.hb-tl__pin::before {
  content: "";
  position: absolute;
  inset: 0;
  z-index: 0;
  pointer-events: none;
  background:
    linear-gradient(90deg, rgba(3,8,4,.82) 0%, rgba(3,8,4,.6) 38%, rgba(3,8,4,.22) 72%, rgba(3,8,4,.3) 100%),
    linear-gradient(180deg, rgba(3,8,4,.5) 0%, rgba(3,8,4,0) 22%, rgba(3,8,4,0) 78%, rgba(3,8,4,.5) 100%);
}

.hb-tl *, .hb-tl *::before, .hb-tl *::after { box-sizing: border-box; }

.hb-tl button:focus-visible {
  outline: 1px solid var(--hb-green);
  outline-offset: 4px;
}

/* the stage starts below the site navbar, but is not clipped there: the dial
   may rise behind the navbar and is cut only by the section itself */
.hb-tl__stage {
  position: absolute;
  inset: var(--hb-nav) 0 0 0;
}

/* ---------- left column ---------- */

.hb-tl__left {
  position: absolute;
  inset: 0;
  z-index: 4;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: clamp(28px, 6vh, 64px) 0 clamp(24px, 4vh, 44px) var(--pad);
  pointer-events: none;
  text-shadow: 0 0 10px var(--hb-bg), 0 0 3px var(--hb-bg);
}

.hb-tl__eyebrow {
  margin: 0;
  font-family: var(--mono);
  font-size: 12px;
  letter-spacing: .14em;
  color: rgba(0,255,65,.85);
}

.hb-tl__title {
  margin: 12px 0 0;
  font-family: var(--display);
  font-weight: 600;
  font-size: clamp(48px, 5.6vw, 92px);
  line-height: .9;
  letter-spacing: -.03em;
}

.hb-tl__days { display: flex; gap: 22px; margin-top: 24px; }

.hb-tl__day {
  pointer-events: auto;
  display: inline-flex;
  align-items: center;
  gap: 9px;
  padding: 6px 0;
  border: 0;
  background: none;
  cursor: pointer;
  font-family: var(--mono);
  font-size: 12px;
  letter-spacing: .14em;
  text-transform: uppercase;
  color: rgba(255,255,255,.4);
  text-shadow: inherit;
  transition: color .3s ease;
}

.hb-tl__day::before {
  content: "";
  width: 5px;
  height: 5px;
  border: 1px solid currentColor;
  border-radius: 50%;
  transition: background .3s ease, border-color .3s ease;
}

.hb-tl__day:hover { color: rgba(255,255,255,.75); }
.hb-tl__day.is-active { color: #fff; }
.hb-tl__day.is-active::before {
  background: var(--hb-green);
  border-color: var(--hb-green);
}

/* zero-height box pinned to the exact vertical centre of the stage, which is
   also the centre of the dial: the rule below IS the dial's horizontal axis.
   It ends just short of the active card. The card's left edge sits at
   (ring radius + half the card width) * S from the right of the stage. */
.hb-tl__now {
  position: absolute;
  top: 50%;
  left: var(--pad);
  right: calc(var(--S) * (.48 + var(--fw)) + 30px);
  height: 0;
}

.hb-tl__rule {
  position: absolute;
  top: 0;
  left: 0;
  right: 16px;
  height: 1px;
  background: linear-gradient(90deg, rgba(255,255,255,.08), rgba(255,255,255,.3) 38%, rgba(0,255,65,.9));
}

.hb-tl__now-copy {
  position: absolute;
  inset: 0;
  animation: hb-tl-in .8s .35s both cubic-bezier(.2,.7,.2,1);
}

/* above the axis: small label on the left, the time window on the right */
.hb-tl__now-top {
  position: absolute;
  left: 0;
  right: 16px;
  bottom: 14px;
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 16px;
}

/* below the axis: the phase itself */
.hb-tl__now-main {
  position: absolute;
  top: 22px;
  left: 0;
  width: min(100%, 340px);
}

.hb-tl__label {
  font-family: var(--mono);
  font-size: 11px;
  letter-spacing: .16em;
  text-transform: uppercase;
  color: rgba(255,255,255,.42);
  white-space: nowrap;
}

.hb-tl__now-title {
  font-size: clamp(22px, 2vw, 30px);
  font-weight: 500;
  line-height: 1.05;
  letter-spacing: -.025em;
}

.hb-tl__now-desc {
  max-width: 34ch;
  margin: 0;
  font-size: 16px;
  line-height: 1.6;
  color: rgba(255,255,255,.72);
}

.hb-tl__now-time {
  font-family: var(--mono);
  font-size: 13px;
  letter-spacing: .12em;
  text-transform: uppercase;
  color: var(--hb-green);
  white-space: nowrap;
}

.hb-tl__now-time span { color: rgba(255,255,255,.45); }

.hb-tl__foot { display: flex; align-items: center; gap: 16px; }

.hb-tl__arrow {
  pointer-events: auto;
  display: grid;
  place-items: center;
  width: 36px;
  height: 36px;
  border: 1px solid var(--hb-line);
  border-radius: 50%;
  background: transparent;
  color: rgba(255,255,255,.55);
  font: inherit;
  font-size: 14px;
  line-height: 1;
  cursor: pointer;
  text-shadow: inherit;
  transition: color .25s ease, border-color .25s ease;
}

.hb-tl__arrow:hover { color: var(--hb-green); border-color: rgba(0,255,65,.6); }

.hb-tl__count {
  font-family: var(--mono);
  font-size: 12px;
  letter-spacing: .14em;
  color: rgba(255,255,255,.55);
}

.hb-tl__count b { font-weight: 400; color: #fff; }

.hb-tl__meta {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-left: 10px;
  font-family: var(--mono);
  font-size: 11px;
  letter-spacing: .08em;
  color: rgba(255,255,255,.42);
}

/* auto-advance timer: a thin line that fills while the dial is playing */
.hb-tl__progress {
  position: relative;
  width: 64px;
  height: 1px;
  background: var(--hb-line);
}

.hb-tl__progress i {
  position: absolute;
  inset: 0;
  background: var(--hb-green);
  transform: scaleX(0);
  transform-origin: left center;
  animation: hb-tl-fill linear forwards;
}

/* ---------- dial ---------- */

.hb-tl__dial {
  position: absolute;
  z-index: 1;
  top: 50%;
  /* the dial's centre sits exactly on the right edge of the page, so only its
     left half (a semicircle) is visible; the frame clips the other half */
  right: calc(var(--S) * -.5);
  width: var(--S);
  height: var(--S);
  transform: translateY(-50%);
  container-type: size;
  pointer-events: none;
}

.hb-tl__svg { display: block; width: 100%; height: 100%; overflow: visible; }

.hb-tl__svg :is(circle, path, line) {
  fill: none;
  stroke: var(--hb-line);
  stroke-width: 1;
  vector-effect: non-scaling-stroke;
}

.hb-tl__svg .disc    { fill: url(#hb-tl-disc); stroke: rgba(255,255,255,.32); }
.hb-tl__svg .band    { fill: rgba(0,255,65,.055); stroke: none; fill-rule: evenodd; }
.hb-tl__svg .r-green { stroke: rgba(0,255,65,.2); }
.hb-tl__svg .r-inst  { stroke: rgba(255,255,255,.4); }
.hb-tl__svg .r-track { stroke: rgba(255,255,255,.26); }
.hb-tl__svg .r-soft  { stroke: rgba(255,255,255,.1); }
.hb-tl__svg .r-cross { stroke: rgba(255,255,255,.3); }
.hb-tl__svg .t-spoke { stroke: rgba(255,255,255,.08); }
.hb-tl__svg .t-minor { stroke: rgba(255,255,255,.26); }
.hb-tl__svg .t-hour  { stroke: rgba(255,255,255,.55); }
.hb-tl__svg .t-major { stroke: rgba(255,255,255,.9); }
.hb-tl__svg .t-inner { stroke: rgba(255,255,255,.22); }
.hb-tl__svg .arc     { stroke: rgba(255,255,255,.16); stroke-width: 3; }
.hb-tl__svg .span    { stroke: rgba(255,255,255,.38); }
.hb-tl__svg .ix      { stroke: var(--hb-green); opacity: .9; }
.hb-tl__svg .ix-tri  { fill: var(--hb-green); stroke: none; }

.hb-tl__svg text {
  fill: rgba(255,255,255,.55);
  font-family: var(--mono);
  font-size: 13px;
  letter-spacing: .1em;
}

.hb-tl__rot {
  transform-box: view-box;
  transform-origin: 500px 500px;
  transition: transform 1300ms cubic-bezier(.66,.02,.18,1);
  will-change: transform;
}

.hb-tl__markers { animation: hb-tl-fade .7s .15s both ease; }

.hb-tl__svg .ev .spoke { stroke: rgba(255,255,255,.26); }
.hb-tl__svg .ev .dot   { fill: var(--hb-bg); stroke: rgba(255,255,255,.7); }
.hb-tl__svg .ev .halo  { stroke: var(--hb-green); opacity: 0; }

.hb-tl__svg .ev .spoke,
.hb-tl__svg .ev .dot,
.hb-tl__svg .ev .halo { transition: stroke .6s ease .35s, fill .6s ease .35s, opacity .6s ease .35s; }

.hb-tl__svg .ev.is-active .spoke { stroke: rgba(0,255,65,.75); }
.hb-tl__svg .ev.is-active .dot   { fill: var(--hb-green); stroke: var(--hb-green); }
.hb-tl__svg .ev.is-active .halo  { opacity: .55; }


/* ---------- desktop focus card (outside the dial) ---------- */

.hb-tl__focus {
  position: absolute;
  z-index: 3;
  top: 50%;
  right: calc(var(--S) * .48 + 28px);
  width: calc(var(--S) * var(--fw));
  transform: translateY(-50%);
  pointer-events: none;
}

.hb-tl__card.is-focus {
  position: relative;
  inset: auto;
  margin: 0;
  width: 100%;
  aspect-ratio: auto;
  min-height: calc(var(--S) * var(--fw) * .84);
  opacity: 1;
  padding: clamp(16px, 1.5vw, 26px);
  cursor: default;
  animation: hb-tl-card-in .8s .25s both cubic-bezier(.2,.7,.2,1);
}

/* the card is wired to the rule on its left and the dial on its right */
.hb-tl__focus::after {
  content: "";
  position: absolute;
  top: 50%;
  left: 100%;
  width: 28px;
  height: 1px;
  background: linear-gradient(90deg, rgba(0,255,65,.9), rgba(0,255,65,.2));
}

@keyframes hb-tl-card-in {
  from { opacity: 0; transform: translateX(-16px); }
  to   { opacity: 1; transform: none; }
}


.hb-tl__card.is-focus .hb-tl__card-text {
  display: -webkit-box;
  margin-top: 10px;
  overflow: hidden;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 3;
  font-size: max(12px, 4.3cqw);
  line-height: 1.5;
  color: rgba(255,255,255,.72);
}

.hb-tl__card-meta {
  display: flex;
  align-items: center;
  gap: 10px;
  font-family: var(--mono);
  font-size: max(10px, 3.6cqw);
  letter-spacing: .08em;
  color: rgba(255,255,255,.55);
}

.hb-tl__card-meta b {
  padding: 2px 7px;
  font-weight: 400;
  color: var(--hb-bg);
  background: var(--hb-green);
}

.hb-tl__strip .sp { fill: rgba(0,255,65,.28); stroke: none; }

/* ---------- agenda (desktop) ---------- */

.hb-tl__agenda {
  display: flex;
  flex-wrap: wrap;
  position: absolute;
  top: 28px;
  left: 0;
  margin: 0;
  padding: 0;
  list-style: none;
}

.hb-tl__agenda li { position: relative; width: min(70px, calc(640px / var(--n, 6))); }

.hb-tl__agenda li:not(:last-child)::before {
  content: "";
  position: absolute;
  top: 11px;
  left: 18px;
  right: 6px;
  height: 1px;
  background: var(--hb-line);
}

.hb-tl__step {
  pointer-events: auto;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 8px;
  padding: 6px 0;
  border: 0;
  background: none;
  cursor: pointer;
  font-family: var(--mono);
  font-size: 11px;
  letter-spacing: .08em;
  color: rgba(255,255,255,.38);
  text-shadow: inherit;
  transition: color .3s ease;
}

.hb-tl__step i {
  position: relative;
  z-index: 1;
  width: 9px;
  height: 9px;
  border: 1px solid currentColor;
  border-radius: 50%;
  background: var(--hb-bg);
  transition: background .3s ease, border-color .3s ease, box-shadow .3s ease;
}

.hb-tl__step:hover { color: rgba(255,255,255,.8); }
.hb-tl__step.is-past { color: rgba(255,255,255,.6); }
.hb-tl__step.is-past i { background: rgba(255,255,255,.5); }
.hb-tl__step.is-active { color: var(--hb-green); }
.hb-tl__step.is-active i {
  background: var(--hb-green);
  border-color: var(--hb-green);
  box-shadow: 0 0 12px rgba(0,255,65,.7);
}

.hb-tl__hint {
  margin-left: 6px;
  color: var(--hb-green);
  animation: hb-tl-pulse 2.2s ease-in-out infinite;
}

@keyframes hb-tl-pulse {
  0%, 100% { opacity: .35; }
  50%      { opacity: 1; }
}

/* rim labels + lit phase arc on the dial */
.hb-tl__svg .rl { transition: opacity .6s ease; }
.hb-tl__svg .rl .rl-dot { fill: var(--hb-bg); stroke: rgba(255,255,255,.5); }
.hb-tl__svg .rl-txt { fill: rgba(255,255,255,.5); font-size: 15px; letter-spacing: .08em; }
.hb-tl__svg .rl.is-active .rl-dot { fill: var(--hb-green); stroke: var(--hb-green); }
.hb-tl__svg .rl.is-active .rl-txt { fill: var(--hb-green); }
.hb-tl__svg .hi {
  stroke: rgba(0,255,65,.95);
  stroke-width: 3;
  filter: drop-shadow(0 0 6px rgba(0,255,65,.7));
  animation: hb-tl-fade .8s .45s both ease;
}

/* ---------- card ring ---------- */

.hb-tl__wheel {
  position: absolute;
  inset: 0;
  transition: transform 1300ms cubic-bezier(.66,.02,.18,1);
  will-change: transform;
}

.hb-tl__cards {
  position: absolute;
  inset: 0;
  animation: hb-tl-fade .7s .15s both ease;
}

.hb-tl__card {
  position: absolute;
  inset: 0;
  margin: auto;
  /* percentage fallback for browsers without container-query units */
  width: calc(var(--cwr) * 100%);
  width: calc(var(--cwr) * 100cqw);
  aspect-ratio: 25 / 21;
  container-type: inline-size; /* card text scales with the card itself */
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 4px;
  padding: 14px;
  padding: 1.6cqw;
  overflow: hidden;
  border: 1px solid rgba(255,255,255,.16);
  border-radius: 0;
  /* dark glass: only the current card is ever visible, so it can be soft */
  background: linear-gradient(150deg, rgba(12,26,15,.86), rgba(5,10,6,.93));
  color: #fff;
  font: inherit;
  text-align: left;
  cursor: pointer;
  pointer-events: auto;
  /* leaving cards vanish quickly */
  transition: transform 900ms cubic-bezier(.66,.02,.18,1), opacity 260ms ease, border-color .5s ease, background .5s ease, box-shadow .6s ease;
}

/* the current card appears after the dial has turned, in place */
.hb-tl__card.is-active {
  transition: transform 900ms cubic-bezier(.66,.02,.18,1), opacity 650ms ease .55s, border-color .5s ease, background .5s ease, box-shadow .6s ease;
}

/* depth veil: darkens neighbours without making them see-through */
.hb-tl__card::after {
  content: "";
  position: absolute;
  inset: 0;
  z-index: 2;
  background: #050a05;
  opacity: var(--veil, 0);
  pointer-events: none;
  transition: opacity 700ms ease;
}

.hb-tl__card:disabled { pointer-events: none; cursor: default; }

.hb-tl__card:hover { border-color: rgba(255,255,255,.34); }

.hb-tl__card.is-active {
  border-color: rgba(255,255,255,.3);
  background: linear-gradient(150deg, rgba(14,30,17,.88), rgba(5,11,7,.94));
  box-shadow:
    0 28px 60px -18px rgba(0,0,0,.85),
    0 0 46px -12px rgba(0,255,65,.28),
    inset 0 0 0 1px rgba(0,255,65,.07);
}

/* small green corner, only on the active card */
.hb-tl__card.is-active::before {
  content: "";
  position: absolute;
  top: -1px;
  left: -1px;
  z-index: 3;
  width: 16px;
  height: 16px;
  border: 1px solid var(--hb-green);
  border-width: 1px 0 0 1px;
}

.hb-tl__card-img {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  opacity: .35;
  z-index: 0;
}

.hb-tl__card > :not(.hb-tl__card-img) { position: relative; z-index: 1; }

.hb-tl__card-top {
  display: flex;
  align-items: center;
  gap: 8px;
  font-family: var(--mono);
  font-size: 9px;
  font-size: max(9px, 4.4cqw);
  letter-spacing: .08em;
  color: rgba(255,255,255,.5);
}

.hb-tl__card-top b { font-weight: 400; color: rgba(255,255,255,.8); }
.hb-tl__card-top em { font-style: normal; }
.hb-tl__card-top i { flex: 1; height: 1px; background: rgba(255,255,255,.16); }

.hb-tl__card.is-active .hb-tl__card-top b { color: var(--hb-green); }

.hb-tl__card-mid { display: block; min-height: 0; }

.hb-tl__card-time {
  display: block;
  font-family: var(--mono);
  font-size: 34px;
  font-size: clamp(30px, 25cqw, 96px);
  line-height: .9;
  letter-spacing: -.05em;
  color: rgba(255,255,255,.55);
  transition: color .5s ease;
}

.hb-tl__card.is-active .hb-tl__card-time { color: var(--hb-green); }

.hb-tl__card-title {
  display: -webkit-box;
  margin-top: 8px;
  overflow: hidden;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  font-family: var(--display);
  font-size: 15px;
  font-size: clamp(13px, 9cqw, 34px);
  font-weight: 500;
  line-height: 1.05;
  letter-spacing: -.02em;
}

/* event description inside the card: only where the left column is hidden */
.hb-tl__card-text { display: none; }

.hb-tl__strip { display: block; width: 100%; height: 14px; flex: none; overflow: visible; }

.hb-tl__strip :is(path) {
  fill: none;
  vector-effect: non-scaling-stroke;
  stroke-width: 1;
}

.hb-tl__strip .st { stroke: rgba(255,255,255,.3); }
.hb-tl__strip .sm { stroke: rgba(255,255,255,.7); stroke-width: 2; }
.hb-tl__card.is-active .hb-tl__strip .sm { stroke: var(--hb-green); }

@keyframes hb-tl-in {
  from { opacity: 0; transform: translateX(14px); }
  to   { opacity: 1; transform: none; }
}

@keyframes hb-tl-fill {
  from { transform: scaleX(0); }
  to   { transform: scaleX(1); }
}

@keyframes hb-tl-fade {
  from { opacity: 0; }
  to   { opacity: 1; }
}

/* ---------- mobile / portrait: the wheel rises from below, active card rests at the top ---------- */

@media ${MOBILE_QUERY} {
  .hb-tl {
    --hb-nav: 72px;
    /* the dial rises from the real bottom edge, so no strip is trimmed off
       the frame (a trim here cut the dial flat, above the screen bottom) */
    --hb-trim: 0px;
    /* the dial is a half-circle rising from the bottom edge */
    --S: min(100vw, 70svh, 760px);
    --pad: 20px;
  }

  .hb-tl__left {
    padding: 20px var(--pad) 24px;
  }

  .hb-tl__pin::before {
    background: linear-gradient(180deg, rgba(3,8,4,.72) 0%, rgba(3,8,4,.35) 40%, rgba(3,8,4,.2) 100%);
  }

  .hb-tl__title { font-size: 44px; }
  .hb-tl__days { margin-top: 12px; }
  .hb-tl__now, .hb-tl__meta, .hb-tl__agenda { display: none; }

  /* prev / counter / next sit just above the dial's rim */
  .hb-tl__foot {
    position: absolute;
    z-index: 4;
    left: 0;
    right: 0;
    bottom: calc(var(--S) * .5 + 18px);
    justify-content: center;
  }
  .hb-tl__arrow { background: rgba(5,10,5,.88); }

  /* dial centred on the bottom edge: only its top half shows */
  .hb-tl__dial {
    top: auto;
    bottom: calc(var(--S) * -.5);
    right: auto;
    left: 50%;
    transform: translateX(-50%);
  }

  /* the active event card sits under the title, full width */
  .hb-tl__focus {
    top: 148px;
    right: var(--pad);
    left: var(--pad);
    width: auto;
    max-width: 520px;
    margin: 0 auto;
    transform: none;
  }
  .hb-tl__focus::after { display: none; }

  .hb-tl__card.is-focus {
    min-height: 0;
    padding: 16px 18px;
    animation: hb-tl-fade .5s both;
  }
  .hb-tl__card.is-focus .hb-tl__card-mid { margin-top: 10px; }
  .hb-tl__card.is-focus .hb-tl__card-time { font-size: clamp(40px, 15vw, 64px); }
  .hb-tl__card.is-focus .hb-tl__card-title { margin-top: 4px; font-size: clamp(17px, 5.2vw, 24px); }
  .hb-tl__card.is-focus .hb-tl__card-text {
    -webkit-line-clamp: 3;
    margin-top: 6px;
    font-size: 13px;
  }
  .hb-tl__card.is-focus .hb-tl__card-meta { margin-top: 10px; font-size: 11px; }
}

/* short phones: keep the card compact so it never reaches the arrows */
@media ${MOBILE_QUERY} and (max-height: 700px) {
  /* smaller dial + tighter controls so the arrows clear the card */
  .hb-tl { --S: min(88vw, 62svh, 760px); }
  .hb-tl__foot { bottom: calc(var(--S) * .5 + 8px); }
  .hb-tl__title { font-size: 38px; }
  .hb-tl__focus { top: 128px; }
  .hb-tl__card.is-focus .hb-tl__card-text { display: none; }
  .hb-tl__card.is-focus .hb-tl__card-time { font-size: clamp(34px, 12vw, 52px); }
}

/* tablets keep the desktop social rail (md+), so leave room for it */
@media ${TABLET_QUERY} {
  .hb-tl { --pad: 88px; }
}

@media (prefers-reduced-motion: reduce) {
  .hb-tl__rot,
  .hb-tl__wheel,
  .hb-tl__card,
  .hb-tl__card.is-active,
  .hb-tl__card::after,
  .hb-tl__svg .ev .spoke,
  .hb-tl__svg .ev .dot,
  .hb-tl__svg .ev .halo { transition: none; }

  .hb-tl__card.is-focus,
  .hb-tl__hint,
  .hb-tl__now-copy,
  .hb-tl__cards,
  .hb-tl__markers { animation: none; }
}
`;