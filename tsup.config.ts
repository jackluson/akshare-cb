import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts"],
  format: ["esm", "cjs"],
  dts: true,
  clean: true,
  sourcemap: true,
  shims: true,
  onSuccess: async () => {
    const { cp } = await import("node:fs/promises");
    await cp("src/scripts", "dist/scripts", { recursive: true });
  },
});
