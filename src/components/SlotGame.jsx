// SlotGame.js
import React, { useState } from 'react';
import { motion } from 'framer-motion';

const symbols = ["🍒", "🍋", "🍇", "🔔", "💎"];
const maxPaylines = 25;

// Define some sample paylines as combinations of positions
// This example assumes 5 reels and 3 rows.
const paylines = [
  [0, 1, 2, 3, 4], // Horizontal line across the middle
  [5, 6, 7, 8, 9], // Top row
  [10, 11, 12, 13, 14], // Bottom row
  // Add more paylines as desired, up to 25
  // Diagonals and other combinations...
];

function getRandomSymbol() {
  return symbols[Math.floor(Math.random() * symbols.length)];
}

const SlotGame = () => {
  const [reels, setReels] = useState(Array(5).fill(Array(3).fill("")));
  const [paylineCount, setPaylineCount] = useState(1);
  const [betPerLine, setBetPerLine] = useState(1);
  const [result, setResult] = useState(null);
  const [isSpinning, setIsSpinning] = useState(false);
  const [winningLines, setWinningLines] = useState([]);

  // Spin reels
  const spinReels = () => {
    setIsSpinning(true);
    const newReels = reels.map(() => Array(3).fill().map(getRandomSymbol));
    setTimeout(() => {
      setReels(newReels);
      checkWin(newReels);
      setIsSpinning(false);
    }, 1500);
  };

  // Check for winning paylines
  const checkWin = (reels) => {
    const activePaylines = paylines.slice(0, paylineCount);
    let winLines = [];
    activePaylines.forEach((line, index) => {
      const [a, b, c, d, e] = line.map(pos => reels[Math.floor(pos / 3)][pos % 3]);
      if (a === b && b === c && c === d && d === e) {
        winLines.push(index);
      }
    });
    setWinningLines(winLines);
    setResult(winLines.length > 0 ? `You won ${winLines.length * betPerLine * 10} coins!` : 'No win. Try again!');
  };

  const handlePaylineChange = (e) => {
    setPaylineCount(Math.min(parseInt(e.target.value), maxPaylines));
  };

  const handleBetChange = (e) => {
    setBetPerLine(parseInt(e.target.value));
  };

  return (
    <div className="text-center">
      <h1 className="text-3xl font-bold mb-6">🎰 Slot Machine 🎰</h1>
      <div className="flex justify-center mb-6">
        {reels.map((reel, i) => (
          <div key={i} className="mx-2">
            {reel.map((symbol, j) => (
              <motion.div
                key={j}
                animate={{ y: isSpinning ? [-20, 20, -20, 0] : 0 }}
                transition={{ duration: 0.5, repeat: isSpinning ? Infinity : 0 }}
                className={`text-2xl border-2 border-gray-300 rounded-lg p-4 mb-2 w-16 h-16 flex items-center justify-center ${
                  winningLines.includes(i) ? "bg-green-300" : ""
                }`}
              >
                {symbol}
              </motion.div>
            ))}
          </div>
        ))}
      </div>
      <div className="mb-4">
        <label className="text-lg font-medium">
          Paylines:
          <select onChange={handlePaylineChange} value={paylineCount} disabled={isSpinning} className="ml-2 p-1 border rounded-lg bg-white text-lg">
            {[...Array(maxPaylines).keys()].map(i => (
              <option key={i} value={i + 1}>{i + 1}</option>
            ))}
          </select>
        </label>
      </div>
      <div className="mb-4">
        <label className="text-lg font-medium">
          Bet per Line:
          <select onChange={handleBetChange} value={betPerLine} disabled={isSpinning} className="ml-2 p-1 border rounded-lg bg-white text-lg">
            {[1, 5, 10].map(bet => (
              <option key={bet} value={bet}>{bet}</option>
            ))}
          </select>
        </label>
      </div>
      <button
        onClick={spinReels}
        disabled={isSpinning}
        className={`${
          isSpinning ? 'bg-gray-300' : 'bg-yellow-400 hover:bg-yellow-300'
        } px-4 py-2 rounded-lg font-semibold text-lg text-white transition duration-300`}
      >
        {isSpinning ? "Spinning..." : "Spin"}
      </button>
      {result && <p className="mt-4 text-xl font-semibold">{result}</p>}
    </div>
  );
};

export default SlotGame;
