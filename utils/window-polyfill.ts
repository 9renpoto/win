const globalWithWindow = globalThis as typeof globalThis & {
  window?: typeof globalThis;
};

if (globalWithWindow.window === undefined) {
  // Provide a minimal shim so dependencies expecting `window` work in SSR.
  globalWithWindow.window = globalWithWindow;
}
