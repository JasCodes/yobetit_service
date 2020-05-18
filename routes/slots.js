const express = require("express");
const router = express.Router();

// - Reel1: ['cherry', 'lemon', 'apple', 'lemon', 'banana', 'banana', 'lemon', 'lemon']
// - Reel2: ['lemon', 'apple', 'lemon', 'lemon', 'cherry', 'apple', 'banana', 'lemon']
// - Reel3: ['lemon', 'apple', 'lemon', 'apple', 'cherry', 'lemon', 'banana', 'lemon']

const reelMat = [
  ["cherry", "lemon", "apple", "lemon", "banana", "banana", "lemon", "lemon"],
  ["lemon", "apple", "lemon", "lemon", "cherry", "apple", "banana", "lemon"],
  ["lemon", "apple", "lemon", "apple", "cherry", "lemon", "banana", "lemon"]
];

// . 3 cherries in a row: won 50 coins
// . 2 cherries in a row: won 40 coins
// . 3 Apples in a row: won 20 coins
// . 2 Apples in a row: won 10 coins
// . 3 Bananas in a row: won 15 coins
// . 2 Bananas in a row: won 5 coins
// . 3 lemons in a row: won 3 coins

const getScore = result => {
  const hashMap = {};
  for (const fruit of result) {
    hashMap[fruit] = hashMap[fruit] + 1 || 1;
  }
  if (hashMap["cherry"] === 3) return 50;
  if (hashMap["cherry"] === 2) return 40;
  if (hashMap["apple"] === 3) return 20;
  if (hashMap["apple"] === 2) return 10;
  if (hashMap["banana"] === 3) return 15;
  if (hashMap["banana"] === 2) return 5;
  if (hashMap["lemon"] === 3) return 3;
};

const cachedScoreResultHashMap = {};
let count = 0;
const runCombos = (list, n = 0, result = [], current = []) => {
  if (n === list.length) {
    result.push(current);
    const score = getScore(current);
    if (score) cachedScoreResultHashMap[current] = score;
  } else
    list[n].forEach(item => runCombos(list, n + 1, result, [...current, item]));
  return result;
};
runCombos(reelMat);
console.log("Generated following precomputed hash map between result and score so it only will need to evaluated once.")
console.log(cachedScoreResultHashMap);

//

// shuffle
const getRandomInt = max => Math.floor(Math.random() * Math.floor(max));
const shuffle = reelMat => {
  const result = [];
  for (const reel of reelMat) {
    let ranReelIndex = getRandomInt(reel.length);
    // result.push(reel[ranReelIndex]);
    result.push(ranReelIndex)
  }
  return result;
};
// console.log(shuffle(reelMat));

router.get("/", function (req, res, next) {
  const result = shuffle(reelMat);
  const score = cachedScoreResultHashMap[result] || 0;
  res.json({ result, score, reels: reelMat });
});

module.exports = router;
