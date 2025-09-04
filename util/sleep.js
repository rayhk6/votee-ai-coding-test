export const sleep = (m) =>
  new Promise((r) => setTimeout(r, Boolean(process.env.TESTING) ? 0 : m));
