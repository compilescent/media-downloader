#!/usr/bin/env node
import { parseArgs, printHelp } from "../lib/args.js";
import { runDownload } from "../lib/downloader.js";
import { showHistory, showSystemDoctor } from "../lib/system.js";
import { runTui } from "../lib/tui.js";

async function main() {
  const options = parseArgs(process.argv.slice(2));

  if (options.help) {
    printHelp();
    return;
  }

  if (options.history) {
    await showHistory();
    return;
  }

  if (options.doctor) {
    await showSystemDoctor();
    return;
  }

  if (options.url) {
    await runDownload(options);
    return;
  }

  await runTui(options);
}

main().catch((error) => {
  console.error(`\nmedia-downloader failed: ${error.message}`);
  process.exitCode = 1;
});
