import React, { useState } from "react";
import "./App.css";

const conditionWords = {
  nouns: [
  "食べ物",           // 果物・野菜・料理・お菓子など
  "芸能人",           
  "飲み物",           // ソフトドリンク・アルコールなど
  "動物",             // 哺乳類・鳥類・虫など
  "植物",             // 木・草・花・野菜など
  "家電",             // 冷蔵庫・掃除機・テレビなど
  "家具",             // 机・椅子・ベッドなど
  "乗り物",           // 車・電車・船・飛行機など
  "建物",             // 家・学校・店・施設など
  "場所",             // 公園・海・山・図書館など
  "人間の体",         // 手・目・髪・臓器など
  "衣類",             // シャツ・ズボン・靴など
  "道具",             // ハサミ・工具・調理器具など
  "職業",             // 医者・教師・農家・警察官など
  "スポーツ",         // 野球・サッカー・器具・技など
  "料理",             // カレー・寿司・ラーメンなど
  "ゲーム",           // ボード・テレビ・スマホゲームなど
  "おもちゃ",         // 人形・ブロック・カードなど
  "国・地域",         // 日本・フランス・アジアなど
  "コンビニ商品",     // 雑誌・ドリンク・お菓子・日用品など
  "仕事道具",         // パソコン・ホワイトボード・名刺など
  "理系っぽい言葉",    // 試験管・元素・分子など
  "遊び",             // かくれんぼ・鬼ごっこ・すごろくなど
  "イベント",         // 結婚式・誕生日・文化祭など
  "日本史に関する言葉", // 江戸時代・戦争・人物など
  "世界史に関する言葉",//
  "自然地形",         // 山・川・海・滝など
  "宇宙に関する言葉",   // 星・惑星・宇宙船など
  "地図に書いているもの",   // 島・湖・港・鉄道など
  "日用品",           // 歯ブラシ・タオル・せっけんなど
  "ビジネス用語" // 会議・プレゼン・契約・商談など
  ],
  others: [
    "大きい", "小さい", "長い", "短い", "広い", "狭い", "重い", "軽い", "厚い", "薄い",
  "高い", "低い", "強い", "弱い", "明るい", "暗い", "暑い", "寒い",
  "冷たい", "温かい", "熱い", "柔らかい", "硬い", "鋭い", "鈍い", "甘い", "苦い", "酸っぱい",
  "しょっぱい", "美味しい", "まずい", "優しい", "怖い", "楽しい", "悲しい",
  "かわいい", "かっこいい", "きれい", "汚い", "不思議な", "面白い", "つまらない", "速い", "遅い",
  "安い", "珍しい", "派手な", "地味な","4文字の言葉", "5文字の言葉",
  "漢字2文字", "アルファベット3文字",
  "「あ」から始まる", "「き」から始まる", "「せ」から始まる", "「ち」から始まる", "「う」から始まる",
  "「ん」で終わる", "「こ」で終わる", "「た」で終わる", "なつかしい","自分しか知らないワード","今日見た・話した",
  "今1位の人に関係する","赤い","エロい","愛知に関係する","小学生でも知っているワード","名前に濁音が入っている",
  ]
};

const events = [
  { message: "今回は2ptチャンス！", type: "bonus" },
  { message: "全員答えて最後の人は-2pt", type: "penalty" },
  { message: "1位から2pt奪う", type: "challenge" },
  { message: "最下位が正解したら5pt", type: "challenge" },
  { message: "今1位の人は1杯飲む！！", type: "challenge" },
  { message: "最下位の人は1杯飲む！！", type: "challenge" },
  { message: "滋賀県出身以外は1杯飲む！！", type: "challenge" },
];

const getRandomCombination = (nouns, others, used, count) => {
  let attempts = 0;
  while (attempts < 1000) {
    const nounCount = Math.random() < 0.5 && count > 1 ? 1 : 0;
    const otherCount = count - nounCount;

    const selectedNouns = [...nouns].sort(() => 0.5 - Math.random()).slice(0, nounCount);
    const selectedOthers = [...others].sort(() => 0.5 - Math.random()).slice(0, otherCount);

    const selected = [...selectedNouns, ...selectedOthers];
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
    const initial = getRandomCombination(conditionWords.nouns, conditionWords.others, new Set(), cardCount);
    return initial || [];
  });
  const [eventMessage, setEventMessage] = useState(null);

  const handleAnswer = () => {
    const newUsed = new Set(usedCombinations);
    const next = getRandomCombination(conditionWords.nouns, conditionWords.others, newUsed, cardCount);
    if (next) {
      setUsedCombinations(newUsed);
      setConditions(next);
      if (Math.random() < 0.1) {
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
          <div className="score-box">{playerScores[i] || 0}点</div>
          <div className="button-column">
            <button className="score-button" onClick={() => handleScoreChange(i, +1)}>＋</button>
            <button className="score-button" onClick={() => handleScoreChange(i, -1)}>－</button>
          </div>
        </div>
      );
    }
    return <div className="player-counter-container row-layout">{counters}</div>;
  };

  return (
    <div className="App" style={{ paddingTop: "0.5rem" }}>
      <h1>∩ゲーム</h1>

      {eventMessage && (
        <div className="event-popup">{eventMessage}</div>
      )}

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
          次の問題！
        </button>
      </div>

      {renderPlayerCounters()}
    </div>
  );
}
