import React, { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './CreateIDSection.css';

const features = [
  {
    number: '01',
    title: 'PERSONALIZED',
    text: 'Your identity, your way',
  },
  {
    number: '02',
    title: 'SHAREABLE',
    text: 'Show it to the world',
  },
  {
    number: '03',
    title: 'OFFICIAL',
    text: 'Be part of HackBIOS',
  },
];

export default function CreateIDSection() {
  const cardWrapRef = useRef(null);
  const navigate = useNavigate();

  // Ask the site-wide HackBiosIDCard modal to open. If it isn't on this page
  // (nothing answers the event), fall back to the /create-id route.
  const openIdModal = () => {
    const event = new Event('hackbios:open-id', { cancelable: true });
    const handled = !window.dispatchEvent(event);
    if (!handled) navigate('/create-id');
  };

  const handleCardPointerMove = (event) => {
    const card = cardWrapRef.current;
    if (!card) return;

    const rect = card.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width;
    const y = (event.clientY - rect.top) / rect.height;

    const rotateY = (x - 0.5) * 24;
    const rotateX = (0.5 - y) * 20;
    const glowX = x * 100;
    const glowY = y * 100;

    card.style.setProperty('--cursor-rotate-x', `${rotateX}deg`);
    card.style.setProperty('--cursor-rotate-y', `${rotateY}deg`);
    card.style.setProperty('--cursor-glow-x', `${glowX}%`);
    card.style.setProperty('--cursor-glow-y', `${glowY}%`);
    card.classList.add('is-cursor-active');
  };

  const handleCardPointerLeave = () => {
    const card = cardWrapRef.current;
    if (!card) return;

    card.style.setProperty('--cursor-rotate-x', '0deg');
    card.style.setProperty('--cursor-rotate-y', '0deg');
    card.style.setProperty('--cursor-glow-x', '50%');
    card.style.setProperty('--cursor-glow-y', '50%');
    card.classList.remove('is-cursor-active');
  };

  return (
    <section id="create-id" className="create-id-section">
      <div className="create-id-grid" aria-hidden="true" />
      <div className="create-id-noise" aria-hidden="true" />

      {/* Background atmosphere */}
      <div className="create-id-glow create-id-glow-left" aria-hidden="true" />
      <div className="create-id-glow create-id-glow-right" aria-hidden="true" />

      <div className="create-id-circuit create-id-circuit-one" aria-hidden="true">
        <span />
        <span />
        <span />
      </div>

      <div className="create-id-circuit create-id-circuit-two" aria-hidden="true">
        <span />
        <span />
        <span />
      </div>

      <div className="create-id-shell">
        {/* LEFT CONTENT */}
        <div className="create-id-copy">
          <div className="create-id-eyebrow">
            <span className="create-id-status-dot" />
            <span>// IDENTITY.EXE</span>
          </div>

          <h2 className="create-id-title">
            <span>CREATE YOUR</span>
            <strong>HACKBIOS ID</strong>
          </h2>

          <p className="create-id-description">
            Generate your official HackBIOS participant ID with your name,
            GitHub profile, team details and profile picture — and make it
            yours.
          </p>

          <div className="create-id-actions">
            <button
              type="button"
              className="create-id-button interactive"
              onClick={openIdModal}
              aria-haspopup="dialog"
            >
              <span>CREATE YOUR ID</span>
              <span className="create-id-arrow">→</span>
            </button>

            <span className="create-id-time">
              [ TAKES LESS THAN A MINUTE ]
            </span>
          </div>

          <div className="create-id-features">
            {features.map((feature) => (
              <div className="create-id-feature" key={feature.number}>
                <div className="create-id-feature-icon">
                  {feature.number === '01' && '◉'}
                  {feature.number === '02' && '↗'}
                  {feature.number === '03' && '★'}
                </div>

                <div>
                  <div className="create-id-feature-title">
                    <span>{feature.number}</span>
                    {feature.title}
                  </div>
                  <div className="create-id-feature-text">{feature.text}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CINEMATIC ID CARD */}
        <div className="create-id-stage">
          {/* distant cards */}
          <div className="create-id-ghost-card create-id-ghost-left">
            <img src="/id-card/hackbios-id.png" alt="" />
          </div>

          <div className="create-id-ghost-card create-id-ghost-right">
            <img src="/id-card/hackbios-id.png" alt="" />
          </div>

          {/* orbital rings */}
          <div className="create-id-orbit create-id-orbit-one" />
          <div className="create-id-orbit create-id-orbit-two" />
          <div className="create-id-orbit create-id-orbit-three" />

          {/* holographic particles */}
          <span className="create-id-particle p1" />
          <span className="create-id-particle p2" />
          <span className="create-id-particle p3" />
          <span className="create-id-particle p4" />
          <span className="create-id-particle p5" />
          <span className="create-id-particle p6" />

          {/* platform */}
          <div className="create-id-platform">
            <div className="create-id-platform-ring ring-a" />
            <div className="create-id-platform-ring ring-b" />
            <div className="create-id-platform-core" />
          </div>

          {/* main card */}
          <div
            ref={cardWrapRef}
            className="create-id-card-wrap"
            onPointerMove={handleCardPointerMove}
            onPointerLeave={handleCardPointerLeave}
            onPointerCancel={handleCardPointerLeave}
          >
            <div className="create-id-card-glow" />
            <div className="create-id-card">
              <img
                src="/id-card/hackbios-id.png"
                alt="HackBIOS participant ID card"
                draggable="false"
              />
              <div className="create-id-card-shine" />
            </div>
          </div>

          <div className="create-id-card-caption">
            <span>HACKBIOS 2K26</span>
            <span>PARTICIPANT ID</span>
          </div>
        </div>
      </div>
    </section>
  );
}