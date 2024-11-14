import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

// Symbol configuration and paylines
const symbols = ["🍒", "🍋", "🍇", "🔔", "💎"];
const maxPaylines = 25;
const paylines = [
  [0, 1, 2, 3, 4],
  [5, 6, 7, 8, 9],
  [10, 11, 12, 13, 14],
  // Additional paylines as needed
];

function getRandomSymbol() {
  return symbols[Math.floor(Math.random() * symbols.length)];
}

const SlotGame = () => {
  const [reels, setReels] = useState(Array(5).fill(Array(3).fill("")));
  const [paylineCount, setPaylineCount] = useState(1);
  const [betPerLine, setBetPerLine] = useState(1);
  const [result, setResult] = useState(null);
  const [gameHistory, setGameHistory] = useState([]);
  const [leaderboard, setLeaderboard] = useState([]);
  const [winningLines, setWinningLines] = useState([]);

  // Spin reels and update game history
  const spinReels = () => {
    const newReels = reels.map(() => Array(3).fill().map(getRandomSymbol));
    setReels(newReels);
    const winLines = checkWin(newReels);
    const winnings = winLines.length * betPerLine * 10;

    const spinResult = {
      reels: newReels,
      betPerLine,
      winnings,
      timestamp: new Date().toLocaleString(),
    };

    setGameHistory([spinResult, ...gameHistory]);
    updateLeaderboard(winnings);
    setResult(winnings > 0 ? `You won ${winnings} coins!` : 'No win. Try again!');
    setWinningLines(winLines);
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
    return winLines;
  };

  // Update leaderboard based on winnings
  const updateLeaderboard = (winnings) => {
    if (winnings > 0) {
      const newEntry = { id: Date.now(), winnings };
      const updatedLeaderboard = [...leaderboard, newEntry]
        .sort((a, b) => b.winnings - a.winnings)
        .slice(0, 10); // Keep top 10 players only
      setLeaderboard(updatedLeaderboard);
    }
  };

  // Real-time updates with useEffect
  useEffect(() => {
    const interval = setInterval(() => {
      // Simulate real-time data update for leaderboard
      console.log("Real-time leaderboard update:", leaderboard);
    }, 5000);
    return () => clearInterval(interval);
  }, [leaderboard]);

  return (
    <div className="text-center">
      <h1 className="text-3xl font-bold mb-6">🎰 Slot Machine 🎰</h1>

      {/* Display the reels */}
      <div className="flex justify-center mb-6">
        {reels.map((reel, i) => (
          <div key={i} className="mx-2">
            {reel.map((symbol, j) => (
              <motion.div
                key={j}
                animate={{ y: winningLines.includes(i) ? [0, -10, 0] : 0 }}
                transition={{ duration: 0.5 }}
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

      {/* Paylines and Bet Input */}
      <div className="mb-4">
        <label className="text-lg font-medium">
          Paylines:
          <select onChange={(e) => setPaylineCount(parseInt(e.target.value))} value={paylineCount} className="ml-2 p-1 border rounded-lg bg-white text-lg">
            {[...Array(maxPaylines).keys()].map(i => (
              <option key={i} value={i + 1}>{i + 1}</option>
            ))}
          </select>
        </label>
      </div>
      <div className="mb-4">
        <label className="text-lg font-medium">
          Bet per Line:
          <select onChange={(e) => setBetPerLine(parseInt(e.target.value))} value={betPerLine} className="ml-2 p-1 border rounded-lg bg-white text-lg">
            {[1, 5, 10].map(bet => (
              <option key={bet} value={bet}>{bet}</option>
            ))}
          </select>
        </label>
      </div>

      {/* Spin Button */}
      <button
        onClick={spinReels}
        className="bg-yellow-400 px-4 py-2 rounded-lg font-semibold text-lg text-white hover:bg-yellow-300 transition duration-300"
      >
        Spin
      </button>

      {/* Display Result */}
      {result && <p className="mt-4 text-xl font-semibold">{result}</p>}

      {/* Game History */}
      <div className="mt-8">
        <h2 className="text-xl font-semibold">Game History</h2>
        <ul className="max-h-48 overflow-y-auto border p-4 rounded-lg">
          {gameHistory.map((entry, index) => (
            <li key={index} className="mb-2">
              Spin at {entry.timestamp}: Bet {entry.betPerLine} - Winnings: {entry.winnings}
            </li>
          ))}
        </ul>
      </div>

      {/* Leaderboard */}
      <div className="mt-8">
        <h2 className="text-xl font-semibold">Leaderboard</h2>
        <ul className="border p-4 rounded-lg">
          {leaderboard.map((entry, index) => (
            <li key={entry.id} className="mb-2">
              Rank {index + 1}: Winnings {entry.winnings} coins
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default SlotGame;
