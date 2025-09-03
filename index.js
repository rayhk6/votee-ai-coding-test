import "dotenv/config";
import { GuessWordleLoop } from "./processor.js";

const init = async () => {
  let run_count = 0;
  let failed_count = 0;
  for (let index = 0; index < 100; index++) {
    console.log("Run #: ", index + 1);
    const run = await GuessWordleLoop(index);
    if (run === null) {
      failed_count++;
    } else {
      run_count += run;
    }
  }
  console.log(
    "Average run count: ",
    run_count / (100 - failed_count),
    " failed count: ",
    failed_count
  );
};
init();
