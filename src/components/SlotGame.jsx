// SlotGame.js
import React, { useState } from 'react';
import { motion } from 'framer-motion';

const symbols = ["🍒", "🍋", "🍇", "🔔", "💎"];
const paylines = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8]
];

function getRandomSymbol() {
  return symbols[Math.floor(Math.random() * symbols.length)];
}

const SlotGame = () => {
  const [reels, setReels] = useState([["", "", ""], ["", "", ""], ["", "", ""]]);
  const [bet, setBet] = useState(1);
  const [result, setResult] = useState(null);
  const [isSpinning, setIsSpinning] = useState(false);

  const spinReels = () => {
    setIsSpinning(true);
    const newReels = reels.map(reel => reel.map(getRandomSymbol));
    setTimeout(() => {
      setReels(newReels);
      checkWin(newReels);
      setIsSpinning(false);
    }, 1500);
  };

  const checkWin = (reels) => {
    const win = paylines.some(line => {
      const [a, b, c] = line.map(idx => reels[Math.floor(idx / 3)][idx % 3]);
      return a === b && b === c;
    });
    setResult(win ? `You won ${bet * 10} coins!` : 'No win. Try again!');
  };

  const handleBetChange = (e) => {
    setBet(parseInt(e.target.value));
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
                className="text-2xl border-2 border-gray-300 rounded-lg p-4 mb-2 w-16 h-16 flex items-center justify-center"
              >
                {symbol}
              </motion.div>
            ))}
          </div>
        ))}
      </div>
      <div className="mb-4">
        <label className="text-lg font-medium">
          Bet:
          <select
            onChange={handleBetChange}
            value={bet}
            disabled={isSpinning}
            className="ml-2 p-1 border rounded-lg bg-white text-lg"
          >
            <option value="1">1</option>
            <option value="5">5</option>
            <option value="10">10</option>
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
