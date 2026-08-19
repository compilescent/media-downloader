import fs from "node:fs/promises";
import fsSync from "node:fs";
import os from "node:os";
import path from "node:path";
import { historyFile } from "./paths.js";
import { colors, panel } from "./ui.js";

export async function commandExists(command) {
  const pathValue = process.env.PATH || "";
  const extensions = process.platform === "win32"
    ? (process.env.PATHEXT || ".EXE;.CMD;.BAT;.COM").split(";")
    : [""];

  for (const directory of pathValue.split(path.delimiter)) {
    if (!directory) continue;
    for (const extension of extensions) {
      const candidate = path.join(directory, `${command}${extension}`);
      try {
        await fs.access(candidate, fsSync.constants.X_OK);
        return true;
      } catch {
        continue;
      }
    }
  }

  if (command === "yt-dlp") {
    const localBin = path.join(os.homedir(), ".local", "bin", command);
    try {
      await fs.access(localBin, fsSync.constants.X_OK);
      return true;
    } catch {
      return false;
    }
  }

  return false;
}

export async function showSystemDoctor() {
  const ytDlp = await commandExists("yt-dlp");
  const ffmpeg = await commandExists("ffmpeg");
  console.log(panel("System doctor", [
    status("yt-dlp", ytDlp, "Required download engine"),
    status("ffmpeg", ffmpeg, "Recommended for merging and audio extraction"),
    "",
    "Install hints:",
    "  macOS:   brew install yt-dlp ffmpeg",
    "  Linux:   python3 -m pip install -U yt-dlp && install ffmpeg from your package manager",
    "  Windows: winget install yt-dlp.yt-dlp Gyan.FFmpeg",
    "  Termux:  pkg install python ffmpeg && pip install -U yt-dlp"
  ]));
}

function status(name, ok, note) {
  const mark = ok ? `${colors.green}ready${colors.reset}` : `${colors.red}missing${colors.reset}`;
  return `  ${name.padEnd(8)} ${mark}  ${colors.dim}${note}${colors.reset}`;
}

export async function addHistory(entry) {
  const file = historyFile();
  await fs.mkdir(path.dirname(file), { recursive: true });
  let history = [];
  try {
    history = JSON.parse(await fs.readFile(file, "utf8"));
  } catch {
    history = [];
  }
  history.unshift({ ...entry, at: new Date().toISOString() });
  await fs.writeFile(file, JSON.stringify(history.slice(0, 50), null, 2));
}

export async function showHistory() {
  try {
    const history = JSON.parse(await fs.readFile(historyFile(), "utf8"));
    if (!history.length) {
      console.log("No downloads recorded yet.");
      return;
    }
    console.log(panel("Recent downloads", history.slice(0, 12).map((item) => {
      return `${item.at}  ${item.preset.padEnd(7)}  ${item.url}`;
    })));
  } catch {
    console.log("No downloads recorded yet.");
  }
}
