import os from "node:os";
import path from "node:path";

export function configDir() {
  if (process.env.XDG_CONFIG_HOME) return path.join(process.env.XDG_CONFIG_HOME, "compilescent-media-downloader");
  if (process.platform === "win32" && process.env.APPDATA) {
    return path.join(process.env.APPDATA, "Compilescent", "MediaDownloader");
  }
  return path.join(os.homedir(), ".config", "compilescent-media-downloader");
}

export function historyFile() {
  return path.join(configDir(), "history.json");
}
