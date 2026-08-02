import { access, readFile } from "node:fs/promises";
import { resolve } from "node:path";
import vinext from "vinext";
import { defineConfig } from "vite";
import { sites } from "./config/sites-vite-plugin";

const SITE_CREATOR_PLACEHOLDER_DATABASE_ID =
  "00000000-0000-4000-8000-000000000000";

// macOS Seatbelt blocks FSEvents, so Codex previews need polling for HMR.
const isCodexSeatbeltSandbox = process.env.CODEX_SANDBOX === "seatbelt";

type HostingConfig = {
  d1?: string | null;
  r2?: string | null;
};

async function pathExists(path: string): Promise<boolean> {
  try {
    await access(path);
    return true;
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") {
      return false;
    }
    throw error;
  }
}

async function loadHostingConfig(): Promise<HostingConfig> {
  try {
    const source = await readFile(
      resolve(process.cwd(), ".openai", "hosting.json"),
      "utf8",
    );
    return JSON.parse(source) as HostingConfig;
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") {
      return {};
    }
    throw error;
  }
}

export default defineConfig(async () => {
  const isVercelBuild = Boolean(
    process.env.VERCEL || process.env.VERCEL_ENV || process.env.NOW_BUILDER,
  );
  const hasWorkerEntry = await pathExists(
    resolve(process.cwd(), "worker", "index.ts"),
  );
  const { d1, r2 } = await loadHostingConfig();
  const localBindingConfig = {
    main: "./worker/index.ts",
    compatibility_flags: ["nodejs_compat"],
    d1_databases: d1
      ? [
          {
            binding: d1,
            database_name: "site-creator-d1",
            database_id: SITE_CREATOR_PLACEHOLDER_DATABASE_ID,
          },
        ]
      : [],
    r2_buckets: r2
      ? [
          {
            binding: r2,
            bucket_name: "site-creator-r2",
          },
        ]
      : [],
  };

  // Keep Wrangler and Miniflare state project-local. These are non-secret tool
  // settings; application environment belongs in ignored `.env*` files.
  process.env.WRANGLER_WRITE_LOGS ??= "false";
  process.env.WRANGLER_LOG_PATH ??= ".wrangler/logs";
  process.env.MINIFLARE_REGISTRY_PATH ??= ".wrangler/registry";

  // Vercel provides its own runtime adapter and does not include the optional
  // Cloudflare worker files in its build checkout.
  const cloudflarePlugins = isVercelBuild || !hasWorkerEntry
    ? []
    : [
        (await import("@cloudflare/vite-plugin")).cloudflare({
          viteEnvironment: { name: "rsc", childEnvironments: ["ssr"] },
          config: localBindingConfig,
        }),
      ];

  return {
    server: {
      allowedHosts: ["a152-124-123-156-83.ngrok-free.app"],
      ...(isCodexSeatbeltSandbox
        ? { watch: { useFsEvents: false, usePolling: true } }
        : {}),
    },
    plugins: [
      vinext(),
      sites(),
      ...cloudflarePlugins,
    ],
  };
});
