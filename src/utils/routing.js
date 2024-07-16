// TODO: unit test for this
export function backendRoute(path) {
//   console.log(new URL('/api', window.location.origin).href);
//   console.log(new URL(import.meta.env.VITE_REACT_APP_BACKEND_URL, window.location.origin).href);
  // This handles both the case where the backend url is absolute and the case where it is relative
  let envBackendUrl = import.meta.env.VITE_REACT_APP_BACKEND_URL;
  if (!envBackendUrl.endsWith('/')) {
    envBackendUrl += '/';
  }
  const backendRoot = new URL(envBackendUrl, window.location.origin).href;
  return new URL(path, backendRoot).href;
}
