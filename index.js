import { CronJob } from "cron";
import "dotenv/config";
import { guess_wordle_loop } from "./processor.js";

// cronjob for guessing the wordle game every day in the morning.
const GUESS_WORDLE = new CronJob(
  "0 9 * * *",
  async () => {
    await guess_wordle_loop();
  },
  null,
  true,
  "HongKong"
);

const init = async () => {
  await guess_wordle_loop();
};
init();
