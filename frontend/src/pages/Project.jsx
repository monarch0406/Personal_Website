import React, { useState, useEffect } from "react";

export default function ProjectShowcase() {
  // 模擬專案資料
  const initialProjects = [
    {
      id: 1,
      name: "醫療資訊整合平台",
      description: "大三時曾以「醫療資訊整合平台」為題發展我們的必修專題。目標是希望民眾可以透過此平台快速了解其病徵所對應的科別，並搭配其他相關功能進一步強化就醫方便性。",
      technologies: ["Vue.js", "ASP.NET", "Microsoft SQL Server", "Google Maps API"],
      imageUrl: "https://i0.wp.com/cms.tstudio.fcu.edu.tw/wp-content/uploads/2020/01/83513927_3509322285810608_8152034203299766272_o.jpg",
      year: "2022/9-2023/5"
    },
    {
      id: 2,
      name: "智慧型農業監控系統",
      description: "開發基於物聯網的農業監控系統，結合環境感測器與自動化控制，幫助農民遠端監控溫室環境，提高作物產量與品質。",
      technologies: ["React", "Node.js", "MongoDB", "Arduino", "IoT Sensors"],
      imageUrl: "https://agritech-today.com/zh-tw/wp-content/uploads/2022/02/03-smart-greenhouse-1.jpg",
      year: "2023/3-2023/9"
    },
  ];

  const [projects, setProjects] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState("add"); // add, edit, delete
  const [currentProject, setCurrentProject] = useState({
    id: null,
    name: "",
    description: "",
    technologies: [],
    imageUrl: "",
    year: ""
  });
  const [techInput, setTechInput] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  // 初始化資料
  useEffect(() => {
    // 模擬從後端獲取資料
    setTimeout(() => {
      setProjects(initialProjects);
      setIsLoading(false);
    }, 500);
  }, []);

  // 打開新增專案 Modal
  const openAddModal = () => {
    setCurrentProject({
      id: null,
      name: "",
      description: "",
      technologies: [],
      imageUrl: "",
      year: ""
    });
    setTechInput("");
    setModalMode("add");
    setShowModal(true);
  };

  // 打開編輯專案 Modal
  const openEditModal = (project) => {
    setCurrentProject({...project});
    setTechInput("");
    setModalMode("edit");
    setShowModal(true);
  };

  // 打開刪除確認 Modal
  const openDeleteModal = (project) => {
    setCurrentProject(project);
    setModalMode("delete");
    setShowModal(true);
  };

  // 新增技術標籤
  const addTechnology = () => {
    if (techInput.trim() !== "" && !currentProject.technologies.includes(techInput.trim())) {
      setCurrentProject({
        ...currentProject,
        technologies: [...currentProject.technologies, techInput.trim()]
      });
      setTechInput("");
    }
  };

  // 移除技術標籤
  const removeTechnology = (tech) => {
    setCurrentProject({
      ...currentProject,
      technologies: currentProject.technologies.filter(t => t !== tech)
    });
  };

  // 處理表單輸入變更
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentProject({
      ...currentProject,
      [name]: value
    });
  };

  // 處理技術輸入框按下 Enter
  const handleTechKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addTechnology();
    }
  };

  // 儲存專案
  const saveProject = () => {
    if (modalMode === "add") {
      // 新增專案 - 模擬生成 ID
      const newId = Math.max(...projects.map(p => p.id), 0) + 1;
      const newProject = { ...currentProject, id: newId };
      setProjects([...projects, newProject]);
    } else if (modalMode === "edit") {
      // 編輯專案
      setProjects(projects.map(p => 
        p.id === currentProject.id ? currentProject : p
      ));
    } else if (modalMode === "delete") {
      // 刪除專案
      setProjects(projects.filter(p => p.id !== currentProject.id));
    }
    setShowModal(false);
  };

  // 渲染載入中畫面
  if (isLoading) {
    return (
      <div className="w-screen h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">載入專案資料...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-screen min-h-screen bg-gray-50">
      {/* 頁面標題 */}
      <div className="w-full bg-indigo-700 text-white py-12">
        <div className="w-full text-center">
          <h1 className="text-4xl font-bold mb-2">專案</h1>
          <p className="text-xl text-indigo-200">Projects</p>
        </div>
      </div>

      {/* 主要內容 */}
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 新增專案按鈕 */}
        <div className="flex justify-end mb-6">
          <button 
            onClick={openAddModal}
            className="bg-black text-white px-4 py-2 rounded-md flex items-center shadow-md transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
            新增專案
          </button>
        </div>

        {/* 專案列表 */}
        {projects.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-300 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
            <h3 className="text-lg font-semibold text-gray-600 mb-2">尚未有專案</h3>
            <p className="text-gray-500 mb-4">點擊「新增專案」按鈕開始建立您的第一個專案</p>
            <button 
              onClick={openAddModal}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md"
            >
              新增專案
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {projects.map(project => (
              <div key={project.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                <div className="relative h-64 overflow-hidden">
                  <img 
                    src={project.imageUrl || "https://via.placeholder.com/800x400?text=專案圖片"} 
                    alt={project.name} 
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-t from-black/70 to-transparent"></div>
                  <div className="absolute bottom-0 left-0 p-4 w-full">
                    <div className="text-xs font-medium text-indigo-300 mb-1">{project.year}</div>
                    <h2 className="text-xl font-bold text-white mb-1">{project.name}</h2>
                  </div>
                </div>
                <div className="p-5">
                  <p className="text-gray-600 mb-4 line-clamp-3">{project.description}</p>
                  
                  <div className="mb-4">
                    <h3 className="text-sm font-medium text-gray-700 mb-2">使用技術：</h3>
                    <div className="flex flex-wrap gap-2">
                      {project.technologies.map((tech, index) => (
                        <span key={index} className="px-2 py-1 bg-indigo-100 text-indigo-700 rounded-full text-xs">
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <div className="flex justify-end space-x-2">
                    <button
                      onClick={() => openEditModal(project)}
                      className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1.5 rounded flex items-center text-sm"
                      title="編輯"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                      </svg>
                      編輯
                    </button>
                    <button
                      onClick={() => openDeleteModal(project)}
                      className="bg-red-100 hover:bg-red-200 text-red-700 px-3 py-1.5 rounded flex items-center text-sm"
                      title="刪除"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                      刪除
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 專案 Modal */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          {/* 背景遮罩 */}
          <div 
            className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm"
            onClick={() => setShowModal(false)}
          ></div>
          
          {/* Modal 內容 */}
          <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl z-10 max-h-[90vh] overflow-y-auto">
            {/* 刪除確認 Modal */}
            {modalMode === "delete" ? (
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-4">確認刪除</h3>
                <p className="text-gray-600 mb-6">
                  您確定要刪除「<span className="font-semibold">{currentProject.name}</span>」專案嗎？此操作無法撤銷。
                </p>
                
                <div className="flex justify-end space-x-3">
                  <button
                    onClick={() => setShowModal(false)}
                    className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-md transition-colors"
                  >
                    取消
                  </button>
                  <button
                    onClick={saveProject}
                    className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md transition-colors"
                  >
                    確認刪除
                  </button>
                </div>
              </div>
            ) : (
              /* 新增/編輯 Modal */
              <div>
                <div className="bg-gradient-to-r from-indigo-700 to-indigo-800 py-4 px-6 rounded-t-lg">
                  <h3 className="text-xl font-bold text-white">
                    {modalMode === "add" ? "新增專案" : "編輯專案"}
                  </h3>
                </div>
                
                <div className="p-6">
                  <div className="space-y-6">
                    {/* 專案名稱 */}
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                        專案名稱 <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={currentProject.name}
                        onChange={handleInputChange}
                        placeholder="輸入專案名稱"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-800"
                        required
                      />
                    </div>
                    
                    {/* 專案時間 */}
                    <div>
                      <label htmlFor="year" className="block text-sm font-medium text-gray-700 mb-1">
                        專案時間
                      </label>
                      <input
                        type="text"
                        id="year"
                        name="year"
                        value={currentProject.year}
                        onChange={handleInputChange}
                        placeholder="例：2022/9-2023/5"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-800"
                      />
                    </div>
                    
                    {/* 專案說明 */}
                    <div>
                      <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                        專案說明 <span className="text-red-500">*</span>
                      </label>
                      <textarea
                        id="description"
                        name="description"
                        value={currentProject.description}
                        onChange={handleInputChange}
                        placeholder="描述專案的目標、功能和價值..."
                        rows="4"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-800"
                        required
                      />
                    </div>
                    
                    {/* 技術標籤 */}
                    <div>
                      <label htmlFor="technologies" className="block text-sm font-medium text-gray-700 mb-1">
                        使用技術
                      </label>
                      <div className="flex">
                        <input
                          type="text"
                          id="technologies"
                          value={techInput}
                          onChange={(e) => setTechInput(e.target.value)}
                          onKeyDown={handleTechKeyDown}
                          placeholder="輸入技術名稱，按 Enter 新增"
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-800"
                        />
                        <button
                          type="button"
                          onClick={addTechnology}
                          className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-r-md"
                        >
                          新增
                        </button>
                      </div>
                      
                      {/* 已新增的技術標籤 */}
                      <div className="flex flex-wrap gap-2 mt-2">
                        {currentProject.technologies.map((tech, index) => (
                          <div key={index} className="bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full text-sm flex items-center">
                            {tech}
                            <button
                              type="button"
                              onClick={() => removeTechnology(tech)}
                              className="ml-1 text-indigo-500 hover:text-indigo-700"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                              </svg>
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    {/* 專案圖片 */}
                    <div>
                      <label htmlFor="imageUrl" className="block text-sm font-medium text-gray-700 mb-1">
                        專案圖片 URL
                      </label>
                      <input
                        type="text"
                        id="imageUrl"
                        name="imageUrl"
                        value={currentProject.imageUrl}
                        onChange={handleInputChange}
                        placeholder="輸入圖片 URL"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-800"
                      />
                      
                      {/* 圖片預覽 */}
                      {currentProject.imageUrl && (
                        <div className="mt-2">
                          <p className="text-sm text-gray-500 mb-1">圖片預覽：</p>
                          <div className="h-40 bg-gray-100 rounded-md overflow-hidden">
                            <img
                              src={currentProject.imageUrl}
                              alt="專案圖片預覽"
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = "https://via.placeholder.com/800x400?text=圖片載入失敗";
                              }}
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {/* 按鈕區 */}
                  <div className="flex justify-end space-x-3 mt-8">
                    <button
                      type="button"
                      onClick={() => setShowModal(false)}
                      className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-md transition-colors"
                    >
                      取消
                    </button>
                    <button
                      type="button"
                      onClick={saveProject}
                      className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md transition-colors"
                      disabled={!currentProject.name || !currentProject.description}
                    >
                      {modalMode === "add" ? "新增" : "儲存"}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}