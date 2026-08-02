#!/usr/bin/env node

const args = process.argv.slice(2);
if (!args.length || args.includes('--help') || args.includes('-h')) {
  console.log(`XI - signed server editor

Usage:
  xi status
  xi audit
  xi signal [--rebase]
  xi list [remote-directory]
  xi get <remote-file> [local-file]
  xi -e <remote-file> <local-file>
  xi upload <remote-file> <local-file>
  xi diff <remote-file> <local-file>
  xi patch <remote-json> <local-json>
  xi pause <endpoint>
  xi resume <endpoint>
  xi log
  xi install [--interval=5m] [--force]
  xi uninstall

Configuration: .xi.json and .xi.key.json`);
} else {
  await import('./xi-core.mjs');
}
