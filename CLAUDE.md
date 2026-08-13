# Facility Tracker, project standards

These rules govern every file in this repository. Read this file before writing code.

## Architecture

- Feature-based structure. Features live in `src/app/features/{feature}/`.
- Each feature is internally organised as:
  ```
  data-access/   repositories, DTOs, mappers, stores
  models/        domain models, enums, view models
  feature-*/     routed container components (feature-list, feature-detail, feature-edit)
  ui/            presentational components, zero injected services
  util/          pure functions, validators
  ```
- `core/` holds app-wide singletons: interceptors, notification service, guards.
- `shared/` holds cross-feature primitives: shared models, shared UI.

## Layering rules (non-negotiable)

- Components NEVER call HttpClient. Only repositories do.
- Repositories NEVER show toasts, log, or navigate. They return data or throw typed errors.
- Containers (feature-\*) own state and orchestration. They may inject services.
- Presentational components (ui/) take `input()` and emit `output()`. They inject nothing.
- Mappers are pure functions. DTO in, domain model out. No side effects.

## SOLID as applied here

- SRP: one file, one reason to change. A component renders; a service decides; a mapper maps.
- DIP: components depend on the abstract `FacilityRepository`, never a concrete class.
- ISP: component inputs are narrow. Pass `latitude`/`longitude`, not a whole `Facility`,
  when that is all the component needs.
- Do not invent inheritance hierarchies to demonstrate LSP or OCP. Abstraction must earn
  its place.

## Angular conventions

Targeting Angular 22. Where the framework already enforces something by default, rely on the
default rather than restating it. Redundant boilerplate is noise, not rigour.

- Standalone components only. No NgModules. Do NOT write `standalone: true`, it is the default.
- Change detection is OnPush. Do NOT write `changeDetection: ChangeDetectionStrategy.OnPush`,
  it is the default from v22 and repeating it adds an import and a line that mean nothing.
  The obligation is to write components that are correct under OnPush: signals or immutable
  inputs, never mutation of an object a template already holds.
- The application is zoneless. Never rely on zone patching to trigger a render.
- Signals for state. `computed()` for derived state. `linkedSignal()` when derived state must
  stay writable.
- `input()` / `output()` functions, never the decorators. `model()` for two-way binding
  instead of pairing an input with an output.
- `inject()` for dependency injection, not constructor parameters.
- Host bindings go in the `host` object of the decorator. No `@HostBinding` or `@HostListener`.
- Typed reactive forms. `nonNullable: true` on controls. Declare the `FormGroup` generic
  explicitly rather than relying on `FormBuilder` inference.
- Lazy-loaded routes via `loadComponent` / `loadChildren`.
- Use the modern control flow: `@if`, `@for`, `@switch`. Never `*ngIf` or `*ngFor`.
- `class` and `style` bindings, never `ngClass` or `ngStyle`.
- Prefer inline templates and styles for components under roughly 30 lines of template.
  Use external files above that, with paths relative to the component TS file.

## Accessibility

- Must pass AXE checks and meet WCAG AA: focus management, colour contrast, ARIA.
- Every interactive element is reachable and operable by keyboard, with a visible focus ring.
- Respect `prefers-reduced-motion`.

## Naming

File names announce their layer:
`*.repository.ts`, `*.mapper.ts`, `*.store.ts`, `*.validator.ts`, `*.dto.ts`,
`*.model.ts`, `*.routes.ts`, `*.interceptor.ts`, `*.guard.ts`
Named exports only. No default exports.

## File size limits

- Component class body: under 60 lines
- Service / store: under 60 lines
- Mapper / validator / util: under 25 lines

If something exceeds this, split it.

## Code quality

- No `console.log` or `debugger` in committed code.
- No commented-out code.
- No magic numbers or strings. Extract named constants.
- No `any`. Use `unknown` and narrow if genuinely needed.
- Explicit names over short ones.

## User-facing copy

Applies to labels, placeholders, buttons, toasts, empty states, error messages, README.

- Never use em dashes or en dashes. Use a comma, a conjunction, or two sentences.
- Sentence case for labels and buttons.
- Buttons say what happens: "Save changes", not "Submit".
- An action keeps its name through the flow: "Save changes" produces "Changes saved".
- Errors state what went wrong and what to do next. They do not apologise and are never vague.
- Empty states invite an action rather than just reporting nothing was found.
- No filler helper text. If a hint is not actionable, delete it.
