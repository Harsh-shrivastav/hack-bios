import React, { useState, useEffect } from 'react';
import CodonStream from './CodonStream';

// ============ EDIT YOUR TEAM HERE ============
// photo: leave as "" for a placeholder avatar, or put a filename that
//        exists in public/team/ (e.g. "harsh.jpg") to use a real photo.
// Leave any social field as "" to hide that icon for that person.
const CATEGORIES = [
  {
    label: 'Organisers',
    members: [
      { name: 'Yuvraj Singh Sahu', role: 'Lead Organiser', photo: 'yuvraj.png', github: 'https://github.com/Theonlyunknowncoder', linkedin: 'https://www.linkedin.com/in/yuvraj-sahu--/', instagram: 'https://www.instagram.com/silents_creation?stkn=bnNlb3llaDNlN3Jp' },
     { name: 'Priyanshu Yadav', role: 'Lead Organiser', photo: 'priyanshu.png', github: 'https://github.com/Priyanshu124-tech', linkedin: 'www.linkedin.com/in/priyanshu-yadav-258ba6290' , instagram: 'https://www.instagram.com/priyanshu_yadav.124/?utm_source=ig_web_button_share_sheet' },
      { name: 'Harsh Shrivastava', role: 'Lead Organiser', photo: 'harsh.png', github: 'https://github.com/Harsh-shrivastav', linkedin: 'https://www.linkedin.com/in/harsh-shrivastava' , instagram: 'https://www.instagram.com/harsh_shrivastav_3?stkn=MWEwY3doeG9tYmc1cQ==' },
    ],
  },
  {
    label: 'Technical Team',
    members: [
      { name: 'Praptee Miller', role: 'Developer', photo: 'Miller.png', github: 'https://github.com/iammissmiller', linkedin: 'https://www.linkedin.com/in/praptee-miller-896a50323/', instagram: 'https://www.instagram.com/i_am.miller?stkn=bnB0ZGh2dTVudnJj' },
      { name: 'Prashant Kumar Sahu', role: 'Developer', photo: 'prashant.png', github: 'https://github.com/Prashant-ARKM', linkedin: 'https://www.linkedin.com/in/prashant-kumar-sahu-b3757539b/', instagram: 'https://www.instagram.com/prnoisy?stkn=a3F2ZHVjczFlaWxu' },
      { name: 'Aashirvad Jaiswal', role: 'Developer', photo: 'aashirvad.png', linkedin: 'https://www.linkedin.com/in/aashirvadj', instagram: 'https://www.instagram.com/aashi.ipynb', },
    ],
  },
  {
    label: 'Media Team',
    members: [
      { name: 'Arpan Singh', role: 'Media CO Lead', photo: 'arpan.png', instagram: 'https://www.instagram.com/arpann.singh?stkn=MWc0Mmd1Yjd2bHk1Mw==' ,linkedin: ' https://www.linkedin.com/in/arpannsingh?utm_source=share_via&utm_content=profile&utm_medium=member_android'},
      { name: 'Divyansh Kaiwart', role: 'Media Team', photo: 'divyansh.png', linkedin: '' },
      { name: 'Harsh Kumar Netam', role: 'Media Team', photo: 'harshkumar.png', linkedin: 'https://www.linkedin.com/in/harshkumarnetam' },
      { name: 'Shreya Sharma', role: 'Media Team', photo: 'shreya.png', linkedin: '' },
      { name: 'Suraj Dewangan', role: 'Media Team', photo: 'suraj.png', linkedin: '' },
    ],
  },
  {
    label: 'Graphics Team',
    members: [
      { name: 'Ashish Chandra', role: 'Graphics Team Lead', photo: 'ashish.png', linkedin: 'https://www.linkedin.com/in/ashish-chandra-552528296' },
      { name: 'Amit Poddar', role: 'Graphics Team', photo: 'amit.png', linkedin: 'https://www.linkedin.com/in/amit-poddar-77b8b2328' },
      { name: 'Akchhansh', role: 'Graphics Team', photo: 'akchhansh.png', linkedin: '' },
    ],
  },
  {
    label: 'Sponsorship Team',
    members: [
      { name: 'Nidhi Sahu', role: 'Sponsorship Team', photo: 'nidhi.png', linkedin: 'https://www.linkedin.com/in/nidhi-sahu-96bb76290' },
      { name: 'Lelushi Barley', role: 'Sponsorship Team', photo: 'lelushi.png', linkedin: '' },
      { name: 'B. Sakshi', role: 'Sponsorship Team', photo: 'sakshi.png', linkedin: '' },
      { name: 'Rupesh Kumar Sidar', role: 'Sponsorship Team', photo: 'rupesh.png', linkedin: 'https://www.linkedin.com/in/rupesh-kumar-sidar-0b6234291' },
      { name: 'Seema Sahu', role: 'Sponsorship Team', photo: 'seema.png', linkedin: '' },
      { name: 'Antriksha', role: 'Sponsorship Team', photo: 'antriksha.png', linkedin: 'https://www.linkedin.com/in/antriksha-v-a85476320' },
    ],
  },
  {
    label: 'Management Team',
    members: [
      { name: 'MD Ashhab Alam', role: 'Management', photo: 'mdashhab.png', linkedin: 'https://www.linkedin.com/in/md-ashhab-alam-8275a2356' },
      { name: 'Syed Mahin Sabry', role: 'Management', photo: 'syedmahin.png', linkedin: '' },
    ],
  },
  {
    label: 'PR Team',
    members: [
      { name: 'Ayush Sahu', role: 'PR Team', photo: 'ayush.png', linkedin: 'https://www.linkedin.com/in/ayush-sahu-b829a4429' },
      { name: 'Bhumika Turker', role: 'PR Team', photo: 'bhumika.png', linkedin: 'https://www.linkedin.com/in/bhumika-turker-895907391' },
    ],
  },
  {
    label: 'Decoration Team',
    members: [
      { name: 'Malvee Vaishnav', role: 'Decoration Team', photo: 'malvee.png', linkedin: '' },
      { name: 'Ashwani Singh', role: 'Core Team', photo: 'ashwani.png', linkedin: '' },
    ],
  },
];
// ===============================================

const getInitials = (name) =>
  name.trim().split(/\s+/).slice(0, 2).map((w) => w[0]?.toUpperCase()).join('');

const Github = (p) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...p}><path d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.57.1.78-.25.78-.55 0-.27-.01-1.17-.02-2.12-3.2.7-3.88-1.36-3.88-1.36-.52-1.34-1.28-1.7-1.28-1.7-1.05-.72.08-.7.08-.7 1.16.08 1.77 1.19 1.77 1.19 1.03 1.77 2.7 1.26 3.36.96.1-.75.4-1.26.73-1.55-2.55-.29-5.24-1.28-5.24-5.68 0-1.26.45-2.29 1.19-3.09-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.18 1.18a11 11 0 0 1 5.79 0c2.2-1.49 3.17-1.18 3.17-1.18.64 1.59.24 2.76.12 3.05.74.8 1.18 1.83 1.18 3.09 0 4.41-2.69 5.38-5.25 5.67.41.36.78 1.06.78 2.14 0 1.55-.01 2.79-.01 3.17 0 .3.2.66.79.55A10.51 10.51 0 0 0 23.5 12C23.5 5.65 18.35.5 12 .5Z" /></svg>
);
const Linkedin = (p) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...p}><path d="M20.45 20.45h-3.55v-5.57c0-1.33-.02-3.04-1.85-3.04-1.86 0-2.14 1.45-2.14 2.95v5.66H9.36V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.45v6.29ZM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12ZM7.12 20.45H3.56V9h3.56v11.45Z" /></svg>
);
const Instagram = (p) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" {...p}><rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.3" cy="6.7" r="1" fill="currentColor" stroke="none" /></svg>
);
const ArrowLeft = (p) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M19 12H5M12 19l-7-7 7-7" /></svg>
);

const SocialIcon = ({ href, Icon, label, className }) => {
  if (!href) return null;
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" aria-label={label}
      className={`interactive text-gray-400 hover:text-[#5dff3a] transition-colors duration-200 ${className || ''}`}>
      <Icon className="w-[16px] h-[16px]" />
    </a>
  );
};

const SocialRow = ({ m, className = '' }) => (
  <div className={`flex items-center gap-3 ${className}`}>
    <SocialIcon href={m.github} Icon={Github} label={`${m.name} on GitHub`} />
    <SocialIcon href={m.linkedin} Icon={Linkedin} label={`${m.name} on LinkedIn`} />
    <SocialIcon href={m.instagram} Icon={Instagram} label={`${m.name} on Instagram`} />
  </div>
);

const Photo = ({ m, className }) =>
  m.photo ? (
    <img src={`/team/${m.photo}`} alt={m.name} className={`object-cover object-top ${className}`} />
  ) : (
    <div className={`flex items-center justify-center bg-[#0d120f] font-mono font-black text-[#5dff3a]/70 ${className}`}
      style={{ textShadow: '0 0 12px rgba(93,255,58,0.35)' }}>
      {getInitials(m.name)}
    </div>
  );

// Full-Bleed Hover cards — the chosen style.
// flex-wrap + fixed-width cards (instead of a CSS grid) so that when a
// category has fewer members than a full row, they center instead of
// hugging the left edge.
const TeamGrid = ({ members }) => (
  <div className="flex flex-wrap justify-center gap-4">
    {members.map((m, i) => (
      <div
        key={`${m.photo || m.name}-${i}`}
        className="relative w-[45%] sm:w-[30%] lg:w-[22%] min-w-[120px] sm:min-w-[150px] h-[220px] sm:h-[300px] lg:h-[500px] overflow-hidden group interactive cursor-pointer"
      >
        <Photo
          m={m}
          className="w-full h-full object-cover object-top grayscale-0 lg:grayscale lg:group-hover:grayscale-0 transition-all duration-500"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-90 lg:opacity-70 lg:group-hover:opacity-90 transition-opacity" />

        <div className="absolute bottom-0 left-0 right-0 p-3 translate-y-0 lg:translate-y-8 lg:group-hover:translate-y-0 transition-transform duration-300">
          <h3 className="font-mono font-bold text-white text-xs uppercase">
            {m.name}
          </h3>

          <p className="font-mono text-[#5dff3a] text-[9px] uppercase tracking-widest opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity delay-100 mb-2">
            {m.role}
          </p>

          <SocialRow
            m={m}
            className="opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity delay-150"
          />
        </div>
      </div>
    ))}
  </div>
);

const TeamPage = () => {
  const [categoryIndex, setCategoryIndex] = useState(0);
  const activeCategory = CATEGORIES[categoryIndex];

  // Warm the browser's cache for every member's photo up front. Without
  // this, switching category tabs would key-remount fresh <img>s (see the
  // key change on TeamGrid above — needed so a stale photo from the old
  // category never sits under the new person's name) but each one would
  // still show blank/broken until it finished loading over the network
  // for the first time. Preloading here means that by the time someone
  // taps a tab, the images are already cached and just appear instantly.
  useEffect(() => {
    CATEGORIES.forEach((cat) => {
      cat.members.forEach((m) => {
        if (m.photo) {
          const img = new Image();
          img.src = `/team/${m.photo}`;
        }
      });
    });
  }, []);

  return (
    <div className="relative min-h-screen md:h-screen w-full overflow-visible md:overflow-hidden bg-transparent text-white">

      {/* Background */}
      <div className="pointer-events-none absolute inset-0 z-0">
        <CodonStream />
      </div>

      {/* Foreground */}
      <div className="relative z-10 flex h-auto md:h-full flex-col px-6 md:px-16 lg:px-24 pt-12 md:pt-16 pb-10 md:pb-14">

        {/* Header */}
        <div className="shrink-0 mb-6">
          <h1 className="font-black font-mono uppercase text-white text-3xl md:text-4xl leading-none">
            The{" "}
            <span className="text-[#5dff3a] drop-shadow-[0_0_14px_rgba(93,255,58,0.5)]">
              Team
            </span>
          </h1>
        </div>

        {/* Category nav */}
        <div className="shrink-0 flex flex-wrap justify-center gap-2 border-b border-[#1e2621] pb-3 mb-6">
          {CATEGORIES.map((cat, i) => (
            <button
              key={i}
              onClick={() => setCategoryIndex(i)}
              className={`interactive px-4 py-2 font-mono text-xs uppercase tracking-widest transition-colors ${
                categoryIndex === i
                  ? "text-[#5dff3a] border-b-2 border-[#5dff3a]"
                  : "text-gray-400 border-b-2 border-transparent hover:text-white"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Scrollable team area — data-lenis-prevent tells the site-wide
            Lenis smooth-scroll instance to leave this box alone, so the
            mouse wheel scrolls it natively instead of Lenis swallowing the
            wheel event for the whole page (only the drag-the-scrollbar
            path was working before, since that bypasses Lenis entirely). */}
        <div
          data-lenis-prevent
          className="relative z-20 overflow-visible md:flex-1 md:min-h-0 md:overflow-y-auto md:overflow-x-hidden overscroll-y-contain pr-1 pointer-events-auto"
        >
          <div className="w-full py-2">
            <TeamGrid members={activeCategory.members} />
          </div>
        </div>

      </div>
    </div>
  );
};

export default TeamPage;