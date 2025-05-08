// src/pages/Home.jsx
import React, { useState, useEffect, useRef } from 'react';
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from 'framer-motion';
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
  
  // 新增：滑動方向狀態，用於技能卡片滑動動畫
  const [slideDirection, setSlideDirection] = useState(0); // -1: 向左, 1: 向右, 0: 初始

  // 預載入所有圖片
  const preloadImages = () => {
    slides.forEach((src) => {
      const img = new Image();
      img.src = src;
    });
  };

  // 自動輪播
  useEffect(() => {
    // 預載入圖片
    preloadImages();
    
    // 設置自動輪播
    timerRef.current = window.setTimeout(
      () => setIdx(i => (i + 1) % slides.length),
      10000
    );
    return () => window.clearTimeout(timerRef.current);
  }, [idx]);
  
  // 新增：技能預覽 State
  const [categories, setCategories] = useState([]);
  const [skillIdx, setSkillIdx] = useState(0);
  
  // 新增：專案預覽 State
  const [featuredProjects, setFeaturedProjects] = useState([]);
  const [isProjectsLoading, setIsProjectsLoading] = useState(true);

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
  
  // 新增：抓取精選專案
  useEffect(() => {
    setIsProjectsLoading(true);
    fetch('/api/projects')
      .then(res => res.json())
      .then(data => {
        // 假設我們只想顯示最新的3個專案
        const featured = data.slice(0, 3);
        setFeaturedProjects(featured);
        setIsProjectsLoading(false);
      })
      .catch(err => {
        console.error('無法載入專案資料:', err);
        setIsProjectsLoading(false);
        // 假資料以防API未實現
        setFeaturedProjects([
          {
            id: 1,
            name: '醫療資訊整合平台',
            description: '整合多家醫院的病患資訊，讓醫生能夠快速取得病患病歷，進行更精準的診斷。',
            imageUrl: '/images/project1.jpg',
            year: '2023/01-2023/06',
            technologies: ['React', 'Node.js', 'MongoDB']
          },
          {
            id: 2,
            name: '雲端分散式儲存系統',
            description: '實現一個高效能、高可靠性的分散式儲存系統，支援大規模資料的快速存取和備份。',
            imageUrl: '/images/project2.jpg',
            year: '2022/09-2023/03',
            technologies: ['Go', 'Docker', 'Kubernetes']
          },
          {
            id: 3,
            name: '多語言即時翻譯應用',
            description: '開發一款能夠即時翻譯多國語言的應用程式，支援語音輸入和輸出，方便跨國溝通。',
            imageUrl: '/images/project3.jpg',
            year: '2022/05-2022/12',
            technologies: ['Flutter', 'TensorFlow', 'Firebase']
          }
        ]);
      });
  }, []);

  // 分頁參數
  const pageSize = 4;
  const visibleCats = categories.length
    ? Array.from({ length: pageSize }, (_, i) =>
        categories[(skillIdx + i) % categories.length]
      )
    : [];
    
  // 切換到前一組技能，並設定向左滑動動畫
  const prevSkill = () => {
    setSlideDirection(-1);
    setSkillIdx(i => (i - 1 + categories.length) % categories.length);
  };
  
  // 切換到下一組技能，並設定向右滑動動畫
  const nextSkill = () => {
    setSlideDirection(1);
    setSkillIdx(i => (i + 1) % categories.length);
  };
    
  // 生成技能卡片滑動動畫變量
  const getSlideAnimation = () => {
    return {
      initial: { 
        x: slideDirection * 80,
        opacity: 0
      },
      animate: { 
        x: 0,
        opacity: 1
      },
      exit: { 
        x: slideDirection * -80,
        opacity: 0 
      },
      transition: { 
        duration: 0.3,
        ease: "easeInOut"
      }
    };
  };

  // 輪播區塊組件 - 修復閃爍問題
  const CarouselSection = () => {
    return (
      <div className="relative w-full h-[calc(100vh-4rem)] overflow-hidden">
        {/* 使用一個包含所有圖片的容器，通過絕對定位和透明度來顯示當前圖片 */}
        <div className="relative w-full h-full">
          {slides.map((slide, i) => (
            <div 
              key={i}
              className="absolute inset-0 w-full h-full transition-opacity duration-1000"
              style={{ opacity: i === idx ? 1 : 0, zIndex: i === idx ? 10 : 0 }}
            >
              <img
                src={slide}
                alt=""
                className="w-full h-full object-cover"
              />
            </div>
          ))}
        </div>
        
        {/* 控制按鈕 */}
        <button
          onClick={() => {
            window.clearTimeout(timerRef.current);
            setIdx(i => (i - 1 + slides.length) % slides.length);
          }}
          className="absolute left-2 top-1/2 -translate-y-1/2 bg-gradient-to-r from-blue-600 to-indigo-700 p-3 rounded-full text-white shadow-lg z-20"
        >‹</button>
        <button
          onClick={() => {
            window.clearTimeout(timerRef.current);
            setIdx(i => (i + 1) % slides.length);
          }}
          className="absolute right-2 top-1/2 -translate-y-1/2 bg-gradient-to-r from-blue-600 to-indigo-700 p-3 rounded-full text-white shadow-lg z-20"
        >›</button>
        
        {/* 輪播指示器 */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex space-x-2 z-20">
          {slides.map((_, i) => (
            <button
              key={i}
              className={`w-3 h-3 rounded-full ${i === idx ? 'bg-white' : 'bg-white/40'} transition-all duration-300`}
              onClick={() => {
                window.clearTimeout(timerRef.current);
                setIdx(i);
              }}
            />
          ))}
        </div>
      </div>
    );
  };

  return (
    // 移除外部容器的 padding/margin，確保滿版
    <div className="w-full overflow-hidden">
      {/* 1. 輪播區塊 - 使用新的無閃爍輪播組件 */}
      <CarouselSection />

      {/* About Me 區塊 - 調整布局，防止圖片遮擋文字 */}
      <div className="relative w-full py-16 bg-gray-900">
        {/* 文字區：加大 z-index 確保顯示在圖片上方 */}
        <div className="container mx-auto px-4 h-full grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10">
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
            <motion.p 
              className="text-lg leading-[1.8] text-gray-200 max-w-xl" // 限制文字寬度
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, amount: 0.7 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              我是陳昱凱，目前就讀於「國立陽明交通大學資訊管理研究所碩士」一年級，隸屬於分散式系統實驗室。大學期間就讀於國立中正大學資訊管理學系，以GPA 4.23（系上第一名）的成績提前畢業。
            </motion.p>
            <motion.p 
              className="text-lg leading-[1.8] text-gray-200 max-w-xl" // 限制文字寬度
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, amount: 0.7 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              在大學及研究所期間，修習過多門資訊課程，如物件導向 Java、程式設計、資料庫管理、網頁程式設計、計算機概論、網路概論、計算機組織、資訊安全技術、資料探勘研究與實務、分散式系統等...
            </motion.p>
            <Link
              to="/introduction"
              className="self-start bg-gradient-to-r from-blue-600 to-indigo-700 text-white font-bold px-6 py-3 rounded-lg shadow-lg transition-all duration-300 ease-in-out hover:from-blue-700 hover:to-indigo-800"
            >
              了解更多
            </Link>
          </div>
          {/* 這邊空一格，不再使用絕對定位 */}
          <div className="hidden md:block"></div>
        </div>

        {/* 圖片區：絕對定位到右側，但設置較低的 z-index，使其不會遮擋文字 */}
        <div className="absolute top-0 right-0 bottom-0 
            w-full 
            md:w-1/2
            lg:w-[50%]
            overflow-hidden
            z-0" // 降低 z-index
        >
          <img
            src="/images/test5.jpg"
            alt="About me"
            className="w-full h-full object-cover opacity-60 md:opacity-100" // 在移動端增加透明度
          />
          {/* 添加漸變遮罩，確保文字在移動端可見 */}
          <div className="absolute inset-0 bg-gradient-to-r from-gray-900 via-gray-900/70 to-transparent md:hidden"></div>
        </div>
      </div>

      {/* 技能預覽 區塊 - 確保滿版，添加卡片滑動動畫 */}
      <div className="py-16 bg-gray-900 relative w-full"          
            style={{
                  backgroundImage: 
                    // 第一層：深黑漸層；第二層：你的圖片
                    "linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.6)), url('/images/image9.jpg')",
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  backgroundRepeat: 'no-repeat',
                  }}          >
        {/* 標題區塊 - 保留動畫 */}
        <div className="mb-12 text-center">
          <motion.h1 
            className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-indigo-500 text-transparent bg-clip-text"
            initial={{ y: -30, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: false, amount: 0.5 }}
            transition={{ duration: 0.6 }}
          >
            技能
          </motion.h1>
          <p className="mt-2 text-lg font-bold text-gray-300 tracking-widest">
            Skills
          </p>
        </div>

        {/* ← 左箭頭 - 使用上方定義的 prevSkill 函數 */}
        <button
          onClick={prevSkill}
          className="absolute top-1/2 left-4 -translate-y-1/2 bg-gradient-to-r from-blue-600 to-indigo-700 p-3 rounded-full text-white shadow-lg z-30"
        >
          ‹
        </button>

        {/* —— 主要容器（撐滿全寬 + 等高卡片 + 動畫） —— */}
        <div className="w-full px-6 lg:px-24 flex justify-evenly items-stretch gap-8 relative overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div 
              key={skillIdx} // 這裡使用 key 觸發動畫
              className="w-full flex justify-evenly items-stretch gap-8"
              {...getSlideAnimation()}
            >
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
                    min-w-[250px]             /* 確保在手機上不會太窄 */
                  "
                >
                  {/* 標題：使用漸層文字 */}
                  <h3 className="text-center font-bold text-4xl mb-6 bg-gradient-to-r from-blue-600 to-indigo-700 text-transparent bg-clip-text">
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
            </motion.div>
          </AnimatePresence>
        </div>

        {/* → 右箭頭 - 使用上方定義的 nextSkill 函數 */}
        <button
          onClick={nextSkill}
          className="absolute top-1/2 right-4 -translate-y-1/2 bg-gradient-to-r from-blue-600 to-indigo-700 p-3 rounded-full text-white shadow-lg z-30"
        >
          ›
        </button>

        {/* 查看更多技能 */}
        <div className="mt-12 text-center">
          <Link
            to="/skill"
            className="inline-block bg-gradient-to-r from-blue-600 to-indigo-700 text-white font-bold px-6 py-3 rounded-lg shadow-lg transition-all duration-300 ease-in-out hover:from-blue-700 hover:to-indigo-800"
          >
            查看更多技能
          </Link>
        </div>
      </div>

      {/* 專案展示區塊 - 確保滿版 */}
      <div className="py-16 w-full"
           style={{
             backgroundImage: 
               "linear-gradient(rgba(0,0,0,0.7), rgba(0,0,0,0.7)), url('/images/image3.jpg')",
             backgroundSize: 'cover',
             backgroundPosition: 'center',
             backgroundRepeat: 'no-repeat',
             width: '100vw', // 確保滿版
           }}>
        {/* 標題區塊 - 調整字體大小與技能區域一致 */}
        <div className="mb-12 text-center">
          <motion.h2
            className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-indigo-500 text-transparent bg-clip-text"
            initial={{ y: -20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: false, amount: 0.5 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
          >
            精選專案
          </motion.h2>
          <p className="mt-2 text-lg font-bold text-gray-300 tracking-widest">
            Featured Projects
          </p>
        </div>

        {/* 專案卡片容器 */}
        <div className="container mx-auto px-4">
          {isProjectsLoading ? (
            // 載入中狀態
            <div className="flex justify-center items-center h-64">
              <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
              <p className="ml-4 text-white">載入專案資料中...</p>
            </div>
          ) : (
            // 專案卡片網格
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredProjects.map(project => (
                <div
                  key={project.id}
                  className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200 hover:shadow-xl transition-shadow duration-300 transform hover:-translate-y-2"
                >
                  <div className="relative h-60 overflow-hidden">
                    <img
                      src={project.imageUrl || "https://via.placeholder.com/800x400?text=專案圖片"}
                      alt={project.name}
                      className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent flex flex-col justify-end p-6 text-white">
                      <div className="flex items-center space-x-2 mb-2">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-300" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                        </svg>
                        <span className="text-sm font-medium">{project.year || "未指定時間"}</span>
                      </div>
                      <h3 className="text-xl font-bold">{project.name}</h3>
                    </div>
                  </div>
                  
                  <div className="p-6">
                    <p className="text-gray-700 mb-4 line-clamp-3">{project.description}</p>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {project.technologies?.map((tech, index) => (
                        <span
                          key={index}
                          className="px-3 py-1.5 bg-gradient-to-r from-blue-100 to-indigo-100 text-indigo-700 rounded-full text-xs font-medium border border-blue-200"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
          
          {/* 查看更多專案 */}
          <div className="mt-12 text-center">
            <Link
              to="/project"
              className="inline-block bg-blue-600 hover:bg-blue-800 text-white font-bold text-lg px-8 py-4 rounded-lg shadow-lg border-2 border-white transition-all duration-300 ease-in-out hover:scale-105"
            >
              查看所有專案
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}