// src/pages/Home.jsx
import React, { useState, useEffect, useRef } from 'react';
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';   // ✅ 你要真的用到它
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
<div className="container mx-auto px-4">
  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-32">
    
    {/* 左側文字 */}
    <div className="flex flex-col justify-center space-y-6 h-[500px] px-4 md:px-0">
      {/* 橘色小橫線 */}
      <div className="h-1 w-12 bg-orange-500"></div>

      {/* 只有標題套動畫 */}
      <motion.h2
        className="text-3xl font-bold uppercase"
        initial={{ x: -50, opacity: 0 }}
        whileInView={{ x: 0, opacity: 1 }}
        viewport={{ once: false, amount: 0.5 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
      >
        歡迎! 陳昱凱的個人網站
      </motion.h2>

      {/* 段落文字 */}
      <p className="text-lg leading-[1.8]">
        我是陳昱凱，目前就讀於「國立陽明交通大學資訊管理研究所碩士」一年級，隸屬於分散式系統實驗室。大學期間就讀於國立中正大學資訊管理學系，以GPA 4.23（系上第一名）的成績提前畢業。
      </p>
      <p className="text-lg leading-[1.8]">
        在大學及研究所期間，修習過多門資訊課程，如物件導向 Java、程式設計、資料庫管理、網頁程式設計、計算機概論、網路概論、計算機組織、資訊安全技術、資料探勘研究與實務、分散式系統等...
      </p>

      {/* 只留 Read More，並用 Link 導向 /skill */}
      <div className="flex">
        <Link
          to="/skill"
          className="!bg-black !text-white !font-bold px-6 py-2 rounded-lg 
              transition-colors duration-200 ease-out 
              hover:!bg-white hover:!text-black hover:shadow-lg"
        >
          Read More
        </Link>
      </div>
    </div>

    {/* 右側圖片：直接給一個固定高度，然後 object-cover */}
    <div className="h-[500px] w-[887px] overflow-hidden rounded-lg shadow-lg">
      <img
        src="/images/test5.jpg"
        alt="About me"
        className="w-full h-full object-cover"
      />
    </div>

  </div>
</div>


    </>
  );
}