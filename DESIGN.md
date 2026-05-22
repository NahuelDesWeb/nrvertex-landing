---
name: NRVERTEX
colors:
  surface: '#131315'
  surface-dim: '#131315'
  surface-bright: '#39393b'
  surface-container-lowest: '#0e0e10'
  surface-container-low: '#1c1b1d'
  surface-container: '#201f22'
  surface-container-high: '#2a2a2c'
  surface-container-highest: '#353437'
  on-surface: '#e5e1e4'
  on-surface-variant: '#ccc3d8'
  inverse-surface: '#e5e1e4'
  inverse-on-surface: '#313032'
  outline: '#958da1'
  outline-variant: '#4a4455'
  surface-tint: '#d2bbff'
  primary: '#d2bbff'
  on-primary: '#3f008e'
  primary-container: '#7c3aed'
  on-primary-container: '#ede0ff'
  inverse-primary: '#732ee4'
  secondary: '#ddb7ff'
  on-secondary: '#490080'
  secondary-container: '#6f00be'
  on-secondary-container: '#d6a9ff'
  tertiary: '#ddb8ff'
  on-tertiary: '#490081'
  tertiary-container: '#844abe'
  on-tertiary-container: '#f2e0ff'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#eaddff'
  primary-fixed-dim: '#d2bbff'
  on-primary-fixed: '#25005a'
  on-primary-fixed-variant: '#5a00c6'
  secondary-fixed: '#f0dbff'
  secondary-fixed-dim: '#ddb7ff'
  on-secondary-fixed: '#2c0051'
  on-secondary-fixed-variant: '#6900b3'
  tertiary-fixed: '#f0dbff'
  tertiary-fixed-dim: '#ddb8ff'
  on-tertiary-fixed: '#2c0051'
  on-tertiary-fixed-variant: '#62259b'
  background: '#131315'
  on-background: '#e5e1e4'
  surface-variant: '#353437'
typography:
  headline-xl:
    fontFamily: Sora
    fontSize: 48px
    fontWeight: '800'
    lineHeight: '1.1'
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Sora
    fontSize: 32px
    fontWeight: '700'
    lineHeight: '1.2'
    letterSpacing: -0.01em
  headline-lg-mobile:
    fontFamily: Sora
    fontSize: 28px
    fontWeight: '700'
    lineHeight: '1.2'
  headline-md:
    fontFamily: Sora
    fontSize: 24px
    fontWeight: '600'
    lineHeight: '1.3'
  body-lg:
    fontFamily: Sora
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.6'
  body-md:
    fontFamily: Sora
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.6'
  label-md:
    fontFamily: Sora
    fontSize: 14px
    fontWeight: '600'
    lineHeight: '1.2'
    letterSpacing: 0.05em
  label-sm:
    fontFamily: Sora
    fontSize: 12px
    fontWeight: '500'
    lineHeight: '1.2'
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  base: 4px
  xs: 8px
  sm: 16px
  md: 24px
  lg: 40px
  xl: 64px
  gutter: 24px
  margin-mobile: 16px
  margin-desktop: 48px
---

## Brand & Style
This design system is engineered for high-performance technology and digital frontier environments. It evokes a sense of "Cyber-Sophistication"—a blend of futuristic precision and immersive depth. The brand personality is bold, innovative, and unapologetically digital.

The visual style is a fusion of **Glassmorphism** and **Neon-Infused Minimalism**. It relies on high-contrast relationships between deep obsidian surfaces and vibrant ultraviolet accents. The interface should feel like a HUD (Heads-Up Display) from a high-end technical simulation: atmospheric, layered, and luminous.

Every interaction must reinforce a sense of energy flow, utilizing light as a functional signifier rather than just decoration.

## Colors
The palette is strictly restricted to the ultraviolet spectrum to maintain a unified, high-energy aesthetic. 

- **Primary Violet (#7c3aed):** Used for structural accents and primary brand states.
- **Secondary Purple (#a855f7):** Used for interactive elements and gradient stops.
- **Glow Highlight (#c084fc):** Reserved for active states, hover effects, and luminous text highlights.
- **Background (#09090b):** An absolute near-black that provides the infinite depth required for glass effects to pop.
- **Functional Glass:** All borders and containers utilize the translucent violet tint to create the "etched in glass" appearance.

**Note:** Absolutely no warm tones (red, orange, yellow) are permitted. Success states should use high-brightness purple/white rather than green.

## Typography
**Sora** is the sole typeface for the design system, chosen for its geometric clarity and futuristic "tech" apertures. 

- **Headlines:** Use Bold (700) or ExtraBold (800) weights. Tighten letter spacing slightly for a more "locked-in" architectural feel. 
- **Body Text:** Use Regular (400) for maximum readability against the dark background. Ensure line height is generous (1.6) to prevent text from feeling cramped in high-contrast settings.
- **Labels:** Use SemiBold (600) with increased letter spacing and uppercase styling for a "system readout" aesthetic.

## Layout & Spacing
The design system employs a **Fluid Grid** model based on an 8px atomic scale. 

- **Grid:** A 12-column system for desktop and a 4-column system for mobile. 
- **Gutter:** Fixed at 24px to ensure breathing room between glass panels.
- **Padding:** Containers should use generous internal padding (MD or LG) to emphasize the "floating" nature of the content.
- **Reflow:** Elements should collapse vertically on mobile, maintaining a consistent 16px margin from the screen edge.

## Elevation & Depth
Depth is not communicated through shadows, but through **Luminance and Translucency**.

1.  **Level 0 (Floor):** The #09090b background.
2.  **Level 1 (Surface):** Glass panels with a `backdrop-filter: blur(12px)` and a `background: rgba(255, 255, 255, 0.03)`.
3.  **Level 2 (Active):** High-opacity glass with a 1px solid border using `rgba(168, 85, 247, 0.25)`.
4.  **Level 3 (Overlay):** Modals or floating tooltips with a primary violet outer glow (`box-shadow: 0 0 20px rgba(124, 58, 237, 0.3)`).

Avoid traditional black shadows. Use colored "ambient glows" to suggest light emitting from the components onto the dark surface below.

## Shapes
The shape language is "Soft-Tech." While the brand is futuristic, it avoids the aggressive sharpness of brutalism in favor of refined, modern curves.

- **Primary Radius:** 0.5rem (8px) for standard components like input fields and small cards.
- **Large Radius (LG):** 1rem (16px) for main content containers and sections.
- **Pill (Full):** Used exclusively for small tags, chips, and specific button variants to provide visual variety.

All borders should be 1px or 1.5px—never thick—to maintain a delicate, high-precision appearance.

## Components
- **CTAs:** Primary buttons must use a linear gradient from `#7c3aed` to `#a855f7` (45-degree angle). They feature a `0 0 15px rgba(168, 85, 247, 0.4)` soft glow. On hover, the glow intensity increases and the scale shifts slightly (1.02x).
- **Glass Cards:** Semi-transparent backgrounds with a 1px border of `rgba(168, 85, 247, 0.25)`. Internal padding should be at least 24px.
- **Input Fields:** Darker than the background or slightly more transparent glass. Focus states trigger a 1px `#c084fc` border and a subtle inner violet glow.
- **Chips/Tags:** Pill-shaped with a violet outline and no fill, or a very subtle `rgba(124, 58, 237, 0.1)` fill.
- **Lists:** Separated by low-opacity violet lines (0.1 alpha). Hovering over a list item should trigger a "scan-line" highlight effect—a subtle horizontal gradient of purple.
- **Progress Bars:** Thin (4px) with a glowing `#c084fc` indicator and a trailing gradient effect.