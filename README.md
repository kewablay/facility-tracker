# Facility Tracker

A small register of monitored infrastructure. It lists facilities, filters and pages through
them, opens one on a detail screen with its location on a map, and edits it in a dialog.

Built with Angular 22, standalone and zoneless throughout, with signals for state.

## Running it

Requires Node 20.19 or newer.

```bash
npm install
npm start
```

The application is served at `http://localhost:4200/` and opens on the facilities list.

| Command                | What it does                              |
| ---------------------- | ----------------------------------------- |
| `npm start`            | Development server with hot reload        |
| `npm run build`        | Production build into `dist/`             |
| `npm test`             | Unit tests with Vitest                    |
| `npm run lint`         | ESLint over TypeScript and templates      |
| `npm run format:check` | Prettier check, `npm run format` to write |

### PrimeNG licence

PrimeNG 22 is a commercial release. Without a key the interface works in full but shows a
licence banner in the corner. Paste a key into `src/environments/environment.ts`:

```ts
export const environment = {
  production: false,
  primeNgLicenseKey: 'your-key-here',
};
```

### Trying the failure states

The data is in memory, so failures are simulated rather than real.

- `http://localhost:4200/facilities?simulateFailure=true` makes the next list request fail
  once. "Try again" then succeeds.
- `http://localhost:4200/facilities/999` is an id that does not exist, which is treated
  differently from a failed request.

## Architecture

```
src/app/
  core/           app-wide singletons: interceptor, error handler, notifications, guard
  shared/         cross-feature primitives: request state, state container, page header
  layout/         the application frame and the not found screen
  features/
    facilities/
      data-access/  repository, DTO, mapper, stores
      models/       domain models and the form's declared shape
      feature-list/    routed container, owns list state
      feature-detail/  routed container, owns one facility
      feature-edit/    the edit dialog and its write store
      ui/           presentational components, nothing injected
      utils/        pure functions and validators
```

Every route is lazy, so each screen is its own chunk. OpenLayers is only in the detail chunk,
which means the list screen never downloads a mapping library it does not use.

### The rules that shaped it

**Components never call HttpClient.** Only the repository does. Components depend on the
abstract `FacilityRepository`, never on a concrete class, and `app.config.ts` is the only file
that names an implementation. Moving to a real backend means writing `HttpFacilityRepository`
and changing one line.

**Repositories never navigate, log, or raise a toast.** They return data or throw a typed
error. Deciding what a reader sees is the container's job.

**Presentational components inject nothing.** They take `input()` and emit `output()`. The map
receives `latitude`, `longitude` and `label` rather than a whole `Facility`, because that is
all it needs.

**Inputs are narrow on purpose.** `FacilityUpdate` is a `Pick` of the editable fields, so the
type itself says that an id, a code and a capacity are not editable.

## Decisions worth explaining

**State lives in the URL, not in the component.** Search term, status filter, page and page
size are query parameters bound to inputs by `withComponentInputBinding()`. State flows one
way: URL to input to query to repository to rows. Nothing is mirrored into a local field, so
there is no second copy to fall out of step. A filtered view survives a refresh, can be shared
as a link, and is still there after stepping back from a detail screen, with no persistence
code anywhere.

**One state type instead of three flags.** `RequestState<T>` is a discriminated union of
idle, loading, success and error. Loading and error cannot both be true, because that state
cannot be expressed. `StateContainer` projects the matching slot, so no screen writes
`@if (loading())` alongside `@if (error())`.

**Editing is a dialog, not a route.** A dialog is a state of the screen the reader is already
on, not a place. It takes a facility rather than an id, because both the list and the detail
screen have already loaded one, and it reports `saved` and `closed` separately so the host
decides what closing means. That is what lets one dialog serve two screens.

**Errors are translated once, at the boundary.** The interceptor maps an HTTP status to an
`AppError` carrying copy a reader can act on, then rethrows. It shows nothing itself, because
a failed background poll and a failed save deserve different treatment and only the caller
knows which one happened. The global handler catches what no screen anticipated, which is by
definition a defect, and reports it to the console and to the reader.

**The whole row opens the facility, using a real link.** A single anchor per row is stretched
across the row with `::after`. A click handler on the row would give a mouse the same result
while leaving the row unreachable by keyboard and unannounced by a screen reader.

**Authentication is a visible seam, not a pretence.** `MockSessionService` always reports
signed in and `mockAuthGuard` reads it. Swapping in real authentication is a change to one
file, and neither the routes nor any feature has to move.

## Testing

```bash
npm test
```

67 tests across 12 files, run by Vitest in jsdom.

The suites test behaviour a reader could notice, not implementation detail. The container
tests drive the real router with `RouterTestingHarness`, so routing, input binding, the guard,
the store and the state container are all exercised the way the application uses them. Only
the repository is substituted.

Cases worth pointing at:

- The map releases its DOM on destroy, so repeated visits cannot leak a map.
- `toMapCoordinate` does not swap the pair. Reversing longitude and latitude throws nothing,
  it just moves a Yorkshire facility into the Indian Ocean, so only an assertion catches it.
- Submitting the edit form twice in a row sends one request.
- A failed save keeps every value the reader typed and leaves the dialog open.
- An unknown id and a failed request produce different screens.

## Accessibility

- Every interactive element is reachable and operable by keyboard, with a visible focus ring.
- Failed validation moves focus to the first field that failed and names what is wrong.
- The map carries `role="img"` and a label naming the facility and its coordinates.
- Loading and result counts are announced through live regions.
- Status is never carried by colour alone. Each tag has a text label.
- The table collapses into stacked cards below 768 pixels, with each column heading travelling
  next to its value.

## Data

Fifteen facilities are seeded in memory in wire shape, so the in-memory repository exercises
the mapper exactly as an HTTP repository would. Statuses are uneven so filtering visibly
changes the result count, several names share a prefix so a partial search returns more than
one row, and the coordinates are real and spread across Great Britain, including one in
Shetland, so the map is not always the same view.

Requests are delayed by 400ms to make loading states observable.

## Known limits

- Data is in memory. An edit survives navigation but not a page reload.
- There is no create or delete. The brief asked for a list, a detail screen and an edit.
- The error interceptor is wired but not yet exercised, since nothing calls `HttpClient` while
  the repository is in memory. It is tested directly against `HttpTestingController`.
