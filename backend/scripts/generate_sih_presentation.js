const pptxgen = require('pptxgenjs');
const path = require('path');

async function createSIHVisualPresentation() {
  const pres = new pptxgen();
  pres.layout = 'LAYOUT_16x9'; // 10.0 x 5.625 inches

  // ASSET PATHS
  const ASSETS = {
    TEAM_LOGO: path.resolve(__dirname, '../../assets/sih/team_logo.jpg'),
    SIH_LOGO: path.resolve(__dirname, '../../assets/sih/sih_logo.jpg'),
    MOBILE_MOCKUP: path.resolve(__dirname, '../../assets/sih/mobile_mockup.jpg'),
    WEB_MOCKUP: path.resolve(__dirname, '../../assets/sih/web_mockup.jpg')
  };

  // PALETTE MATCHING THE USER'S REFERENCE SLIDES
  const PALETTE = {
    WHITE: 'FFFFFF',
    BG_CANVAS: 'FFFFFF',
    PEACH_BANNER: 'FED7AA',      // Soft Peach / Coral ribbon
    PEACH_BORDER: 'FDBA74',
    SKY_BANNER: 'BAE6FD',        // Soft Sky Blue ribbon
    SKY_BORDER: '7DD3FC',
    MINT_PILL: 'D1FAE5',
    DARK_BLUE: '1E3A8A',         // SIH Highlighted Navy Blue
    DARK_TEXT: '0F172A',         // Primary text
    SLATE_TEXT: '334155',        // Subtext
    MUTED_BORDER: 'CBD5E1',      // Boundary lines
    GRAY_CONTAINER: 'F8FAFC',
    PURPLE_CARD: 'F3E8FF',
    PURPLE_BORDER: 'D8B4FE',
    ORANGE_CARD: 'FFEDD5',
    ORANGE_BORDER: 'FDBA74',
    YELLOW_CARD: 'FEF08A',
    YELLOW_BORDER: 'FDE047',
    BLUE_TECH_BAR: '0284C7',
    DEEP_BLUE_TECH: '0369A1'
  };

  // HELPER: Standard SIH Header for Slides 2 to 6
  function addSIHStandardHeader(slide, titleText, subtitleText = null) {
    // Top-Left: Team Logo & Brand
    slide.addImage({
      path: ASSETS.TEAM_LOGO,
      x: 0.35, y: 0.15, w: 0.75, h: 0.75
    });

    // Top-Right: Official SIH Logo
    slide.addImage({
      path: ASSETS.SIH_LOGO,
      x: 8.8, y: 0.1, w: 0.85, h: 0.85
    });

    // Top-Center Peach Ribbon Banner
    const titleWidth = subtitleText ? 4.2 : 5.0;
    const titleX = 5.0 - titleWidth / 2;
    slide.addShape(pres.ShapeType.roundRect, {
      x: titleX, y: 0.15, w: titleWidth, h: 0.38, r: 0.12,
      fill: { color: PALETTE.PEACH_BANNER },
      line: { color: PALETTE.PEACH_BORDER, width: 1.2 }
    });
    slide.addText(titleText, {
      x: titleX, y: 0.18, w: titleWidth, h: 0.32,
      fontSize: 12, fontFace: 'Trebuchet MS', bold: true, color: '000000', align: 'center', underline: true
    });

    // Optional Subtitle Blue Banner
    if (subtitleText) {
      const subWidth = 3.6;
      const subX = 5.0 - subWidth / 2;
      slide.addShape(pres.ShapeType.roundRect, {
        x: subX, y: 0.58, w: subWidth, h: 0.28, r: 0.08,
        fill: { color: PALETTE.SKY_BANNER },
        line: { color: PALETTE.SKY_BORDER, width: 1 }
      });
      slide.addText(subtitleText, {
        x: subX, y: 0.61, w: subWidth, h: 0.22,
        fontSize: 8.5, fontFace: 'Trebuchet MS', bold: true, color: '000000', align: 'center'
      });
    }
  }

  // =========================================================================
  // SLIDE 1: TITLE PAGE (Exact Match to User Reference 1)
  // =========================================================================
  {
    const slide = pres.addSlide();
    slide.background = { color: PALETTE.WHITE };

    // Top-Left Team Logo
    slide.addImage({
      path: ASSETS.TEAM_LOGO,
      x: 0.4, y: 0.2, w: 1.05, h: 1.05
    });

    // Top Header Text
    slide.addText('SMART INDIA HACKATHON 2026', {
      x: 1.6, y: 0.2, w: 6.8, h: 0.45,
      fontSize: 22, fontFace: 'Times New Roman', bold: true, color: '000000', align: 'center'
    });
    slide.addText('TITLE PAGE', {
      x: 1.6, y: 0.68, w: 6.8, h: 0.4,
      fontSize: 18, fontFace: 'Times New Roman', bold: true, color: '000000', align: 'center'
    });

    // Top-Right Official SIH Logo
    slide.addImage({
      path: ASSETS.SIH_LOGO,
      x: 8.45, y: 0.15, w: 1.25, h: 1.25
    });

    // Left Side: Problem Statement & Team Details (Dark Blue Bold Underlined)
    const items = [
      { label: 'Problem Statement ID – ', val: 'SIH26044', underline: true },
      { label: 'Problem Statement Title - ', val: 'Academia–Industry Collaboration Portal for Skill Mapping, Internships and Placement', italic: true, underline: true },
      { label: 'Ministry / Organization - ', val: 'Ministry of Ayush, Government of India', underline: true },
      { label: 'Theme - ', val: 'Smart Automation / EdTech / HealthTech', italic: true, underline: true },
      { label: 'PS Category- ', val: 'Software', underline: true },
      { label: 'Team ID- ', val: 'SIH26-AYUSH-55396', underline: true },
      { label: 'Team Name - ', val: 'SkillBridge', italic: true, underline: true }
    ];

    let startY = 1.6;
    items.forEach(item => {
      slide.addText([
        { text: '• ' + item.label, options: { bold: true, fontSize: 10.5, fontFace: 'Trebuchet MS', color: PALETTE.DARK_BLUE } },
        { text: item.val, options: { bold: true, italic: !!item.italic, underline: !!item.underline, fontSize: 10.5, fontFace: 'Trebuchet MS', color: PALETTE.DARK_BLUE } }
      ], {
        x: 0.5, y: startY, w: 5.6, h: item.label.includes('Title') ? 0.65 : 0.42
      });
      startY += item.label.includes('Title') ? 0.68 : 0.44;
    });

    // Right Side: Graphic Hexagon Backdrop with Brain Lightbulb
    slide.addShape(pres.ShapeType.hexagon, {
      x: 6.5, y: 1.65, w: 3.0, h: 3.4,
      fill: { color: 'E0F2FE' },
      line: { color: 'BAE6FD', width: 1.5 }
    });

    slide.addImage({
      path: ASSETS.SIH_LOGO,
      x: 6.8, y: 1.95, w: 2.4, h: 2.8
    });
  }

  // =========================================================================
  // SLIDE 2: PROPOSED SOLUTION & INSTANCE OF APPROACH (Exact Match to User Ref 5)
  // =========================================================================
  {
    const slide = pres.addSlide();
    slide.background = { color: PALETTE.WHITE };

    // Top-Left Team Logo & Top-Right SIH Logo
    slide.addImage({ path: ASSETS.TEAM_LOGO, x: 0.35, y: 0.15, w: 0.75, h: 0.75 });
    slide.addImage({ path: ASSETS.SIH_LOGO, x: 8.85, y: 0.1, w: 0.85, h: 0.85 });

    // Top Header Banner Box
    slide.addShape(pres.ShapeType.roundRect, {
      x: 1.25, y: 0.12, w: 7.4, h: 0.65, r: 0.08,
      fill: { color: 'FFF7ED' },
      line: { color: PALETTE.PEACH_BORDER, width: 1.2 }
    });
    slide.addText([
      { text: 'Objective: ', options: { bold: true, fontSize: 8.5, color: '000000' } },
      { text: 'Bridge Ayush Curricula & Industry Demands via Closed-Loop Skill Mapping\n', options: { fontSize: 8.5, color: '000000' } },
      { text: 'Goal: ', options: { bold: true, fontSize: 8.5, color: '000000' } },
      { text: 'Enable diagnostic competency assessment, deficit remediation & cryptographic internship matching', options: { fontSize: 8.5, color: '000000' } }
    ], {
      x: 1.35, y: 0.16, w: 7.2, h: 0.58, align: 'center', fontFace: 'Trebuchet MS'
    });

    // LEFT COLUMN: PROPOSED SOLUTION
    // Peach Pill Title
    slide.addShape(pres.ShapeType.roundRect, {
      x: 0.5, y: 0.9, w: 2.6, h: 0.32, r: 0.1,
      fill: { color: PALETTE.PEACH_BANNER },
      line: { color: PALETTE.PEACH_BORDER, width: 1 }
    });
    slide.addText('PROPOSED SOLUTION :', {
      x: 0.5, y: 0.93, w: 2.6, h: 0.26,
      fontSize: 9.5, fontFace: 'Trebuchet MS', bold: true, color: '000000', align: 'center'
    });

    // Phase 1, Phase 2, Phase 3 Text
    const phases = [
      {
        head: 'Phase-I: Diagnostic Assessment & Ingestion:',
        b1: '📊 Standardized testing across 10 Ayush competencies (Schedule T, Pharmacovigilance, Nadi Pariksha).',
        b2: '💻 Timed auto-grading engine converting student responses to empirical JSON skill profiles.'
      },
      {
        head: 'Phase 2: Mathematical Gap Mapping:',
        b1: '🎯 5-Tier Deficit Vector formula computes exact skill shortfall against target industry roles.',
        b2: '🤖 Auto-remediation pipeline assigns tailored micro-courses for Critical (≥30%) and High deficits.'
      },
      {
        head: 'Phase 3: Matching & Cryptographic Portfolio:',
        b1: '⚡ 5-Factor weighted recommendation engine computes verified role-compatibility scores (0-100%).',
        b2: '🔒 Deterministic SHA-256 micro-credentials provide instant, tamper-proof W3C verification.'
      }
    ];

    let phY = 1.3;
    phases.forEach(p => {
      slide.addText(p.head, {
        x: 0.5, y: phY, w: 4.3, h: 0.22,
        fontSize: 8.5, fontFace: 'Trebuchet MS', bold: true, color: PALETTE.DARK_TEXT
      });
      slide.addText(p.b1, {
        x: 0.5, y: phY + 0.2, w: 4.3, h: 0.3,
        fontSize: 7.2, fontFace: 'Segoe UI', color: PALETTE.SLATE_TEXT
      });
      slide.addText(p.b2, {
        x: 0.5, y: phY + 0.48, w: 4.3, h: 0.3,
        fontSize: 7.2, fontFace: 'Segoe UI', color: PALETTE.SLATE_TEXT
      });
      phY += 0.82;
    });

    // Thin separator line
    slide.addShape(pres.ShapeType.line, {
      x: 0.5, y: 3.75, w: 4.3, h: 0,
      line: { color: PALETTE.MUTED_BORDER, width: 0.75 }
    });

    // Bottom Left: Innovation & Uniqueness Banners
    slide.addShape(pres.ShapeType.roundRect, {
      x: 0.6, y: 3.85, w: 1.8, h: 0.26, r: 0.08,
      fill: { color: PALETTE.PEACH_BANNER }
    });
    slide.addText('INNOVATION:', {
      x: 0.6, y: 3.88, w: 1.8, h: 0.2,
      fontSize: 8.5, fontFace: 'Trebuchet MS', bold: true, color: '000000', align: 'center'
    });

    slide.addShape(pres.ShapeType.roundRect, {
      x: 2.8, y: 3.85, w: 1.8, h: 0.26, r: 0.08,
      fill: { color: PALETTE.PEACH_BANNER }
    });
    slide.addText('UNIQUENESS:', {
      x: 2.8, y: 3.88, w: 1.8, h: 0.2,
      fontSize: 8.5, fontFace: 'Trebuchet MS', bold: true, color: '000000', align: 'center'
    });

    // Innovation Cards
    const innovPills = [
      { text: 'Empirical Skill\nTesting', color: 'CCFBF1' },
      { text: '5-Factor Weighted\nMatch Engine', color: 'DBEAFE' },
      { text: 'Deterministic\nSHA-256 Digest', color: 'FEF3C7' },
      { text: 'Faculty R&D\nCollaboration Hub', color: 'F3E8FF' }
    ];
    let inX = 0.5; let inY = 4.18;
    innovPills.forEach((ip, i) => {
      slide.addShape(pres.ShapeType.roundRect, {
        x: inX, y: inY, w: 0.95, h: 0.55, r: 0.06,
        fill: { color: ip.color }, line: { color: '94A3B8', width: 0.5 }
      });
      slide.addText(ip.text, {
        x: inX, y: inY + 0.05, w: 0.95, h: 0.45,
        fontSize: 6.5, fontFace: 'Segoe UI', bold: true, color: '0F172A', align: 'center'
      });
      inX += 1.05;
      if (i === 1) { inX = 0.5; inY += 0.62; }
    });

    // Uniqueness Cards
    const uniqPills = [
      { text: 'Ayush Specialized\nIndustry Mapping', color: 'D1FAE5' },
      { text: 'Closed-Loop Skill\nRemediation', color: 'CFFAFE' },
      { text: 'W3C Verifiable\nCredential Model', color: 'FFE4E6' }
    ];
    let uY = 4.18;
    uniqPills.forEach(up => {
      slide.addShape(pres.ShapeType.roundRect, {
        x: 2.7, y: uY, w: 2.05, h: 0.35, r: 0.06,
        fill: { color: up.color }, line: { color: '94A3B8', width: 0.5 }
      });
      slide.addText(up.text.replace('\n', ' - '), {
        x: 2.75, y: uY + 0.05, w: 1.95, h: 0.25,
        fontSize: 6.5, fontFace: 'Segoe UI', bold: true, color: '0F172A', align: 'center'
      });
      uY += 0.42;
    });

    // Vertical Divider
    slide.addShape(pres.ShapeType.line, {
      x: 4.95, y: 0.95, w: 0, h: 4.5,
      line: { color: PALETTE.MUTED_BORDER, width: 1 }
    });

    // RIGHT COLUMN: INSTANCE OF APPROACH (Flowchart)
    slide.addShape(pres.ShapeType.roundRect, {
      x: 5.8, y: 0.9, w: 3.2, h: 0.32, r: 0.1,
      fill: { color: PALETTE.PEACH_BANNER },
      line: { color: PALETTE.PEACH_BORDER, width: 1 }
    });
    slide.addText('INSTANCE OF APPROACH :', {
      x: 5.8, y: 0.93, w: 3.2, h: 0.26,
      fontSize: 9.5, fontFace: 'Trebuchet MS', bold: true, color: '000000', align: 'center'
    });

    // Flowchart Box 1: Phase 1
    slide.addShape(pres.ShapeType.roundRect, {
      x: 5.2, y: 1.3, w: 4.3, h: 0.85, r: 0.08,
      fill: { color: 'F0F9FF' }, line: { color: '0284C7', width: 1 }
    });
    slide.addText('Phase 1: Diagnostic Assessment & Ingestion', {
      x: 5.3, y: 1.34, w: 4.1, h: 0.2,
      fontSize: 7.5, fontFace: 'Trebuchet MS', bold: true, color: '0369A1'
    });
    slide.addShape(pres.ShapeType.roundRect, {
      x: 5.3, y: 1.58, w: 1.25, h: 0.45, r: 0.05,
      fill: { color: 'FEF3C7' }, line: { color: 'F59E0B', width: 0.5 }
    });
    slide.addText('10 Ayush MCQs\nAuto-Graded', {
      x: 5.3, y: 1.62, w: 1.25, h: 0.38,
      fontSize: 6.2, fontFace: 'Segoe UI', bold: true, align: 'center', color: '78350F'
    });
    slide.addShape(pres.ShapeType.roundRect, {
      x: 6.7, y: 1.58, w: 1.3, h: 0.45, r: 0.05,
      fill: { color: 'E0E7FF' }, line: { color: '6366F1', width: 0.5 }
    });
    slide.addText('Schedule T & GCP\nCompetencies', {
      x: 6.7, y: 1.62, w: 1.3, h: 0.38,
      fontSize: 6.2, fontFace: 'Segoe UI', bold: true, align: 'center', color: '3730A3'
    });
    slide.addShape(pres.ShapeType.roundRect, {
      x: 8.15, y: 1.58, w: 1.25, h: 0.45, r: 0.05,
      fill: { color: 'FCE7F3' }, line: { color: 'EC4899', width: 0.5 }
    });
    slide.addText('Student JSON\nProfile Schema', {
      x: 8.15, y: 1.62, w: 1.25, h: 0.38,
      fontSize: 6.2, fontFace: 'Segoe UI', bold: true, align: 'center', color: '831843'
    });

    // Arrow 1 -> 2
    slide.addShape(pres.ShapeType.downArrow, {
      x: 7.25, y: 2.2, w: 0.2, h: 0.2,
      fill: { color: '0284C7' }
    });

    // Flowchart Box 2: Phase 2
    slide.addShape(pres.ShapeType.roundRect, {
      x: 5.2, y: 2.45, w: 4.3, h: 1.45, r: 0.08,
      fill: { color: 'FDF4FF' }, line: { color: 'C026D3', width: 1 }
    });
    slide.addText('Phase 2: 5-Tier Deficit Vector & Gap Remediator', {
      x: 5.3, y: 2.48, w: 4.1, h: 0.2,
      fontSize: 7.5, fontFace: 'Trebuchet MS', bold: true, color: '86198F'
    });

    slide.addShape(pres.ShapeType.roundRect, {
      x: 6.2, y: 2.7, w: 2.3, h: 0.3, r: 0.05,
      fill: { color: 'FAE8FF' }, line: { color: 'C026D3', width: 0.8 }
    });
    slide.addText('Deficit(k) = Target(k) - Score(k)', {
      x: 6.2, y: 2.74, w: 2.3, h: 0.22,
      fontSize: 6.8, fontFace: 'Consolas', bold: true, align: 'center', color: '701A75'
    });

    // Decision Diamond
    slide.addShape(pres.ShapeType.diamond, {
      x: 6.8, y: 3.05, w: 1.1, h: 0.45,
      fill: { color: 'FEF08A' }, line: { color: 'CA8A04', width: 0.8 }
    });
    slide.addText('Gap ≥ 20%?', {
      x: 6.8, y: 3.14, w: 1.1, h: 0.25,
      fontSize: 6.2, fontFace: 'Trebuchet MS', bold: true, align: 'center', color: '713F12'
    });

    // Decision outcomes
    slide.addShape(pres.ShapeType.roundRect, {
      x: 5.35, y: 3.52, w: 1.8, h: 0.3, r: 0.05,
      fill: { color: 'FEE2E2' }, line: { color: 'EF4444', width: 0.6 }
    });
    slide.addText('YES → Auto-Remedial Course', {
      x: 5.35, y: 3.56, w: 1.8, h: 0.22,
      fontSize: 6.2, fontFace: 'Segoe UI', bold: true, color: '991B1B', align: 'center'
    });

    slide.addShape(pres.ShapeType.roundRect, {
      x: 7.55, y: 3.52, w: 1.8, h: 0.3, r: 0.05,
      fill: { color: 'DCFCE7' }, line: { color: '22C55E', width: 0.6 }
    });
    slide.addText('NO → Matchmaking Ready', {
      x: 7.55, y: 3.56, w: 1.8, h: 0.22,
      fontSize: 6.2, fontFace: 'Segoe UI', bold: true, color: '166534', align: 'center'
    });

    // Arrow 2 -> 3
    slide.addShape(pres.ShapeType.downArrow, {
      x: 7.25, y: 3.95, w: 0.2, h: 0.2,
      fill: { color: '0284C7' }
    });

    // Flowchart Box 3: Phase 3
    slide.addShape(pres.ShapeType.roundRect, {
      x: 5.2, y: 4.2, w: 4.3, h: 1.15, r: 0.08,
      fill: { color: 'F0FDF4' }, line: { color: '16A34A', width: 1 }
    });
    slide.addText('Phase 3: 5-Factor Matching & Cryptographic Credentialing', {
      x: 5.3, y: 4.24, w: 4.1, h: 0.2,
      fontSize: 7.5, fontFace: 'Trebuchet MS', bold: true, color: '166534'
    });

    slide.addShape(pres.ShapeType.roundRect, {
      x: 5.35, y: 4.48, w: 1.95, h: 0.35, r: 0.05,
      fill: { color: 'E0F2FE' }, line: { color: '0284C7', width: 0.6 }
    });
    slide.addText('5-Factor Match Engine\n(Score: 0-100%)', {
      x: 5.35, y: 4.5, w: 1.95, h: 0.3,
      fontSize: 6.2, fontFace: 'Segoe UI', bold: true, align: 'center', color: '075985'
    });

    slide.addShape(pres.ShapeType.roundRect, {
      x: 7.45, y: 4.48, w: 1.95, h: 0.35, r: 0.05,
      fill: { color: 'FEF3C7' }, line: { color: 'D97706', width: 0.6 }
    });
    slide.addText('SHA-256 Micro-Credential\n(W3C Verifiable Ledger)', {
      x: 7.45, y: 4.5, w: 1.95, h: 0.3,
      fontSize: 6.2, fontFace: 'Segoe UI', bold: true, align: 'center', color: '92400E'
    });

    slide.addShape(pres.ShapeType.roundRect, {
      x: 5.8, y: 4.9, w: 3.1, h: 0.35, r: 0.05,
      fill: { color: 'F1F5F9' }, line: { color: '64748B', width: 0.6 }
    });
    slide.addText('Verified Internship / Job Offer Issued', {
      x: 5.8, y: 4.95, w: 3.1, h: 0.25,
      fontSize: 6.5, fontFace: 'Trebuchet MS', bold: true, align: 'center', color: '0F172A'
    });
  }

  // =========================================================================
  // SLIDE 3: TECHNICAL APPROACH - DATA FLOW AND PROCESSING (Exact Match to User Ref 2)
  // =========================================================================
  {
    const slide = pres.addSlide();
    slide.background = { color: PALETTE.WHITE };

    addSIHStandardHeader(slide, 'TECHNICAL APPROACH', 'DATA FLOW AND PROCESSING');

    // Outer Dashed Gray Boundary Container
    slide.addShape(pres.ShapeType.roundRect, {
      x: 0.4, y: 0.95, w: 9.2, h: 3.9, r: 0.12,
      fill: { color: 'FFFFFF' },
      line: { color: '94A3B8', width: 1.5, dashType: 'dash' }
    });

    // 1. User / Doctor / App Box (Top-Left)
    slide.addShape(pres.ShapeType.roundRect, {
      x: 0.6, y: 1.1, w: 1.0, h: 0.9, r: 0.08,
      fill: { color: 'F1F5F9' }, line: { color: '64748B', width: 1 }
    });
    slide.addText('👨‍🎓 🏭 🔬\nStudent / Recruiter /\nFaculty App', {
      x: 0.6, y: 1.15, w: 1.0, h: 0.8,
      fontSize: 6.8, fontFace: 'Segoe UI', bold: true, align: 'center', color: '0F172A'
    });

    // Arrow -> Security Layer
    slide.addShape(pres.ShapeType.rightArrow, {
      x: 1.65, y: 1.45, w: 0.35, h: 0.2,
      fill: { color: '64748B' }
    });

    // 2. Security Gateway Layer
    slide.addShape(pres.ShapeType.rect, {
      x: 2.05, y: 1.1, w: 1.45, h: 0.9,
      fill: { color: 'E0F2FE' },
      line: { color: '0284C7', width: 1.2, dashType: 'dash' }
    });
    slide.addText('🛡️ SECURITY LAYER\nHelmet.js • HSTS • CSP\nX-Request-ID Tracing\nExpress Rate Limiting', {
      x: 2.08, y: 1.15, w: 1.39, h: 0.8,
      fontSize: 6.5, fontFace: 'Segoe UI', bold: true, align: 'center', color: '0369A1'
    });

    // Arrow -> Processing Layer
    slide.addShape(pres.ShapeType.downArrow, {
      x: 2.7, y: 2.05, w: 0.2, h: 0.25,
      fill: { color: '64748B' }
    });

    // 3. Processing Layer (Purple Box)
    slide.addShape(pres.ShapeType.roundRect, {
      x: 1.3, y: 2.35, w: 2.9, h: 2.3, r: 0.08,
      fill: { color: PALETTE.PURPLE_CARD },
      line: { color: PALETTE.PURPLE_BORDER, width: 1.2 }
    });
    slide.addText('⚙️ Processing Layer (REST Microservices)', {
      x: 1.35, y: 2.4, w: 2.8, h: 0.22,
      fontSize: 7.5, fontFace: 'Trebuchet MS', bold: true, color: '6B21A8'
    });

    // Sub-blocks in Processing Layer
    slide.addShape(pres.ShapeType.roundRect, {
      x: 1.45, y: 2.68, w: 2.6, h: 0.45, r: 0.05,
      fill: { color: 'FFFFFF' }, line: { color: 'D8B4FE', width: 0.8 }
    });
    slide.addText('🔍 10 Ayush Competency Diagnostic Engine\nTimed MCQs • Auto-Grading Scoring', {
      x: 1.45, y: 2.72, w: 2.6, h: 0.38,
      fontSize: 6.5, fontFace: 'Segoe UI', align: 'center', bold: true, color: '3B0764'
    });

    slide.addShape(pres.ShapeType.downArrow, {
      x: 2.65, y: 3.16, w: 0.18, h: 0.15,
      fill: { color: '9333EA' }
    });

    slide.addShape(pres.ShapeType.roundRect, {
      x: 1.45, y: 3.35, w: 2.6, h: 0.55, r: 0.05,
      fill: { color: 'FFFFFF' }, line: { color: 'D8B4FE', width: 0.8 }
    });
    slide.addText('🔄 5-Tier Deficit Vector & Gap Remediation\nDeficit(k) = Target(k) - Score(k)\nRemedial Micro-Course Assignment', {
      x: 1.45, y: 3.38, w: 2.6, h: 0.48,
      fontSize: 6.2, fontFace: 'Segoe UI', align: 'center', bold: true, color: '3B0764'
    });

    slide.addShape(pres.ShapeType.downArrow, {
      x: 2.65, y: 3.93, w: 0.18, h: 0.15,
      fill: { color: '9333EA' }
    });

    slide.addShape(pres.ShapeType.roundRect, {
      x: 1.45, y: 4.12, w: 2.6, h: 0.45, r: 0.05,
      fill: { color: 'FFFFFF' }, line: { color: 'D8B4FE', width: 0.8 }
    });
    slide.addText('✔ Validate SHA-256 Micro-Credentials\nW3C Verifiable Credentials Ledger', {
      x: 1.45, y: 4.16, w: 2.6, h: 0.38,
      fontSize: 6.2, fontFace: 'Segoe UI', align: 'center', bold: true, color: '166534'
    });

    // 4. Unified Data Store (Orange / Tan Box - Top Center)
    slide.addShape(pres.ShapeType.roundRect, {
      x: 4.3, y: 1.1, w: 2.7, h: 1.25, r: 0.08,
      fill: { color: PALETTE.ORANGE_CARD },
      line: { color: PALETTE.ORANGE_BORDER, width: 1.2 }
    });
    slide.addText('🗄️ Unified Data Store', {
      x: 4.35, y: 1.15, w: 2.6, h: 0.22,
      fontSize: 8, fontFace: 'Trebuchet MS', bold: true, color: 'C2410C', align: 'center'
    });

    slide.addShape(pres.ShapeType.roundRect, {
      x: 4.45, y: 1.42, w: 1.15, h: 0.82, r: 0.05,
      fill: { color: 'FFFFFF' }, line: { color: 'FDBA74', width: 0.8 }
    });
    slide.addText('🍃 MongoDB 7.0\n18 Collections\nCompound\nIndices (<50ms)', {
      x: 4.45, y: 1.46, w: 1.15, h: 0.74,
      fontSize: 6.2, fontFace: 'Segoe UI', align: 'center', bold: true, color: '9A3412'
    });

    slide.addShape(pres.ShapeType.roundRect, {
      x: 5.75, y: 1.42, w: 1.15, h: 0.82, r: 0.05,
      fill: { color: 'FFFFFF' }, line: { color: 'FDBA74', width: 0.8 }
    });
    slide.addText('📜 Audit Ledger\nSHA-256 Hashes\nStudent Records\nW3C Proofs', {
      x: 5.75, y: 1.46, w: 1.15, h: 0.74,
      fontSize: 6.2, fontFace: 'Segoe UI', align: 'center', bold: true, color: '9A3412'
    });

    // 5. Monitoring & Analytics (Coral / Salmon Box - Center)
    slide.addShape(pres.ShapeType.roundRect, {
      x: 4.4, y: 2.5, w: 2.5, h: 2.15, r: 0.08,
      fill: { color: 'FFEDD5' },
      line: { color: 'FB923C', width: 1.2 }
    });
    slide.addText('📊 Monitoring & Telemetry', {
      x: 4.45, y: 2.55, w: 2.4, h: 0.2,
      fontSize: 7.5, fontFace: 'Trebuchet MS', bold: true, color: 'C2410C', align: 'center'
    });

    slide.addShape(pres.ShapeType.roundRect, {
      x: 4.55, y: 2.8, w: 2.2, h: 0.45, r: 0.05,
      fill: { color: 'FFFFFF' }, line: { color: 'FDBA74', width: 0.8 }
    });
    slide.addText('📝 Append-Only Audit Logs\n(W3C Compliant Event Trail)', {
      x: 4.55, y: 2.84, w: 2.2, h: 0.38,
      fontSize: 6.2, fontFace: 'Segoe UI', align: 'center', bold: true, color: '431407'
    });

    slide.addShape(pres.ShapeType.roundRect, {
      x: 4.55, y: 3.32, w: 2.2, h: 0.52, r: 0.05,
      fill: { color: 'FFFFFF' }, line: { color: 'FDBA74', width: 0.8 }
    });
    slide.addText('📈 Placement Absorption Funnel\n& Regional Skill Demand Heatmaps', {
      x: 4.55, y: 3.36, w: 2.2, h: 0.44,
      fontSize: 6.2, fontFace: 'Segoe UI', align: 'center', bold: true, color: '431407'
    });

    slide.addShape(pres.ShapeType.roundRect, {
      x: 4.55, y: 3.92, w: 2.2, h: 0.6, r: 0.05,
      fill: { color: 'FFFFFF' }, line: { color: 'FDBA74', width: 0.8 }
    });
    slide.addText('🤖 5-Factor Weighted Engine\n(Score = 0.50S + 0.20E +\n0.15C + 0.10P + 0.05L)', {
      x: 4.55, y: 3.96, w: 2.2, h: 0.52,
      fontSize: 6.2, fontFace: 'Segoe UI', align: 'center', bold: true, color: '166534'
    });

    // 6. Outputs (Yellow Box - Right Side)
    slide.addShape(pres.ShapeType.roundRect, {
      x: 7.1, y: 1.45, w: 2.3, h: 3.2, r: 0.08,
      fill: { color: PALETTE.YELLOW_CARD },
      line: { color: PALETTE.YELLOW_BORDER, width: 1.2 }
    });
    slide.addText('📤 Outputs & Stakeholder Action', {
      x: 7.15, y: 1.5, w: 2.2, h: 0.22,
      fontSize: 7.5, fontFace: 'Trebuchet MS', bold: true, color: 'A16207', align: 'center'
    });

    slide.addShape(pres.ShapeType.roundRect, {
      x: 7.25, y: 1.78, w: 2.0, h: 0.8, r: 0.05,
      fill: { color: 'FFFFFF' }, line: { color: 'FDE047', width: 0.8 }
    });
    slide.addText('👨‍🎓 Candidate Portfolio\n• Radar Skill Breakdown\n• Remedial Study Path\n• Verified 1-Click Apply', {
      x: 7.25, y: 1.82, w: 2.0, h: 0.72,
      fontSize: 6.2, fontFace: 'Segoe UI', bold: true, color: '713F12'
    });

    slide.addShape(pres.ShapeType.roundRect, {
      x: 7.25, y: 2.65, w: 2.0, h: 0.88, r: 0.05,
      fill: { color: 'FFFFFF' }, line: { color: 'FDE047', width: 0.8 }
    });
    slide.addText('🏭 Ayush Industry HR\n• Pre-Screened Pipeline\n• Compatibility Breakdown\n• Weekly Milestone Tracker', {
      x: 7.25, y: 2.69, w: 2.0, h: 0.8,
      fontSize: 6.2, fontFace: 'Segoe UI', bold: true, color: '713F12'
    });

    slide.addShape(pres.ShapeType.roundRect, {
      x: 7.25, y: 3.6, w: 2.0, h: 0.95, r: 0.05,
      fill: { color: 'FFFFFF' }, line: { color: 'FDE047', width: 0.8 }
    });
    slide.addText('🏛 Ministry & Institutes\n• Regional Skill Heatmap\n• Curriculum Gap Analysis\n• NAAC/NIRF Audit Exports', {
      x: 7.25, y: 3.64, w: 2.0, h: 0.88,
      fontSize: 6.2, fontFace: 'Segoe UI', bold: true, color: '713F12'
    });

    // BOTTOM BAR: TECH STACK (Exact Match to User Ref 2)
    slide.addShape(pres.ShapeType.rect, {
      x: 0.0, y: 4.95, w: 2.2, h: 0.675,
      fill: { color: PALETTE.DEEP_BLUE_TECH }
    });
    slide.addText('TECH STACK', {
      x: 0.0, y: 5.12, w: 2.2, h: 0.35,
      fontSize: 14, fontFace: 'Trebuchet MS', bold: true, color: 'FFFFFF', align: 'center'
    });

    slide.addShape(pres.ShapeType.rect, {
      x: 2.2, y: 4.95, w: 7.8, h: 0.675,
      fill: { color: 'F8FAFC' }, line: { color: 'CBD5E1', width: 0.8 }
    });

    // Tech Stack Badges
    const techBadges = [
      { name: 'React 18', col: '0284C7' },
      { name: 'Vite 5', col: '7C3AED' },
      { name: 'Tailwind CSS', col: '0D9488' },
      { name: 'Node.js 20', col: '16A34A' },
      { name: 'Express.js', col: '334155' },
      { name: 'MongoDB 7', col: '15803D' },
      { name: 'JWT Auth', col: 'D97706' },
      { name: 'Docker', col: '2563EB' },
      { name: 'Nginx', col: '059669' },
      { name: 'Helmet.js', col: 'DC2626' },
      { name: 'FastAPI / ML', col: '0284C7' },
      { name: 'Recharts SVG', col: '4F46E5' }
    ];

    let tX = 2.35; let tY = 5.03;
    techBadges.forEach((tb, idx) => {
      slide.addShape(pres.ShapeType.roundRect, {
        x: tX, y: tY, w: 1.15, h: 0.24, r: 0.05,
        fill: { color: 'FFFFFF' }, line: { color: tb.col, width: 1.2 }
      });
      slide.addText(tb.name, {
        x: tX, y: tY + 0.03, w: 1.15, h: 0.18,
        fontSize: 6.8, fontFace: 'Segoe UI', bold: true, color: tb.col, align: 'center'
      });
      tX += 1.25;
      if (idx === 5) { tX = 2.35; tY += 0.28; }
    });
  }

  // =========================================================================
  // SLIDE 4: KEY FEATURES, USE CASE & ARCHITECTURE (Exact Match to User Ref 3)
  // =========================================================================
  {
    const slide = pres.addSlide();
    slide.background = { color: PALETTE.WHITE };

    // Header Logo Badges
    slide.addImage({ path: ASSETS.TEAM_LOGO, x: 0.35, y: 0.15, w: 0.75, h: 0.75 });
    slide.addImage({ path: ASSETS.SIH_LOGO, x: 8.85, y: 0.1, w: 0.85, h: 0.85 });

    // Vertical Divider Columns
    slide.addShape(pres.ShapeType.line, { x: 3.3, y: 0.2, w: 0, h: 5.2, line: { color: '000000', width: 1.5 } });
    slide.addShape(pres.ShapeType.line, { x: 6.7, y: 0.2, w: 0, h: 5.2, line: { color: '000000', width: 1.5 } });

    // COLUMN 1: KEY FEATURES (Left Column)
    slide.addShape(pres.ShapeType.roundRect, {
      x: 0.5, y: 0.15, w: 2.3, h: 0.35, r: 0.1,
      fill: { color: PALETTE.PEACH_BANNER }, line: { color: PALETTE.PEACH_BORDER, width: 1 }
    });
    slide.addText('KEY FEATURES', {
      x: 0.5, y: 0.18, w: 2.3, h: 0.28,
      fontSize: 10, fontFace: 'Trebuchet MS', bold: true, color: '000000', align: 'center'
    });

    slide.addShape(pres.ShapeType.roundRect, {
      x: 0.4, y: 0.56, w: 2.5, h: 0.28, r: 0.08,
      fill: { color: 'FEF08A' }
    });
    slide.addText('CLOSED-LOOP LIFECYCLE PLATFORM', {
      x: 0.4, y: 0.6, w: 2.5, h: 0.2,
      fontSize: 6.8, fontFace: 'Trebuchet MS', bold: true, color: '713F12', align: 'center'
    });

    // Radial Feature Mindmap
    const featureNodes = [
      { title: 'Security & RBAC', sub: 'JWT • Bcrypt • Helmet', col: '22C55E', y: 0.95 },
      { title: 'Diagnostic Engine', sub: '10 Ayush Competencies', col: '0284C7', y: 1.55 },
      { title: 'Deficit Vector Formula', sub: '5-Tier Gap Analyzer', col: 'A855F7', y: 2.15 },
      { title: 'SHA-256 Credentials', sub: 'W3C Verifiable Ledger', col: 'EC4899', y: 2.75 },
      { title: '6-Stage Internship', sub: 'Weekly Milestone Logs', col: 'F59E0B', y: 3.35 },
      { title: 'Faculty R&D Hub', sub: 'Joint Grants & Sabbaticals', col: '14B8A6', y: 3.95 },
      { title: 'National Telemetry', sub: 'Macro Workforce Heatmap', col: '6366F1', y: 4.55 }
    ];

    featureNodes.forEach(fn => {
      slide.addShape(pres.ShapeType.roundRect, {
        x: 0.5, y: fn.y, w: 2.3, h: 0.5, r: 0.08,
        fill: { color: 'FFFFFF' }, line: { color: fn.col, width: 1.2 }
      });
      slide.addText(fn.title, {
        x: 0.55, y: fn.y + 0.04, w: 2.2, h: 0.22,
        fontSize: 7.5, fontFace: 'Trebuchet MS', bold: true, color: fn.col
      });
      slide.addText(fn.sub, {
        x: 0.55, y: fn.y + 0.24, w: 2.2, h: 0.22,
        fontSize: 6.5, fontFace: 'Segoe UI', color: PALETTE.SLATE_TEXT
      });
    });

    // COLUMN 2: USE CASE (Center Column)
    slide.addShape(pres.ShapeType.roundRect, {
      x: 4.0, y: 0.15, w: 2.0, h: 0.35, r: 0.1,
      fill: { color: PALETTE.PEACH_BANNER }, line: { color: PALETTE.PEACH_BORDER, width: 1 }
    });
    slide.addText('USE CASE', {
      x: 4.0, y: 0.18, w: 2.0, h: 0.28,
      fontSize: 10, fontFace: 'Trebuchet MS', bold: true, color: '000000', align: 'center'
    });

    // Actors & System Use Case Container
    slide.addShape(pres.ShapeType.roundRect, {
      x: 3.5, y: 0.58, w: 3.0, h: 4.75, r: 0.15,
      fill: { color: 'F0FDF4' }, line: { color: '059669', width: 1.5 }
    });
    slide.addText('SkillBridge Unified Ecosystem', {
      x: 3.55, y: 0.65, w: 2.9, h: 0.22,
      fontSize: 7.8, fontFace: 'Trebuchet MS', bold: true, color: '065F46', align: 'center'
    });

    const useCases = [
      'Take 10 Ayush Diagnostic Tests',
      'View Skill Deficit Vector vs Role',
      'Enroll in Auto-Remedial Course',
      'Search Matched Jobs (5-Factor Fit)',
      'Review Pre-Screened Candidates',
      'Sign-off Weekly Internship Milestones',
      'Submit Joint Faculty R&D Proposals',
      'Access NAAC/NIRF Compliance Audits',
      'Inspect Pan-India Skill Demand Heatmap'
    ];

    let ucY = 0.95;
    useCases.forEach(uc => {
      slide.addShape(pres.ShapeType.ellipse, {
        x: 3.65, y: ucY, w: 2.7, h: 0.38,
        fill: { color: 'FFFFFF' }, line: { color: '10B981', width: 0.8 }
      });
      slide.addText(uc, {
        x: 3.65, y: ucY + 0.05, w: 2.7, h: 0.28,
        fontSize: 6.2, fontFace: 'Segoe UI', bold: true, color: '064E3B', align: 'center'
      });
      ucY += 0.45;
    });

    // COLUMN 3: ARCHITECTURE (Right Column)
    slide.addShape(pres.ShapeType.roundRect, {
      x: 7.1, y: 0.15, w: 2.1, h: 0.35, r: 0.1,
      fill: { color: PALETTE.PEACH_BANNER }, line: { color: PALETTE.PEACH_BORDER, width: 1 }
    });
    slide.addText('ARCHITECTURE', {
      x: 7.1, y: 0.18, w: 2.1, h: 0.28,
      fontSize: 10, fontFace: 'Trebuchet MS', bold: true, color: '000000', align: 'center'
    });

    // Cloud Architecture Stack
    const archBoxes = [
      { title: '🌐 CLIENT APP / EDGE CDN', sub: 'React 18 SPA • HTTPS • Cloudflare WAF • SSL Termination', col: 'FEF3C7', bcol: 'F59E0B', y: 0.6 },
      { title: '⚖️ INGRESS & LOAD BALANCER', sub: 'Nginx Reverse Proxy • Rate Limiting • UUID Header Tracing', col: 'E0F2FE', bcol: '0284C7', y: 1.3 },
      { title: '⚙️ DOCKER SERVICE LAYER', sub: 'Node.js 20 REST Services • JWT RBAC • Bcrypt • Helmet', col: 'F3E8FF', bcol: '9333EA', y: 2.0 },
      { title: '⚡ IN-MEMORY CACHE', sub: 'Redis 7 • Session Token Store • Assessment Rate Cache', col: 'FEE2E2', bcol: 'EF4444', y: 2.85 },
      { title: '🗄️ PERSISTENCE DATA LAYER', sub: 'MongoDB 7.0+ Replica Set • 18 Schemas • Indexed Collections', col: 'DCFCE7', bcol: '16A34A', y: 3.55 },
      { title: '📈 MONITORING & TELEMETRY', sub: 'Prometheus Metrics • Grafana Heatmaps • Immutable Audit Trail', col: 'FFEDD5', bcol: 'EA580C', y: 4.35 }
    ];

    archBoxes.forEach(ab => {
      slide.addShape(pres.ShapeType.roundRect, {
        x: 6.85, y: ab.y, w: 2.65, h: 0.62, r: 0.08,
        fill: { color: ab.col }, line: { color: ab.bcol, width: 1 }
      });
      slide.addText(ab.title, {
        x: 6.9, y: ab.y + 0.04, w: 2.55, h: 0.2,
        fontSize: 6.8, fontFace: 'Trebuchet MS', bold: true, color: '0F172A'
      });
      slide.addText(ab.sub, {
        x: 6.9, y: ab.y + 0.24, w: 2.55, h: 0.34,
        fontSize: 6.2, fontFace: 'Segoe UI', color: '334155'
      });
    });
  }

  // =========================================================================
  // SLIDE 5: IMPACT, FEASIBILITY & REGULATORY VIABILITY
  // =========================================================================
  {
    const slide = pres.addSlide();
    slide.background = { color: PALETTE.WHITE };

    addSIHStandardHeader(slide, 'IMPACT & FEASIBILITY', 'MULTI-STAKEHOLDER VALUE & REGULATORY COMPLIANCE');

    // 4 Stakeholder Value Cards (2x2 Grid)
    const cards = [
      {
        title: '👨‍🎓 STUDENTS & ASPIRANTS',
        tag: 'Objective Clarity & Verified Hiring',
        col: '0D9488', bg: 'CCFBF1',
        bullets: [
          'Diagnostic assessment across 10 Ayush competencies eliminates resume bias.',
          'Automated remedial learning path bridges deficits before graduation.',
          'Cryptographically signed SHA-256 portfolio unlocks direct corporate interviews.'
        ],
        x: 0.5, y: 1.0, w: 4.3, h: 1.95
      },
      {
        title: '🏭 AYUSH INDUSTRY & RECRUITERS',
        tag: '70% Screening Overhead Reduction',
        col: '0284C7', bg: 'E0F2FE',
        bullets: [
          'Pre-screened talent certified in Schedule T GMP & Clinical Documentation.',
          '5-Factor compatibility score eliminates unvetted resume screening.',
          'Weekly milestone sign-offs ensure structured internship deliverables.'
        ],
        x: 5.1, y: 1.0, w: 4.4, h: 1.95
      },
      {
        title: '🔬 FACULTY & ACADEMIA',
        tag: 'Funded Research & Industry Sabbaticals',
        col: '7C3AED', bg: 'F3E8FF',
        bullets: [
          'Publish research capabilities and bid directly on corporate consulting RFPs.',
          'Apply for industry-sponsored sabbaticals in certified manufacturing plants.',
          'Curriculum feedback loops highlight missing market topics for syllabus updates.'
        ],
        x: 0.5, y: 3.1, w: 4.3, h: 1.85
      },
      {
        title: '🏛 INSTITUTES & MINISTRY OF AYUSH',
        tag: 'NAAC / NIRF Audits & National Telemetry',
        col: 'D97706', bg: 'FEF3C7',
        bullets: [
          'Real-time institutional placement velocity and candidate absorption rates.',
          'W3C-compliant audit logs provide instant export for NAAC & NCISM accreditation.',
          'National workforce heatmap empowers data-driven skill policy interventions.'
        ],
        x: 5.1, y: 3.1, w: 4.4, h: 1.85
      }
    ];

    cards.forEach(cd => {
      slide.addShape(pres.ShapeType.roundRect, {
        x: cd.x, y: cd.y, w: cd.w, h: cd.h, r: 0.1,
        fill: { color: 'FFFFFF' }, line: { color: cd.col, width: 1.2 }
      });
      slide.addShape(pres.ShapeType.roundRect, {
        x: cd.x + 0.15, y: cd.y + 0.12, w: cd.w - 0.3, h: 0.28, r: 0.06,
        fill: { color: cd.bg }
      });
      slide.addText(cd.title + ' — ' + cd.tag, {
        x: cd.x + 0.2, y: cd.y + 0.16, w: cd.w - 0.4, h: 0.2,
        fontSize: 7.5, fontFace: 'Trebuchet MS', bold: true, color: cd.col
      });

      let cy = cd.y + 0.46;
      cd.bullets.forEach(b => {
        slide.addText('✔ ' + b, {
          x: cd.x + 0.2, y: cy, w: cd.w - 0.4, h: 0.42,
          fontSize: 7.0, fontFace: 'Segoe UI', color: PALETTE.DARK_TEXT
        });
        cy += 0.42;
      });
    });

    // Bottom Banner: Measurable KPIs & NEP 2020 Alignment
    slide.addShape(pres.ShapeType.roundRect, {
      x: 0.5, y: 5.05, w: 9.0, h: 0.42, r: 0.08,
      fill: { color: '064E3B' }
    });
    slide.addText('🎯 TARGET IMPACT:  70% Faster Hiring  |  85%+ Match Fit  |  100% Cryptographic Verification  |  Aligned with NEP 2020 & Ayush Vision 2030', {
      x: 0.5, y: 5.14, w: 9.0, h: 0.25,
      fontSize: 8, fontFace: 'Trebuchet MS', bold: true, color: 'FDE68A', align: 'center'
    });
  }

  // =========================================================================
  // SLIDE 6: RESEARCH AND REFERENCE & PROTOTYPE (Exact Match to User Ref 4)
  // =========================================================================
  {
    const slide = pres.addSlide();
    slide.background = { color: PALETTE.WHITE };

    // Header: Team Logo, Title Banner, SIH Logo
    slide.addImage({ path: ASSETS.TEAM_LOGO, x: 0.35, y: 0.15, w: 0.75, h: 0.75 });
    slide.addImage({ path: ASSETS.SIH_LOGO, x: 8.85, y: 0.1, w: 0.85, h: 0.85 });

    slide.addShape(pres.ShapeType.roundRect, {
      x: 2.8, y: 0.15, w: 4.4, h: 0.38, r: 0.12,
      fill: { color: PALETTE.PEACH_BANNER },
      line: { color: PALETTE.PEACH_BORDER, width: 1.2 }
    });
    slide.addText('RESEARCH AND REFERENCE', {
      x: 2.8, y: 0.18, w: 4.4, h: 0.32,
      fontSize: 12, fontFace: 'Trebuchet MS', bold: true, color: '000000', align: 'center', underline: true
    });

    // Research Sub-banner
    slide.addShape(pres.ShapeType.roundRect, {
      x: 3.0, y: 0.58, w: 4.0, h: 0.28, r: 0.08,
      fill: { color: 'FFF7ED' }, line: { color: 'FDBA74', width: 0.8 }
    });
    slide.addText('KEY RESEARCH & OFFICIAL DOCUMENTS:', {
      x: 3.0, y: 0.62, w: 4.0, h: 0.2,
      fontSize: 8.5, fontFace: 'Trebuchet MS', bold: true, color: '000000', align: 'center'
    });

    // Research Citations with Clickable Links
    slide.addText([
      { text: 'Drugs & Cosmetics Act, 1940 — Schedule T (Good Manufacturing Practices for Ayurvedic Siddha & Unani Medicines).\n', options: { bold: true, fontSize: 7.2, color: '0F172A' } },
      { text: 'https://ayush.gov.in/docs/schedule-t-gmp.pdf\n', options: { underline: true, fontSize: 7, color: '0284C7' } },
      { text: 'National Education Policy (NEP 2020) — Experiential Learning, Credit-Based Internships & Industry Syllabi Sync.\n', options: { bold: true, fontSize: 7.2, color: '0F172A' } },
      { text: 'https://www.education.gov.in/sites/upload_files/mhrd/files/NEP_Final_English_0.pdf\n', options: { underline: true, fontSize: 7, color: '0284C7' } },
      { text: 'W3C Verifiable Credentials Data Model v1.1 — Cryptographic Micro-Credential Transparency Architecture.\n', options: { bold: true, fontSize: 7.2, color: '0F172A' } },
      { text: 'https://www.w3.org/TR/vc-data-model/', options: { underline: true, fontSize: 7, color: '0284C7' } }
    ], {
      x: 0.5, y: 0.9, w: 9.0, h: 1.0, fontFace: 'Segoe UI'
    });

    // Reference Links Sub-banner
    slide.addShape(pres.ShapeType.roundRect, {
      x: 3.3, y: 1.95, w: 3.4, h: 0.24, r: 0.06,
      fill: { color: 'FFF7ED' }
    });
    slide.addText('LINKS FROM WHERE WE TOOK REFERENCES:', {
      x: 3.3, y: 1.98, w: 3.4, h: 0.18,
      fontSize: 7.5, fontFace: 'Trebuchet MS', bold: true, color: '000000', align: 'center'
    });

    slide.addText('• https://ayush.gov.in  • https://ncismindia.org  • https://abdm.gov.in  • https://aicte-india.org  • https://github.com/jaiswalvaibhav789/Skill.Bridge', {
      x: 0.5, y: 2.22, w: 9.0, h: 0.22,
      fontSize: 7.2, fontFace: 'Segoe UI', color: '0284C7', align: 'center', underline: true
    });

    // Dividing Horizontal Line with Diamond Accent (Exact Match to User Ref 4)
    slide.addShape(pres.ShapeType.line, {
      x: 0.4, y: 2.5, w: 9.2, h: 0,
      line: { color: '000000', width: 1.5 }
    });
    slide.addShape(pres.ShapeType.diamond, {
      x: 4.88, y: 2.4, w: 0.24, h: 0.2,
      fill: { color: '000000' }
    });

    // PROTOTYPE SECTION
    slide.addShape(pres.ShapeType.roundRect, {
      x: 3.8, y: 2.62, w: 2.4, h: 0.32, r: 0.1,
      fill: { color: PALETTE.PEACH_BANNER },
      line: { color: PALETTE.PEACH_BORDER, width: 1 }
    });
    slide.addText('PROTOTYPE', {
      x: 3.8, y: 2.65, w: 2.4, h: 0.26,
      fontSize: 10.5, fontFace: 'Trebuchet MS', bold: true, color: '000000', align: 'center'
    });

    // Prototype Links
    slide.addText([
      { text: 'Prototype walkthrough : ', options: { bold: true, fontSize: 8.5, color: '000000' } },
      { text: 'CLICK HERE (Live Video)  ', options: { bold: true, underline: true, fontSize: 8.5, color: '0284C7' } },
      { text: '|  Full Demonstration: ', options: { bold: true, fontSize: 8.5, color: '000000' } },
      { text: 'CLICK HERE (GitHub Repo)', options: { bold: true, underline: true, fontSize: 8.5, color: '0284C7' } }
    ], {
      x: 0.5, y: 2.96, w: 9.0, h: 0.24, align: 'center', fontFace: 'Segoe UI'
    });

    // 3 Mockup Frames: Mobile App, Microservices/API, Web Dashboard (Exact Match to User Ref 4)
    // Frame 1: Mobile App
    slide.addShape(pres.ShapeType.roundRect, {
      x: 0.8, y: 3.22, w: 1.0, h: 0.22, r: 0.05,
      fill: { color: 'FEE2E2' }
    });
    slide.addText('MOBILE APP', {
      x: 0.8, y: 3.25, w: 1.0, h: 0.16,
      fontSize: 6.8, fontFace: 'Trebuchet MS', bold: true, color: '991B1B', align: 'center'
    });
    slide.addImage({
      path: ASSETS.MOBILE_MOCKUP,
      x: 0.6, y: 3.48, w: 1.4, h: 1.95
    });

    // Frame 2: Microservices & API Console (Middle)
    slide.addShape(pres.ShapeType.roundRect, {
      x: 3.3, y: 3.22, w: 2.6, h: 0.22, r: 0.05,
      fill: { color: 'E0E7FF' }
    });
    slide.addText('MICROSERVICES & ALGORITHMIC ENGINE', {
      x: 3.3, y: 3.25, w: 2.6, h: 0.16,
      fontSize: 6.8, fontFace: 'Trebuchet MS', bold: true, color: '3730A3', align: 'center'
    });

    // Dark terminal mockup box for microservices
    slide.addShape(pres.ShapeType.roundRect, {
      x: 2.2, y: 3.48, w: 4.8, h: 1.95, r: 0.08,
      fill: { color: '0F172A' }, line: { color: '334155', width: 1 }
    });
    slide.addText([
      { text: '$ node tests/run_all_tests.js\n', options: { color: '4ADE80', fontFace: 'Consolas', fontSize: 6.2, bold: true } },
      { text: '✔ [AUTH SUITE] JWT token rotation & 5-role guards (12/12 passed)\n', options: { color: 'F8FAFC', fontFace: 'Consolas', fontSize: 5.8 } },
      { text: '✔ [ASSESSMENT] 10 Ayush competency MCQ auto-grader (10/10 passed)\n', options: { color: 'F8FAFC', fontFace: 'Consolas', fontSize: 5.8 } },
      { text: '✔ [GAP ENGINE] 5-Tier Deficit Vector formulation (8/8 passed)\n', options: { color: 'F8FAFC', fontFace: 'Consolas', fontSize: 5.8 } },
      { text: '✔ [MATCHING] 5-Factor Weighted Compatibility Scoring (15/15 passed)\n', options: { color: 'F8FAFC', fontFace: 'Consolas', fontSize: 5.8 } },
      { text: '✔ [LEDGER] SHA-256 deterministic W3C credentials (14/14 passed)\n', options: { color: 'F8FAFC', fontFace: 'Consolas', fontSize: 5.8 } },
      { text: '✔ [MILESTONES] 6-Stage internship state transitions (16/16 passed)\n', options: { color: 'F8FAFC', fontFace: 'Consolas', fontSize: 5.8 } },
      { text: '===========================================================\n', options: { color: '64748B', fontFace: 'Consolas', fontSize: 5.8 } },
      { text: 'MASTER STATUS: 10 SUITES / 97 TESTS PASSING (100% GREEN)', options: { color: '38BDF8', fontFace: 'Consolas', fontSize: 6.2, bold: true } }
    ], {
      x: 2.3, y: 3.52, w: 4.6, h: 1.85
    });

    // Frame 3: Web Dashboard (Right)
    slide.addShape(pres.ShapeType.roundRect, {
      x: 7.7, y: 3.22, w: 1.2, h: 0.22, r: 0.05,
      fill: { color: 'FEF3C7' }
    });
    slide.addText('WEB DASHBOARD', {
      x: 7.7, y: 3.25, w: 1.2, h: 0.16,
      fontSize: 6.8, fontFace: 'Trebuchet MS', bold: true, color: 'B45309', align: 'center'
    });
    slide.addImage({
      path: ASSETS.WEB_MOCKUP,
      x: 7.2, y: 3.48, w: 2.2, h: 1.95
    });
  }

  // Save the updated presentation
  const outputPath = path.resolve(__dirname, '../../SkillBridge_SIH26044_Presentation.pptx');
  await pres.writeFile({ fileName: outputPath });
  console.log(`Visual SIH Presentation successfully created at: ${outputPath}`);
}

createSIHVisualPresentation().catch(err => {
  console.error('Error creating presentation:', err);
  process.exit(1);
});
