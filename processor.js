import { fetch_data } from "./lib/fetch.js";
import { wordlist } from "./lib/wordlist_array.js";
import { alphabet_array } from "./util/alphabet.js";
import { sleep } from "./util/sleep.js";

//avoid TLS error for self-signed cert
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
// set the result variable
let result = ["", "", "", "", ""];
let guess = ["", "", "", "", ""];

let possible_chars = [];
let duplicated_chars = []; //for handling a-z guessing result

// find possible words from wordlist based on result and possible_chars
const FindPossibilities = () => {
  return wordlist.filter(
    (word) =>
      result.every((char, index) => char === "" || word[index] === char) &&
      possible_chars.every((char) => word.includes(char))
  );
};

const Validation = (response, initial = false) => {
  console.log(response);
  //check response one by one
  let pass = true;
  for (let index = 0; index < response.length; index++) {
    const element = response[index];
    if (element.result === "correct") {
      const tmp = result.slice();
      tmp[index] = element.guess;
      result = tmp.slice();
      if (!duplicated_chars.includes(element.guess) && initial) {
        duplicated_chars.push(element.guess);
      }
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
  duplicated_chars = [];
};

export const GuessWordleLoop = async (seed) => {
  let run_count = 0;
  Reset();
  try {
    let alphabet = alphabet_array.slice();
    // guess the characters by looping a-z
    for (let i = 0; i < 6; i++) {
      //try vowels first

      if (i === 0) {
        guess = ["a", "e", "i", "o", "u"];
        //remove elements from alphabet_array
        alphabet.splice(alphabet.indexOf("a"), 1);
        alphabet.splice(alphabet.indexOf("e"), 1);
        alphabet.splice(alphabet.indexOf("i"), 1);
        alphabet.splice(alphabet.indexOf("o"), 1);
        alphabet.splice(alphabet.indexOf("u"), 1);
      } else if (i === 5) {
        //handle z case
        const char = alphabet[0];
        guess = [char, char, char, char, char];
        alphabet.splice(alphabet.indexOf(char), 1);
      } else {
        for (let j = 0; j < 5; j++) {
          let char = alphabet[0];
          alphabet.splice(0, 1);

          guess[j] = char;
        }
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

      console.log("Guessing word: ", guess.join("").replace(",", ""));
      run_count++;
      const response = await fetch_data(guess, seed);
      Validation(response, true);

      //avoid rate limit
      await sleep(1500);
    }
    console.log(
      "Result after first round: ",
      result,
      ` Possible chars: ${possible_chars}`,
      ` Duplicated chars: ${duplicated_chars}`
    );

    //check existing result against wordlist
    const possibilities = FindPossibilities();
    if (possibilities.length === 1) {
      //found exact match
      guess = possibilities[0].split("");
      console.log("Found exact match: ", guess);
      //check result
      const checking = await fetch_data(guess, seed);

      if (Validation(checking) === true) {
        //correct guess
        return run_count + 1;
      }
      //continue if not correct (some vocabularies may be missing from the list)
    }

    //check if all elements of result are filled
    for (let index = 0; index < possible_chars.length; index++) {
      const element = possible_chars[index];
      guess = result.slice(); //reset guess to result

      //if the index is the last element or the only element, fill all empty characters with that character
      if (index.length === 1 || index === possible_chars.length - 1) {
        for (let j = 0; j < 5; j++) {
          if (result[j] === "") {
            guess[j] = element;
          }
        }
        break;
      }

      // fill the empty characters with possible_chars
      for (let j = 0; j < 5; j++) {
        if (result[j] === "") {
          guess[j] = element;
        }
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
        return run_count;
      }

      //avoid rate limit
      await sleep(1500);
    }

    //final check
    run_count++;

    const final_check = await fetch_data(guess, seed);
    const final_checking = Validation(final_check);
    if (final_checking === true) {
      console.log("Final validation passed");
      console.log(
        "All characters are filled: ",
        result.join("").replace(",", ""),
        ` Run ${run_count} times`
      );
      console.log("=====================================");
      return run_count;
    } else {
      // exceptional cases handling, e.g. civic with correct i position in a-z guessing etc.
      // check duplicated_chars
      guess = result.slice();
      for (let index = 0; index < duplicated_chars.length; index++) {
        const element = duplicated_chars[index];
        for (let j = 0; j < 5; j++) {
          if (result[j] === "") {
            guess[j] = element;
          }
        }
        const response = await fetch_data(guess, seed);
        const checking = Validation(response);
        if (checking === true) {
          //all characters are correct
          console.log("Final validation passed with duplicated chars");
          console.log(
            "All characters are filled: ",
            result.join("").replace(",", ""),
            ` Run ${run_count} times`
          );
          console.log("=====================================");
          return run_count + 1;
        }
      }
      throw new Error("Final validation failed");
    }
  } catch (error) {
    console.error(("[guess_wordle_loop] error: ", error));
    throw error;
  }
};
