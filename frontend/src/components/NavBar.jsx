import React from 'react';
import { Link } from 'react-router-dom';
import { FaGithub, FaLinkedin } from 'react-icons/fa';

export default function NavBar() {
  const menu = [
    { cn: '個人介紹', en: 'About Me',    to: '#about' },
    { cn: '技能',     en: 'Skills',      to: 'skill' },
    { cn: '工作經驗', en: 'Experience',  to: '#experience' },
    { cn: '專案介紹', en: 'Projects',    to: '#projects' },
    { cn: '獎項',     en: 'Awards',      to: '#awards' },
    { cn: '其他',     en: 'Others',      to: '#others' },
  ];

  return (
    <nav className="sticky top-0 w-full bg-white shadow z-50">
      {/* 去掉 container，改成左右 padding */}
      <div className="flex items-center justify-between px-8 py-4">
        {/* 左側：標題 已經靠最左 */}
        <Link to="/" className="flex flex-col items-start">
          <span className="text-3xl font-bold text-gray-700">
            陳昱凱個人網站
          </span>
          <span className="text-lg text-gray-500">
            Personal Website
          </span>
        </Link>

        {/* 中間：六個雙行文字連結 */}
        <ul className="flex space-x-12">
        {menu.map(item => (
        <li key={item.cn}>
        <a
        href={item.to}
        className="
          flex flex-col items-center
          !text-[#333333] visited:text-[#333333] hover:text-[#0052CC]
          pb-1 hover:border-b-2 hover:border-[#0052CC]
          transition
        "
        >
        <span className="text-2xl font-bold">{item.cn}</span>
        <span className="text-base">{item.en}</span>
      </a>
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





  

