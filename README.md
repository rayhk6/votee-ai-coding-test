<h1 align="center">Welcome to this project 👋</h1>
<p>
</p>

> To demostrate how to solve the wordle like puzzle.

# How to use it

Simply run below

`$ npm run start`

## Open source packages used

1. dotenv https://github.com/motdotla/dotenv

# Performance

| Item                               | Tries | Avg Guess | Error |
| :--------------------------------- | :---: | :-------: | ----: |
| Without checking against a-z round |  100  |   6.53    |     7 |
| With checking against a-z round    |  100  |    7.1    |     0 |
| Final                              |  100  |   6.77    |     0 |

# Backtest

| Logic             | Tries | Avg Guess | Min | Max |
| :---------------- | :---: | :-------: | :-: | --: |
| Normal            | 14855 |   7.53    |  3  |  10 |
| Vowels first      | 14855 |   7.45    |  3  |  10 |
| By char frequency | 14855 |   7.15    |  2  |  10 |

## To-do

1. <s>Improve error guessing (e.g. civic , i is "correct" in position from first a-z guessing, leading to failure since i will not be used later)</s>
2. <s>>Changing the a-z guessing mechanism may improve the performance, e.g. vowels words will be guessed first</s>
3. If there are more than 1 possible combination from dictionary and the count is less than the count of possible characters, the program should try with dictionary combination first.

## Author

👤 **Ray Wong**

- Github: [@rayhk6](https://github.com/rayhk6)

## Show your support

Give a ⭐️ if this project helped you!

## References

Ref: https://gist.github.com/dracos/dd0668f281e685bad51479e5acaadb93

---
