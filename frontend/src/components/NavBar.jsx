import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaGithub, FaLinkedin } from 'react-icons/fa';

export default function NavBar() {
  const navigate = useNavigate();
  
  // 處理導航並立即跳轉到頂部的函數
  const handleNavigation = (path) => {
    navigate(path);
    window.scrollTo(0, 0); // 立即跳轉到頂部，沒有滾動動畫
  };

  const menu = [
    { cn: '個人介紹', en: 'About Me',    to: 'introduction' },
    { cn: '技能',     en: 'Skills',      to: 'skill' },
    { cn: '工作經驗', en: 'Experience',  to: 'experience' },
    { cn: '專案介紹', en: 'Projects',    to: 'project' },
    { cn: '證照&獎項', en: 'Awards',      to: 'award' },
    { cn: '其他',     en: 'Others',      to: 'other' },
  ];

  return (
    <nav className="sticky top-0 w-full bg-white shadow z-50">
      {/* 去掉 container，改成左右 padding */}
      <div className="flex items-center justify-between px-8 py-4">
        {/* 左側：標題 點擊時回到首頁頂部 */}
        <div 
          onClick={() => handleNavigation('/')}
          className="flex flex-col items-start cursor-pointer"
        >
          <span className="text-3xl font-bold text-gray-700">
            陳昱凱個人網站
          </span>
          <span className="text-lg text-gray-500">
            Personal Website
          </span>
        </div>

        {/* 中間：六個雙行文字連結 - 也添加跳轉到頂部功能 */}
        <ul className="flex space-x-12">
          {menu.map(item => (
            <li key={item.cn}>
              <div
                onClick={() => handleNavigation(`/${item.to}`)}
                className="
                  flex flex-col items-center cursor-pointer
                  !text-[#333333] hover:text-[#0052CC]
                  pb-1 hover:border-b-2 hover:border-[#0052CC]
                  transition
                "
              >
                <span className="text-2xl font-bold">{item.cn}</span>
                <span className="text-base">{item.en}</span>
              </div>
            </li>
          ))}
        </ul>

        {/* 右側：放大 Icon */}
        <div className="flex items-center space-x-6">
          <a href="https://github.com/monarch0406?tab=repositories" target="_blank" rel="noopener noreferrer">
            <FaGithub className="w-8 h-8 text-gray-600 hover:text-gray-800 transition" />
          </a>
          <a href="https://www.linkedin.com/in/monarch0406" target="_blank" rel="noopener noreferrer">
            <FaLinkedin className="w-8 h-8 text-gray-600 hover:text-gray-800 transition" />
          </a>
          <a href="https://www.104.com.tw/" target="_blank" rel="noopener noreferrer">
            <img src="/icon/104.png" alt="104" className="w-8 h-8" />
          </a>
        </div>
      </div>
    </nav>
  );
}