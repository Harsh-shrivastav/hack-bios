import React from 'react';
import styled from 'styled-components';

const FloatingSocials = () => {
  return (
    <div className="fixed left-4 top-1/2 -translate-y-1/2 z-50 hidden md:block">
      <StyledWrapper>
        <ul className="example-2">
          
          <li className="icon-content">
            <a data-social="instagram" aria-label="Instagram" href="https://www.instagram.com/hackbios?igsh=MXNkbGlnN3lybzB2ag==" target="_blank" rel="noopener noreferrer">
              <div className="filled" />
              <svg viewBox="0 0 16 16" fill="currentColor" height={16} width={16}>
                <path d="M8 0C5.829 0 5.556.01 4.703.048 3.85.088 3.269.222 2.76.42a3.9 3.9 0 0 0-1.417.923A3.9 3.9 0 0 0 .42 2.76C.222 3.268.087 3.85.048 4.7.01 5.555 0 5.827 0 8.001c0 2.172.01 2.444.048 3.297.04.852.174 1.433.372 1.942.205.526.478.972.923 1.417.444.445.89.719 1.416.923.51.198 1.09.333 1.942.372C5.555 15.99 5.827 16 8 16s2.444-.01 3.298-.048c.851-.04 1.434-.174 1.943-.372a3.9 3.9 0 0 0 1.416-.923c.445-.445.718-.891.923-1.417.197-.509.332-1.09.372-1.942C15.99 10.445 16 10.173 16 8s-.01-2.445-.048-3.299c-.04-.851-.175-1.433-.372-1.941a3.9 3.9 0 0 0-.923-1.417A3.9 3.9 0 0 0 13.24.42c-.51-.198-1.092-.333-1.943-.372C10.443.01 10.172 0 7.998 0zm-.717 1.442h.718c2.136 0 2.389.007 3.232.046.78.035 1.204.166 1.486.275.373.145.64.319.92.599s.453.546.598.92c.11.281.24.705.275 1.485.039.843.047 1.096.047 3.231s-.008 2.389-.047 3.232c-.035.78-.166 1.203-.275 1.485a2.5 2.5 0 0 1-.599.919c-.28.28-.546.453-.92.598-.28.11-.704.24-1.485.276-.843.038-1.096.047-3.232.047s-2.39-.009-3.233-.047c-.78-.036-1.203-.166-1.485-.276a2.5 2.5 0 0 1-.92-.598 2.5 2.5 0 0 1-.6-.92c-.109-.281-.24-.705-.275-1.485-.038-.843-.046-1.096-.046-3.233s.008-2.388.046-3.231c.036-.78.166-1.204.276-1.486.145-.373.319-.64.599-.92s.546-.453.92-.598c.282-.11.705-.24 1.485-.276.738-.034 1.024-.044 2.515-.045zm4.988 1.328a.96.96 0 1 0 0 1.92.96.96 0 0 0 0-1.92m-4.27 1.122a4.109 4.109 0 1 0 0 8.217 4.109 4.109 0 0 0 0-8.217m0 1.441a2.667 2.667 0 1 1 0 5.334 2.667 2.667 0 0 1 0-5.334" />
              </svg>
            </a>
            <div className="tooltip">Instagram</div>
          </li>

          <li className="icon-content">
            <a data-social="linkedin" aria-label="LinkedIn" href="https://www.linkedin.com/company/hackbios-2k26/" target="_blank" rel="noopener noreferrer">
              <div className="filled" />
              <svg viewBox="0 0 16 16" fill="currentColor" height={16} width={16}>
                <path d="M0 1.146C0 .513.526 0 1.175 0h13.65C15.474 0 16 .513 16 1.146v13.708c0 .633-.526 1.146-1.175 1.146H1.175C.526 16 0 15.487 0 14.854zm4.943 12.248V6.169H2.542v7.225zm-1.2-8.212c.837 0 1.358-.554 1.358-1.248-.015-.709-.52-1.248-1.342-1.248S2.4 3.226 2.4 3.934c0 .694.521 1.248 1.327 1.248zm4.908 8.212V9.359c0-.216.016-.432.08-.586.173-.431.568-.878 1.232-.878.869 0 1.216.662 1.216 1.634v3.865h2.401V9.25c0-2.22-1.184-3.252-2.764-3.252-1.274 0-1.845.7-2.165 1.193v.025h-.016l.016-.025V6.169h-2.4c.03.678 0 7.225 0 7.225z" />
              </svg>
            </a>
            <div className="tooltip">LinkedIn</div>
          </li>

          <li className="icon-content">
            <a data-social="x" aria-label="X (Twitter)" href="https://x.com/thehackBIOS" target="_blank" rel="noopener noreferrer">
              <div className="filled" />
              <svg viewBox="0 0 24 24" fill="currentColor" height={16} width={16}>
                <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z" />
              </svg>
            </a>
            <div className="tooltip">Twitter</div>
          </li>

          <li className="icon-content">
            <a data-social="discord" aria-label="Discord" href="https://discord.gg/JbtFtYrUds" target="_blank" rel="noopener noreferrer">
              <div className="filled" />
              <svg viewBox="0 0 127.14 96.36" fill="currentColor" height={16} width={20}>
                <path d="M107.7,8.07A105.15,105.15,0,0,0,81.47,0a72.06,72.06,0,0,0-3.36,6.83A97.68,97.68,0,0,0,49,6.83,72.37,72.37,0,0,0,45.64,0,105.89,105.89,0,0,0,19.39,8.09C2.79,32.65-1.71,56.6.54,80.21h0A105.73,105.73,0,0,0,32.71,96.36,77.7,77.7,0,0,0,39.6,85.25a68.42,68.42,0,0,1-10.85-5.18c.91-.66,1.8-1.34,2.66-2a75.57,75.57,0,0,0,64.32,0c.87.71,1.76,1.39,2.68,2a68.68,68.68,0,0,1-10.87,5.19,77,77,0,0,0,6.89,11.1A105.25,105.25,0,0,0,126.6,80.22h0C129.24,52.84,122.09,29.11,107.7,8.07ZM42.45,65.69C36.18,65.69,31,60,31,53s5-12.74,11.43-12.74S54,46,53.89,53,48.84,65.69,42.45,65.69Zm42.24,0C78.41,65.69,73.31,60,73.31,53s5-12.74,11.43-12.74S96.18,46,96.06,53,91.08,65.69,84.69,65.69Z" />
              </svg>
            </a>
            <div className="tooltip">Discord</div>
          </li>

          <li className="icon-content">
            <a data-social="linktree" aria-label="Linktree" href="https://linktr.ee/hackbios#510054195" target="_blank" rel="noopener noreferrer">
              <div className="filled" />
              <svg viewBox="0 0 24 24" fill="currentColor" height={16} width={16}>
                <path d="M13.882 12.385l5.297-6.04H14.65c-.21 0-.323.016-.323.21L12.008 9l-2.3-2.4c0-.194-.13-.21-.323-.21H4.85l5.242 6.04-5.903 6.637h4.484c.193 0 .322-.05.42-.21l2.918-3.418 2.92 3.418c.096.16.225.21.42.21h4.45l-5.92-6.637zM11.96 22.37v-7.142h.063v7.14H18.7V24H5.25v-1.63h6.71z" />
              </svg>
            </a>
            <div className="tooltip">Linktree</div>
          </li>

        </ul>
      </StyledWrapper>
    </div>
  );
};

const StyledWrapper = styled.div`
  ul {
    list-style: none;
    padding: 0;
    margin: 0;
  }

  .example-2 {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    row-gap: 0.8rem;
  }
  .example-2 .icon-content {
    margin: 0;
    position: relative;
  }
  .example-2 .icon-content .tooltip {
    position: absolute;
    top: 50%;
    left: 100%;
    transform: translateY(-50%) translateX(10px);
    color: #fff;
    padding: 6px 12px;
    border-radius: 6px;
    opacity: 0;
    visibility: hidden;
    font-size: 13px;
    font-family: inherit;
    font-weight: bold;
    letter-spacing: 0.05em;
    white-space: nowrap;
    transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
    box-shadow: 0 4px 15px rgba(0,0,0,0.5);
    z-index: 10;
  }
  .example-2 .icon-content:hover .tooltip {
    opacity: 1;
    visibility: visible;
    transform: translateY(-50%) translateX(16px);
  }
  
  /* Adding a tiny triangle pointer to tooltip */
  .example-2 .icon-content .tooltip::before {
    content: '';
    position: absolute;
    top: 50%;
    left: -4px;
    transform: translateY(-50%);
    border-width: 5px 5px 5px 0;
    border-style: solid;
    border-color: transparent currentColor transparent transparent;
  }

  .example-2 .icon-content a {
    position: relative;
    overflow: hidden;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 48px;
    height: 48px;
    border-radius: 50%;
    color: #4d4d4d;
    background-color: #111811;
    border: 1px solid rgba(0, 255, 65, 0.15);
    transition: all 0.3s ease-in-out;
  }
  .example-2 .icon-content a:hover {
    box-shadow: 0 0 20px rgba(0, 255, 65, 0.2);
    border-color: transparent;
  }
  .example-2 .icon-content a svg {
    position: relative;
    z-index: 1;
    width: 22px;
    height: 22px;
    transition: transform 0.3s ease-in-out;
  }
  .example-2 .icon-content a:hover svg {
    color: white;
    transform: scale(1.15);
  }
  .example-2 .icon-content a .filled {
    position: absolute;
    top: auto;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 0;
    background-color: #000;
    transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
  }
  .example-2 .icon-content a:hover .filled {
    height: 100%;
  }

  /* INSTAGRAM */
  .example-2 .icon-content a[data-social="instagram"] .filled {
    background: linear-gradient(45deg, #405de6, #5b51db, #b33ab4, #c135b4, #e1306c, #fd1f1f);
  }
  .example-2 .icon-content a[data-social="instagram"] ~ .tooltip {
    background: linear-gradient(45deg, #405de6, #e1306c);
    color: #fff;
  }

  /* LINKEDIN */
  .example-2 .icon-content a[data-social="linkedin"] .filled,
  .example-2 .icon-content a[data-social="linkedin"] ~ .tooltip {
    background-color: #0077b5;
    color: #fff;
  }

  /* X / TWITTER */
  .example-2 .icon-content a[data-social="x"] .filled,
  .example-2 .icon-content a[data-social="x"] ~ .tooltip {
    background-color: #1da1f2; /* Kept iconic blue for contrast, or could be #111 */
    color: #fff;
  }

  /* DISCORD */
  .example-2 .icon-content a[data-social="discord"] .filled,
  .example-2 .icon-content a[data-social="discord"] ~ .tooltip {
    background-color: #5865F2;
    color: #fff;
  }

  /* LINKTREE */
  .example-2 .icon-content a[data-social="linktree"] .filled,
  .example-2 .icon-content a[data-social="linktree"] ~ .tooltip {
    background-color: #43E660;
    color: #000;
  }
`;

export default FloatingSocials;
