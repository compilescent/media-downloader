import readline from "node:readline/promises";
import { stdin as input, stdout as output } from "node:process";
import { runDownload } from "./downloader.js";
import { PRESETS } from "./presets.js";
import { showHistory, showSystemDoctor } from "./system.js";
import { clear, colors, logo, panel } from "./ui.js";

export async function runTui(options = {}) {
  const rl = readline.createInterface({ input, output });
  try {
    clear();
    console.log(logo());
    console.log();
    console.log(panel("Quick actions", [
      "1. Download media",
      "2. Audio only",
      "3. Show history",
      "4. System doctor",
      "5. Exit"
    ]));

    const action = await rl.question(`\n${colors.cyan}?${colors.reset} Choose an action: `);
    if (action === "5") return;
    if (action === "3") {
      await showHistory();
      return;
    }
    if (action === "4") {
      await showSystemDoctor();
      return;
    }

    const url = await rl.question(`${colors.cyan}?${colors.reset} Paste media URL: `);
    if (!url.trim()) throw new Error("A URL is required.");

    const preset = action === "2" ? "audio" : await choosePreset(rl);
    const outputDir = await rl.question(`${colors.cyan}?${colors.reset} Output folder [downloads]: `);
    await runDownload({
      ...options,
      url: url.trim(),
      preset,
      output: outputDir.trim() || "downloads"
    });
  } finally {
    rl.close();
  }
}

async function choosePreset(rl) {
  const entries = Object.entries(PRESETS);
  console.log();
  console.log(panel("Presets", entries.map(([key, preset], index) => {
    return `${index + 1}. ${key.padEnd(8)} ${colors.bold}${preset.label}${colors.reset} ${colors.dim}${preset.description}${colors.reset}`;
  })));

  const selected = await rl.question(`\n${colors.cyan}?${colors.reset} Preset [1]: `);
  const index = Math.max(0, Number(selected || 1) - 1);
  return entries[index]?.[0] || "best";
}
