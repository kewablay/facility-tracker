export type RequestState<TData> =
  { status: 'loading' } | { status: 'error'; message: string } | { status: 'success'; data: TData };

export const LOADING_STATE: RequestState<never> = { status: 'loading' };

export function errorState(message: string): RequestState<never> {
  return { status: 'error', message };
}

export function successState<TData>(data: TData): RequestState<TData> {
  return { status: 'success', data };
}
