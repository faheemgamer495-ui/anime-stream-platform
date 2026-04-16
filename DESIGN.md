# Design Brief — Anime OTT Streaming Platform (Preview/Live Separation)

## Direction

Netflix Dark Cinema with strict Preview/Live mode separation. Premium OTT streaming with ultra-deep near-black backgrounds, refined card interactions, strategic red accent (#E50914). **Preview Mode**: unmistakable admin badge, visible edit overlays, admin toolbar. **Live Mode**: pure content discovery UI, zero admin indicators. Same dark palette and typography across both modes—only admin chrome differs.

## Tone

Focused, premium, cinematic. Deep backgrounds create immense depth. Red used exclusively for CTAs, active states, and admin indicators. Preview mode feels commanding; Live mode feels clean and content-forward.

## Differentiation

**Preview vs Live**:
- Preview (Admin): Red "PREVIEW" badge top-right (admin-badge class), optional admin toolbar below header (admin-toolbar), edit overlays on cards (edit-overlay), admin context actions visible
- Live (User): Zero admin chrome, badges, or overlays; pure content focus
- **Shared Foundation**: Same Netflix dark palette, typography, motion, spacing across both modes. Visual identity is consistent; only admin affordances change based on context.

## Color Palette

| Token      | OKLCH           | Role                                 |
|------------|-----------------|--------------------------------------|
| background | 0.08 0 0        | Ultra-deep near-black primary surface|
| foreground | 0.98 0 0        | High contrast white text             |
| card       | 0.13 0 0        | Elevated card, subtle lift           |
| primary    | 0.52 0.23 23    | Netflix red #E50914, buttons, accents|
| accent     | 0.52 0.23 23    | Interactive highlights, hover states |
| muted      | 0.18 0.01 0     | Dark grey, secondary surfaces        |
| border     | 0.22 0.01 0     | Subtle separation, improved contrast |

## Typography

- Display: Space Grotesk — bold section headers, hero text, navigation labels (weight 600–700, size 5xl–7xl)
- Body: Satoshi — UI labels, descriptions, form text (weight 400–600, size base–lg)
- Mono: JetBrains Mono — code, admin panels, timestamps (weight 400–500, size sm–base)
- Scale: hero `text-5xl md:text-7xl font-bold`, h2 `text-3xl md:text-4xl font-bold`, label `text-sm font-semibold`, body `text-base`

## Elevation & Depth

Depth through layered background colors and refined shadows. Red glow (`box-shadow: 0 0 24px rgba(229, 9, 20, 0.35)`) applied on featured cards and hover states. Hero shadow inset for dimensional text. Card lift shadow (0 12px 32px) for elevated interactive states.

## Structural Zones

| Zone         | Background      | Treatment                  | Notes                          |
|--------------|-----------------|---------------------------|--------------------------------|
| Header       | card (0.13)     | Border-bottom, transparent | Sticky, minimal elevation      |
| Hero Banner  | muted (0.18)    | Accent stripe + glow       | Featured anime, hero typography|
| Content      | background      | Alternating muted/card     | Spacious 2rem/6rem gaps        |
| Card Sections| card (0.13)     | Hover: scale 1.05 + glow   | Carousel sections w/ smooth scroll|
| Season Selector| card (0.13)  | Active: accent bg + glow   | Tabs or dropdown, smooth transition|
| Episode List | background      | Hover: muted/50 + accent   | Clean rows, left accent border |
| Footer       | muted (0.18)    | Border-top                 | Reduced opacity, minimal info  |

## Spacing & Rhythm

Spacious rhythm with 2rem (32px) gap between major sections, 1rem (16px) horizontal spacing inside carousels. Micro-spacing: 0.5rem inside cards, 0.25rem button padding. Mobile-first with `gap-4 md:gap-6 lg:gap-8`.

## Component Patterns

- **Buttons**: Red primary (`bg-accent text-accent-foreground`), rounded-md, `transition-smooth`, hover `glow-accent-strong`
- **Cards**: `bg-card rounded-md shadow-subtle`, poster image 100% fill, title + rating overlay, `scale-hover` effect
- **Season Tabs**: `px-4 py-2 rounded-md` active `bg-accent` inactive `text-muted-foreground hover:text-foreground`
- **Episode Items**: `hover:bg-muted/50 border-l-2 border-accent pl-4` on hover, smooth transition
- **Hero**: Full-width accent stripe, large bold title, red glow shadow, `text-balance` on subtitle
- **Hero Banner Slider**: Auto-advance every 5s, pause-on-hover, left/right arrow nav (`hero-slider-nav`), dot indicators (`hero-dot-indicator`) with active glow
- **Admin Badge** (Preview only): Red pill-shaped `admin-badge`, top-right header, `glow-accent-strong` shadow, letter-spaced uppercase "PREVIEW"
- **Admin Toolbar** (Preview only): `admin-toolbar` sticky below header, context-sensitive action buttons (`admin-toolbar-action`), secondary grey buttons available
- **Edit Overlay** (Preview only): `edit-overlay` on hover, semi-transparent dark background, red edit/delete buttons
- **Save State Indicators**: Compact pill-shaped badges with icon + text — `save-state-saved` (✓ green), `save-state-saving` (⟳ red pulse), `save-state-error` (✗ destructive). Positioned in form headers or action buttons.
- **Toast Notifications**: Slide in from right (`animate-toast-slide-in`), auto-dismiss 3–5s, colored by type (success green, error red, info accent). Stack vertically on right edge.
- **Episode Player Controls**: Refined horizontal bar at video bottom with gradient overlay, button group (play/pause, full-screen, volume, speed selector). Progress bar with interactive hover state.
- **Episode Sidebar**: Scrollable list of episodes, current episode highlighted with accent left border, smooth hover fade to muted background.

## Motion

- **Entrance**: Cards `animate-fade-in` on load, staggered 0.1s per item; hero banner `animate-fade-cross` (smooth crossfade) on slide transition
- **Hover**: Cards `scale-hover` (1.05 scale, 0.3s ease), red buttons trigger `glow-accent-strong` (0.3s smooth); episode sidebar items fade to muted on hover with accent left border
- **Tab selection**: `animate-scale-in` (0.3s cubic-bezier) with `glow-pulse` for featured items
- **Hero slider**: 5s auto-advance with pause-on-hover; manual arrow nav and dot indicators with `animate-slide-fade-in/out` for arrow feedback; active dot pulses with glow
- **Save state**: `save-state-saving` pulses with `animate-pulse` while persisting; `save-state-saved` fades in green for 2s then auto-dismisses
- **Toast notifications**: Slide in from right with `animate-toast-slide-in`, auto-dismiss after 4s with `animate-toast-slide-out`; stacking vertical on right edge with 0.5s stagger
- **Video player controls**: Gradient bar fades in on hover, controls use `transition-smooth`; progress bar hover state scales height 0.5 → 1.5rem
- **Scroll**: Native smooth scroll on carousels and episode sidebar, no bounce or easing

## Constraints

- Dark theme enforced (0.08–0.18 L range) — no light mode
- Red accent (#E50914, 0.52 0.23 23) only for CTAs, highlights, active states
- No full-page gradients — use layered solid colors or subtle overlays
- All fonts from bundled set — no external CDN
- Mobile-first responsive: `sm:`, `md:`, `lg:` breakpoints, full mobile optimization
- Shadows: subtle (0 2px 8px), card-lift (0 12px 32px), never harsh or glowing
- No neon effects — all red accents use controlled opacity and glow

## Signature Detail

Polished red glow effect on featured cards, buttons, and admin badge—applied with precision to signal interactivity and admin context. Hero banner accent stripe combined with Space Grotesk typography creates cinematic impact. Season selector active state with smooth scale-in animation. Episode list hover highlighting with accent left border creates visual rhythm. **Preview mode distinguishes admin context via unmistakable red badge and toolbar without cluttering Live mode.**

## Performance & Accessibility

- All animations reduced on `prefers-reduced-motion` via Tailwind config
- High contrast text (0.98 foreground on 0.08–0.13 backgrounds) ensures AA+ compliance
- Touch targets minimum 44px on mobile for season tabs and episode items
- Loading states use subtle opacity changes, never jarring spinners
- Color not sole information carrier — use text labels, icons, or borders

## Testing Checklist

✓ Hero banner visual hierarchy and glow effect on 24" desktop + 6" mobile
✓ Card hover scale (1.05) and glow shadow smooth at 60fps
✓ Season selector tabs active/inactive states clear on all device sizes
✓ Episode list hover highlighting responsive and accessible
✓ All red accents consistent (#E50914) across components
✓ Dark backgrounds (0.08–0.18) pass WCAG AA+ contrast with white text (0.98)
✓ Animations respect `prefers-reduced-motion` setting
✓ Mobile responsiveness: hero typography scales, cards stack properly, season selector tabs collapse to dropdown
✓ **Preview Mode**: Red admin badge visible, admin toolbar sticky below header, edit overlays work on cards, no duplicate buttons
✓ **Live Mode**: Zero admin chrome visible, same UI as Preview without badges/toolbar/overlays, content is the focus
