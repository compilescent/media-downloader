export const colors = {
  reset: "\x1b[0m",
  bold: "\x1b[1m",
  dim: "\x1b[2m",
  cyan: "\x1b[36m",
  blue: "\x1b[34m",
  magenta: "\x1b[35m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  red: "\x1b[31m"
};

export function clear() {
  process.stdout.write("\x1b[2J\x1b[H");
}

export function logo() {
  return `${colors.cyan}
   ____                      _ _                         _
  / ___|___  _ __ ___  _ __ (_) | ___  ___  ___ ___ _ __ | |_
 | |   / _ \\| '_ \` _ \\| '_ \\| | |/ _ \\/ __|/ __/ _ \\ '_ \\| __|
 | |__| (_) | | | | | | |_) | | |  __/\\__ \\ (_|  __/ | | | |_
  \\____\\___/|_| |_| |_| .__/|_|_|\\___||___/\\___\\___|_| |_|\\__|
                      |_|
${colors.reset}${colors.bold}Media Downloader${colors.reset}  ${colors.dim}beautiful TUI for yt-dlp${colors.reset}`;
}

export function panel(title, lines) {
  const content = Array.isArray(lines) ? lines : String(lines).split("\n");
  const plain = [title, ...content].map(stripAnsi);
  const width = Math.min(92, Math.max(42, ...plain.map((line) => line.length)) + 4);
  const top = `╭─ ${colors.bold}${title}${colors.reset} ${"─".repeat(Math.max(0, width - title.length - 5))}╮`;
  const body = content.map((line) => `│ ${line}${" ".repeat(Math.max(0, width - stripAnsi(line).length - 2))}│`);
  const bottom = `╰${"─".repeat(width)}╯`;
  return [top, ...body, bottom].join("\n");
}

export function stripAnsi(value) {
  return String(value).replace(/\x1b\[[0-9;]*m/g, "");
}

export function progressLine(percent, label) {
  const width = 28;
  const filled = Math.max(0, Math.min(width, Math.round((percent / 100) * width)));
  const bar = `${colors.cyan}${"█".repeat(filled)}${colors.dim}${"░".repeat(width - filled)}${colors.reset}`;
  return `${bar} ${String(Math.round(percent)).padStart(3)}% ${colors.dim}${label}${colors.reset}`;
}
