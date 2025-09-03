export const fetch_data = async (guess) => {
  try {
    const response = await fetch(
      `${process.env.GUESS_URL}?guess=${guess.join("").replace(",", "")}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (response.ok === true) {
      const data = await response.json();
      console.log(("Response from server: ", data));
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
