# Premium warm ivory redesign

## Outcome
Unify the existing ScriptForge AI experience into the premium warm-ivory dashboard already established in the reference commit, without creating a new project or changing product logic.

## Implementation
- Keep the responsive floating sidebar, mobile slide-out navigation, top search and account controls across dashboard pages.
- Convert remaining hardcoded styling to the shared warm-ivory, warm-gray, forest-green, and dark-theme semantic tokens.
- Finish and polish Home, Script Parameters, Script Output, Video Prompt Builder, Settings, Pricing, Auth, Reset Password, Payment Success, Payment Cancel, and 404.
- Preserve generation, attachments, copying, prompt enhancement, history, usage limits, authentication, checkout, bilingual RTL, theme switching, and anchor navigation.
- Keep `/pricing` and `/settings` as direct routes; authenticated settings may still send signed-out visitors to sign-in.
- Complete the pending result downloads so `.txt` and `.md` include the hook, script, and final generated video prompt.

## Validation
- Repair the current syntax errors in Pricing and Settings.
- Run the project’s automated checks through the preview pipeline.
- Verify desktop and mobile layouts, light/dark modes, Arabic RTL, direct page routes, and the signed-in generation flow in the live preview.

## Technical details
- Reuse the existing React/Vite structure and design-system Button component.
- Use semantic CSS variables and Tailwind roles instead of page-level hardcoded colors.
- Keep backend calls, schemas, edge functions, and generated integration files unchanged.
