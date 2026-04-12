# Design Brief

## Direction

Netflix Dark Cinema — Premium OTT streaming platform with cinematic dark theme, bold red accent for CTAs, and smooth interactive animations.

## Tone

Focused, premium, cinematic. Deep near-black backgrounds with minimal card elevation and red used sparingly for maximum impact.

## Differentiation

Smooth card scale animations (1.05x) on hover with red glow overlay. Hero banner with red accent stripe underline. Glass-morphic text overlays on carousels. Clean typographic hierarchy with modern geometric sans-serif.

## Color Palette

| Token      | OKLCH           | Role                                 |
|------------|-----------------|--------------------------------------|
| background | 0.10 0 0        | Deep near-black, primary surface     |
| foreground | 0.95 0 0        | High contrast white text             |
| card       | 0.15 0 0        | Elevated card, image containers      |
| primary    | 0.52 0.23 23    | Netflix red #E50914, buttons, accents|
| accent     | 0.52 0.23 23    | Interactive highlights, hover states |
| muted      | 0.20 0.01 0     | Dark grey, secondary surfaces        |

## Typography

- Display: Space Grotesk — bold section headers, hero text, navigation labels
- Body: Satoshi — UI labels, descriptions, form text
- Mono: JetBrains Mono — code, admin panels, timestamps
- Scale: hero `text-5xl md:text-7xl font-bold`, h2 `text-3xl md:text-4xl font-bold`, label `text-sm font-semibold`, body `text-base`

## Elevation & Depth

No prominent shadows — depth through background color layers, transparency, and card hover effects. Red glow (`box-shadow: 0 0 20px rgba(229, 9, 20, 0.3)`) applied on featured cards and interactive hover states.

## Structural Zones

| Zone         | Background      | Border           | Notes                          |
|--------------|-----------------|------------------|--------------------------------|
| Header       | card (0.15)     | border (0.25)    | Subtle top border, transparent |
| Hero Banner  | muted (0.20)    | accent stripe    | Red stripe beneath title       |
| Content      | background      | —                | Alternating muted/background   |
| Card Sections| card (0.15)     | —                | Hover: scale 1.05 + glow       |
| Footer       | muted (0.20)    | border (0.25)    | Top border, reduced text size  |

## Spacing & Rhythm

Spacious rhythm with 2rem (32px) gap between sections. Cards within carousels use 1rem (16px) horizontal spacing. Micro-spacing: 0.5rem inside cards, 0.25rem button padding. Mobile-first with `gap-4 md:gap-6 lg:gap-8`.

## Component Patterns

- Buttons: Red primary (`bg-accent`), white text, rounded-md, `transition-smooth`, hover scale slight shadow `shadow-accent-glow`
- Cards: `bg-card rounded-md`, poster image 100% fill, title + rating overlay bottom, scale-hover effect
- Badges: `bg-muted text-foreground rounded-full px-3 py-1 text-sm`, no shadow
- Hero: Full-width gradient background (charcoal to muted), red accent stripe, large bold title, subtitle

## Motion

- Entrance: Cards fade-in `animate-fade-in` on load, staggered 0.1s per item
- Hover: All interactive elements use `scale-hover` (1.05 scale, 0.3s ease), red buttons trigger `glow-accent`
- Decorative: Carousel scroll smooth native, no bounce

## Constraints

- Dark theme enforced — no light mode toggle
- Red accent (#E50914 OKLCH 0.52 0.23 23) only for CTAs, highlights, active states
- No gradients on backgrounds — use layered solid colors
- All fonts from bundled set: no external CDN imports
- Mobile-first responsive layout with `sm:`, `md:`, `lg:` breakpoints

## Signature Detail

Red accent glow on featured anime cards and action buttons — instantly recognizable as the Netflix red, applied with restraint to drive attention without overwhelming the dark interface.
