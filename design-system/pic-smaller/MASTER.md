# Design System Master File

> **LOGIC:** When building a specific page, first check `design-system/pages/[page-name].md`.
> If that file exists, its rules **override** this Master file.
> If not, strictly follow the rules below.

---

**Project:** Pic Smaller
**Generated:** 2026-08-06 19:02:31
**Category:** Link-in-Bio Page Builder
**Design Dials:** Variance 6/10 (Balanced / Modern) | Motion 4/10 (Standard) | Density 5/10 (Standard)

---

## Global Rules

### Color Palette

| Role | Hex | CSS Variable |
|------|-----|--------------|
| Brand | `#172033` | `--color-primary` |
| On Primary | `#FFFFFF` | `--color-on-primary` |
| Action | `#007A60` | `--color-secondary` |
| Action Hover | `#006B54` | `--color-secondary-hover` |
| Action Soft | `#E8F5F1` | `--color-action-soft` |
| Surface | `#FFFFFF` | `--color-surface` |
| Subtle Surface | `#F5F7FA` | `--color-surface-subtle` |
| Muted Surface | `#EEF2F6` | `--color-surface-muted` |
| Foreground | `#172033` | `--color-foreground` |
| Muted Text | `#64748B` | `--color-text-muted` |
| Border | `#D5DDE7` | `--color-border` |
| Strong Border | `#9CABBC` | `--color-border-strong` |
| Success | `#15803D` | `--color-success` |
| Warning | `#9A6700` | `--color-warning` |
| Destructive | `#C2414B` | `--color-destructive` |

**Color Notes:** Match the PicSmaller desktop product: ink identifies the brand, deep green is the only interactive/CTA color, amber is reserved for warnings, and red for destructive states. Neutral surfaces and borders must use their semantic variables instead of ad hoc hex values.

### Typography

- **Heading Font:** Libre Bodoni
- **Body Font:** Public Sans
- **Mood:** magazine, editorial, publishing, refined, journalism, print
- **Google Fonts:** [Libre Bodoni + Public Sans](https://fonts.googleapis.com/css2?family=Libre+Bodoni:wght@400;500;600;700&family=Public+Sans:wght@300;400;500;600;700&display=swap)

**CSS Import:**
```css
@import url('https://fonts.googleapis.com/css2?family=Libre+Bodoni:wght@400;500;600;700&family=Public+Sans:wght@300;400;500;600;700&display=swap');
```

### Spacing Variables

*Density: 5/10 — Standard*

| Token | Value | Usage |
|-------|-------|-------|
| `--space-xs` | `4px` / `0.25rem` | Tight gaps |
| `--space-sm` | `8px` / `0.5rem` | Icon gaps, inline spacing |
| `--space-md` | `16px` / `1rem` | Standard padding |
| `--space-lg` | `24px` / `1.5rem` | Section padding |
| `--space-xl` | `32px` / `2rem` | Large gaps |
| `--space-2xl` | `48px` / `3rem` | Section margins |
| `--space-3xl` | `64px` / `4rem` | Hero padding |

### Shadow Depths

| Level | Value | Usage |
|-------|-------|-------|
| `--shadow-sm` | `0 1px 2px rgba(0,0,0,0.05)` | Subtle lift |
| `--shadow-md` | `0 4px 6px rgba(0,0,0,0.1)` | Cards, buttons |
| `--shadow-lg` | `0 10px 15px rgba(0,0,0,0.1)` | Modals, dropdowns |
| `--shadow-xl` | `0 20px 25px rgba(0,0,0,0.15)` | Hero images, featured cards |

---

## Component Specs

### Buttons

```css
/* Primary Button */
.btn-primary {
  background: var(--color-secondary);
  color: white;
  padding: 12px 24px;
  border-radius: 8px;
  font-weight: 600;
  transition: all 200ms ease;
  cursor: pointer;
}

.btn-primary:hover {
  opacity: 0.9;
  transform: translateY(-1px);
}

/* Secondary Button */
.btn-secondary {
  background: transparent;
  color: var(--color-primary);
  border: 1px solid var(--color-border);
  padding: 12px 24px;
  border-radius: 8px;
  font-weight: 600;
  transition: all 200ms ease;
  cursor: pointer;
}
```

### Cards

```css
.card {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: 8px;
  padding: 24px;
  box-shadow: var(--shadow-md);
  transition: all 200ms ease;
  cursor: pointer;
}

.card:hover {
  box-shadow: var(--shadow-lg);
  transform: translateY(-2px);
}
```

### Inputs

```css
.input {
  padding: 12px 16px;
  border: 1px solid var(--color-border);
  border-radius: 6px;
  font-size: 16px;
  transition: border-color 200ms ease;
}

.input:focus {
  border-color: var(--color-secondary);
  outline: none;
  box-shadow: 0 0 0 3px var(--color-action-soft);
}
```

### Modals

```css
.modal-overlay {
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(4px);
}

.modal {
  background: white;
  border-radius: 16px;
  padding: 32px;
  box-shadow: var(--shadow-xl);
  max-width: 500px;
  width: 90%;
}
```

---

## Style Guidelines

**Style:** Interactive Product Demo

**Keywords:** Embedded product mockup/video, interactive elements, product walkthrough, step-by-step guides, hover-to-reveal features, embedded demos

**Best For:** SaaS platforms, tool/software products, productivity apps landing pages, developer tools, productivity software

**Key Effects:** Product animation playback, step progression animations, hover reveal effects, smooth zoom on interaction

### Page Pattern

**Pattern Name:** Comparison Table + CTA

- **Conversion Strategy:** Use comparison to show unique value. Highlight your product row. Include 'free trial' in pricing row.
- **CTA Placement:** Table: Right column. CTA: Below table
- **Section Order:** 1. Hero, 2. Problem intro, 3. Comparison table (product vs competitors), 4. Pricing (optional), 5. CTA

---

## Motion

**Page Transition** (Standard) — Trigger: route change | Duration: 400-600ms | Easing: `power2.inOut`

```js
const tl = gsap.timeline(); tl.to('.transition-overlay', { yPercent: 0, duration: 0.4, ease: 'power2.inOut' }).call(navigate).to('.transition-overlay', { yPercent: -100, duration: 0.4, ease: 'power2.inOut', delay: 0.1 });
```

**Framework notes:** Keep the overlay element mounted at the layout root (outside the page component) so it survives the route swap

- ✅ Show a lightweight loading indicator if the destination route's data fetch outlasts the overlay
- ❌ Don't tie the overlay's reveal directly to data-fetch completion without a max-wait timeout; a slow API stalls the whole transition
- ⚡ Prefer CSS transform (yPercent) over top/left to keep the overlay animation on the compositor thread

---

## Anti-Patterns (Do NOT Use)

- ❌ Muted colors
- ❌ Low energy

### Additional Forbidden Patterns

- ❌ **Emojis as icons** — Use SVG icons (Heroicons, Lucide, Simple Icons)
- ❌ **Missing cursor:pointer** — All clickable elements must have cursor:pointer
- ❌ **Layout-shifting hovers** — Avoid scale transforms that shift layout
- ❌ **Low contrast text** — Maintain 4.5:1 minimum contrast ratio
- ❌ **Instant state changes** — Always use transitions (150-300ms)
- ❌ **Invisible focus states** — Focus states must be visible for a11y

---

## Pre-Delivery Checklist

Before delivering any UI code, verify:

- [ ] No emojis used as icons (use SVG instead)
- [ ] All icons from consistent icon set (Heroicons/Lucide)
- [ ] `cursor-pointer` on all clickable elements
- [ ] Hover states with smooth transitions (150-300ms)
- [ ] Light mode: text contrast 4.5:1 minimum
- [ ] Focus states visible for keyboard navigation
- [ ] `prefers-reduced-motion` respected
- [ ] Responsive: 375px, 768px, 1024px, 1440px
- [ ] No content hidden behind fixed navbars
- [ ] No horizontal scroll on mobile
