if (!/pnpm/.test(process.env.npm_execpath || "")) {
  console.warn(`\u001b[33m请使用pnpm进行操作\u001b[39m\n`);
  process.exit(1);
}
