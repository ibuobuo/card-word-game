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
  const [playerCount, setPlayerCount] = useState(2);
  const [playerScores, setPlayerScores] = useState([0, 0]);
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

  const handleScoreChange = (index, delta) => {
    const updatedScores = [...playerScores];
    updatedScores[index] += delta;
    setPlayerScores(updatedScores);
  };

  const renderCards = () => {
    const items = [];
    for (let i = 0; i < conditions.length; i++) {
      items.push(
        <div key={`card-${i}`} className="card">{conditions[i]}</div>
      );
      if (i < conditions.length - 1) {
        items.push(
          <div key={`sep-${i}`} className="separator" style={{ fontSize: "2rem" }}>∩</div>
        );
      }
    }
    return <div className="card-vertical-container">{items}</div>;
  };

  const renderPlayerCounters = () => {
    const counters = [];
    for (let i = 0; i < playerCount; i++) {
      counters.push(
        <div key={i} className="player-counter-box">
          <div className="score-box">プレイヤー{i + 1}: {playerScores[i] || 0}点</div>
          <div className="button-column">
            <button className="score-button" onClick={() => handleScoreChange(i, +1)}>＋</button>
            <button className="score-button" onClick={() => handleScoreChange(i, -1)}>－</button>
          </div>
        </div>
      );
    }
    return <div className="player-counter-container">{counters}</div>;
  };

  return (
    <div className="App">
      <h1>∩ゲーム</h1>

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

      <div className="selector">
        <label>プレイヤー人数: </label>
        <select
          value={playerCount}
          onChange={(e) => {
            const count = Number(e.target.value);
            setPlayerCount(count);
            setPlayerScores(Array(count).fill(0));
          }}
        >
          <option value={1}>1</option>
          <option value={2}>2</option>
          <option value={3}>3</option>
          <option value={4}>4</option>
        </select>
      </div>

      <div className="cards-wrapper">
        {renderCards()}
      </div>

      <div style={{ marginTop: "2rem" }}>
        <button
          onClick={handleAnswer}
          className="answer-button"
        >
          回答！
        </button>
      </div>

      {renderPlayerCounters()}

      {eventMessage && (
        <div className="event-popup">{eventMessage}</div>
      )}
    </div>
  );
}
