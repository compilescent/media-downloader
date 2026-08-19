# Compilescent Media Downloader

A polished cross-platform terminal media downloader with a dependency-free arrow-key TUI. It uses `yt-dlp` as the download engine and focuses on a better user experience: presets, format listing, playlist control, subtitles, metadata, thumbnails, queue support, progress display, history, system checks, and clean Compilescent branding.

> Download only content you own, have permission to save, or are legally allowed to archive. This tool does not bypass DRM or platform access controls.

## Install

```sh
npm install -g compilescent-media-downloader
```

You also need `yt-dlp`. `ffmpeg` is recommended for merging video/audio and extracting audio.

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

## Features

- Beautiful arrow-key ANSI TUI with zero runtime npm dependencies
- Cross-platform Node.js CLI for macOS, Linux, Windows, and Termux
- Presets: best, audio, 1080p, 720p, mobile, archive
- Format listing with `-F` / `--list-formats`
- Queue mode for multiple URLs
- Playlist opt-in so accidental playlist downloads are avoided
- Optional subtitles, metadata, thumbnails, cookies-from-browser, and fragment concurrency
- Progress display powered by `yt-dlp --newline`
- Recent download history
- Doctor command for `yt-dlp` and `ffmpeg`
- Dry-run mode for inspecting commands before execution
- Legal-use reminder and no DRM bypass logic

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
