import "dotenv/config";
import { wordlist } from "./lib/wordlist_array.js";
import { GuessWordleLoop } from "./processor.js";

const init = async () => {
  let run_count = 0;
  let failed_count = 0;
  let total_run = 0;
  let min = 0;
  let max = 0;

  const length = Boolean(process.env.TESTING) === true ? wordlist.length : 100;

  for (let index = 0; index < length; index++) {
    console.log("Run #: ", index + 1);
    total_run++;
    const run = await GuessWordleLoop(index);
    if (run === null) {
      failed_count++;
    } else {
      run_count += run;
      if (min === 0 || run < min) {
        min = run;
      } else if (run > max) {
        max = run;
      }
    }
  }
  console.log(
    "Run: ",
    total_run,
    " Average run count: ",
    run_count / total_run,
    " failed count: ",
    failed_count,
    " Min: ",
    min,
    " Max: ",
    max
  );
};
init();

//GetStat();
