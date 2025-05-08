import React, { useState, useEffect } from "react";

export default function ProjectShowcase() {
  // 狀態定義 - 所有狀態只在此宣告一次
  const [projects, setProjects] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState("add"); // add, edit, delete
  const [currentProject, setCurrentProject] = useState({
    id: null,
    name: "",
    description: "",
    technologies: [],
    imageUrl: "",
    year: "",
    projectUrl: ""
  });
  const [techInput, setTechInput] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [modalAnimationClass, setModalAnimationClass] = useState("");
  // 新增一個狀態來跟踪哪些專案的描述被展開
  const [expandedDescriptions, setExpandedDescriptions] = useState({});

  // 切換描述的展開/收合狀態
  const toggleDescription = (projectId) => {
    setExpandedDescriptions(prev => ({
      ...prev,
      [projectId]: !prev[projectId]
    }));
  };

  // 讀取後端專案列表
  useEffect(() => {
    fetch("/api/projects")
      .then(res => res.json())
      .then(data => {
        setProjects(data);
        setIsLoading(false);
      })
      .catch(err => console.error(err));
  }, []);

  // 渲染技術標籤的輔助函數
  const renderTechTag = (tech, index, withRemoveButton = false) => {
    return (
      <span 
        key={index} 
        className="px-3 py-1.5 bg-gradient-to-r from-blue-100 to-indigo-100 text-indigo-700 rounded-full flex items-center border border-blue-200"
      >
        {tech}
        {withRemoveButton && (
          <button 
            onClick={() => removeTechnology(tech)} 
            className="ml-1.5 text-indigo-600 hover:text-red-600 transition duration-300 flex items-center justify-center"
            style={{background: 'transparent', boxShadow: 'none'}}
            aria-label="移除技術"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        )}
      </span>
    );
  };

  // 開啟視窗時添加動畫效果
  const openModalWithAnimation = (mode, project = null) => {
    setModalMode(mode);
    if (project) {
      setCurrentProject(mode === "delete" ? project : { ...project,
               projectUrl: project.projectUrl || ""   // ← 帶入原本的網址 
               });
    } else {
      setCurrentProject({ id: null, name: "", description: "", technologies: [], imageUrl: "", year: "",projectUrl: "" });
    }
    setTechInput("");
    setShowModal(true);
    // 先設置為縮小狀態
    setModalAnimationClass("scale-95 opacity-0");
    // 短暫延遲後設置為正常大小，產生放大動畫
    setTimeout(() => {
      setModalAnimationClass("scale-100 opacity-100");
    }, 10);
  };

  // 關閉視窗時添加動畫效果
  const closeModalWithAnimation = () => {
    // 設置為縮小狀態，產生縮小動畫
    setModalAnimationClass("scale-95 opacity-0");
    // 動畫結束後關閉視窗
    setTimeout(() => {
      setShowModal(false);
    }, 200);
  };

  const openAddModal = () => {
    openModalWithAnimation("add");
  };

  const openEditModal = project => {
    openModalWithAnimation("edit", project);
  };

  const openDeleteModal = project => {
    openModalWithAnimation("delete", project);
  };

  const addTechnology = () => {
    if (techInput.trim() && !currentProject.technologies.includes(techInput.trim())) {
      setCurrentProject({
        ...currentProject,
        technologies: [...currentProject.technologies, techInput.trim()]
      });
      setTechInput("");
    }
    // 在輸入新技術後自動聚焦回輸入欄
    document.querySelector('input[placeholder="輸入技術名稱，按 Enter 新增"]')?.focus();
  };

  const removeTechnology = tech => {
    setCurrentProject({
      ...currentProject,
      technologies: currentProject.technologies.filter(t => t !== tech)
    });
  };

  const handleInputChange = e => {
    const { name, value } = e.target;
    setCurrentProject({ ...currentProject, [name]: value });
  };

  const handleTechKeyDown = e => {
    if (e.key === "Enter") {
      e.preventDefault();
      addTechnology();
    }
  };

  // 儲存專案（對接後端）
  const saveProject = () => {
    const url = "/api/projects" + (modalMode === "edit" ? `/${currentProject.id}` : "");
    const method =
      modalMode === "edit"
        ? "PUT"
        : modalMode === "delete"
        ? "DELETE"
        : "POST";
    const options = {
      method,
      headers: { "Content-Type": "application/json" },
      ...(method !== "DELETE" && { body: JSON.stringify(currentProject) })
    };

    // 先執行視窗關閉動畫
    closeModalWithAnimation();

    // 延遲發送請求，等待動畫結束
    setTimeout(() => {
      fetch(url, options)
        .then(res => {
          if (!res.ok) throw new Error("Network response was not ok");
          return method === "DELETE" ? null : res.json();
        })
        .then(data => {
          if (modalMode === "add") setProjects(prev => [...prev, data]);
          if (modalMode === "edit")
            setProjects(prev => prev.map(p => (p.id === data.id ? data : p)));
          if (modalMode === "delete")
            setProjects(prev => prev.filter(p => p.id !== currentProject.id));
        })
        .catch(err => console.error(err));
    }, 200);
  };

  // 載入中狀態
  if (isLoading)
    return (
      <div className="w-screen h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">載入專案資料...</p>
        </div>
      </div>
    );

  // 主要渲染
  return (
    <div className="w-screen min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      {/* 頁面標題 - 採用更醒目的樣式 */}
      <div className="w-full bg-gradient-to-r from-blue-600 to-indigo-700 text-center py-12 shadow-md">
        <h1 className="text-4xl font-bold text-white">專案展示</h1>
        <p className="text-blue-100 mt-2">My Projects Portfolio</p>
      </div>

      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-end mb-6">
          <button
            onClick={openAddModal}
            className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-5 py-3 rounded-lg shadow-lg hover:from-blue-600 hover:to-indigo-700 transition duration-300 ease-in-out flex items-center font-medium"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
            新增專案
          </button>
        </div>

        {projects.length === 0 ? (
          <div className="bg-white rounded-xl shadow-lg p-8 text-center border border-gray-200">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-blue-500 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
            <h3 className="text-xl font-semibold text-gray-800 mb-3">尚未有專案</h3>
            <p className="text-gray-600 mb-4">開始添加您的第一個專案以展示您的作品！</p>
            <button 
              onClick={openAddModal} 
              className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-6 py-3 rounded-lg shadow-md hover:from-blue-600 hover:to-indigo-700 transition duration-300 ease-in-out font-medium"
            >
              建立新專案
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {projects.map(project => (
              <div key={project.id} className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200 hover:shadow-xl transition-shadow duration-300 transform hover:-translate-y-1">
                <div className="relative h-64 overflow-hidden group">
                  <img
                    src={project.imageUrl || "https://via.placeholder.com/800x400?text=專案圖片"}
                    alt={project.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent flex flex-col justify-end p-6 text-white">
                    <div className="flex items-center space-x-2 mb-2">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-300" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                      </svg>
                      <span className="text-sm font-medium">{project.year || "未指定時間"}</span>
                    </div>
                    <h2 className="text-2xl font-bold">{project.name}</h2>
                  </div>
                </div>
                <div className="p-6">
                  {/* 修改描述區塊，添加展開/收合功能 */}
                  <div className="mb-5">
                    <p className={`text-gray-700 ${expandedDescriptions[project.id] ? "" : "line-clamp-3"}`}>
                      {project.description}
                    </p>
                    {project.description && (
                      <div className="mt-2">
                        <span 
                          onClick={() => toggleDescription(project.id)}
                          className="text-indigo-600 hover:text-indigo-800 cursor-pointer text-sm flex items-center"
                        >
                          {expandedDescriptions[project.id] ? (
                            <>
                              收合
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" clipRule="evenodd" />
                              </svg>
                            </>
                          ) : (
                            <>
                              更多
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 011.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                              </svg>
                            </>
                          )}
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-2 mb-6">
                    {project.technologies.map((tech, index) => 
                      renderTechTag(tech, index)
                    )}
                    {project.technologies.length === 0 && (
                      <span className="text-gray-400 text-sm italic">未指定技術</span>
                    )}
                  </div>
                  <div className="flex justify-between items-center">
                    {/* 新增專案連結按鈕 */}
                    {project.projectUrl && (
                      <a
                        href={project.projectUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center text-indigo-600 hover:text-indigo-800 font-medium transition-colors duration-200"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                        專案連結
                      </a>
                    )}
                    {!project.projectUrl && (
                      <div></div> // 佔位元素，保持按鈕在右側對齊
                    )}
                    <div className="flex space-x-3">
                      <button
                        onClick={() => openEditModal(project)}
                        className="px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-lg shadow-md hover:from-emerald-600 hover:to-teal-700 transition duration-300 ease-in-out text-sm font-medium flex items-center"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                        </svg>
                        修改
                      </button>
                      <button
                        onClick={() => openDeleteModal(project)}
                        className="px-4 py-2 bg-gradient-to-r from-rose-500 to-red-600 text-white rounded-lg shadow-md hover:from-rose-600 hover:to-red-700 transition duration-300 ease-in-out text-sm font-medium flex items-center"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                        刪除
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal 區塊 - 更精美的設計 */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50"
             style={{
               backgroundImage: 
                 "linear-gradient(rgba(0,0,0,0.7), rgba(0,0,0,0.7)), url('/images/image13.jpg')",
               backgroundSize: 'cover',
               backgroundPosition: 'center',
               backgroundRepeat: 'no-repeat',
               backdropFilter: 'blur(5px)'
             }}
             onClick={() => closeModalWithAnimation()}>
          <div className={`bg-white rounded-xl shadow-2xl w-full max-w-3xl z-10 max-h-[90vh] overflow-y-auto transform transition-all duration-300 ${modalAnimationClass}`}
               onClick={e => e.stopPropagation()}>
            {modalMode === "delete" ? (
              <div className="p-6">
                <div className="flex items-center text-red-600 mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  <h3 className="text-xl font-bold text-gray-800">確認刪除</h3>
                </div>
                <p className="text-gray-600 mb-6 pl-10">
                  您確定要刪除「<span className="font-semibold text-red-600">{currentProject.name}</span>」專案嗎？此操作無法撤銷。
                </p>
                <div className="flex justify-end space-x-3">
                  <button
                    onClick={() => closeModalWithAnimation()}
                    className="px-4 py-2 bg-gradient-to-r from-gray-600 to-gray-800 hover:from-gray-700 hover:to-gray-900 text-white rounded-lg shadow-md transition duration-300 ease-in-out font-medium"
                  >
                    取消
                  </button>
                  <button
                    onClick={saveProject}
                    className="px-4 py-2 bg-gradient-to-r from-red-500 to-red-700 hover:from-red-600 hover:to-red-800 text-white rounded-lg shadow-md transition duration-300 ease-in-out font-medium"
                  >
                    確認刪除
                  </button>
                </div>
              </div>
            ) : (
              <div>
                <div className="bg-gradient-to-r from-blue-600 to-indigo-700 py-5 px-6 rounded-t-xl">
                  <h3 className="text-xl font-bold text-white flex items-center">
                    {modalMode === "add" ? (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    )}
                    {modalMode === "add" ? "新增專案" : "編輯專案"}
                  </h3>
                </div>
                <div className="p-6 space-y-5">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      專案名稱 <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={currentProject.name}
                      onChange={handleInputChange}
                      placeholder="輸入專案名稱"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 text-gray-900"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">專案時間</label>
                    <input
                      type="text"
                      name="year"
                      value={currentProject.year}
                      onChange={handleInputChange}
                      placeholder="例：2022/9-2023/5"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 text-gray-900"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      專案說明 <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      name="description"
                      value={currentProject.description}
                      onChange={handleInputChange}
                      rows={4}
                      placeholder="描述專案的目標、功能和價值..."
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 text-gray-900"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">使用技術</label>
                    <div className="flex">
                      <input
                        type="text"
                        value={techInput}
                        onChange={e => setTechInput(e.target.value)}
                        onKeyDown={handleTechKeyDown}
                        placeholder="輸入技術名稱，按 Enter 新增"
                        className="flex-1 px-4 py-3 border border-gray-300 rounded-l-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 text-gray-900"
                      />
                      <button
                        onClick={addTechnology}
                        className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-4 py-3 rounded-r-lg hover:from-blue-600 hover:to-indigo-700 transition duration-300 ease-in-out"
                      >
                        新增
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-2 mt-3">
                      {currentProject.technologies.map((tech, index) => 
                        renderTechTag(tech, index, true)
                      )}
                    </div>
                    {/* 專案網址 */}
                    <div className="mt-4">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        專案網址
                      </label>
                      <input
                        type="text"
                        name="projectUrl"
                        value={currentProject.projectUrl}
                        onChange={handleInputChange}
                        placeholder="輸入專案相關 URL"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 text-gray-900"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">專案圖片 URL</label>
                    <input
                      type="text"
                      name="imageUrl"
                      value={currentProject.imageUrl}
                      onChange={handleInputChange}
                      placeholder="輸入圖片 URL"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 text-gray-900"
                    />
                    {currentProject.imageUrl && (
                      <div className="mt-3 h-48 overflow-hidden rounded-lg bg-gray-100 border border-gray-200">
                        <img
                          src={currentProject.imageUrl}
                          alt="預覽"
                          className="w-full h-full object-cover"
                          onError={e => {
                            e.currentTarget.src = "https://via.placeholder.com/800x400?text=載入失敗";
                          }}
                        />
                      </div>
                    )}
                  </div>
                  <div className="flex justify-end space-x-3 mt-8 pt-4 border-t border-gray-200">
                    <button 
                      onClick={() => closeModalWithAnimation()} 
                      className="px-5 py-2.5 bg-gradient-to-r from-gray-600 to-gray-800 hover:from-gray-700 hover:to-gray-900 text-white rounded-lg shadow-md transition duration-300 ease-in-out font-medium"
                    >
                      取消
                    </button>
                    <button 
                      onClick={saveProject} 
                      className="px-5 py-2.5 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg shadow-md hover:from-blue-600 hover:to-indigo-700 transition duration-300 ease-in-out font-medium disabled:opacity-50 disabled:cursor-not-allowed" 
                      disabled={!currentProject.name || !currentProject.description}
                    >
                      {modalMode === "add" ? "新增專案" : "儲存變更"}
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