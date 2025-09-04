import { wordlist } from "./wordlist_array.js";

const Compare = (position, char, seed) => {
  const correct_word = wordlist[seed];
  if (correct_word[position] === char) {
    return "correct";
  } else if (correct_word.includes(char)) {
    return "present";
  } else {
    return "absent";
  }
};

export const fetch_data = async (guess, seed = 0) => {
  try {
    if (Boolean(process.env.TESTING) === true) {
      //backtest
      if (guess.join("").replace(",", "").length !== 5) {
        //invalid guess
        throw new Error("Invalid guess");
      } else {
        return [
          {
            slot: 0,
            guess: guess[0],
            result: Compare(0, guess[0], seed),
          },
          {
            slot: 1,
            guess: guess[1],
            result: Compare(1, guess[1], seed),
          },
          {
            slot: 2,
            guess: guess[2],
            result: Compare(2, guess[2], seed),
          },
          {
            slot: 3,
            guess: guess[3],
            result: Compare(3, guess[3], seed),
          },
          {
            slot: 4,
            guess: guess[4],
            result: Compare(4, guess[4], seed),
          },
        ];
      }
    }

    const response = await fetch(
      `${process.env.GUESS_URL}?guess=${guess
        .join("")
        .replace(",", "")}&seed=${seed}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (response.ok === true) {
      const data = await response.json();
      // console.log(("Response from server: ", data));
      return data;
    } else {
      //exception handling
      console.error("Error response from server: ", response.status);
      throw new Error("Error response from server");
    }
  } catch (error) {
    throw error;
  }
};
