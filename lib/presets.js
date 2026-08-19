export const PRESETS = {
  best: {
    label: "Best quality",
    description: "Best video and audio available, merged when ffmpeg exists.",
    args: ["-f", "bv*+ba/b"]
  },
  audio: {
    label: "Audio only",
    description: "Extract audio for listening, podcasts, and sound clips.",
    args: ["-x", "--audio-format", "mp3", "--audio-quality", "0"]
  },
  "1080p": {
    label: "Video 1080p",
    description: "High-quality video capped at 1080p.",
    args: ["-f", "bv*[height<=1080]+ba/b[height<=1080]"]
  },
  "720p": {
    label: "Video 720p",
    description: "Balanced size and quality for sharing.",
    args: ["-f", "bv*[height<=720]+ba/b[height<=720]"]
  },
  mobile: {
    label: "Mobile friendly",
    description: "Small mp4-friendly output where the source supports it.",
    args: ["-f", "mp4/best[ext=mp4]/best"]
  },
  archive: {
    label: "Archive mode",
    description: "Save metadata, thumbnails, and subtitles for personal archives.",
    args: ["--write-info-json", "--write-thumbnail", "--write-subs", "--embed-metadata"]
  }
};
