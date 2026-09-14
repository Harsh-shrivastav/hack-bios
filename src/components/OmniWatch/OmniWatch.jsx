import { useEffect, useRef, useState } from "react";
import "./OmniWatch.css";

// Change this if you host the assets somewhere other than /omniwatch/assets
// (e.g. an S3/CDN URL). It just needs to resolve to wherever the
// public/omniwatch/assets folder ends up being served from.
const ASSET_BASE = "/omniwatch/assets";

const ALIEN_COUNT = 19;

const alienSrcs = Array.from({ length: ALIEN_COUNT }, (_, i) => {
  const num = String(i + 1).padStart(2, "0");
  return `${ASSET_BASE}/aliens/alien_${num}_green_diamond_cropped.png`;
});

const idleSrc = `${ASSET_BASE}/idle-icon-cropped.png`;
const sequence = [idleSrc, ...alienSrcs];

const ROTATE_MS = 400; // quick snap between the ring's 4 positions
const HOLD_MS = 1000; // pause at each position; the diamond content changes here
const STEP_MS = ROTATE_MS + HOLD_MS;
const DIAL_SOUND_SRC = "/audio/omnitrix-dial.mp3";

export default function OmniWatch({ muted = false }) {
  const [rotation, setRotation] = useState(0);
  const [srcA, setSrcA] = useState(idleSrc);
  const [srcB, setSrcB] = useState(idleSrc);
  const [activeA, setActiveA] = useState(true);

  // plain refs for bookkeeping that shouldn't trigger re-renders on their own
  const indexRef = useRef(0);
  const showingARef = useRef(true);
  const dialAudioRef = useRef(null);
  const mutedRef = useRef(muted);

  useEffect(() => {
    mutedRef.current = muted;
  }, [muted]);

  useEffect(() => {
    dialAudioRef.current = new Audio(DIAL_SOUND_SRC);
    dialAudioRef.current.volume = 0.5;
  }, []);

  useEffect(() => {
    let swapTimeoutId;

    const interval = setInterval(() => {
      setRotation((r) => r + 90);

      // Click on every 90° snap. Browsers block audio before the user has
      // interacted with the page at all, so this can silently fail on the
      // very first cycle — that's expected, not a bug.
      const audio = dialAudioRef.current;
      if (audio && !mutedRef.current) {
        audio.currentTime = 0;
        audio.play().catch(() => {});
      }

      swapTimeoutId = setTimeout(() => {
        indexRef.current = (indexRef.current + 1) % sequence.length;
        const nextSrc = sequence[indexRef.current];

        if (showingARef.current) {
          setSrcB(nextSrc);
          setActiveA(false);
        } else {
          setSrcA(nextSrc);
          setActiveA(true);
        }
        showingARef.current = !showingARef.current;
      }, ROTATE_MS);
    }, STEP_MS);

    return () => {
      clearInterval(interval);
      clearTimeout(swapTimeoutId);
    };
  }, []);

  return (
    <div className="omniwatch-scene">
      <div className="omniwatch-glow" />

      <div className="omniwatch-watch">
        <img className="omniwatch-base" src={`${ASSET_BASE}/base-static.png`} alt="" />

        <div className="omniwatch-dial-slot">
          <img
            className={`omniwatch-dial-icon${activeA ? " active" : ""}`}
            src={srcA}
            alt=""
          />
          <img
            className={`omniwatch-dial-icon${!activeA ? " active" : ""}`}
            src={srcB}
            alt=""
          />
        </div>

        <img className="omniwatch-frame" src={`${ASSET_BASE}/frame-top.png`} alt="" />

        <img
          className="omniwatch-gems"
          src={`${ASSET_BASE}/gems-ring.png`}
          alt=""
          style={{ transform: `rotate(${rotation}deg)` }}
        />
      </div>
    </div>
  );
}