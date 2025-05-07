// src/pages/Home.jsx
import React, { useState, useEffect, useRef } from 'react';
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';


export default function Home() {
  const slides = [
    '/images/slide1.jpg',
    '/images/slide2.jpg',
    '/images/slide3.jpg',
    '/images/slide4.jpg'
  ];
  const [idx, setIdx] = useState(0);
  const timerRef = useRef();

  // 自動輪播
  useEffect(() => {
    timerRef.current = window.setTimeout(
      () => setIdx(i => (i + 1) % slides.length),
      10000
    );
    return () => window.clearTimeout(timerRef.current);
  }, [idx]);
  // 新增：技能預覽 State
  const [categories, setCategories] = useState([]);
  const [skillIdx, setSkillIdx] = useState(0);

  // 新增：抓取 categories + skills
  useEffect(() => {
    fetch('http://localhost:8080/api/categories')
      .then(res => res.json())
      .then(data => {
        const cats = data.map(cat => ({
          id: cat.id,
          name: cat.name,
          items: (cat.skills || []).map(s => s.name),
        }));
        setCategories(cats);
      });
  }, []);

  // 分頁參數
  const pageSize = 4;
  const visibleCats = categories.length
    ? Array.from({ length: pageSize }, (_, i) =>
        categories[(skillIdx + i) % categories.length]
      )
    : [];


  return (
    <>
      {/* 1. 輪播區塊（不變） */}
      <div className="relative w-full h-[calc(100vh-4rem)] overflow-hidden">
        <img
          src={slides[idx]}
          alt=""
          className="w-full h-full object-cover"
        />
        <button
          onClick={() => {
            window.clearTimeout(timerRef.current);
            setIdx(i => (i - 1 + slides.length) % slides.length);
          }}
          className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/30 p-3 rounded-full text-white"
        >‹</button>
        <button
          onClick={() => {
            window.clearTimeout(timerRef.current);
            setIdx(i => (i + 1) % slides.length);
          }}
          className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/30 p-3 rounded-full text-white"
        >›</button>
      </div>

{/* About Me 區塊 */}
<div className="relative w-full h-[500px]">
  {/* 文字區：原本的 container + Grid 都保留 */}
  <div className="container mx-auto px-4 h-full grid grid-cols-1 md:grid-cols-2 gap-8">
    <div className="flex flex-col justify-center space-y-6 h-full">
      <div className="h-1 w-12 bg-orange-500"></div>
      <motion.h2
        className="text-3xl font-bold uppercase text-white"
        initial={{ x: -50, opacity: 0 }}
        whileInView={{ x: 0, opacity: 1 }}
        viewport={{ once: false, amount: 0.5 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
      >
        歡迎! 陳昱凱的個人網站
      </motion.h2>
      <p className="text-lg leading-[1.8] text-gray-200">
        我是陳昱凱，目前就讀於「國立陽明交通大學資訊管理研究所碩士」一年級，隸屬於分散式系統實驗室。大學期間就讀於國立中正大學資訊管理學系，以GPA 4.23（系上第一名）的成績提前畢業。
      </p>
      <p className="text-lg leading-[1.8] text-gray-200">
        在大學及研究所期間，修習過多門資訊課程，如物件導向 Java、程式設計、資料庫管理、網頁程式設計、計算機概論、網路概論、計算機組織、資訊安全技術、資料探勘研究與實務、分散式系統等...
      </p>
      <Link
        to="/introduction"
        className="self-start !bg-black !text-white !font-bold px-6 py-2 rounded-lg 
        transition-colors duration-200 ease-out 
        hover:!bg-white hover:!text-black hover:shadow-lg"
      >
        Read More
      </Link>
    </div>
    {/* 這邊空一格，留給絕對定位的圖片 */}
    <div></div>
  </div>

  {/* 圖片區：絕對定位到 container 的最右邊 */}
  <div className="      absolute inset-y-0 right-0 my-auto
      w-full 
      sm:w-1/2     /* 小螢幕 50% 寬 */
      md:w-2/5     /* 中螢幕 40% 寬 */
      lg:w-[887px] /* 大螢幕固定 887px */
      max-h-[500px] overflow-hidden rounded-l-lg shadow-lg">
    <img
      src="/images/test5.jpg"
      alt="About me"
      className="w-full h-full object-cover"
    />
  </div>
</div>


{/* 技能預覽 區塊 */}
<div className="py-16 bg-gray-900 relative w-full"          
      style={{
            backgroundImage: 
              // 第一層：深黑漸層；第二層：你的圖片
              "linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.6)), url('/images/image9.jpg')",
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            }}          >
  {/* 標題區塊 */}
  <div className="mb-12 text-center">
    <h1 className="text-4xl font-bold text-white">技能</h1>
    <p className="mt-2 text-lg font-bold text-gray-300 tracking-widest">
      Skills
    </p>
  </div>

  {/* ← 左箭頭：預設隱藏，滑鼠移到 group 才淡入 */}
  <button
    onClick={() =>
      setSkillIdx(i => (i - 1 + categories.length) % categories.length)
    }
    className={`
      absolute top-1/2 left-4 -translate-y-1/2 
      opacity-0 hover:opacity-100 transition-opacity duration-300
      text-white !text-2xl select-none
    `}
  >
    ‹
  </button>

{/* —— 主要容器（撐滿全寬 + 等高卡片） —— */}
<div className="w-full px-6 lg:px-24 flex justify-evenly items-stretch gap-8">
  {visibleCats.map(cat => (
    <div
      key={cat.id}
      className="
        flex-1                    /* 平均分寬 */
        border border-gray-300 rounded-lg 
        p-8 lg:p-8               /* 內距 */
        bg-white shadow-lg 
        flex flex-col 
        min-h-[320px]             /* 最少高度，能擺下 4 筆列表 */
      "
    >
      {/* 標題：再放大 */}
      <h3 className="text-center font-bold text-4xl mb-6 text-gray-800">
        {cat.name}
      </h3>

      {/* 技能列表：更大 */}
      <ul className="list-disc list-inside text-2xl text-gray-700 flex-1 space-y-4">
        {cat.items.slice(0, 4).map((item, i) => (
          <li key={i}>{item}</li>
        ))}
      </ul>
    </div>
  ))}
</div>

  {/* → 右箭頭 */}
  <button
    onClick={() => setSkillIdx(i => (i + 1) % categories.length)}
    className="    
    absolute top-1/2 right-4 -translate-y-1/2
    opacity-0 hover:opacity-100 transition-opacity duration-300

    /* 同樣的樣式 */
    bg-black/20 p-3 rounded-full
    text-white !text-2xl select-none"
  >
    ›
  </button>

  {/* 查看更多技能 */}
  <div className="mt-12 text-center">
    <Link
      to="/skill"
      className="inline-block bg-blue-600 !text-white !font-bold px-6 py-3 rounded hover:bg-blue-900 transition"
    >
      查看更多技能
    </Link>
  </div>
</div>

    </>
  );
}