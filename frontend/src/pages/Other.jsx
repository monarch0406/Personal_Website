import React, { useState, useEffect } from "react";

export default function Extracurricular() {
  // --- 狀態管理 ---
  // 課外經歷資料
  const [activities, setActivities] = useState([]);

  // --- 新增經歷 Modal 狀態 ---
  const [showAddModal, setShowAddModal] = useState(false);
  const [newActivity, setNewActivity] = useState({
    title: "", 
    description: "", 
    date: "", 
    imageUrl: ""
  });

  // --- 編輯經歷 Modal 狀態 ---
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingActivityId, setEditingActivityId] = useState(null);
  const [editActivity, setEditActivity] = useState({ ...newActivity });

  // --- 刪除經歷 Modal 狀態 ---
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletingActivityId, setDeletingActivityId] = useState(null);
  
  // --- Modal 動畫效果 ---
  const [modalAnimationClass, setModalAnimationClass] = useState("");

  // 初次載入：讀取後端資料
  useEffect(() => {
    fetch("/api/activities")
      .then(res => res.json())
      .then(data => setActivities(data))
      .catch(console.error);
  }, []);

  // 開啟視窗時添加動畫效果
  const openModalWithAnimation = (modalFunction) => {
    // 先設置為縮小狀態
    setModalAnimationClass("scale-95 opacity-0");
    // 執行模態視窗打開功能
    modalFunction();
    // 短暫延遲後設置為正常大小，產生放大動畫
    setTimeout(() => {
      setModalAnimationClass("scale-100 opacity-100");
    }, 10);
  };

  // 關閉視窗時添加動畫效果
  const closeModalWithAnimation = (closeFunction) => {
    // 設置為縮小狀態，產生縮小動畫
    setModalAnimationClass("scale-95 opacity-0");
    // 動畫結束後關閉視窗
    setTimeout(() => {
      closeFunction();
    }, 200);
  };

  // --- 經歷相關函數 ---
  // 表單欄位變更
  const handleNewActivityChange = e => {
    const { name, value } = e.target;
    setNewActivity(prev => ({ ...prev, [name]: value }));
  };
  
  const handleEditActivityChange = e => {
    const { name, value } = e.target;
    setEditActivity(prev => ({ ...prev, [name]: value }));
  };

  // 新增經歷 (POST)
  const handleAddActivity = () => {
    fetch("/api/activities", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newActivity)
    })
      .then(res => res.json())
      .then(created => {
        setActivities([...activities, created]);
        closeModalWithAnimation(() => {
          setShowAddModal(false);
          setNewActivity({ title: "", description: "", date: "", imageUrl: "" });
        });
      })
      .catch(console.error);
  };

  // 開啟編輯經歷（帶入原值）
  const openEditModal = id => {
    openModalWithAnimation(() => {
      const target = activities.find(a => a.id === id);
      if (!target) return;
      setEditActivity({ ...target });
      setEditingActivityId(id);
      setShowEditModal(true);
    });
  };

  // 儲存編輯經歷 (PUT)
  const handleSaveEdit = () => {
    fetch(`/api/activities/${editingActivityId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(editActivity)
    })
      .then(res => {
        if (!res.ok) throw new Error("更新失敗");
        return res.json();
      })
      .then(updated => {
        setActivities(activities.map(a => a.id === updated.id ? updated : a));
        closeModalWithAnimation(() => setShowEditModal(false));
      })
      .catch(console.error);
  };

  // 開啟刪除經歷
  const openDeleteModal = id => {
    openModalWithAnimation(() => {
      setDeletingActivityId(id);
      setShowDeleteModal(true);
    });
  };

  // 確認刪除經歷 (DELETE)
  const handleDeleteActivity = () => {
    fetch(`/api/activities/${deletingActivityId}`, { method: "DELETE" })
      .then(() => {
        setActivities(activities.filter(a => a.id !== deletingActivityId));
        closeModalWithAnimation(() => setShowDeleteModal(false));
      })
      .catch(console.error);
  };

  return (
    <div className="w-full min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      {/* Header - 確保滿版效果 */}
      <div className="w-full bg-gradient-to-r from-blue-600 to-indigo-700 text-center py-12 shadow-md" style={{ width: '100vw' }}>
        <h1 className="text-4xl font-bold text-white">其他</h1>
        <p className="text-blue-100 mt-2">Others</p>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 md:px-8 py-8">
        {/* 課外經歷區塊 */}
        <div className="bg-white rounded-xl shadow-lg p-6 md:p-8 mb-10 transform transition-all duration-300 hover:shadow-xl">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-3xl font-bold text-indigo-800">課外活動</h2>
            <button
              onClick={() => openModalWithAnimation(() => setShowAddModal(true))}
              className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-4 py-2 rounded-lg shadow hover:from-blue-600 hover:to-indigo-700 flex items-center justify-center transition duration-300 font-bold"
              title="新增經歷"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
              </svg>
              新增經歷
            </button>
          </div>

          {/* 經歷列表 */}
          {activities.length === 0 ? (
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 text-center">
              <p className="text-gray-500">尚未新增任何課外經歷</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {activities.map(activity => (
                <div key={activity.id} className="bg-gray-50 border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition-shadow duration-300">
                  {/* 活動圖片 */}
                  {activity.imageUrl && (
                    <div className="relative h-60 overflow-hidden">
                      <img 
                        src={activity.imageUrl} 
                        alt={activity.title} 
                        className="w-full h-full object-cover" 
                      />
                    </div>
                  )}

                  {/* 活動資訊 */}
                  <div className="p-5">
                    <h3 className="text-xl font-bold text-gray-800 mb-2">{activity.title}</h3>
                    <p className="text-gray-600 mb-3">{activity.description}</p>
                    <div className="text-sm text-gray-500 italic mb-4">日期：{activity.date}</div>
                    
                    {/* 操作按鈕 */}
                    <div className="flex justify-end space-x-2">
                      <button 
                        onClick={() => openEditModal(activity.id)} 
                        className="bg-gradient-to-r from-emerald-400 to-teal-500 text-white p-2 rounded-lg hover:from-emerald-500 hover:to-teal-600 shadow transition duration-300" 
                        title="修改"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                          <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                        </svg>
                      </button>
                      <button 
                        onClick={() => openDeleteModal(activity.id)} 
                        className="bg-gradient-to-r from-red-500 to-rose-600 text-white p-2 rounded-lg hover:from-red-600 hover:to-rose-700 shadow transition duration-300" 
                        title="刪除"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M3 6h18"></path>
                          <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"></path>
                          <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 課外貢獻/志工服務區塊 - 可根據需求調整或刪除 */}
        <div className="bg-white rounded-xl shadow-lg p-6 md:p-8 transform transition-all duration-300 hover:shadow-xl">
          <div className="w-full h-64 flex items-center justify-center">
            <div className="text-center p-8 max-w-2xl">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-blue-500 mb-4" viewBox="0 0 20 20" fill="currentColor">
                <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
              </svg>
              <h3 className="text-2xl font-bold text-gray-800 mb-2">更多內容即將上線</h3>
              <p className="text-gray-600">
                未來會再思考可以添加什麼內容。請不要抱持什麼期待！
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 新增經歷 Modal */}
      {showAddModal && (
        <div 
          className="fixed inset-0 flex items-center justify-center z-50"
          style={{
            backgroundImage: 
              "linear-gradient(rgba(0,0,0,0.7), rgba(0,0,0,0.7)), url('/images/activity-bg.jpg')",
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            backdropFilter: 'blur(5px)'
          }}
          onClick={() => closeModalWithAnimation(() => setShowAddModal(false))}
        >
          <div 
            className={`bg-white rounded-xl shadow-2xl p-6 w-full max-w-md z-10 transform transition-all duration-300 ${modalAnimationClass}`}
            onClick={e => e.stopPropagation()}
          >
            <h3 className="text-xl font-semibold mb-4 text-gray-800">新增課外經歷</h3>
            <div className="space-y-4">
              {/* 活動標題 */}
              <div>
                <label className="block text-gray-700 text-sm mb-1">活動標題</label>
                <input
                  type="text"
                  name="title"
                  value={newActivity.title}
                  onChange={handleNewActivityChange}
                  placeholder="例：校園義工服務" 
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-800"
                />
              </div>
              
              {/* 活動說明 */}
              <div>
                <label className="block text-gray-700 text-sm mb-1">活動說明</label>
                <textarea
                  name="description"
                  value={newActivity.description}
                  onChange={handleNewActivityChange}
                  placeholder="請簡短描述此活動的內容及收穫" 
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-800 h-24"
                />
              </div>
              
              {/* 活動日期 */}
              <div>
                <label className="block text-gray-700 text-sm mb-1">活動日期</label>
                <input
                  type="text"
                  name="date"
                  value={newActivity.date}
                  onChange={handleNewActivityChange}
                  placeholder="例：2023/05/15 或 2023/03-2023/06" 
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-800"
                />
              </div>
              
              {/* 活動照片 URL */}
              <div>
                <label className="block text-gray-700 text-sm mb-1">活動照片 URL</label>
                <input
                  type="text"
                  name="imageUrl"
                  value={newActivity.imageUrl}
                  onChange={handleNewActivityChange}
                  placeholder="請填入活動照片的網址" 
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-800"
                />
              </div>
            </div>
            
            <div className="flex justify-end space-x-3 mt-6">
              <button 
                onClick={() => closeModalWithAnimation(() => setShowAddModal(false))} 
                className="bg-gradient-to-r from-gray-500 to-gray-700 text-white px-5 py-2 rounded-lg shadow hover:from-gray-600 hover:to-gray-800 transition duration-300 font-bold"
              >
                取消
              </button>
              <button 
                onClick={handleAddActivity} 
                className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-5 py-2 rounded-lg shadow hover:from-blue-600 hover:to-indigo-700 transition duration-300 font-bold"
              >
                儲存
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 編輯經歷 Modal */}
      {showEditModal && (
        <div 
          className="fixed inset-0 flex items-center justify-center z-50"
          style={{
            backgroundImage: 
              "linear-gradient(rgba(0,0,0,0.7), rgba(0,0,0,0.7)), url('/images/activity-bg.jpg')",
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            backdropFilter: 'blur(5px)'
          }}
          onClick={() => closeModalWithAnimation(() => setShowEditModal(false))}
        >
          <div 
            className={`bg-white rounded-xl shadow-2xl p-6 w-full max-w-md z-10 transform transition-all duration-300 ${modalAnimationClass}`}
            onClick={e => e.stopPropagation()}
          >
            <h3 className="text-xl font-semibold mb-4 text-gray-800">編輯課外經歷</h3>
            <div className="space-y-4">
              {/* 活動標題 */}
              <div>
                <label className="block text-gray-700 text-sm mb-1">活動標題</label>
                <input
                  type="text"
                  name="title"
                  value={editActivity.title}
                  onChange={handleEditActivityChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-800"
                />
              </div>
              
              {/* 活動說明 */}
              <div>
                <label className="block text-gray-700 text-sm mb-1">活動說明</label>
                <textarea
                  name="description"
                  value={editActivity.description}
                  onChange={handleEditActivityChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-800 h-24"
                />
              </div>
              
              {/* 活動日期 */}
              <div>
                <label className="block text-gray-700 text-sm mb-1">活動日期</label>
                <input
                  type="text"
                  name="date"
                  value={editActivity.date}
                  onChange={handleEditActivityChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-800"
                />
              </div>
              
              {/* 活動照片 URL */}
              <div>
                <label className="block text-gray-700 text-sm mb-1">活動照片 URL</label>
                <input
                  type="text"
                  name="imageUrl"
                  value={editActivity.imageUrl}
                  onChange={handleEditActivityChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-800"
                />
              </div>
            </div>
            
            <div className="flex justify-end space-x-3 mt-6">
              <button 
                onClick={() => closeModalWithAnimation(() => setShowEditModal(false))} 
                className="bg-gradient-to-r from-gray-500 to-gray-700 text-white px-5 py-2 rounded-lg shadow hover:from-gray-600 hover:to-gray-800 transition duration-300 font-bold"
              >
                取消
              </button>
              <button 
                onClick={handleSaveEdit} 
                className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-5 py-2 rounded-lg shadow hover:from-blue-600 hover:to-indigo-700 transition duration-300 font-bold"
              >
                儲存
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 刪除經歷 Modal */}
      {showDeleteModal && (
        <div 
          className="fixed inset-0 flex items-center justify-center z-50"
          style={{
            backgroundImage: 
              "linear-gradient(rgba(0,0,0,0.7), rgba(0,0,0,0.7)), url('/images/activity-bg.jpg')",
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            backdropFilter: 'blur(5px)'
          }}
          onClick={() => closeModalWithAnimation(() => setShowDeleteModal(false))}
        >
          <div 
            className={`bg-white rounded-xl shadow-2xl p-6 w-full max-w-md z-10 transform transition-all duration-300 ${modalAnimationClass}`}
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center text-red-600 mb-4 justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <h3 className="text-2xl font-semibold mb-4 text-gray-800 text-center">確認刪除</h3>
            <p className="text-center text-gray-700 mb-6">確定要刪除此筆課外經歷？此操作無法撤銷。</p>
            <div className="flex justify-center space-x-4 mt-4">
              <button 
                onClick={() => closeModalWithAnimation(() => setShowDeleteModal(false))} 
                className="bg-gradient-to-r from-gray-500 to-gray-700 text-white px-5 py-2 rounded-lg shadow hover:from-gray-600 hover:to-gray-800 transition duration-300 font-bold"
              >
                取消
              </button>
              <button 
                onClick={handleDeleteActivity} 
                className="bg-gradient-to-r from-red-500 to-rose-600 text-white px-5 py-2 rounded-lg shadow hover:from-red-600 hover:to-rose-700 transition duration-300 font-bold"
              >
                刪除
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}