const LANDING_CSS = `
  @media (max-width: 768px) {
    html { scroll-snap-type: y proximity; scroll-padding-top: 16px; }
    .landing-demo-section { scroll-snap-align: start; }
  }

  .landing-hero-h1 { font-size: 46px; }
  .landing-hero-p { font-size: 18px; }
  .landing-section-heading { font-size: 30px; }
  .landing-btn-primary:hover { filter: brightness(1.05); }
  .landing-btn-primary:active { transform: translateY(2px); box-shadow: 0 3px 0 #0F766E !important; }

  @keyframes demoFadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
  .demo-option { font-family: inherit; }
  .demo-option:not(:disabled):hover { border-color: #14B8A6 !important; background: #F0FDFA !important; transform: translateY(-1px); }
  .demo-option:not(:disabled):active { transform: translateY(1px); box-shadow: none !important; }
  .demo-next-btn { font-family: inherit; }
  .demo-next-btn:hover { filter: brightness(1.05); }
  .demo-next-btn:active { transform: translateY(2px); box-shadow: 0 2px 0 #0F766E !important; }
  .demo-restart-btn { font-family: inherit; }
  .demo-restart-btn:hover { background: #F8FAFC !important; border-color: #CBD5E1 !important; }

  /* Every question ships in the HTML; only the current one is on screen. */
  .demo-panel[hidden], .demo-feedback[hidden] { display: none; }

  @media (max-width: 768px) {
    .landing-hero-h1 { font-size: 32px !important; }
    .landing-hero-p { font-size: 16px !important; }
    .landing-section-heading { font-size: 24px !important; }
  }

  @media (max-width: 480px) {
    .landing-hero-h1 { font-size: 26px !important; letter-spacing: -0.5px !important; }
    .landing-hero-p { font-size: 15px !important; }
    .landing-section-heading { font-size: 22px !important; }
    nav > div { padding: 0 16px !important; }
  }
`;

export function LandingStyles() {
  return <style>{LANDING_CSS}</style>;
}
