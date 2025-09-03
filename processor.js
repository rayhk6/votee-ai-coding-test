import { fetch_data } from "./lib/fetch.js";
import { wordlist } from "./lib/wordlist_array.js";

export const sleep = (m) => new Promise((r) => setTimeout(r, m));
//avoid TLS error for self-signed cert
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
// set the result variable
let result = ["", "", "", "", ""];
let guess = ["", "", "", "", ""];
let possible_chars = [];

// find possible words from wordlist based on result and possible_chars
const FindPossibilities = () => {
  return wordlist.filter(
    (word) =>
      result.every((char, index) => char === "" || word[index] === char) &&
      possible_chars.every((char) => word.includes(char))
  );
};

const Validation = (response) => {
  //check response one by one
  let pass = true;
  for (let index = 0; index < response.length; index++) {
    const element = response[index];
    if (element.result === "correct") {
      const tmp = result.slice();
      tmp[index] = element.guess;
      result = tmp.slice();
    } else if (element.result === "present") {
      //if present, add to possible_chars if not already present
      if (!possible_chars.includes(element.guess)) {
        possible_chars.push(element.guess);
      }
      pass = false;
    } else {
      pass = false;
    }
  }

  return pass;
};

const Reset = () => {
  result = ["", "", "", "", ""];
  guess = ["", "", "", "", ""];
  possible_chars = [];
};

export const GuessWordleLoop = async (seed) => {
  let run_count = 0;
  Reset();
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

      //check if elements in possible_chars sum non-empty result = 5, yes -> break the loop
      if (
        possible_chars.length + result.filter((char) => char !== "").length >=
        5
      ) {
        break;
      }

      //guess the word by calling the API
      //handle z case as well
      if ((i > 0 && i % 5 === 4) || i === 25) {
        console.log("Guessing word: ", guess.join("").replace(",", ""));
        run_count++;
        const response = await fetch_data(guess, seed);
        Validation(response);

        //avoid rate limit
        await sleep(1500);
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
      //if the index is the last element or the only element, fill all empty characters with that character
      if (index.length === 1 || index === possible_chars.length - 1) {
        for (let j = 0; j < 5; j++) {
          if (result[j] === "") {
            result[j] = element;
          }
        }
        break;
      }

      guess = result.slice(); //reset guess to result

      // fill the empty characters with possible_chars
      for (let j = 0; j < 5; j++) {
        if (result[j] === "") {
          guess[j] = element;
        }
      }

      //check existing result against wordlist
      const possibilities = FindPossibilities();
      if (possibilities.length === 1) {
        //found exact match
        result = possibilities[0].split("");
        console.log("Found exact match: ", result);
        //check result
        const checking = await fetch_data(result, seed);
        if (Validation(checking)) {
          //correct guess
          return run_count + 1;
        }
        //continue if not correct (some vocabularies may be missing from the list)
      }

      console.log(
        `Guessing word 2nd round #${index + 1}: `,
        guess.join("").replace(",", "")
      );

      run_count++;
      const response = await fetch_data(guess, seed);
      const checking = Validation(response);
      if (checking === true) {
        //all characters are correct
        break;
      }

      //avoid rate limit
      await sleep(1500);
    }

    //final check
    run_count++;
    const final_check = await fetch_data(result, seed);
    const final_checking = Validation(final_check);
    if (final_checking === true) {
      console.log("Final validation passed");
      console.log(
        "All characters are filled: ",
        result.join("").replace(",", ""),
        ` Run ${run_count} times`
      );
      console.log("=====================================");
    } else {
      throw new Error("Final validation failed");
    }

    return run_count;
  } catch (error) {
    console.error(("[guess_wordle_loop] error: ", error));
    return null;
  }
};
