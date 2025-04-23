// src/pages/Home.jsx
import React, { useState, useEffect, useRef } from 'react';

export default function Home() {
  const slides = ['/images/slide1.jpg','/images/slide2.jpg','/images/slide3.jpg','/images/slide4.jpg'];
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
      {/* 1. 這個 wrapper 不在任何 container 裡 → w-full 到視窗最邊 */}
      {/* 2. h-[calc(100vh-4rem)] 讓它從 NavBar 底下撐滿整個視窗高度 */}
      <div className="relative w-full h-[calc(100vh-4rem)] overflow-hidden">
        {/* object-cover 填滿這個框框 */}
        <img
          src={slides[idx]}
          alt=""
          className="w-full h-full object-cover"
        />

        {/* 左右箭頭浮在邊緣（不受其它 padding 影響） */}
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

      {/* 下面才回到 container 放其他內容 */}
      <div className="container mx-auto px-4 py-8">
        {/* 你的其他版塊 */}
        <p>下面是其他內容…</p>
      </div>
    </>
  );
}




  


  