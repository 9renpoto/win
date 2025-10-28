const denoWithKv = Deno as typeof Deno & {
  openKv?: typeof Deno.openKv;
  KvU64?: typeof Deno.KvU64;
};

export const kvAvailable = typeof denoWithKv.openKv === "function" &&
  typeof denoWithKv.KvU64 === "function";

const kvPromise:
  | ReturnType<NonNullable<typeof denoWithKv.openKv>>
  | null = kvAvailable ? denoWithKv.openKv!() : null;

export function getKv() {
  if (!kvPromise) {
    throw new Error("Deno KV is not available");
  }
  return kvPromise;
}

export function createKvU64(value: bigint) {
  if (!kvAvailable || !denoWithKv.KvU64) {
    throw new Error("Deno KV is not available");
  }
  return new denoWithKv.KvU64(value);
}
