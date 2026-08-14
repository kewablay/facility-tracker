# Facility Tracker

### Live application: **[facility-tracker-phi.vercel.app](https://facility-tracker-phi.vercel.app/)**

A register of monitored infrastructure. Facility Tracker lists the facilities on a network,
filters and pages through them, opens any one of them on a detail screen with its position on a
map, and edits its record in place.

The application is built with Angular 22 in standalone, zoneless mode, using signals for state
and a repository abstraction that keeps the user interface independent of the data source.

## Features

- Searchable, filterable and paginated facility register
- Filter state held in the URL, so any view can be refreshed, bookmarked or shared
- Detail screen with an OpenLayers map centred on the facility
- Edit dialog with a typed reactive form, field level validation and toast confirmation
- Distinct loading, empty, error and not found states on every screen
- Responsive layouts, with the table collapsing into stacked cards on small screens
- Keyboard and screen reader support throughout

## Tech stack

| Concern       | Choice                                             |
| ------------- | -------------------------------------------------- |
| Framework     | Angular 22 (standalone, zoneless, signals)         |
| Language      | TypeScript 6                                       |
| UI components | PrimeNG 22 with a custom `@primeuix/themes` preset |
| Mapping       | OpenLayers 10 with OpenStreetMap tiles             |
| Testing       | Vitest with jsdom                                  |
| Tooling       | ESLint (flat config), Prettier, husky, lint-staged |

## Deployment

The application is deployed to Vercel at
[facility-tracker-phi.vercel.app](https://facility-tracker-phi.vercel.app/), built from
`npm run build` and served as a single page application, so any address can be opened directly
or shared.

The hosted instance runs the same in-memory repository as local development, which means the
data resets on reload and the failure simulations described below are available there too.

## Getting started

### Prerequisites

Node.js 20.19 or newer, and npm.

### Installation

```bash
npm install
```

### Running

```bash
npm start
```

The development server runs at `http://localhost:4200/` and opens on the facility register.

### Scripts

| Script                 | Description                                    |
| ---------------------- | ---------------------------------------------- |
| `npm start`            | Development server with hot module replacement |
| `npm run build`        | Production build, output in `dist/`            |
| `npm run watch`        | Development build in watch mode                |
| `npm test`             | Unit tests                                     |
| `npm run lint`         | Lint TypeScript sources and templates          |
| `npm run lint:fix`     | Lint and apply fixable corrections             |
| `npm run format`       | Format the workspace with Prettier             |
| `npm run format:check` | Verify formatting without writing              |

## Configuration

Environment values live in `src/environments/environment.ts`.

PrimeNG 22 is a commercially licensed release. The interface is fully functional without a key,
but an unlicensed build displays a licence notice. Supply a key to remove it:

```ts
export const environment = {
  production: false,
  primeNgLicenseKey: 'PRIMENG_LICENCE_KEY',
};
```

## Project structure

```
src/app/
  core/                 application wide singletons
    auth/               session service backing the route guard
    errors/             AppError and the global error handler
    guards/             route guards
    http/               HTTP interceptors
    notifications/      toast facade
    theme/              PrimeNG theme preset
  shared/               cross feature primitives
    models/             RequestState, PagedResult, PageSelection
    ui/                 StateContainer, PageHeader, DataValue
    utils/              pagination and parsing helpers
  layout/               application shell and the not found screen
  features/
    facilities/
      data-access/      repository, DTO, mapper, stores
      models/           domain models and the form contract
      feature-list/     register screen
      feature-detail/   detail screen
      feature-edit/     edit dialog
      ui/               presentational components
      utils/            pure functions and validators
```

Path aliases `@core/*`, `@shared/*` and `@features/*` are configured in `tsconfig.json`, and
ESLint enforces the layering with `no-restricted-imports`.

## Architecture

### Routing

Every route is lazily loaded, so each screen is delivered as its own chunk. OpenLayers is
reachable only from the detail route, which keeps the mapping library out of the register
screen entirely.

| Path              | Screen                               |
| ----------------- | ------------------------------------ |
| `/`               | Redirects to `/facilities`           |
| `/facilities`     | Register, guarded by `mockAuthGuard` |
| `/facilities/:id` | Detail                               |
| `**`              | Not found                            |

### Data access

Components depend on the abstract `FacilityRepository`, never on a concrete implementation.
`app.config.ts` is the only file that binds the token:

```ts
{ provide: FacilityRepository, useClass: InMemoryFacilityRepository }
```

`InMemoryFacilityRepository` serves a seeded collection behind a simulated 400ms latency.
Replacing it with a real backend means adding an `HttpFacilityRepository` and changing that one
provider. Nothing else in the application is aware of the difference.

Wire and domain shapes are kept apart. `FacilityDto` uses the snake_case keys and ISO date
strings of the API, `Facility` uses camelCase and a real `Date`, and `facility.mapper.ts`
translates between them in both directions.

### State

Reads are owned by feature stores built on `rxResource`, which are provided per screen rather
than globally, so a store is created and disposed with the screen that uses it.

The register keeps its search term, status filter, page and page size in the URL. Those query
parameters are bound to component inputs by `withComponentInputBinding()`, so state flows in one
direction: URL, to input, to query, to repository, to rows. No value is mirrored into a local
field, which means no second copy can fall out of step, and filter state survives a reload, a
shared link and a back navigation without any persistence code.

Request state is modelled as a discriminated union rather than a set of boolean flags:

```ts
type RequestState<TData> =
  { status: 'loading' } | { status: 'error'; message: string } | { status: 'success'; data: TData };
```

Loading and error cannot both be true, because that combination cannot be expressed.
`StateContainer` projects the slot matching the current state, so screens declare each state
once instead of composing conditionals.

### Error handling

`errorInterceptor` translates an HTTP status into an `AppError` carrying a message that names
the problem and the next step, then rethrows it. It never displays anything itself, because a
failed background refresh and a failed save warrant different treatment and only the caller
knows which occurred. `GlobalErrorHandler` catches anything no screen anticipated.

Presentation of expected failures belongs to the screen: the register offers a retry, the detail
screen distinguishes a missing record from a failed request, and the edit dialog reports the
failure without discarding a single value the user typed.

### Presentation

Components under `ui/` inject nothing. They receive `input()` and emit `output()`, which keeps
them trivially testable and reusable. Interfaces are kept narrow for the same reason: the map
component takes a latitude, a longitude and a label rather than a whole facility, and
`FacilityUpdate` is a `Pick` of the editable fields, so the type itself records that an
identifier, a code and a capacity are not editable.

Theming is done through PrimeNG design tokens in `core/theme/petrol.preset.ts` rather than
stylesheet overrides. Component tokens reference the palette custom properties declared in
`src/styles.scss`, which keeps a single source of truth for colour.

## Development aids

The seeded repository can simulate failure conditions that a real backend would produce.

| Address                            | Behaviour                                          |
| ---------------------------------- | -------------------------------------------------- |
| `/facilities?simulateFailure=true` | Fails the next list request once; a retry succeeds |
| `/facilities/999`                  | An unknown identifier, rendered as not found       |

## Testing

```bash
npm test
```

67 tests across 12 files, executed by Vitest in jsdom.

Tests target observable behaviour rather than implementation detail. Screen level suites drive
the real router through `RouterTestingHarness`, exercising routing, input binding, the guard, the
stores and the state container together; only the repository is substituted. Coverage includes
the mapper round trip, filtering and pagination, coordinate validation and projection, the map's
lifecycle cleanup, HTTP error translation, and the edit flow including double submission,
validation failure and recovery from a failed save.

## Accessibility

- All interactive elements are keyboard operable with a visible focus indicator
- Table rows are navigated by a real link rather than a click handler, so rows are reachable and
  announced correctly
- Failed validation moves focus to the first invalid field and states what is required
- The map exposes `role="img"` with a label naming the facility and its coordinates
- Loading progress and result counts are announced through live regions
- Status is conveyed by text as well as colour, and badge colours meet WCAG AA contrast

## Current limitations

- Data is held in memory. Edits persist across navigation but not across a reload.
- The API surface covers reading and updating. Creation and deletion are not implemented.
- The HTTP interceptor is wired and tested directly, but is not exercised at runtime while the
  repository is in memory.
