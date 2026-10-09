# Project Architecture

- Keep post-generation utilities as focused components rendered by `ScriptOutput`; this preserves the input form as script setup only and keeps result-dependent tools unavailable until generation completes.
- Structure the primary page as a sticky top navigation, hero, idea gallery, and workspace, styled with the Dribbble-inspired semantic design tokens in `index.css`; this keeps navigation stable while supporting RTL, dark mode, and mobile layouts.
- Keep pre-generation starters (hero topic, idea gallery) feeding `ScriptForm` through its `preset` prop instead of duplicating form state.
- Keep the public workspace independent of the auth provider and user-specific history writes; this prevents account state from blocking anonymous generation while preserving existing private records.