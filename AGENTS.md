# Project Architecture

- Keep post-generation utilities as focused components rendered by `ScriptOutput`; this preserves the input form as script setup only and keeps result-dependent tools unavailable until generation completes.
- Structure the primary workspace as a responsive sidebar shell with semantic design tokens; this keeps navigation stable while supporting RTL and mobile layouts.
- Keep the public workspace independent of the auth provider and user-specific history writes; this prevents account state from blocking anonymous generation while preserving existing private records.