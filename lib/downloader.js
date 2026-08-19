import fs from "node:fs/promises";
import path from "node:path";
import { spawn } from "node:child_process";
import { PRESETS } from "./presets.js";
import { addHistory, commandExists, showSystemDoctor } from "./system.js";
import { colors, panel, progressLine } from "./ui.js";

export async function runDownload(options) {
  if (!options.dryRun && !(await commandExists("yt-dlp"))) {
    await showSystemDoctor();
    throw new Error("yt-dlp is required before downloads can run.");
  }

  const queue = [options.url, ...(options.queue || [])].filter(Boolean);
  for (const url of queue) {
    await downloadOne({ ...options, url });
  }
}

async function downloadOne(options) {
  const preset = PRESETS[options.preset || "best"];
  const outputDir = path.resolve(process.cwd(), options.output || "downloads");
  const args = buildYtDlpArgs(options, outputDir, preset);

  if (!options.listFormats) args.push(options.url);

  console.log(panel("Download job", [
    `${colors.bold}URL:${colors.reset} ${options.url}`,
    `${colors.bold}Mode:${colors.reset} ${options.listFormats ? "List formats" : preset.label}`,
    `${colors.bold}Output:${colors.reset} ${outputDir}`,
    `${colors.dim}${options.listFormats ? "Inspect format IDs before downloading." : preset.description}${colors.reset}`
  ]));

  if (options.dryRun) {
    console.log(`yt-dlp ${args.map(shellQuote).join(" ")}`);
    return;
  }

  if (!options.listFormats) await fs.mkdir(outputDir, { recursive: true });
  await runYtDlp(args);
  await addHistory({ url: options.url, preset: options.listFormats ? "formats" : options.preset || "best", output: outputDir });
}

function buildYtDlpArgs(options, outputDir, preset) {
  if (options.listFormats) {
    return ["-F", options.url];
  }

  const args = [
    "--newline",
    "--progress",
    options.playlist ? "--yes-playlist" : "--no-playlist",
    "-P",
    outputDir,
    "-o",
    "%(title).180B [%(id)s].%(ext)s",
    ...preset.args
  ];

  if (options.subtitles && options.preset !== "archive") args.push("--write-subs");
  if (options.metadata && options.preset !== "archive") args.push("--embed-metadata");
  if (options.thumbnail && options.preset !== "archive") args.push("--write-thumbnail");
  if (options.cookiesFromBrowser) args.push("--cookies-from-browser", options.cookiesFromBrowser);
  if (options.concurrentFragments) args.push("--concurrent-fragments", String(options.concurrentFragments));

  return args;
}

function runYtDlp(args) {
  return new Promise((resolve, reject) => {
    const child = spawn("yt-dlp", args, { stdio: ["ignore", "pipe", "pipe"] });
    let lastPercent = 0;

    child.stdout.on("data", (chunk) => {
      for (const line of String(chunk).split(/\r?\n/)) {
        if (!line.trim()) continue;
        const match = line.match(/\[download\]\s+([0-9.]+)%/);
        if (match) {
          lastPercent = Number(match[1]);
          process.stdout.write(`\r${progressLine(lastPercent, "downloading")}`);
        } else if (line.includes("Destination:")) {
          process.stdout.write(`\n${colors.green}${line}${colors.reset}\n`);
        } else if (line.includes("has already been downloaded")) {
          process.stdout.write(`\n${colors.yellow}${line}${colors.reset}\n`);
        } else {
          process.stdout.write(`${line}\n`);
        }
      }
    });

    child.stderr.on("data", (chunk) => {
      process.stderr.write(`${colors.red}${chunk}${colors.reset}`);
    });

    child.on("error", reject);
    child.on("close", (code) => {
      process.stdout.write("\n");
      if (code === 0) resolve();
      else reject(new Error(`yt-dlp exited with code ${code}`));
    });
  });
}

function shellQuote(value) {
  if (/^[a-zA-Z0-9_./:=+-]+$/.test(value)) return value;
  return JSON.stringify(value);
}
