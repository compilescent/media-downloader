import readline from "node:readline";
import { createInterface } from "node:readline/promises";
import { stdin as input, stdout as output } from "node:process";
import { runDownload } from "./downloader.js";
import { PRESETS } from "./presets.js";
import { showHistory, showSystemDoctor } from "./system.js";
import { clear, colors, logo, panel } from "./ui.js";

const actions = [
  { value: "download", label: "Download media", hint: "Best for video, audio, reels, clips, and posts." },
  { value: "audio", label: "Extract audio", hint: "Fast audio preset for music, talks, and podcasts." },
  { value: "queue", label: "Queue downloader", hint: "Paste several URLs and process them in order." },
  { value: "formats", label: "List formats", hint: "Inspect yt-dlp format IDs before downloading." },
  { value: "history", label: "Recent history", hint: "Show the last saved jobs." },
  { value: "doctor", label: "System doctor", hint: "Check yt-dlp and ffmpeg availability." },
  { value: "exit", label: "Exit", hint: "Close the TUI." }
];

export async function runTui(options = {}) {
  clear();
  console.log(logo());
  console.log();

  const action = await select("What do you want to do?", actions);
  if (action === "exit") return;
  if (action === "history") return showHistory();
  if (action === "doctor") return showSystemDoctor();

  const answers = await askJob(action);
  if (answers.exit) return;
  await runDownload({ ...options, ...answers });
}

async function askJob(action) {
  const rl = createInterface({ input, output });
  try {
    const rawUrl = await rl.question(`${colors.cyan}?${colors.reset} Paste URL${action === "queue" ? "s separated by new lines or commas" : ""}: `);
    const urls = splitUrls(rawUrl);
    if (!urls.length) throw new Error("A URL is required.");

    const outputDir = await rl.question(`${colors.cyan}?${colors.reset} Output folder [downloads]: `);
    const cookiesFromBrowser = await rl.question(`${colors.cyan}?${colors.reset} Browser cookies name, optional [none]: `);
    const concurrentFragments = await rl.question(`${colors.cyan}?${colors.reset} Concurrent fragments [4]: `);
    rl.close();

    const preset = action === "audio" ? "audio" : action === "formats" ? "best" : await selectPreset();
    if (preset === "exit") return { exit: true };
    const subtitles = action !== "formats" && await confirm("Save subtitles when available?", false);
    if (subtitles === "exit") return { exit: true };
    const metadata = action !== "formats" && await confirm("Embed metadata when supported?", true);
    if (metadata === "exit") return { exit: true };
    const thumbnail = action !== "formats" && await confirm("Save thumbnail when supported?", false);
    if (thumbnail === "exit") return { exit: true };
    const playlist = action !== "formats" && await confirm("Allow playlist downloads?", false);
    if (playlist === "exit") return { exit: true };

    return {
      url: urls[0],
      queue: urls.slice(1),
      output: outputDir.trim() || "downloads",
      preset,
      listFormats: action === "formats",
      subtitles,
      metadata,
      thumbnail,
      playlist,
      cookiesFromBrowser: cookiesFromBrowser.trim() || undefined,
      concurrentFragments: concurrentFragments.trim() || "4"
    };
  } finally {
    rl.close();
  }
}

async function selectPreset() {
  const choices = Object.entries(PRESETS).map(([value, preset]) => ({
    value,
    label: `${value} - ${preset.label}`,
    hint: preset.description
  }));
  return select("Choose quality preset", choices);
}

async function confirm(message, defaultValue) {
  const value = await select(message, [
    { value: true, label: "Yes", hint: "Enable this option." },
    { value: false, label: "No", hint: "Leave it disabled." }
  ], defaultValue ? 0 : 1);
  return value;
}

async function select(title, choices, initial = 0) {
  if (!process.stdin.isTTY || !process.stdout.isTTY) {
    return fallbackSelect(title, choices, initial);
  }

  readline.emitKeypressEvents(process.stdin);
  process.stdin.setRawMode(true);
  let index = initial;

  return new Promise((resolve) => {
    function render() {
      clear();
      console.log(logo());
      console.log();
      console.log(panel(title, choices.map((choice, choiceIndex) => {
        const marker = choiceIndex === index ? `${colors.cyan}>${colors.reset}` : " ";
        const label = choiceIndex === index ? `${colors.bold}${choice.label}${colors.reset}` : choice.label;
        return `${marker} ${label}  ${colors.dim}${choice.hint || ""}${colors.reset}`;
      }).concat(["", `${colors.dim}Use ↑/↓ or j/k, Enter to select, q to quit.${colors.reset}`])));
    }

    function cleanup() {
      process.stdin.off("keypress", onKey);
      process.stdin.setRawMode(false);
      clear();
    }

    function onKey(_, key = {}) {
      if (key.name === "down" || key.name === "j") index = (index + 1) % choices.length;
      else if (key.name === "up" || key.name === "k") index = (index - 1 + choices.length) % choices.length;
      else if (key.name === "return") {
        const selected = choices[index].value;
        cleanup();
        resolve(selected);
        return;
      } else if (key.name === "q" || (key.ctrl && key.name === "c")) {
        cleanup();
        resolve("exit");
        return;
      }
      render();
    }

    process.stdin.on("keypress", onKey);
    render();
  });
}

async function fallbackSelect(title, choices, initial) {
  const rl = createInterface({ input, output });
  try {
    console.log(panel(title, choices.map((choice, index) => `${index + 1}. ${choice.label} ${colors.dim}${choice.hint || ""}${colors.reset}`)));
    const answer = await rl.question(`${colors.cyan}?${colors.reset} Select [${initial + 1}]: `);
    const index = Math.max(0, Number(answer || initial + 1) - 1);
    return choices[index]?.value ?? choices[initial].value;
  } finally {
    rl.close();
  }
}

function splitUrls(value) {
  return String(value)
    .split(/[\n,]+/)
    .map((item) => item.trim())
    .filter(Boolean);
}
