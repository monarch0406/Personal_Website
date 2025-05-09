import React, { useState, useEffect } from "react";

export default function CertificationsAwards() {
  // --- 狀態管理 ---
  // 證照資料
  const [certifications, setCertifications] = useState([]);
  // 獎項資料
  const [awards, setAwards] = useState([]);

  // --- 新增證照 Modal 狀態 ---
  const [showAddCertModal, setShowAddCertModal] = useState(false);
  const [newCert, setNewCert] = useState({
    name: "", 
    description: "", 
    date: "", 
    imageUrl: ""
  });

  // --- 編輯證照 Modal 狀態 ---
  const [showEditCertModal, setShowEditCertModal] = useState(false);
  const [editingCertId, setEditingCertId] = useState(null);
  const [editCert, setEditCert] = useState({ ...newCert });

  // --- 刪除證照 Modal 狀態 ---
  const [showDeleteCertModal, setShowDeleteCertModal] = useState(false);
  const [deletingCertId, setDeletingCertId] = useState(null);

  // --- 新增獎項 Modal 狀態 ---
  const [showAddAwardModal, setShowAddAwardModal] = useState(false);
  const [newAward, setNewAward] = useState({
    name: "", 
    description: "", 
    date: "", 
    imageUrl: ""
  });

  // --- 編輯獎項 Modal 狀態 ---
  const [showEditAwardModal, setShowEditAwardModal] = useState(false);
  const [editingAwardId, setEditingAwardId] = useState(null);
  const [editAward, setEditAward] = useState({ ...newAward });

  // --- 刪除獎項 Modal 狀態 ---
  const [showDeleteAwardModal, setShowDeleteAwardModal] = useState(false);
  const [deletingAwardId, setDeletingAwardId] = useState(null);
  
  // --- Modal 動畫效果 ---
  const [modalAnimationClass, setModalAnimationClass] = useState("");

  // 初次載入：讀取後端資料
  useEffect(() => {
    fetch("/api/certifications")
      .then(res => res.json())
      .then(data => setCertifications(data))
      .catch(console.error);

    fetch("/api/awards")
      .then(res => res.json())
      .then(data => setAwards(data))
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

  // --- 證照相關函數 ---
  // 表單欄位變更
  const handleNewCertChange = e => {
    const { name, value } = e.target;
    setNewCert(prev => ({ ...prev, [name]: value }));
  };
  
  const handleEditCertChange = e => {
    const { name, value } = e.target;
    setEditCert(prev => ({ ...prev, [name]: value }));
  };

  // 新增證照 (POST)
  const handleAddCertification = () => {
    fetch("/api/certifications", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newCert)
    })
      .then(res => res.json())
      .then(created => {
        setCertifications([...certifications, created]);
        closeModalWithAnimation(() => {
          setShowAddCertModal(false);
          setNewCert({ name: "", description: "", date: "", imageUrl: "" });
        });
      })
      .catch(console.error);
  };

  // 開啟編輯證照（帶入原值）
  const openEditCertModal = id => {
    openModalWithAnimation(() => {
      const target = certifications.find(c => c.id === id);
      if (!target) return;
      setEditCert({ ...target });
      setEditingCertId(id);
      setShowEditCertModal(true);
    });
  };

  // 儲存編輯證照 (PUT)
  const handleSaveEditCert = () => {
    fetch(`/api/certifications/${editingCertId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(editCert)
    })
      .then(res => {
        if (!res.ok) throw new Error("更新失敗");
        return res.json();
      })
      .then(updated => {
        setCertifications(certifications.map(c => c.id === updated.id ? updated : c));
        closeModalWithAnimation(() => setShowEditCertModal(false));
      })
      .catch(console.error);
  };

  // 開啟刪除證照
  const openDeleteCertModal = id => {
    openModalWithAnimation(() => {
      setDeletingCertId(id);
      setShowDeleteCertModal(true);
    });
  };

  // 確認刪除證照 (DELETE)
  const handleDeleteCertification = () => {
    fetch(`/api/certifications/${deletingCertId}`, { method: "DELETE" })
      .then(() => {
        setCertifications(certifications.filter(c => c.id !== deletingCertId));
        closeModalWithAnimation(() => setShowDeleteCertModal(false));
      })
      .catch(console.error);
  };

  // --- 獎項相關函數 ---
  // 表單欄位變更
  const handleNewAwardChange = e => {
    const { name, value } = e.target;
    setNewAward(prev => ({ ...prev, [name]: value }));
  };
  
  const handleEditAwardChange = e => {
    const { name, value } = e.target;
    setEditAward(prev => ({ ...prev, [name]: value }));
  };

  // 新增獎項 (POST)
  const handleAddAward = () => {
    fetch("/api/awards", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newAward)
    })
      .then(res => res.json())
      .then(created => {
        setAwards([...awards, created]);
        closeModalWithAnimation(() => {
          setShowAddAwardModal(false);
          setNewAward({ name: "", description: "", date: "", imageUrl: "" });
        });
      })
      .catch(console.error);
  };

  // 開啟編輯獎項（帶入原值）
  const openEditAwardModal = id => {
    openModalWithAnimation(() => {
      const target = awards.find(a => a.id === id);
      if (!target) return;
      setEditAward({ ...target });
      setEditingAwardId(id);
      setShowEditAwardModal(true);
    });
  };

  // 儲存編輯獎項 (PUT)
  const handleSaveEditAward = () => {
    fetch(`/api/awards/${editingAwardId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(editAward)
    })
      .then(res => {
        if (!res.ok) throw new Error("更新失敗");
        return res.json();
      })
      .then(updated => {
        setAwards(awards.map(a => a.id === updated.id ? updated : a));
        closeModalWithAnimation(() => setShowEditAwardModal(false));
      })
      .catch(console.error);
  };

  // 開啟刪除獎項
  const openDeleteAwardModal = id => {
    openModalWithAnimation(() => {
      setDeletingAwardId(id);
      setShowDeleteAwardModal(true);
    });
  };

  // 確認刪除獎項 (DELETE)
  const handleDeleteAward = () => {
    fetch(`/api/awards/${deletingAwardId}`, { method: "DELETE" })
      .then(() => {
        setAwards(awards.filter(a => a.id !== deletingAwardId));
        closeModalWithAnimation(() => setShowDeleteAwardModal(false));
      })
      .catch(console.error);
  };

// 渲染
  return (
    <div className="w-screen min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      {/* Header */}
      <div className="w-full bg-gradient-to-r from-blue-600 to-indigo-700 text-center py-12 shadow-md">
        <h1 className="text-4xl font-bold text-white">證照 & 獎項</h1>
        <p className="text-blue-100 mt-2">Certifications & Awards</p>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 md:px-8 py-8">
        {/* 證照區塊 */}
        <div className="bg-white rounded-xl shadow-lg p-6 md:p-8 mb-10 transform transition-all duration-300 hover:shadow-xl">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-3xl font-bold text-indigo-800">專業證照</h2>
            <button
              onClick={() => openModalWithAnimation(() => setShowAddCertModal(true))}
              className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-4 py-2 rounded-lg shadow hover:from-blue-600 hover:to-indigo-700 flex items-center justify-center transition duration-300 font-bold"
              title="新增證照"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
              </svg>
              新增證照
            </button>
          </div>

          {/* 證照列表 */}
          {certifications.length === 0 ? (
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 text-center">
              <p className="text-gray-500">尚未新增任何證照</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {certifications.map(cert => (
                <div key={cert.id} className="bg-gray-50 border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition-shadow duration-300">
                  {/* 證照圖片 */}
                  {cert.imageUrl && (
                    <div className="relative h-60 overflow-hidden">
                      <img 
                        src={cert.imageUrl} 
                        alt={cert.name} 
                        className="w-full h-full object-cover" 
                      />
                    </div>
                  )}

                  {/* 證照資訊 */}
                  <div className="p-5">
                    <h3 className="text-xl font-bold text-gray-800 mb-2">{cert.name}</h3>
                    <p className="text-gray-600 mb-3">{cert.description}</p>
                    <div className="text-sm text-gray-500 italic mb-4">取得日期：{cert.date}</div>
                    
                    {/* 操作按鈕 */}
                    <div className="flex justify-end space-x-2">
                      <button 
                        onClick={() => openEditCertModal(cert.id)} 
                        className="bg-gradient-to-r from-emerald-400 to-teal-500 text-white p-2 rounded-lg hover:from-emerald-500 hover:to-teal-600 shadow transition duration-300" 
                        title="修改"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                          <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                        </svg>
                      </button>
                      <button 
                        onClick={() => openDeleteCertModal(cert.id)} 
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

        {/* 獎項區塊 */}
        <div className="bg-white rounded-xl shadow-lg p-6 md:p-8 transform transition-all duration-300 hover:shadow-xl">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-3xl font-bold text-indigo-800">榮譽獎項</h2>
            <button
              onClick={() => openModalWithAnimation(() => setShowAddAwardModal(true))}
              className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-4 py-2 rounded-lg shadow hover:from-blue-600 hover:to-indigo-700 flex items-center justify-center transition duration-300 font-bold"
              title="新增獎項"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
              </svg>
              新增獎項
            </button>
          </div>

          {/* 獎項列表 */}
          {awards.length === 0 ? (
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 text-center">
              <p className="text-gray-500">尚未新增任何獎項</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {awards.map(award => (
                <div key={award.id} className="bg-gray-50 border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition-shadow duration-300">
                  {/* 獎項圖片 */}
                  {award.imageUrl && (
                    <div className="relative h-60 overflow-hidden">
                      <img 
                        src={award.imageUrl} 
                        alt={award.name} 
                        className="w-full h-full object-cover" 
                      />
                    </div>
                  )}

                  {/* 獎項資訊 */}
                  <div className="p-5">
                    <h3 className="text-xl font-bold text-gray-800 mb-2">{award.name}</h3>
                    <p className="text-gray-600 mb-3">{award.description}</p>
                    <div className="text-sm text-gray-500 italic mb-4">獲獎日期：{award.date}</div>
                    
                    {/* 操作按鈕 */}
                    <div className="flex justify-end space-x-2">
                      <button 
                        onClick={() => openEditAwardModal(award.id)} 
                        className="bg-gradient-to-r from-emerald-400 to-teal-500 text-white p-2 rounded-lg hover:from-emerald-500 hover:to-teal-600 shadow transition duration-300" 
                        title="修改"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                          <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                        </svg>
                      </button>
                      <button 
                        onClick={() => openDeleteAwardModal(award.id)} 
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
      </div>

      {/* 新增證照 Modal */}
      {showAddCertModal && (
        <div 
          className="fixed inset-0 flex items-center justify-center z-50"
          style={{
            backgroundImage: 
              "linear-gradient(rgba(0,0,0,0.7), rgba(0,0,0,0.7)), url('/images/cert-bg.jpg')",
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            backdropFilter: 'blur(5px)'
          }}
          onClick={() => closeModalWithAnimation(() => setShowAddCertModal(false))}
        >
          <div 
            className={`bg-white rounded-xl shadow-2xl p-6 w-full max-w-md z-10 transform transition-all duration-300 ${modalAnimationClass}`}
            onClick={e => e.stopPropagation()}
          >
            <h3 className="text-xl font-semibold mb-4 text-gray-800">新增證照</h3>
            <div className="space-y-4">
              {/* 證照名稱 */}
              <div>
                <label className="block text-gray-700 text-sm mb-1">證照名稱</label>
                <input
                  type="text"
                  name="name"
                  value={newCert.name}
                  onChange={handleNewCertChange}
                  placeholder="例：AWS 解決方案架構師助理" 
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-800"
                />
              </div>
              
              {/* 證照說明 */}
              <div>
                <label className="block text-gray-700 text-sm mb-1">證照說明</label>
                <textarea
                  name="description"
                  value={newCert.description}
                  onChange={handleNewCertChange}
                  placeholder="請簡短描述此證照的內容及重要性" 
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-800 h-24"
                />
              </div>
              
              {/* 考試日期 */}
              <div>
                <label className="block text-gray-700 text-sm mb-1">考試日期</label>
                <input
                  type="text"
                  name="date"
                  value={newCert.date}
                  onChange={handleNewCertChange}
                  placeholder="例：2023/12/15" 
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-800"
                />
              </div>
              
              {/* 證照照片 URL */}
              <div>
                <label className="block text-gray-700 text-sm mb-1">證照照片 URL</label>
                <input
                  type="text"
                  name="imageUrl"
                  value={newCert.imageUrl}
                  onChange={handleNewCertChange}
                  placeholder="請填入證照照片的網址" 
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-800"
                />
              </div>
            </div>
            
            <div className="flex justify-end space-x-3 mt-6">
              <button 
                onClick={() => closeModalWithAnimation(() => setShowAddCertModal(false))} 
                className="bg-gradient-to-r from-gray-500 to-gray-700 text-white px-5 py-2 rounded-lg shadow hover:from-gray-600 hover:to-gray-800 transition duration-300 font-bold"
              >
                取消
              </button>
              <button 
                onClick={handleAddCertification} 
                className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-5 py-2 rounded-lg shadow hover:from-blue-600 hover:to-indigo-700 transition duration-300 font-bold"
              >
                儲存
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 編輯證照 Modal */}
      {showEditCertModal && (
        <div 
          className="fixed inset-0 flex items-center justify-center z-50"
          style={{
            backgroundImage: 
              "linear-gradient(rgba(0,0,0,0.7), rgba(0,0,0,0.7)), url('/images/cert-bg.jpg')",
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            backdropFilter: 'blur(5px)'
          }}
          onClick={() => closeModalWithAnimation(() => setShowEditCertModal(false))}
        >
          <div 
            className={`bg-white rounded-xl shadow-2xl p-6 w-full max-w-md z-10 transform transition-all duration-300 ${modalAnimationClass}`}
            onClick={e => e.stopPropagation()}
          >
            <h3 className="text-xl font-semibold mb-4 text-gray-800">編輯證照</h3>
            <div className="space-y-4">
              {/* 證照名稱 */}
              <div>
                <label className="block text-gray-700 text-sm mb-1">證照名稱</label>
                <input
                  type="text"
                  name="name"
                  value={editCert.name}
                  onChange={handleEditCertChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-800"
                />
              </div>
              
              {/* 證照說明 */}
              <div>
                <label className="block text-gray-700 text-sm mb-1">證照說明</label>
                <textarea
                  name="description"
                  value={editCert.description}
                  onChange={handleEditCertChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-800 h-24"
                />
              </div>
              
              {/* 考試日期 */}
              <div>
                <label className="block text-gray-700 text-sm mb-1">考試日期</label>
                <input
                  type="text"
                  name="date"
                  value={editCert.date}
                  onChange={handleEditCertChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-800"
                />
              </div>
              
              {/* 證照照片 URL */}
              <div>
                <label className="block text-gray-700 text-sm mb-1">證照照片 URL</label>
                <input
                  type="text"
                  name="imageUrl"
                  value={editCert.imageUrl}
                  onChange={handleEditCertChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-800"
                />
              </div>
            </div>
            
            <div className="flex justify-end space-x-3 mt-6">
              <button 
                onClick={() => closeModalWithAnimation(() => setShowEditCertModal(false))} 
                className="bg-gradient-to-r from-gray-500 to-gray-700 text-white px-5 py-2 rounded-lg shadow hover:from-gray-600 hover:to-gray-800 transition duration-300 font-bold"
              >
                取消
              </button>
              <button 
                onClick={handleSaveEditCert} 
                className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-5 py-2 rounded-lg shadow hover:from-blue-600 hover:to-indigo-700 transition duration-300 font-bold"
              >
                儲存
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 刪除證照 Modal */}
      {showDeleteCertModal && (
        <div 
          className="fixed inset-0 flex items-center justify-center z-50"
          style={{
            backgroundImage: 
              "linear-gradient(rgba(0,0,0,0.7), rgba(0,0,0,0.7)), url('/images/cert-bg.jpg')",
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            backdropFilter: 'blur(5px)'
          }}
          onClick={() => closeModalWithAnimation(() => setShowDeleteCertModal(false))}
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
            <p className="text-center text-gray-700 mb-6">確定要刪除此筆證照？此操作無法撤銷。</p>
            <div className="flex justify-center space-x-4 mt-4">
              <button 
                onClick={() => closeModalWithAnimation(() => setShowDeleteCertModal(false))} 
                className="bg-gradient-to-r from-gray-500 to-gray-700 text-white px-5 py-2 rounded-lg shadow hover:from-gray-600 hover:to-gray-800 transition duration-300 font-bold"
              >
                取消
              </button>
              <button 
                onClick={handleDeleteCertification} 
                className="bg-gradient-to-r from-red-500 to-rose-600 text-white px-5 py-2 rounded-lg shadow hover:from-red-600 hover:to-rose-700 transition duration-300 font-bold"
              >
                刪除
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 新增獎項 Modal */}
      {showAddAwardModal && (
        <div 
          className="fixed inset-0 flex items-center justify-center z-50"
          style={{
            backgroundImage: 
              "linear-gradient(rgba(0,0,0,0.7), rgba(0,0,0,0.7)), url('/images/award-bg.jpg')",
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            backdropFilter: 'blur(5px)'
          }}
          onClick={() => closeModalWithAnimation(() => setShowAddAwardModal(false))}
        >
          <div 
            className={`bg-white rounded-xl shadow-2xl p-6 w-full max-w-md z-10 transform transition-all duration-300 ${modalAnimationClass}`}
            onClick={e => e.stopPropagation()}
          >
            <h3 className="text-xl font-semibold mb-4 text-gray-800">新增獎項</h3>
            <div className="space-y-4">
              {/* 獎項名稱 */}
              <div>
                <label className="block text-gray-700 text-sm mb-1">獎項名稱</label>
                <input
                  type="text"
                  name="name"
                  value={newAward.name}
                  onChange={handleNewAwardChange}
                  placeholder="例：全國大專校院競賽金牌獎" 
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-800"
                />
              </div>
              
<div>
                <label className="block text-gray-700 text-sm mb-1">獎項說明</label>
                <textarea
                  name="description"
                  value={newAward.description}
                  onChange={handleEditAwardChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-800 h-24"
                />
              </div>
              
              {/* 獲獎日期 */}
              <div>
                <label className="block text-gray-700 text-sm mb-1">獲獎日期</label>
                <input
                  type="text"
                  name="date"
                  value={newAward.date}
                  onChange={handleNewAwardChange}
                  placeholder="例：2023/10/25" 
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-800"
                />
              </div>
              
              {/* 獎項照片 URL */}
              <div>
                <label className="block text-gray-700 text-sm mb-1">獎項照片 URL</label>
                <input
                  type="text"
                  name="imageUrl"
                  value={newAward.imageUrl}
                  onChange={handleNewAwardChange}
                  placeholder="請填入獎項照片的網址" 
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-800"
                />
              </div>
            </div>
            
            <div className="flex justify-end space-x-3 mt-6">
              <button 
                onClick={() => closeModalWithAnimation(() => setShowAddAwardModal(false))} 
                className="bg-gradient-to-r from-gray-500 to-gray-700 text-white px-5 py-2 rounded-lg shadow hover:from-gray-600 hover:to-gray-800 transition duration-300 font-bold"
              >
                取消
              </button>
              <button 
                onClick={handleAddAward} 
                className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-5 py-2 rounded-lg shadow hover:from-blue-600 hover:to-indigo-700 transition duration-300 font-bold"
              >
                儲存
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 編輯獎項 Modal */}
      {showEditAwardModal && (
        <div 
          className="fixed inset-0 flex items-center justify-center z-50"
          style={{
            backgroundImage: 
              "linear-gradient(rgba(0,0,0,0.7), rgba(0,0,0,0.7)), url('/images/award-bg.jpg')",
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            backdropFilter: 'blur(5px)'
          }}
          onClick={() => closeModalWithAnimation(() => setShowEditAwardModal(false))}
        >
          <div 
            className={`bg-white rounded-xl shadow-2xl p-6 w-full max-w-md z-10 transform transition-all duration-300 ${modalAnimationClass}`}
            onClick={e => e.stopPropagation()}
          >
            <h3 className="text-xl font-semibold mb-4 text-gray-800">編輯獎項</h3>
            <div className="space-y-4">
              {/* 獎項名稱 */}
              <div>
                <label className="block text-gray-700 text-sm mb-1">獎項名稱</label>
                <input
                  type="text"
                  name="name"
                  value={editAward.name}
                  onChange={handleEditAwardChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-800"
                />
              </div>
              
                {/* 獎項說明 */}
              <div>
                <label className="block text-gray-700 text-sm mb-1">獎項說明</label>
                <textarea
                    name="description"
                    value={editAward.description}
                    onChange={handleEditAwardChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-800 h-24"
                />
              </div>
              
              {/* 獲獎日期 */}
              <div>
                <label className="block text-gray-700 text-sm mb-1">獲獎日期</label>
                <input
                  type="text"
                  name="date"
                  value={editAward.date}
                  onChange={handleEditAwardChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-800"
                />
              </div>
              
              {/* 獎項照片 URL */}
              <div>
                <label className="block text-gray-700 text-sm mb-1">獎項照片 URL</label>
                <input
                  type="text"
                  name="imageUrl"
                  value={editAward.imageUrl}
                  onChange={handleEditAwardChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-800"
                />
              </div>
            </div>
            
            <div className="flex justify-end space-x-3 mt-6">
              <button 
                onClick={() => closeModalWithAnimation(() => setShowEditAwardModal(false))} 
                className="bg-gradient-to-r from-gray-500 to-gray-700 text-white px-5 py-2 rounded-lg shadow hover:from-gray-600 hover:to-gray-800 transition duration-300 font-bold"
              >
                取消
              </button>
              <button 
                onClick={handleSaveEditAward} 
                className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-5 py-2 rounded-lg shadow hover:from-blue-600 hover:to-indigo-700 transition duration-300 font-bold"
              >
                儲存
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 刪除獎項 Modal */}
      {showDeleteAwardModal && (
        <div 
          className="fixed inset-0 flex items-center justify-center z-50"
          style={{
            backgroundImage: 
              "linear-gradient(rgba(0,0,0,0.7), rgba(0,0,0,0.7)), url('/images/award-bg.jpg')",
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            backdropFilter: 'blur(5px)'
          }}
          onClick={() => closeModalWithAnimation(() => setShowDeleteAwardModal(false))}
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
            <p className="text-center text-gray-700 mb-6">確定要刪除此筆獎項？此操作無法撤銷。</p>
            <div className="flex justify-center space-x-4 mt-4">
              <button 
                onClick={() => closeModalWithAnimation(() => setShowDeleteAwardModal(false))} 
                className="bg-gradient-to-r from-gray-500 to-gray-700 text-white px-5 py-2 rounded-lg shadow hover:from-gray-600 hover:to-gray-800 transition duration-300 font-bold"
              >
                取消
              </button>
              <button 
                onClick={handleDeleteAward} 
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