import { fetch_data } from "./lib/fetch.js";

export const sleep = (m) => new Promise((r) => setTimeout(r, m));
//avoid TLS error for self-signed cert
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
// set the result variable
let result = ["", "", "", "", ""];
let guess = ["", "", "", "", ""];
let possible_chars = [];

const check_response = (response, second_validation = false) => {
  //check response one by one
  for (let index = 0; index < response.length; index++) {
    const element = response[index];
    if (element.result === "correct") {
      const tmp = result.slice();
      tmp[index] = element.guess;
      result = tmp.slice();
    } else if (element.result === "present" && second_validation === false) {
      possible_chars.push(element.guess);
    }
  }
};

export const guess_wordle_loop = async () => {
  try {
    // guess the characters by looping a-z
    for (let i = 0; i < 26; i++) {
      const char = String.fromCharCode(97 + i); // get the character from ASCII code

      for (let j = 0; j < 6; j++) {
        guess[i % 5] = char;
      }

      //handle z case
      if (i === 25) {
        guess = ["z", "z", "z", "z", "z"];
      }

      //guess the word by calling the API
      //handle z case as well
      if ((i > 0 && i % 5 === 4) || i === 25) {
        console.log("Guessing word: ", guess.join("").replace(",", ""));
        const response = await fetch_data(guess);
        check_response(response);

        //avoid rate limit
        await sleep(2000);
      }
    }
    console.log(
      "Result after first round: ",
      result,
      ` Possible chars: ${possible_chars}`
    );
    //check if all elements of result are filled
    for (let index = 0; index < possible_chars.length; index++) {
      const element = possible_chars[index];
      guess = result.slice(); //reset guess to result
      // fill the empty characters with possible_chars
      for (let j = 0; j < 5; j++) {
        if (guess[j] === "") {
          guess[j] = element;
        }
      }
      console.log(
        `Guessing word #${index + 1}: `,
        guess.join("").replace(",", "")
      );

      const response = await fetch_data(guess);
      check_response(response, true);

      console.log(
        `Result after second round #${index + 1}: `,
        result.every((char) => char !== ""),
        result
      );
      if (result.every((char) => char !== "")) {
        //all characters are filled

        console.log(
          "All characters are filled: ",
          result.join("").replace(",", ""),
          ` Run ${index + 7} times`
        );
        continue;
      }
      //avoid rate limit
      await sleep(2000);
    }

    return;
  } catch (error) {
    console.error(("[guess_wordle_loop] error: ", error));
    return;
  }
};
