import { PRESETS } from "./presets.js";

export function parseArgs(argv) {
  const options = {
    preset: "best",
    output: "downloads",
    queue: []
  };

  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    const next = () => argv[++i];

    if (arg === "-h" || arg === "--help") options.help = true;
    else if (arg === "--doctor") options.doctor = true;
    else if (arg === "--history") options.history = true;
    else if (arg === "-u" || arg === "--url") options.url = next();
    else if (arg === "-o" || arg === "--output") options.output = next();
    else if (arg === "-p" || arg === "--preset") options.preset = next();
    else if (arg === "--audio") options.preset = "audio";
    else if (arg === "--video") options.preset = "best";
    else if (arg === "--subtitles") options.subtitles = true;
    else if (arg === "--dry-run") options.dryRun = true;
    else if (arg === "--") options.queue.push(...argv.slice(i + 1));
    else if (arg.startsWith("-")) throw new Error(`Unknown option: ${arg}`);
    else if (!options.url) options.url = arg;
    else options.queue.push(arg);
  }

  if (!PRESETS[options.preset]) {
    throw new Error(`Unknown preset "${options.preset}". Use one of: ${Object.keys(PRESETS).join(", ")}`);
  }

  return options;
}

export function printHelp() {
  console.log(`Compilescent Media Downloader

Usage:
  media-downloader                         Open the interactive TUI
  media-downloader <url>                   Download with the best preset
  media-downloader <url> --audio           Extract audio as mp3/m4a
  media-downloader <url> -p 1080p          Download video up to 1080p
  media-downloader --doctor                Check yt-dlp and ffmpeg
  media-downloader --history               Show recent downloads

Options:
  -u, --url <url>          Media URL
  -o, --output <dir>       Output folder, default: downloads
  -p, --preset <name>      best, audio, 1080p, 720p, mobile, archive
      --subtitles          Save subtitles when available
      --dry-run            Print the yt-dlp command without running it
  -h, --help               Show help

Legal note:
  Download only content you own, have permission to save, or are legally allowed to archive.
`);
}
