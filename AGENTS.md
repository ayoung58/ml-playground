## Development

When starting the dev server, use background mode:

```
astro dev --background
```

Manage the background server with `astro dev stop`, `astro dev status`, and `astro dev logs`.

## Documentation

Full documentation: https://docs.astro.build

Consult these guides before working on related tasks:

- [Adding pages, dynamic routes, or middleware](https://docs.astro.build/en/guides/routing/)
- [Working with Astro components](https://docs.astro.build/en/basics/astro-components/)
- [Using React, Vue, Svelte, or other framework components](https://docs.astro.build/en/guides/framework-components/)
- [Adding or managing content](https://docs.astro.build/en/guides/content-collections/)
- [Adding styles or using Tailwind](https://docs.astro.build/en/guides/styling/)
- [Supporting multiple languages](https://docs.astro.build/en/guides/internationalization/)

Project: ML Playground, an interactive CPSC 340 study site.
Stack: Astro Starlight, React islands, TypeScript, MDX, KaTeX, Vitest.

Rules:

- Code in src/lib/ml must be pure TypeScript: no React, no DOM, no randomness without a seeded RNG passed in.
- Algorithms that animate must return a trace (array of step objects), not just a final answer.
- Widgets live in src/components, use function components and hooks, and accept props for dataset and hyperparameters.
- Use CSS variables from Starlight (--sl-color-\*) for colors so widgets work in light and dark mode.
- Canvas drawing must read theme colors at draw time and redraw when the theme changes.
- Prefer small files and explicit types. No new dependencies without asking.
- After changes, run npm run build and npm test and report failures.
- Explain non-obvious math in comments, with the formula in LaTeX.
