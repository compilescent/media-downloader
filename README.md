# Compilescent Media Downloader

Compilescent Media Downloader is a Node.js command line tool for running common `yt-dlp` download tasks from a terminal menu or direct flags.

It keeps the wrapper small: no runtime npm dependencies, no bundled download engine, and no background services. Install `yt-dlp` for downloading. Install `ffmpeg` if you need merging, audio extraction, or metadata embedding.

> Download only content you own, have permission to save, or are legally allowed to archive. This tool does not bypass DRM or platform access controls.

## Install

```sh
npm install -g compilescent-media-downloader
```

```sh
media-downloader --doctor
```

## Usage

```sh
media-downloader
media-downloader "https://example.com/watch/video"
media-downloader "https://example.com/watch/video" --audio
media-downloader "https://example.com/watch/video" --preset 1080p
media-downloader "https://example.com/watch/video" --list-formats
media-downloader "https://example.com/playlist" --playlist
media-downloader --history
```

Short aliases are included:

```sh
cmdl "https://example.com/watch/video"
mdl "https://example.com/watch/video" --audio
```

## What it does

- Arrow-key terminal menu, with a non-interactive fallback
- Works on macOS, Linux, Windows, and Termux where Node.js and `yt-dlp` are available
- Presets: best, audio, 1080p, 720p, mobile, archive
- Format listing with `-F` / `--list-formats`
- Queue mode for multiple URLs
- Playlist downloads are opt-in
- Optional subtitles, metadata, thumbnails, browser cookies, and fragment concurrency
- Progress display from `yt-dlp --newline`
- Recent download history
- `--doctor` checks for `yt-dlp` and `ffmpeg`
- `--dry-run` prints the command before running it
- No DRM bypass code

## Install yt-dlp and ffmpeg

```sh
# macOS
brew install yt-dlp ffmpeg

# Windows
winget install yt-dlp.yt-dlp Gyan.FFmpeg

# Termux
pkg install python ffmpeg
pip install -U yt-dlp
```

## Commands

```text
media-downloader                         Open the interactive TUI
media-downloader <url>                   Download with the best preset
media-downloader <url> --audio           Extract audio
media-downloader <url> -p 1080p          Download video up to 1080p
media-downloader <url> -F                List available formats
media-downloader <url> --playlist        Allow playlist downloads
media-downloader --doctor                Check required tools
media-downloader --history               Show recent downloads
```

## License

MIT
