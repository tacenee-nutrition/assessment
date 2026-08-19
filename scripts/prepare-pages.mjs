import { existsSync } from "node:fs";
import { rename, rm } from "node:fs/promises";
import path from "node:path";

const outputDirectory = path.resolve("dist/client");
const nestedDirectory = path.join(outputDirectory, "assessment");
const nestedAssets = path.join(nestedDirectory, "_next");
const publicAssets = path.join(outputDirectory, "_next");

if (!existsSync(nestedAssets)) {
  throw new Error(`GitHub Pages assets were not found at ${nestedAssets}`);
}

await rm(publicAssets, { recursive: true, force: true });
await rename(nestedAssets, publicAssets);
await rm(nestedDirectory, { recursive: true, force: true });

console.log("Prepared dist/client for the /assessment GitHub Pages path.");
