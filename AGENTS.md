# Project Architecture

- Keep post-generation utilities as focused components rendered by `ScriptOutput`; this preserves the input form as script setup only and keeps result-dependent tools unavailable until generation completes.