# CLAUDE.md

## Project Overview

Tin Yat Kwok Portfolio - A personal portfolio website for a Senior UX Designer.

**Current Direction:** End-to-End Delivery (Direction G) - "16 years turning ideas into shipped products"

## Project Structure

```
/home/yat/test4/
├── index.html                  # Main portfolio page (Direction G - End-to-End Delivery)
├── case-study-aop.html         # Bank Account Opening case study
├── case-study-stocktrading.html # Stock Trading Experience case study
├── case-study-wealthmgt.html   # HSBC Wealth Management case study
├── work-banking-concept.html   # Banking App Concept work
├── work-credit-card.html       # Credit Card work
├── work-funds-trading.html     # Funds Trading work
├── work-hiking.html            # Hiking App Concept work
├── CLAUDE.md                   # This file
├── archive/                    # Archived direction explorations
│   └── directions/             # Direction A-G explorations + README
├── assets/
│   ├── css/
│   │   ├── styles.css          # Main stylesheet (~55KB, includes Direction G styles)
│   │   └── directionG.css        # Merged into styles.css (reference only)
│   ├── js/
│   │   └── main.js             # Navigation, scroll effects, active states
│   └── images/
│       ├── logo.svg            # Nav logo (height: 30px in CSS)
│       ├── favicon.svg
│       ├── casestudy1.webp     # AOP case study thumbnail
│       ├── casestudy3.webp     # Stock Trading case study thumbnail
│       ├── wealthmgtthumb.webp # Wealth Management thumbnail
│       ├── hsb_app.svg         # HSBC logo
│       ├── bocapp_icon.svg     # BOCHK app icon
│       ├── hero.png            # Hero portrait (flipped via CSS)
│       ├── portrait2.png       # About section portrait
│       └── case-studies/       # Case study images organized by project
│           ├── aop/
│           ├── stock/
│           └── wealthmgt/
└── tinyatk.github.io/          # Legacy directory - old portfolio version
```

## Design System

### Typography
- **Heading Font:** DM Serif Display, Georgia, serif (font-weight: 400)
- **Body Font:** Inter, sans-serif (font-weight: 400, 500, 600, 700)
- Import via Google Fonts with `preconnect` optimizations

### CSS Custom Properties (in styles.css)
```css
:root {
  --font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  --font-family-heading: 'DM Serif Display', Georgia, serif;
  --color-background: #F7F8FA;
  --color-surface: #FFFFFF;
  --color-text-primary: #102033;
  --color-text-secondary: #516072;
  --color-accent: #1B66FF;
  --color-border: #D9E1EA;
}
```

### Heading Styles
All headings (h1-h6) use `font-weight: 400` with DM Serif Display.

### Navigation
- Fixed position at top
- Logo height: 30px (CSS: `.nav-logo img { height: 30px; width: auto; display: block; }`)
- Links: Work, Process, Expertise, About, Contact
- Active state: accent color underline via `.nav-link.active`
- Mobile: hamburger menu with `aria-expanded` support

### Case Study Cards (index.html)
- CSS class: `.case-study-card`
- Structure: thumbnail image + title + description + "View case study →" link
- Uses staggered scroll-reveal animation (fade-up with 80ms delay between cards)
- Featured layout: 2fr 1fr grid (image + content side-by-side)

### JavaScript Architecture

**main.js**: Core functionality
- Mobile navigation toggle
- Scroll-based active nav highlighting (`updateActiveNavLink()`)
- Smooth scroll for anchor links
- Keyboard navigation (Escape to close menu)
- Lazy image loading support

**animations.js**: Scroll animations (isolated module)
- IntersectionObserver for `.anim-*` sections
- Counter animations for Results section
- Typewriter effect for Capabilities
- Timeline progress for Process
- Parallax for About portrait
- Ripple effects for Contact

## Scroll-Triggered Animations

Animation system powered by `assets/js/animations.js`:

### Animation Classes

Sections have animation classes added to enable scroll-triggered effects:

| Section | Class | Effect |
|---------|-------|--------|
| Logo Strip | `.anim-logo-strip` | Sequential fade reveal (1A) |
| Why Work | `.anim-why-work` | Icon rotation + fade (2B) |
| Featured Case Studies | `.anim-case-studies` | Card expansion (3A) |
| Selected Work | `.anim-selected-work` | Cascade ripple (4D) |
| Results | `.anim-results` | Number count-up (5A) |
| Delivery Process | `.anim-process` | Timeline progress (6B) |
| Capabilities | `.anim-capabilities` | Typewriter effect (7A) |
| About | `.anim-about` | Portrait parallax (8A) |
| Contact CTA | `.anim-contact` | Ripple effect (9D) |

### How It Works

1. `IntersectionObserver` watches sections with `.anim-*` classes
2. When 15% visible, adds `.is-visible` class to the section
3. CSS transitions handle the base fade-up animations
4. JavaScript handles advanced effects (counters, typewriter, parallax, ripples)

### Key Animation Files

- `assets/css/styles.css` (~line 2445): CSS transitions and keyframes
- `assets/js/animations.js`: IntersectionObserver + JS-powered effects

### Accessibility

- Respects `prefers-reduced-motion` media query
- One-time triggers per section (no re-trigger on scroll back)
- Uses `cubic-bezier(0.25, 0.46, 0.45, 0.94)` easing for natural feel

## Homepage Sections (Direction G)

1. **Hero** - End-to-end credibility badges, flipped portrait image
2. **Logo Strip** - Previous companies (.logo-strip)
3. **Featured Case Studies** - Shipped work with impact metrics (.featured-case-studies)
4. **Why Work With Me** - Value props in 2x2 grid (.value-props)
5. **Results** - Impact metrics grid (.results-section)
6. **Delivery Process** - 5-step timeline (.delivery-process)
7. **Capabilities** - Skills table (.capabilities)
8. **About** - Personality + quote (.about-section)
9. **Contact CTA** - Final call-to-action (.contact-cta)

## Image Conventions

### Case Study Thumbnails (index.html)
- AOP: `casestudy1.webp`
- Stock Trading: `casestudy3.webp`
- Wealth Management: `wealthmgtthumb.webp`

### Hero Portrait
- File: `assets/images/hero.png`
- CSS flip: `.hero-portrait img { transform: scaleX(-1); }`

### Case Study Page Images
Located in `assets/images/case-studies/{project-name}/`
Use `loading="lazy"` for all images below the fold.

### Continuous Image Blocks
For gapless image stacking in case studies:
```css
.case-study-image-continuous {
  display: flex;
  flex-direction: column;
  gap: 0;
}
```

### Hero Images
Case studies use hero images above the Introduction section:
```html
<div class="case-study-image-block case-study-image-hero">
  <img src="./assets/images/case-studies/{project}/hero.webp" alt="..." loading="lazy">
</div>
```
Hero images are sized to 70% width via CSS.

## External Resources

### Fonts (Google Fonts)
```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=DM+Serif+Display&family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
```

## Common Tasks

### Adding a New Case Study
1. Create HTML file at root: `/case-study-{name}.html`
2. Copy navigation structure from existing case study
3. Add images to `/assets/images/case-studies/{name}/`
4. Update case study navigation (prev/next links)
5. Add thumbnail to index.html if featured
6. Add "Impact and Results" section with metrics

### Adding a New Work Item
1. Create HTML file at root: `/work-{name}.html`
2. Copy structure from existing work page
3. Add thumbnail image to `/assets/images/`
4. Add card to index.html #selected-work section

### Updating Navigation
- All pages share identical `<nav>` structure
- Update all HTML files when changing nav items
- Active state logic is in `main.js`
- Case study pages should have "Case Studies" link as active

### Typography Changes
- Update `--font-family-heading` in CSS
- Ensure h1-h6 have `font-weight: 400`

### Adding Images
- Thumbnails: `/assets/images/`
- Case study content: `/assets/images/case-studies/{project}/`
- Use WebP format for photos
- Always include descriptive `alt` text
- Hero images should use `.case-study-image-hero` class

## Impact and Results Section Pattern

Case studies include an "Impact and Results" section with metrics:

```html
<h2 class="case-study-section-title">Impact and Results</h2>
<p>After launching...</p>

<div class="impact-metrics">
  <div class="impact-metric">
    <div class="impact-metric-value">+24%</div>
    <div class="impact-metric-label">Completion Rate</div>
  </div>
  <div class="impact-metric">
    <div class="impact-metric-value">-47%</div>
    <div class="impact-metric-label">Support Tickets</div>
  </div>
  <div class="impact-metric">
    <div class="impact-metric-value">4.2/5</div>
    <div class="impact-metric-label">User Satisfaction</div>
  </div>
</div>
```

## Known Patterns

### HTML Structure for Case Studies
```html
<body class="case-study-page">
<nav>...</nav>
<header class="case-study-hero">...</header>
<section class="case-study-meta-block">...</section>
<main class="case-study-content-wrapper">
  <div class="case-study-body">
    <!-- Hero image -->
    <div class="case-study-image-block case-study-image-hero">...</div>
    <!-- Introduction -->
    <section class="case-study-section">...</section>
    <!-- Impact and Results -->
    <section class="case-study-section">
      <h2 class="case-study-section-title">Impact and Results</h2>
      <div class="impact-metrics">...</div>
    </section>
  </div>
</main>
<section class="case-study-nav">...</section>
<section class="contact">...</section>
<footer>...</footer>
</body>
```

### Scroll-Based Active Nav
The `updateActiveNavLink()` function in main.js:
- Runs on scroll (throttled with requestAnimationFrame)
- Calculates current section based on scroll position + nav height
- Adds `.active` class to matching nav links
- Special handling for case study pages (only "Case Studies" active)

### Flattened File Structure
All HTML files are at root level with prefixed names:
- `case-study-{name}.html` for case studies
- `work-{name}.html` for work items
- `./` relative paths for assets (not `../`)
- Links always point to `./index.html`, not just folders

## Archive Notes

Direction explorations (A-G) are archived in `/archive/directions/`:
- `directionA.html` - Impact-focused (business outcomes)
- `directionB.html` - Process-focused (design methodology)
- `directionC.html` - Leadership-focused (team/strategy)
- `directionD.html` - Specialization-focused (complexity types)
- `directionE.html` - Personality-focused (story-driven)
- `directionF.html` - Combined approach (synthesized)
- `directionG.html` - End-to-end delivery (LIVE as index.html)
- `README.md` - Documentation of each direction's positioning
- `index.html.backup` - Original pre-direction index.html

## Legacy Directory

The `/tinyatk.github.io/` directory contains the old portfolio version. Do not modify unless migrating content.

## Current Date

2026/04/13

## Claude Code Instructions

When editing files, if you encounter the error "Error: String to replace not found in file", re-read the file from disk to get the current state, then retry the edit.

