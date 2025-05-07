import React, { useState, useEffect } from "react";

export default function Introduction() {
  const [edus, setEdus] = useState([]);
  const [bioContent, setBioContent] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const maxLength = 500; // 可見字數限制，可依需求調整

  // --- 新增學歷 Modal 狀態 ---
  const [showAddModal, setShowAddModal] = useState(false);
  const [newEdu, setNewEdu] = useState({
    school: "", degree: "", level: "",
    startDate: "", endDate: "", city: "", district: "", gpa: ""
  });

  // --- 編輯學歷 Modal 狀態 ---
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingEduId, setEditingEduId] = useState(null);
  const [editEdu, setEditEdu] = useState({ ...newEdu });

  // --- 刪除學歷 Modal 狀態 ---
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletingEduId, setDeletingEduId] = useState(null);

  // 初次載入：讀取後端資料
  useEffect(() => {
    fetch("/api/educations")
      .then(res => res.json())
      .then(data => setEdus(data))
      .catch(console.error);

    fetch("/api/introduction")
      .then(res => res.json())
      .then(data => setBioContent(data.content))
      .catch(console.error);
  }, []);

  // 表單欄位變更
  const handleNewEduChange = e => {
    const { name, value } = e.target;
    setNewEdu(prev => ({ ...prev, [name]: value }));
  };
  const handleEditEduChange = e => {
    const { name, value } = e.target;
    setEditEdu(prev => ({ ...prev, [name]: value }));
  };

  // 新增學歷 (POST)
  const handleAddEducation = () => {
    fetch("/api/educations", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newEdu)
    })
      .then(res => res.json())
      .then(created => {
        setEdus([...edus, created]);
        setShowAddModal(false);
        setNewEdu({ school: "", degree: "", level: "", startDate: "", endDate: "", city: "", district: "", gpa: "" });
      })
      .catch(console.error);
  };

  // 開啟編輯（帶入原值）
  const openEditModal = id => {
    const target = edus.find(e => e.id === id);
    if (!target) return;
    setEditEdu({ ...target });
    setEditingEduId(id);
    setShowEditModal(true);
  };

  // 儲存編輯 (PUT)
  const handleSaveEdit = () => {
    fetch(`/api/educations/${editingEduId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(editEdu)
    })
      .then(res => {
        if (!res.ok) throw new Error("更新失敗");
        return res.json();
      })
      .then(updated => {
        setEdus(edus.map(e => e.id === updated.id ? updated : e));
        setShowEditModal(false);
      })
      .catch(console.error);
  };

  // 開啟刪除
  const openDeleteModal = id => {
    setDeletingEduId(id);
    setShowDeleteModal(true);
  };

  // 確認刪除 (DELETE)
  const handleDeleteEducation = () => {
    fetch(`/api/educations/${deletingEduId}`, { method: "DELETE" })
      .then(() => {
        setEdus(edus.filter(e => e.id !== deletingEduId));
        setShowDeleteModal(false);
      })
      .catch(console.error);
  };

  // 自傳儲存 (PUT)
  const handleSaveBio = () => {
    fetch("/api/introduction", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content: bioContent })
    })
      .then(res => {
        if (!res.ok) throw new Error("自傳更新失敗");
        setIsEditing(false);
        alert("自傳內容已更新");
      })
      .catch(console.error);
  };

  // 處理「顯示更多」功能
  const isTruncated = bioContent.length > maxLength;
  const displayContent = !expanded && isTruncated 
    ? bioContent.substring(0, maxLength) + "..." 
    : bioContent;

  // 渲染
  return (
    <div className="w-screen h-screen">
      {/* Header */}
      <div className="w-full text-center py-8 bg-gray-50">
        <h1 className="text-4xl font-bold text-gray-900">個人介紹</h1>
        <p className="text-xl text-gray-600 mt-2">About Me</p>
      </div>

      {/* Main */}
      <div className="mx-auto px-8 py-6 bg-white w-full">
        <div className="flex flex-col md:flex-row max-w-5xl mx-auto">
          {/* 左：照片 */}
          <div className="md:w-1/3 flex justify-center mb-8 md:mb-0">
            <div className="w-48 h-48 bg-gray-200 rounded-full overflow-hidden">
              <img src="images/bighead2.jpg" alt="個人照片" className="w-full h-full object-cover" />
            </div>
          </div>

          {/* 右：姓名＋學歷＋自傳 */}
          <div className="md:w-2/3">
            {/* 姓名 */}
            <h2 className="text-2xl font-semibold text-gray-800 mb-2">姓名</h2>
            <h2 className="text-3xl font-bold text-blue-900 mb-6">陳昱凱</h2>

 {/* 學歷標題與加號按鈕 */}
<section className="mb-8">
  <div className="flex justify-between items-center mb-2">
    <h3 className="text-2xl font-semibold text-gray-800">學歷</h3>
    <button
      onClick={() => setShowAddModal(true)}
      className="bg-gray-900 text-white p-2 rounded-full hover:bg-gray-800 flex items-center justify-center"
      title="新增學歷"
    >
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="12" y1="5" x2="12" y2="19"></line>
        <line x1="5" y1="12" x2="19" y2="12"></line>
      </svg>
    </button>
  </div>
{/* 學歷列表項目 - 修正 GPA 格式 */}
{edus.map(item => (
  <div key={item.id} className="bg-gray-50 border border-gray-200 rounded mb-2 p-4">
    <div className="flex justify-between items-start">
      <div>
        <div className="text-lg font-bold text-gray-800">{item.school}</div>
        <div className="text-sm text-gray-500">
          {item.degree} {item.level} ｜ {item.startDate} - {item.endDate}
        </div>
        <div className="text-sm text-gray-500 mt-1">
          {item.city} {item.district} ｜ GPA : {item.gpa}
        </div>
      </div>
      <div className="flex space-x-2">
        <button 
          onClick={() => openEditModal(item.id)} 
          className="p-2 rounded hover:bg-gray-200" 
          title="修改"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
          </svg>
        </button>
        <button 
          onClick={() => openDeleteModal(item.id)} 
          className="p-2 rounded hover:bg-gray-200" 
          title="刪除"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 6h18"></path>
            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"></path>
            <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
          </svg>
        </button>
      </div>
    </div>
  </div>
))}
            </section>

            {/* 自傳 - 包含「顯示更多」功能 */}
            <section className="mb-8">
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-2xl font-semibold text-gray-800">自傳</h3>
                {!isEditing ? (
                  <button onClick={() => setIsEditing(true)} className="bg-gray-900 text-white px-3 py-1 rounded-md text-sm hover:bg-gray-800">編輯</button>
                ) : (
                  <div className="flex space-x-2">
                    <button onClick={() => setIsEditing(false)} className="bg-gray-500 text-white px-3 py-1 rounded-md hover:bg-gray-600">取消</button>
                    <button onClick={handleSaveBio} className="bg-gray-900 text-white px-3 py-1 rounded-md hover:bg-gray-800">儲存</button>
                  </div>
                )}
              </div>

<div className="bg-gray-50 border border-gray-200 rounded p-4">
  {!isEditing ? (
    <div className="text-gray-800">
      {displayContent.split("\n\n").map((p, i) => (
        <p key={i} className="mb-4">{p}</p>
      ))}
      
      {isTruncated && (
        <div className="text-center mt-2">
          {!expanded ? (
            <span 
              onClick={() => setExpanded(true)}
              className="text-gray-500 hover:text-gray-700 cursor-pointer text-sm inline-block"
            >
              更多 ▼
            </span>
          ) : (
            <span 
              onClick={() => setExpanded(false)}
              className="text-gray-500 hover:text-gray-700 cursor-pointer text-sm inline-block"
            >
              收起 ▲
            </span>
          )}
        </div>
      )}
    </div>
  ) : (
    <textarea
      value={bioContent}
      onChange={e => setBioContent(e.target.value)}
      className="w-full h-64 p-2 border border-gray-300 rounded focus:outline-none text-gray-800"
    />
  )}
              </div>
            </section>
          </div>
        </div>
      </div>

{/* 新增 Modal */}
{showAddModal && (
  <div className="fixed inset-0 flex items-center justify-center z-50">
    <div className="absolute inset-0 bg-black opacity-50" />
    <div className="bg-white rounded-lg p-6 w-full max-w-md z-10">
      <h3 className="text-xl font-semibold mb-4 text-gray-800">新增學歷</h3>
      <div className="space-y-4">
        {/* 學校 (單獨一行) */}
        <div>
          <label className="block text-gray-700 text-sm mb-1">學校</label>
          <input
            type="text"
            name="school"
            value={newEdu.school}
            onChange={handleNewEduChange}
            placeholder="例：國立陽明交通大學" 
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none text-gray-800"
          />
        </div>
        
        {/* 學系和學位 (並排) */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-gray-700 text-sm mb-1">學系</label>
            <input
              type="text"
              name="degree"
              value={newEdu.degree}
              onChange={handleNewEduChange}
              placeholder="例：資訊管理系" 
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none text-gray-800"
            />
          </div>
          <div>
            <label className="block text-gray-700 text-sm mb-1">學位</label>
            <input
              type="text"
              name="level"
              value={newEdu.level}
              onChange={handleNewEduChange}
              placeholder="例：碩士在讀" 
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none text-gray-800"
            />
          </div>
        </div>
        
        {/* 開始時間和結束時間 (並排) */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-gray-700 text-sm mb-1">開始日期</label>
            <input
              type="text"
              name="startDate"
              value={newEdu.startDate}
              onChange={handleNewEduChange}
              placeholder="例：2024/09" 
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none text-gray-800"
            />
          </div>
          <div>
            <label className="block text-gray-700 text-sm mb-1">結束日期</label>
            <input
              type="text"
              name="endDate"
              value={newEdu.endDate}
              onChange={handleNewEduChange}
              placeholder="例：至今" 
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none text-gray-800"
            />
          </div>
        </div>
        
        {/* 縣市和鄉區 (並排) */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-gray-700 text-sm mb-1">縣市</label>
            <input
              type="text"
              name="city"
              value={newEdu.city}
              onChange={handleNewEduChange}
              placeholder="例：新竹市" 
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none text-gray-800"
            />
          </div>
          <div>
            <label className="block text-gray-700 text-sm mb-1">鄉區</label>
            <input
              type="text"
              name="district"
              value={newEdu.district}
              onChange={handleNewEduChange}
              placeholder="例：東區" 
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none text-gray-800"
            />
          </div>
        </div>
        
        {/* 整體 GPA (單獨一行) */}
        <div>
          <label className="block text-gray-700 text-sm mb-1">整體 GPA</label>
          <input
            type="text"
            name="gpa"
            value={newEdu.gpa}
            onChange={handleNewEduChange}
            placeholder="例：4.0" 
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none text-gray-800"
          />
        </div>
      </div>
      
      <div className="flex justify-end space-x-2 mt-6">
        <button onClick={() => setShowAddModal(false)} className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600">取消</button>
        <button onClick={handleAddEducation} className="bg-gray-900 text-white px-4 py-2 rounded hover:bg-gray-800">儲存</button>
      </div>
    </div>
  </div>
)}

{/* 編輯 Modal */}
{showEditModal && (
  <div className="fixed inset-0 flex items-center justify-center z-50">
    <div className="absolute inset-0 bg-black opacity-50" />
    <div className="bg-white rounded-lg p-6 w-full max-w-md z-10">
      <h3 className="text-xl font-semibold mb-4 text-gray-800">編輯學歷</h3>
      <div className="space-y-4">
        {/* 學校 (單獨一行) */}
        <div>
          <label className="block text-gray-700 text-sm mb-1">學校</label>
          <input
            type="text"
            name="school"
            value={editEdu.school}
            onChange={handleEditEduChange}
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none text-gray-800"
          />
        </div>
        
        {/* 學系和學位 (並排) */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-gray-700 text-sm mb-1">學系</label>
            <input
              type="text"
              name="degree"
              value={editEdu.degree}
              onChange={handleEditEduChange}
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none text-gray-800"
            />
          </div>
          <div>
            <label className="block text-gray-700 text-sm mb-1">學位</label>
            <input
              type="text"
              name="level"
              value={editEdu.level}
              onChange={handleEditEduChange}
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none text-gray-800"
            />
          </div>
        </div>
        
        {/* 開始時間和結束時間 (並排) */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-gray-700 text-sm mb-1">開始日期</label>
            <input
              type="text"
              name="startDate"
              value={editEdu.startDate}
              onChange={handleEditEduChange}
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none text-gray-800"
            />
          </div>
          <div>
            <label className="block text-gray-700 text-sm mb-1">結束日期</label>
            <input
              type="text"
              name="endDate"
              value={editEdu.endDate}
              onChange={handleEditEduChange}
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none text-gray-800"
            />
          </div>
        </div>
        
        {/* 縣市和鄉區 (並排) */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-gray-700 text-sm mb-1">縣市</label>
            <input
              type="text"
              name="city"
              value={editEdu.city}
              onChange={handleEditEduChange}
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none text-gray-800"
            />
          </div>
          <div>
            <label className="block text-gray-700 text-sm mb-1">鄉區</label>
            <input
              type="text"
              name="district"
              value={editEdu.district}
              onChange={handleEditEduChange}
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none text-gray-800"
            />
          </div>
        </div>
        
        {/* 整體 GPA (單獨一行) */}
        <div>
          <label className="block text-gray-700 text-sm mb-1">整體 GPA</label>
          <input
            type="text"
            name="gpa"
            value={editEdu.gpa}
            onChange={handleEditEduChange}
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none text-gray-800"
          />
        </div>
      </div>
      
      <div className="flex justify-end space-x-2 mt-6">
        <button onClick={() => setShowEditModal(false)} className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600">取消</button>
        <button onClick={handleSaveEdit} className="bg-gray-900 text-white px-4 py-2 rounded hover:bg-gray-800">儲存</button>
      </div>
    </div>
  </div>
)}

      {/* 刪除 Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="absolute inset-0 bg-black opacity-50" />
          <div className="bg-white rounded-lg p-6 w-full max-w-sm z-10">
            <h3 className="text-xl font-semibold mb-4 text-gray-800 text-center">確認刪除</h3>
            <p className="text-center text-gray-600 mb-6">確定要刪除此筆學歷？</p>
            <div className="flex justify-center space-x-4">
              <button onClick={() => setShowDeleteModal(false)} className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600">取消</button>
              <button onClick={handleDeleteEducation} className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700">刪除</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}