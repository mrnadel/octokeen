# UI Rules

## Components
Check `src/components/ui/` before writing inline UI:
- `PageHeader` — sticky header, back button, title, subtitle, icon
- `UserAvatar` — image or initials fallback
- `LeaderboardRow` — rank + avatar + name + XP
- `EmptyState` — icon + title + subtitle + optional CTA
- `ErrorRetry` — error card with retry
- `LoadingSpinner` — centered, with or without card wrapper
- `TabToggle` — multi-button tab switcher with optional badge
- `ProgressBar` — animated fill, auto-coloring
- `AnimatedCounter`, `GameButton`, `HeartDisplay`, `UpgradeGate`, `CoinIcon`, `GlossaryText`

Extract repeated markup into `src/components/ui/` rather than copy-pasting.

## CSS Utilities
Use `globals.css` classes before writing one-off styles:
`card`, `card-hover`, `btn-primary`, `btn-secondary`, `badge-*`, `stat-card`, `progress-bar`

## Modal Gallery
Add every new screen, modal, or overlay to `modal-gallery.html`.
