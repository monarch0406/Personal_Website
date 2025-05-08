import React, { useState, useEffect } from "react";

export default function ProjectShowcase() {
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

  const openAddModal = () => {
    setCurrentProject({ id: null, name: "", description: "", technologies: [], imageUrl: "", year: "" });
    setTechInput("");
    setModalMode("add");
    setShowModal(true);
  };

  const openEditModal = project => {
    setCurrentProject({ ...project });
    setTechInput("");
    setModalMode("edit");
    setShowModal(true);
  };

  const openDeleteModal = project => {
    setCurrentProject(project);
    setModalMode("delete");
    setShowModal(true);
  };

  const addTechnology = () => {
    if (techInput.trim() && !currentProject.technologies.includes(techInput.trim())) {
      setCurrentProject({
        ...currentProject,
        technologies: [...currentProject.technologies, techInput.trim()]
      });
      setTechInput("");
    }
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
      .catch(err => console.error(err))
      .finally(() => setShowModal(false));
  };

  if (isLoading)
    return (
      <div className="w-screen h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">載入專案資料...</p>
        </div>
      </div>
    );

  return (
    <div className="w-screen min-h-screen bg-gray-50">
      {/* 頁面標題 */}
      <div className="w-full bg-indigo-700 text-white py-12 ">
        <div className="w-full text-center ">
          <h1 className="text-4xl font-bold text-gray-800">專案</h1>
          <p className="text-xl text-gray-600 mt-2">Projects</p>
        </div>
      </div>

      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-end mb-6">
          <button
            onClick={openAddModal}
            className="bg-black text-white px-4 py-2 rounded-md shadow-md flex items-center"
          >
            + 新增專案
          </button>
        </div>

        {projects.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <h3 className="text-lg font-semibold text-gray-600 mb-2">尚未有專案</h3>
            <button onClick={openAddModal} className="bg-indigo-600 text-white px-4 py-2 rounded-md">
              新增專案
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {projects.map(project => (
              <div key={project.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="relative h-64 overflow-hidden">
                  <img
                    src={project.imageUrl || "https://via.placeholder.com/800x400?text=專案圖片"}
                    alt={project.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute bottom-0 left-0 p-4 w-full bg-gradient-to-t from-black/70 to-transparent text-white">
                    <div className="text-xs">{project.year}</div>
                    <h2 className="text-xl font-bold">{project.name}</h2>
                  </div>
                </div>
                <div className="p-5">
                  <p className="text-gray-600 mb-4 line-clamp-3">{project.description}</p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.technologies.map((tech, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-indigo-100 text-indigo-700 rounded-full text-xs"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                  <div className="flex justify-end space-x-2">
                    <button
                      onClick={() => openEditModal(project)}
                      className="px-3 py-1 bg-gray-100 rounded text-sm"
                    >
                      編輯
                    </button>
                    <button
                      onClick={() => openDeleteModal(project)}
                      className="px-3 py-1 bg-red-100 text-red-700 rounded text-sm"
                    >
                      刪除
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal 區塊 */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div
            className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm"
            onClick={() => setShowModal(false)}
          ></div>
          <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl z-10 max-h-[90vh] overflow-y-auto">
            {modalMode === "delete" ? (
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-4">確認刪除</h3>
                <p className="text-gray-600 mb-6">
                  您確定要刪除「<span className="font-semibold">{currentProject.name}</span>」專案嗎？此操作無法撤銷。
                </p>
                <div className="flex justify-end space-x-3">
                  <button
                    onClick={() => setShowModal(false)}
                    className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-md"
                  >
                    取消
                  </button>
                  <button
                    onClick={saveProject}
                    className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md"
                  >
                    確認刪除
                  </button>
                </div>
              </div>
            ) : (
              <div>
                <div className="bg-gradient-to-r from-indigo-700 to-indigo-800 py-4 px-6 rounded-t-lg">
                  <h3 className="text-xl font-bold text-white">
                    {modalMode === "add" ? "新增專案" : "編輯專案"}
                  </h3>
                </div>
                <div className="p-6 space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      專案名稱 <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={currentProject.name}
                      onChange={handleInputChange}
                      placeholder="輸入專案名稱"
                      className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-indigo-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">專案時間</label>
                    <input
                      type="text"
                      name="year"
                      value={currentProject.year}
                      onChange={handleInputChange}
                      placeholder="例：2022/9-2023/5"
                      className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      專案說明 <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      name="description"
                      value={currentProject.description}
                      onChange={handleInputChange}
                      rows={4}
                      placeholder="描述專案的目標、功能和價值..."
                      className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-indigo-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">使用技術</label>
                    <div className="flex">
                      <input
                        type="text"
                        value={techInput}
                        onChange={e => setTechInput(e.target.value)}
                        onKeyDown={handleTechKeyDown}
                        placeholder="輸入技術名稱，按 Enter 新增"
                        className="flex-1 px-3 py-2 border rounded-l-md focus:ring-2 focus:ring-indigo-500"
                      />
                      <button
                        onClick={addTechnology}
                        className="bg-indigo-600 text-white px-4 py-2 rounded-r-md"
                      >
                        新增
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {currentProject.technologies.map((tech,index)=>(
                        <span key={index} className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full flex items-center">
                          {tech}
                          <button onClick={()=>removeTechnology(tech)} className="ml-1">
                            ×
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">專案圖片 URL</label>
                    <input
                      type="text"
                      name="imageUrl"
                      value={currentProject.imageUrl}
                      onChange={handleInputChange}
                      placeholder="輸入圖片 URL"
                      className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-indigo-500"
                    />
                    {currentProject.imageUrl && (
                      <div className="mt-2 h-40 overflow-hidden rounded-md bg-gray-100">
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
                  <div className="flex justify-end space-x-3 mt-6">
                    <button onClick={()=>setShowModal(false)} className="px-4 py-2 bg-gray-200 rounded-md">取消</button>
                    <button onClick={saveProject} className="px-4 py-2 bg-indigo-600 text-white rounded-md" disabled={!currentProject.name || !currentProject.description}>
                      {modalMode==="add"?"新增":"儲存"}
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
