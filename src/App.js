import React, { useState } from "react";
import "./App.css";

const allConditions = [
  "大きい",
  "赤い",
  "3文字",
  "コンビニに売っている",
  "みんな大好きな",
  "甘い",
  "丸い",
  "動物",
  "光る",
  "危険なもの"
];

const events = [
  { message: "今回は2ptチャンス！", type: "bonus" },
  { message: "最後の人は-1pt", type: "penalty" },
  { message: "お題が2倍難しい！？", type: "challenge" },
];

const getRandomCombination = (all, used, count) => {
  let attempts = 0;
  while (attempts < 1000) {
    const shuffled = [...all].sort(() => 0.5 - Math.random());
    const selected = shuffled.slice(0, count);
    const key = selected.sort().join("|");
    if (!used.has(key)) {
      used.add(key);
      return selected;
    }
    attempts++;
  }
  return null;
};

export default function App() {
  const [cardCount, setCardCount] = useState(2);
  const [usedCombinations, setUsedCombinations] = useState(new Set());
  const [conditions, setConditions] = useState(() => {
    const initial = getRandomCombination(allConditions, new Set(), cardCount);
    return initial || [];
  });
  const [eventMessage, setEventMessage] = useState(null);

  const handleAnswer = () => {
    const newUsed = new Set(usedCombinations);
    const next = getRandomCombination(allConditions, newUsed, cardCount);
    if (next) {
      setUsedCombinations(newUsed);
      setConditions(next);
      if (Math.random() < 0.3) {
        const randomEvent = events[Math.floor(Math.random() * events.length)];
        setEventMessage(randomEvent.message);
        setTimeout(() => setEventMessage(null), 3000);
      }
    } else {
      alert("これ以上新しい組み合わせがありません！");
    }
  };

  const renderCards = () => {
    if (cardCount === 3 && conditions.length === 3) {
      return (
        <div className="card-layout-3">
          <div className="card">{conditions[2]}</div>
          <div className="bottom-row">
            <div className="card">{conditions[0]}</div>
            <div className="card">{conditions[1]}</div>
          </div>
        </div>
      );
    } else {
      return (
        <div className="card-container">
          {conditions.map((cond, idx) => (
            <div key={idx} className="card">{cond}</div>
          ))}
        </div>
      );
    }
  };

  return (
    <div className="App">
      <h1>カード条件ゲーム</h1>

      <div className="selector">
        <label>カード枚数: </label>
        <select
          value={cardCount}
          onChange={(e) => setCardCount(Number(e.target.value))}
        >
          <option value={1}>1</option>
          <option value={2}>2</option>
          <option value={3}>3</option>
        </select>
      </div>

      <div className="cards-wrapper">
        {renderCards()}
      </div>

      <button
        onClick={handleAnswer}
        className="answer-button"
      >
        回答！
      </button>

      {eventMessage && (
        <div className="event-popup">{eventMessage}</div>
      )}
    </div>
  );
}
