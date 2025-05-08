import React, { useEffect, useState } from 'react';

export default function SkillsPage() {
  // State
  const [categories, setCategories] = useState([]);
  const [newCategoryName, setNewCategoryName] = useState('');

  // Add Item Modal
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [modalCatId, setModalCatId] = useState(null);
  const [tempName, setTempName] = useState('');
  const [tempDesc, setTempDesc] = useState('');

  // Edit Item Modal
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editCatId, setEditCatId] = useState(null);
  const [editIndex, setEditIndex] = useState(null);
  const [editName, setEditName] = useState('');
  const [editDesc, setEditDesc] = useState('');

  // Delete Item Modal
  const [delItemModalOpen, setDelItemModalOpen] = useState(false);
  const [delItemCatId, setDelItemCatId] = useState(null);
  const [delItemIndex, setDelItemIndex] = useState(null);

  // Delete Category Modal
  const [delCatModalOpen, setDelCatModalOpen] = useState(false);
  const [delCatId, setDelCatId] = useState(null);

  // Modal Animation
  const [modalAnimationClass, setModalAnimationClass] = useState("");

  // Fetch all categories on mount
  useEffect(() => {
    fetchCategories();
  }, []);

  async function fetchCategories() {
    const res = await fetch('http://localhost:8080/api/categories');
    const data = await res.json();
    // map backend shape to frontend state
    setCategories(
      data.map(cat => ({
        id: cat.id,
        name: cat.name,
        items: (cat.skills || []).map(s => ({
          id: s.id,
          name: s.name,
          desc: s.description
        }))
      }))
    );
  }

  // Category CRUD
  async function addCategory() {
    if (!newCategoryName.trim()) return;
    const res = await fetch('http://localhost:8080/api/categories', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: newCategoryName.trim() })
    });
    const cat = await res.json();
    setCategories([...categories, { id: cat.id, name: cat.name, items: [] }]);
    setNewCategoryName('');
  }

  async function deleteCategory() {
    await fetch(`http://localhost:8080/api/categories/${delCatId}`, { method: 'DELETE' });
    setCategories(categories.filter(cat => cat.id !== delCatId));
    closeModalWithAnimation();
  }

  // Item CRUD
  async function addItem(catId, name, desc) {
    const res = await fetch('http://localhost:8080/api/skills', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, description: desc, categoryId: catId })
    });
    const s = await res.json();
    setCategories(
      categories.map(cat =>
        cat.id === catId
          ? { ...cat, items: [...cat.items, { id: s.id, name: s.name, desc: s.description }] }
          : cat
      )
    );
    closeModalWithAnimation();
  }

  async function updateItem() {
    const cat = categories.find(c => c.id === editCatId);
    const item = cat.items[editIndex];
    const res = await fetch(`http://localhost:8080/api/skills/${item.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: editName, description: editDesc, categoryId: editCatId })
    });
    const updated = await res.json();
    setCategories(
      categories.map(c => {
        if (c.id !== editCatId) return c;
        const items = c.items.map(i => (i.id === updated.id ? { id: updated.id, name: updated.name, desc: updated.description } : i));
        return { ...c, items };
      })
    );
    closeModalWithAnimation();
  }

  async function deleteItem() {
    const cat = categories.find(c => c.id === delItemCatId);
    const item = cat.items[delItemIndex];
    await fetch(`http://localhost:8080/api/skills/${item.id}`, { method: 'DELETE' });
    setCategories(
      categories.map(c =>
        c.id === delItemCatId
          ? { ...c, items: c.items.filter(i => i.id !== item.id) }
          : c
      )
    );
    closeModalWithAnimation();
  }

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
  const closeModalWithAnimation = () => {
    // 設置為縮小狀態，產生縮小動畫
    setModalAnimationClass("scale-95 opacity-0");
    // 動畫結束後關閉視窗
    setTimeout(() => {
      closeAllModals();
    }, 200);
  };

  // Modal handlers
  function openAddModal(catId) {
    openModalWithAnimation(() => {
      setModalCatId(catId);
      setTempName('');
      setTempDesc('');
      setAddModalOpen(true);
    });
  }
  
  function openEditModal(catId, idx) {
    openModalWithAnimation(() => {
      const it = categories.find(c => c.id === catId).items[idx];
      setEditCatId(catId);
      setEditIndex(idx);
      setEditName(it.name);
      setEditDesc(it.desc);
      setEditModalOpen(true);
    });
  }
  
  function openDelItemModal(catId, idx) {
    openModalWithAnimation(() => {
      setDelItemCatId(catId);
      setDelItemIndex(idx);
      setDelItemModalOpen(true);
    });
  }
  
  function openDeleteCategoryModal(catId) {
    openModalWithAnimation(() => {
      setDelCatId(catId);
      setDelCatModalOpen(true);
    });
  }
  
  function closeAllModals() {
    setAddModalOpen(false);
    setEditModalOpen(false);
    setDelItemModalOpen(false);
    setDelCatModalOpen(false);
  }

  return (
    <div className="w-screen min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 overflow-auto flex flex-col">
      {/* Header */}
      <header className="w-full bg-gradient-to-r from-blue-600 to-indigo-700 text-center py-12 shadow-md mb-8">
        <h1 className="text-4xl font-bold text-white">技能</h1>
        <p className="text-blue-100 mt-2">Skills</p>
      </header>

      {/* Main Content */}
      <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <div className="space-y-8">
          {categories.map(cat => (
            <section key={cat.id} className="bg-white rounded-xl shadow-lg p-6 transform transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
              <div className="flex flex-wrap justify-between items-center mb-6">
                <h2 className="text-2xl font-semibold text-gray-800">{cat.name}</h2>
                <div className="space-x-2 mt-2 sm:mt-0">
                  <button onClick={() => openAddModal(cat.id)} className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white hover:from-blue-600 hover:to-indigo-700 px-3 py-1.5 rounded-lg shadow transition duration-300 !font-bold">
                    新增項目
                  </button>
                  <button onClick={() => openDeleteCategoryModal(cat.id)} className="bg-gradient-to-r from-red-500 to-rose-600 text-white hover:from-red-600 hover:to-rose-700 px-3 py-1.5 rounded-lg shadow transition duration-300 !font-bold">
                    刪除欄位
                  </button>
                </div>
              </div>

              <div className="space-y-4">
                {cat.items.map((item, idx) => (
                  <div key={item.id} className="bg-gray-50 border border-gray-200 rounded-lg p-4 flex flex-wrap md:flex-nowrap items-center justify-between transition-all duration-300 hover:bg-white hover:shadow">
                    <div className="flex-1 grid grid-cols-1 md:grid-cols-[120px_minmax(0,1fr)] gap-2 md:gap-4 items-center mb-3 md:mb-0">
                      <span className="text-xl !font-bold text-gray-900">
                        {item.name}
                      </span>
                      <span className="text-gray-700">{item.desc}</span>
                    </div>
                    <div className="flex space-x-2 w-full md:w-auto">
                      <button onClick={() => openEditModal(cat.id, idx)} className="bg-gradient-to-r from-emerald-400 to-teal-500 text-white hover:from-emerald-500 hover:to-teal-600 px-3 py-1.5 rounded-lg transition duration-300 flex-1 md:flex-initial !font-bold">
                        修改
                      </button>
                      <button onClick={() => openDelItemModal(cat.id, idx)} className="bg-gradient-to-r from-red-500 to-rose-600 text-white hover:from-red-600 hover:to-rose-700 px-3 py-1.5 rounded-lg transition duration-300 flex-1 md:flex-initial !font-bold">
                        刪除
                      </button>
                    </div>
                  </div>
                ))}
                {cat.items.length === 0 && (
                  <div className="text-center py-8 bg-gray-50 rounded-lg border border-gray-200">
                    <p className="text-gray-500">尚未新增任何項目</p>
                  </div>
                )}
              </div>
            </section>
          ))}
          
          {/* Footer: 新增欄位 */}
          <div className="bg-white rounded-xl shadow-lg p-6 transform transition-all duration-300 hover:shadow-xl">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">新增欄位</h2>
            <div className="flex flex-col sm:flex-row">
              <input
                type="text"
                placeholder="新增欄位名稱，例如「資料庫」"
                value={newCategoryName}
                onChange={e => setNewCategoryName(e.target.value)}
                className="flex-1 border border-gray-300 rounded-lg sm:rounded-r-none px-4 py-2 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <button 
                onClick={addCategory} 
                className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white hover:from-blue-600 hover:to-indigo-700 px-6 py-2 rounded-lg sm:rounded-l-none shadow transition duration-300 mt-2 sm:mt-0 !font-bold"
              >
                新增欄位
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* Add Item Modal */}
      {addModalOpen && (
        <div
          className="fixed inset-0 flex items-center justify-center z-50"
          style={{
            backgroundImage: 
              "linear-gradient(rgba(0,0,0,0.7), rgba(0,0,0,0.7)), url('/images/image3.jpg')",
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            backdropFilter: 'blur(5px)'
          }}
          onClick={() => closeModalWithAnimation()}
        >
          <div 
            className={`bg-white rounded-xl shadow-2xl p-6 w-full max-w-md transform transition-all duration-300 ${modalAnimationClass}`}
            onClick={e => e.stopPropagation()}
          >
            <h3 className="text-2xl font-semibold mb-4 text-gray-800 text-center !font-bold">新增項目</h3>
            <div className="mb-4">
              <label className="block mb-2 text-gray-700 font-medium">技能名稱</label>
              <input
                type="text"
                value={tempName}
                onChange={e => setTempName(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-800"
              />
            </div>
            <div className="mb-4">
              <label className="block mb-2 text-gray-700 font-medium">說明</label>
              <input
                type="text"
                value={tempDesc}
                onChange={e => setTempDesc(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-800"
              />
            </div>
            <div className="flex justify-center space-x-4 mt-6">
              <button onClick={() => closeModalWithAnimation()} className="bg-gradient-to-r from-gray-500 to-gray-700 text-white hover:from-gray-600 hover:to-gray-800 px-5 py-2 rounded-lg shadow transition duration-300 !font-bold">取消</button>
              <button 
                onClick={() => addItem(modalCatId, tempName.trim(), tempDesc.trim())} 
                className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white hover:from-blue-600 hover:to-indigo-700 px-5 py-2 rounded-lg shadow transition duration-300 !font-bold"
                disabled={!tempName.trim()}
              >確認</button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Item Modal */}
      {editModalOpen && (
        <div
          className="fixed inset-0 flex items-center justify-center z-50"
          style={{
            backgroundImage: 
              "linear-gradient(rgba(0,0,0,0.7), rgba(0,0,0,0.7)), url('/images/image2.jpg')",
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            backdropFilter: 'blur(5px)'
          }}
          onClick={() => closeModalWithAnimation()}
        >
          <div 
            className={`bg-white rounded-xl shadow-2xl p-6 w-full max-w-md transform transition-all duration-300 ${modalAnimationClass}`}
            onClick={e => e.stopPropagation()}
          >
            <h3 className="text-2xl font-semibold mb-4 text-gray-800 text-center">修改項目</h3>
            <div className="mb-4">
              <label className="block mb-2 text-gray-700 font-medium">技能名稱</label>
              <input
                type="text"
                value={editName}
                onChange={e => setEditName(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-800"
              />
            </div>
            <div className="mb-4">
              <label className="block mb-2 text-gray-700 font-medium">說明</label>
              <input
                type="text"
                value={editDesc}
                onChange={e => setEditDesc(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-800"
              />
            </div>
            <div className="flex justify-center space-x-4 mt-6">
              <button onClick={() => closeModalWithAnimation()} className="bg-gradient-to-r from-gray-500 to-gray-700 text-white hover:from-gray-600 hover:to-gray-800 px-5 py-2 rounded-lg shadow transition duration-300 !font-bold">取消</button>
              <button 
                onClick={updateItem} 
                className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white hover:from-blue-600 hover:to-indigo-700 px-5 py-2 rounded-lg shadow transition duration-300 !font-bold"
                disabled={!editName.trim()}
              >確認</button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Item Modal */}
      {delItemModalOpen && (
        <div
          className="fixed inset-0 flex items-center justify-center z-50"
          style={{
            backgroundImage: 
              "linear-gradient(rgba(0,0,0,0.7), rgba(0,0,0,0.7)), url('/images/image1.jpg')",
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            backdropFilter: 'blur(5px)'
          }}
          onClick={() => closeModalWithAnimation()}
        >
          <div 
            className={`bg-white rounded-xl shadow-2xl p-6 w-full max-w-md transform transition-all duration-300 ${modalAnimationClass}`}
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center text-red-600 mb-4 justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <h3 className="text-2xl font-semibold mb-4 text-gray-800 text-center">刪除項目</h3>
            <p className="text-center text-gray-700 mb-6">確定要刪除此項目嗎？此操作無法撤銷。</p>
            <div className="flex justify-center space-x-4 mt-4">
              <button onClick={() => closeModalWithAnimation()} className="bg-gradient-to-r from-gray-500 to-gray-700 text-white hover:from-gray-600 hover:to-gray-800 px-5 py-2 rounded-lg shadow transition duration-300 !font-bold">取消</button>
              <button onClick={deleteItem} className="bg-gradient-to-r from-red-500 to-rose-600 text-white hover:from-red-600 hover:to-rose-700 px-5 py-2 rounded-lg shadow transition duration-300 !font-bold">刪除</button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Category Modal */}
      {delCatModalOpen && (
        <div
          className="fixed inset-0 flex items-center justify-center z-50"
          style={{
            backgroundImage: 
              "linear-gradient(rgba(0,0,0,0.7), rgba(0,0,0,0.7)), url('/images/image1.jpg')",
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            backdropFilter: 'blur(5px)'
          }}
          onClick={() => closeModalWithAnimation()}
        >
          <div 
            className={`bg-white rounded-xl shadow-2xl p-6 w-full max-w-md transform transition-all duration-300 ${modalAnimationClass}`}
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center text-red-600 mb-4 justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <h3 className="text-2xl font-semibold mb-4 text-gray-800 text-center">刪除欄位</h3>
            <p className="text-center text-gray-700 mb-6">確定要刪除此欄位嗎？此操作無法撤銷。</p>
            <div className="flex justify-center space-x-4 mt-4">
              <button onClick={() => closeModalWithAnimation()} className="bg-gradient-to-r from-gray-500 to-gray-700 text-white hover:from-gray-600 hover:to-gray-800 px-5 py-2 rounded-lg shadow transition duration-300 !font-bold">取消</button>
              <button onClick={deleteCategory} className="bg-gradient-to-r from-red-500 to-rose-600 text-white hover:from-red-600 hover:to-rose-700 px-5 py-2 rounded-lg shadow transition duration-300 !font-bold">刪除</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}