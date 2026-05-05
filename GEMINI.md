# Global AI Assistant Instructions (GEMINI.md)

## Core Architecture & Ecosystem
- **Framework:** React (Functional Components with Hooks only, except for Error Boundaries).
- **Preferred Frameworks:** Vite, Next.js, and TanStack Start. Default to Vite or TanStack Start for Client-Side Rendered (CSR) applications, and Next.js or TanStack Start for Server-Side Rendered (SSR) applications.
- **SSR Standards:** Always utilize the most modern practices and architectural patterns appropriate for the specific framework in use (e.g., Next.js App Router, TanStack Start's file-based routing).
- **Strict RSC Boundaries:** When using frameworks that support React Server Components (like Next.js), strictly enforce RSC boundaries. Keep pages as Server Components and push the `"use client"` directive to the absolute lowest leaf components possible in the tree.
- **Dependency Inversion:** Always apply dependency inversion on boundaries with external libraries. Wrap third-party tools and APIs in custom adapters or hooks to ensure seamless updates and replacements.
- **Development Environment:** Prefer Storybook for component isolation and UI development. Always use **Component Story Format 3 (CSF3)** with objects and `play` functions for interactions.
- **Package Management:** Infer the package manager (npm, yarn, pnpm) directly from the project's lockfile or `package.json`. 
- **Module Resolution:** Always utilize a standard `node_modules` architecture. Do not use Plug'n'Play (PnP).
- **Client State Management:** Use **Jotai** for shared client state to avoid prop drilling. Default to local `useState` only for strictly isolated component state.
- **URL State as First-Class State:** Leverage URL search parameters (preferring libraries like `nuqs` or TanStack Router's built-in search params) for any shareable, bookmarkable, or refreshable state (e.g., pagination, search filters, tabs) before reaching for component or global state.
- **Server State / Data Fetching:** Use TanStack Query exclusively. 
- **HTTP Client:** Use the built-in `fetch` API or performant, lightweight wrappers. **Do not use Axios.**
- **Data Validation:** Use **Zod** strictly for schema validation at all application borders, specifically user/client (forms/inputs) and client/server (API responses).
- **Ecosystem Preference:** Always look for a TanStack offering first when needing tools like routing or form management (e.g., TanStack Router, TanStack Form).

## 1. Functional Programming & Control Flow
- **Immutability First:** Never mutate state, props, or data structures directly. Always return new references.
- **Jotai State Philosophy:** Leverage Jotai's atomic model. Build complex state by composing smaller atoms together into derived atoms (pure functions).
- **Data Access (Selectors):** When reading data from an API, components and functions must *never* access the required values directly. Exclusively extract values using selector functions (pure functions that safely path to the exact key in the object and return the value if it exists).
- **Pure Functions:** Write deterministic utility functions without side effects.
- **Early Returns:** Aggressively use early returns (guard clauses) to prevent deep nesting and improve readability.
- **Code Reuse:** Prioritize code reuse wherever it makes logical sense. Extract shared logic into custom hooks, pure utilities, or generic components to keep code DRY.
- **No Imperative Patterns:** Avoid `for` loops, `let` mutations, and imperative state updates. 
- **No Object-Oriented Patterns:** Do not use `class` structures (except for React Error Boundaries). Stick entirely to pure functions, hooks, and composition.
- **Function Style:** Always use arrow functions. Never use standard `function` declarations.
- **NO Switch Statements:** Do not use `switch` statements. Prefer object literals (lookup tables/maps) or `if`/`else if` branching.
- **useEffect Usage:** Treat useEffect as an absolute last resort. Never use it for data fetching or state synchronization. It should only be used to synchronize React with external, non-React systems (e.g., observing a DOM node resize).

## 2. Directory Architecture & File Structure
- **Source Directory:** All application code must reside within a `src` directory.
- **Top-Level Grouping:** Inside `src`, maintain sibling directories for `constants`, `components`, `hooks`, `hocs`, `selectors`, and `utils`. This list can expand or contract as needed depending on application needs.
- **Feature-Based Components:** Group components by feature (e.g., `src/components/auth`). Components shared across multiple features must be placed in `src/components/shared`.
- **Strict Colocation (Folders per Item):** Every individual component, hook, HOC, and selector must have its own dedicated folder matching its name (e.g., `src/selectors/get-user/get-user.ts` and `src/selectors/get-user/get-user.test.ts`). Test files and Storybook files must live alongside the implementation inside this folder.
- **Helper Isolation:** - **Global Test Utilities:** Any custom testing utilities, generic mock generators, or Vitest setups must live strictly in `src/test-utils`. 
    - **Storybook Tooling:** Storybook-specific tooling (decorators, global parameters, theme wrappers) must reside exclusively in the top-level `.storybook` directory. Do not blend these with feature components.
- **Utility Scoping:**
    - **Global Utils:** Utilities used across multiple features go in `src/utils/`.
    - **Feature-Scoped Utils:** Utilities specific to a feature go into a dedicated file inside that feature's directory (e.g., `src/components/[feature]/utils.ts`).
    - **Component-Scoped Utils:** If a utility is *only* used by a single component, it must be defined directly inside that component's file.
- **Naming Conventions:** Always use `kebab-case` for files and folders. React Components are named in `PascalCase`. Functions are named in `camelCase`.
- **Constants/Enums:** While TS `enum`s are banned, any constant objects acting as enums (using `as const`) must be named in `PascalCase`.
- **Test-Only Exports:** Anything exported strictly for testing purposes must be prefixed with two underscores (e.g., `export const __helperFunction`).
- **No Barrel Files:** Absolutely avoid barrel files (e.g., `index.ts` files whose sole purpose is to re-export other modules). Always write direct, explicit imports to the specific file. This prevents circular dependencies, maximizes tree-shaking efficiency, and improves the TypeScript compiler's performance.

## 3. Exports & Component Rules
- **Named Exports Only:** **Do not use default exports anywhere.** Always use named exports (`export const MyComponent = ...`).
- **Prop Destructuring:** Always destructure props directly in the component's function signature (e.g., `const MyComponent = ({ title, isActive }: Props) => ...`).
- **Component Types:** Always use functional components written as arrow functions. The *only* exception allowed is when writing a React Error Boundary, which requires a class component.
- **Rules of Hooks:** The React Rules of Hooks must be guaranteed to *never* be broken. Hooks must only be called at the top level of a functional component or custom hook.

## 4. TypeScript Standards & High-Performance Types
- **Split Configurations:** Utilize split `tsconfig` architectures (e.g., `tsconfig.app.json`, `tsconfig.node.json`, `tsconfig.test.json`, `tsconfig.storybook.json`) referenced by a root `tsconfig.json`, rather than a single monolithic file.
- **Modern Web Strictness:** Configurations must be geared for modern web development (e.g., `"moduleResolution": "bundler"`, `"isolatedModules": true`, modern ES targets) and set to maximum strictness.
- **Strict Typing:** Adhere strictly to TS compiler checks. 
- **NO Enums:** Absolutely avoid the TypeScript `enum` keyword. Use string/number literal union types or constant objects with `as const` instead.
- **Avoid Type Casting:** Do not force types (e.g., `as unknown as T`). Rely on type guards and narrowing. Casting is only acceptable as an absolute last resort if avoiding it requires a massive refactor.
- **Restricted Use of `any`:** Never use the `any` type in production-facing code. It is only permissible in test files or Storybook files.
- **Generic Constraints:** Never leave generic parameters unbounded (`<T>`). Always constrain them (e.g., `<T extends BaseInterface>`) to limit the compiler's search space and optimize `tsserver` responsiveness.
- **Limit Type Complexity:** Strictly avoid infinitely recursive mapped types or extreme template literal type generation, as these severely degrade IDE and compiler performance.
- **Monomorphic Intent:** Design generic utilities and functions to accept and process predictable, consistent object structures. Avoid highly polymorphic patterns that force JavaScript engines (like V8) to de-optimize execution paths due to varying hidden classes.
- **Simplicity over Smart Types:** Do not use a generic if a simpler union type or concrete interface provides the same level of type safety.
- **Interfaces over Types:** Prefer interface for defining object shapes to maximize compiler caching and performance, reserving type aliases strictly for unions, primitives, and mapped types.
- **Explicit Return Types:** Always explicitly define return types for functions, custom hooks, and React components to prevent the compiler from performing expensive, deep Abstract Syntax Tree (AST) inferences.
- **Type-Only Imports:** Always utilize import type and export type when passing TypeScript definitions across boundaries to guarantee safe, zero-cost erasure during compilation.
- **Skip Lib Check:** Always ensure `"skipLibCheck": true` is explicitly set in all `tsconfig.json` files. The compiler must not waste CPU cycles type-checking third-party `node_modules`.

## 5. Security & Error Handling
- **XSS Prevention:** Absolutely **never** use `dangerouslySetInnerHTML`. There are no exceptions to this rule.
- **Result Objects over Try/Catch:** Whenever possible, avoid `try/catch` blocks. Return result objects or tuples instead (e.g., `const { data, error } = await performAction()`).
- **Error Boundaries:** Do not blindly assume an error boundary exists. Reuse an existing one if applicable, or create one if the component tree requires it.

## 6. Styling, UI & Accessibility
- **Styling:** Use Tailwind CSS **v4 or greater** exclusively. Assume Tailwind v4 architectures. Do not generate or modify `tailwind.config.js` files. All theme customizations must be executed via CSS variables and the `@theme` block in the main stylesheet.
- **8-Point Grid:** Strictly adhere to an 8-point grid system for all layout dimensions, spacing (margins/padding), and sizing.
- **Dynamic Classes:** Always leverage `clsx` and `tailwind-merge` (typically via a `cn()` utility function) for conditionally joining Tailwind classes. Never use standard JavaScript template literals for class manipulation to avoid specificity conflicts.
- **Component Library:** Leverage `shadcn/ui` for components, taking advantage of their built-in accessibility base classes and Radix UI primitives.
- **Accessibility (a11y) First:** Prioritize accessibility best practices in all markup. Ensure proper ARIA attributes, keyboard navigability, semantic HTML, and screen reader support.
- **Empty & Error States:** Never assume the "happy path." Always design and implement high-quality, illustrative Empty States with clear Calls to Action (CTAs) for any data-driven UI that might return empty. Provide clear, human-readable error states for failed mutations or queries.
- **Destructive Actions:** Never bind a destructive action (e.g., deleting a planned meal or clearing a shopping list) to a single, unprompted click. Always implement a confirmation mechanism, such as an `AlertDialog` or a toast with an "Undo" action.
- **Focus Management:** Never use Tailwind's `outline-none` to hide focus rings without immediately replacing them with a custom, highly visible focus state (e.g., `focus-visible:ring-2 focus-visible:ring-primary`). Keyboard focus must always be immediately discernible.
- **No Disabled Buttons:** Never use the `disabled` attribute on buttons to prevent user action (such as submitting an incomplete form). Always leave buttons clickable and rely on immediate, visible validation errors upon interaction to guide the user.
- **UX Principles:**
    - **Jakob's Law:** Rely strictly on established standard UI patterns. Do not invent novel navigation structures or unfamiliar interaction paradigms.
    - **Hick's Law:** Aggressively minimize cognitive load. Employ progressive disclosure for secondary actions instead of crowding the screen. Keep layouts minimalist and purposeful.
    - **Fitts's Law:** Enforce large, easily clickable touch targets (minimum 44x44px) for all interactive elements. Group related actions logically with distinct spacing to prevent misclicks.
    - **Doherty Threshold:** The UI must provide immediate feedback. Default to optimistic UI updates for mutations via TanStack Query, and aggressively utilize skeleton loaders or instant visual states for actions taking longer than 400ms.
- **Strict Media Accessibility:** All images must include meaningful, descriptive `alt` attributes. Use empty `alt=""` strictly and exclusively for purely decorative images. 
- **Semantic Landmarks:** Do not rely on generic `<div>` tags for structural layout. Always use native HTML5 semantic landmarks (`<header>`, `<nav>`, `<main>`, `<article>`, `<aside>`, `<footer>`) to construct a proper document outline for screen readers.
- **Motion & Preferences:** Respect system-level accessibility preferences. Ensure any CSS transitions or animations utilize Tailwind's `motion-safe:` modifiers or respect `prefers-reduced-motion` media queries natively.
- **Color Contrast:** Ensure all text and interactive elements meet or exceed WCAG AA minimum contrast ratios (4.5:1 for normal text).
- **UI Abstraction Boundary (Proxy Pattern):** To preserve custom modifications during CLI updates, treat `src/components/ui/` strictly as a machine-owned directory. Never manually modify the files generated by `shadcn/ui`. Create a proxy layer (e.g., `src/components/design-system/`) that imports the base `shadcn` components and extends them with custom variants, styling, or logic. The rest of the application must exclusively consume components from the custom `design-system` directory, never directly from the `ui/` directory.
- **Component Variants:** Strictly utilize `class-variance-authority` (`cva`) for managing component UI variations, states, and dynamic class merging. Do not manually concatenate strings or use complex ternary operators for variant logic within the JSX payload.

## 7. Performance, Build & Tooling Optimization
- **Tooling Speed Priority:** Prioritize absolute execution speed across all tooling configurations. Vite builds, TypeScript compilation, Biome linting, and Vitest execution must be optimized for minimal latency. Avoid heavy plugins, redundant checks, or configurations that introduce unnecessary overhead.
- **Lazy Loading:** Aggressively utilize React's `lazy` and `Suspense` for route-level components and heavy below-the-fold UI elements.
- **Code Splitting:** Ensure proper chunking in the Vite build. Separate vendor libraries from application code to optimize client-side loading.
- **Caching Strategies:** Leverage content hashing for static assets in Vite configurations or similar build tooling to maximize browser caching efficiency.
- **Compression:** Prioritize modern compression choices (like Brotli over Gzip) for build outputs when configuring server or Vite plugin delivery.
- **Vite SWC:** For React applications leveraging Vite, strictly utilize the `@vitejs/plugin-react-swc` plugin rather than the standard Babel-based React plugin to maximize Hot Module Replacement (HMR) speeds.
- **Storybook Builder:** Always configure Storybook to use the Vite builder (`@storybook/builder-vite` or the corresponding Vite-based framework adapter) instead of Webpack. Storybook must utilize the same high-performance `esbuild` pipeline as the main application.
- **Image Optimization:** Treat media as the primary performance bottleneck. Always enforce explicit `width` and `height` attributes on image tags to prevent Cumulative Layout Shift (CLS). Default to native `loading="lazy"` and `decoding="async"` for all below-the-fold media.
- **Core Web Vitals:** Architect the UI to protect Core Web Vitals. Avoid dynamic content injections above the fold that cause layout shifts, and ensure the Largest Contentful Paint (LCP) element is prioritized and never lazy-loaded.
- **Tree-Shaking & Imports:** Maintain strict import hygiene. Only import specific icons or utility functions directly from their respective paths (e.g., specific Lucide icons) rather than importing entire libraries, ensuring maximum tree-shaking efficiency.

## 8. Linting & Formatting
- **Biome Exclusivity:** Do not suggest, generate, or assume the use of ESLint, Prettier, or their respective configuration files. Assume standard Biome rules apply. 

## 9. Testing & Automation
- **Unit/Integration Framework:** Use Vitest (`describe`, `it`, `expect`, `vi`). Do not use Jest.
- **Strict Production Boundary:** Absolutely never write test-specific or Storybook-specific logic inside production code (e.g., no conditional rendering based on `process.env.NODE_ENV === 'test'`). Production code must remain entirely agnostic of the environments testing or documenting it.
- **E2E Automation:** Use **Playwright** exclusively for end-to-end testing and browser automation.
- **Coverage Goal:** Write comprehensive tests to shoot for **100% test coverage**.
- **Performance/Mocking Rules:** Avoid heavy module mocking (`vi.mock()`) to prevent Vitest cache invalidation and performance bottlenecks.
    - Test pure functions directly without mocks.
    - Use Mock Service Worker (MSW) to mock the network layer instead of mocking the HTTP client.
    - If you must verify a call, use `vi.spyOn()` and ensure it is restored, rather than destroying the module graph.
- **Surgical UI Mocking (Project Standard):** To prevent OOM and maintain performance, all shared UI primitives in `src/components/ui/` MUST be globally mocked in `src/test-utils/setup.tsx`. These mocks should be minimal functional implementations (e.g., rendering native HTML elements).
- **Component Rendering:** By default, do not globally or locally mock child UI components (including `shadcn/ui`). Allow them to render so React Testing Library can properly evaluate their ARIA roles and accessibility states. However, **mocking is permitted** (and encouraged) for heavy, third-party, or state-complex `design-system` components (e.g., Modals, Sheets, Comboboxes) if it prevents significant performance degradation or Out-Of-Memory (OOM) issues during test execution. Prefer global mocks in `src/test-utils/setup.ts` for consistency.
- **React Testing Library:** Test user behavior and accessibility, not implementation details. Query by ARIA roles and text content over generic test IDs.
- **Environment Scoping:** Execute pure function and utility tests in the default Node environment. Reserve heavy DOM environments (happy-dom or jsdom) exclusively for React component files, utilizing in-file pragma comments (e.g., // <!-- Import failed: vitest-environment - ENOENT: no such file or directory, access '/users/hosley/.gemini/vitest-environment' --> happy-dom) or workspace configurations.
- **Concurrent Execution:** Utilize describe.concurrent or test.concurrent for pure function and selector tests to run them simultaneously in the same thread, bypassing Vitest's standard worker overhead.
- **Design System Regression Safety Net:** All proxy components within `src/components/design-system/` must be rigorously tested using React Testing Library to verify structural integrity, ARIA roles, and correct prop forwarding. Because the underlying `src/components/ui/` files are machine-updated and frequently overwritten, these specific tests must act as a strict regression safety net to instantly detect if an upstream CLI update introduces breaking changes to the DOM structure, accessibility states, or API contracts.

## 10. CI/CD, Git & Versioning
- **Branching Model:** Strictly utilize trunk-based development. 
- **Healthchecks:** GitHub Actions PR healthcheck workflows must invariably run `build`, `lint`, and `test` commands.
- **Versioning:** Always follow Semantic Versioning (SemVer).
- **Automated Releases:** Every commit merged or pushed to the `main` branch must automatically bump the version and add to the `CHANGELOG`. 
- **Infinite Loop Prevention:** Pushes made to `main` directly from a CI job (e.g., the commit that actually updates the `CHANGELOG` and version number) must be configured to bypass CI triggers to prevent infinite workflow loops.
- **Deployment Initialization Prompts:** When asked to configure Storybook, proactively ask if a GitHub Action should be set up to deploy the Storybook instance to GitHub Pages. Additionally, inquire if a deployment pipeline should be built out for the main application (e.g., the Vite CSR app, Next.js, or TanStack Start app).

## 11. Documentation & Architecture
- **Singular Source of Truth:** Maintain a singular `README.md` at the project root that contains any and all information about the given project. Actively maintain and update this file as the project evolves.
- **Decision Tracking:** Explicitly document all architectural, tooling, and structural decisions within the `README.md` so they can be referenced later. Reference these established decisions when writing or modifying code.
- **Visual Documentation:** Leverage Mermaid diagrams regularly within the `README.md` and other markdown files to visually map out architecture, state flows, dependency graphs, and component hierarchies.
- **Keep Comments Brief:** Comments should be concise and only explain *why* something is happening, not *what* is happening. Do not comment obvious code.
- **Syntax:** Use standard double-slash `//` comments for inline notes.
- **JSDoc:** Only use full JSDoc comments (`/** */`) for complex, non-obvious utility functions, types, or APIs that require explicit documentation.

## 12. AI Persona & Output Formatting
- **No Fluff:** Do not apologize, do not use conversational pleasantries, and do not explain basic React/programming concepts unless explicitly asked. Be concise and direct.
- **No Placeholders:** Never use placeholders like `// ... existing code` or `/* rest of function */`. When modifying a component or function, output the complete, valid, copy-pasteable code block.
- **Strict Imports:** Always include all necessary import statements at the top of generated code blocks.
- **Dependency Gatekeeping:** Rely strictly on the tools defined in this document. Do not suggest or introduce new npm packages or third-party libraries without explicitly asking for permission first.
- **Code First:** Prioritize outputting the code. Place any necessary brief explanations *after* the code blocks, not before.
- **Verification Step:** Before outputting code, silently verify it against the strict bans in this document (e.g., no default exports, no enums, no switch statements, no Axios, no any in production). Do not output code that violates these constraints.
