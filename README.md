<h1 align="center">Welcome to this project 👋</h1>
<p>
</p>

> To demostrate how to solve the wordle like puzzle

<h2> How to use it</h2>

Simply run below

node index.js

## Open packages used

1. dotenv https://github.com/motdotla/dotenv

# Performance

| Item                               | Tries | Avg Guess | Error |
| :--------------------------------- | :---: | :-------: | ----: |
| Without checking against a-z round |  100  |   6.53    |     7 |
| With checking against a-z round    |  100  |    7.1    |     0 |

# Backtest

| Tries | Avg Guess | Min | Max |
| :---- | :-------: | :-: | --: |
| 14855 |   7.53    |  3  |  10 |

## To-do

1. <s>Improve error guessing (e.g. civic , i is "correct" in position from first a-z guessing, leading to failure since i will not be used later)</s>
2. Changing the a-z guessing mechanism may improve the performance, e.g. vowels words will be guessed first

## Author

👤 **Ray Wong**

- Github: [@rayhk6](https://github.com/rayhk6)

## Show your support

Give a ⭐️ if this project helped you!

## References

Ref: https://gist.github.com/dracos/dd0668f281e685bad51479e5acaadb93

---
