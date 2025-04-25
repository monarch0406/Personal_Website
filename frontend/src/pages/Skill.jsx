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
    closeAllModals();
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
    closeAllModals();
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
    closeAllModals();
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
    closeAllModals();
  }

  // Modal handlers
  function openAddModal(catId) {
    setModalCatId(catId);
    setTempName('');
    setTempDesc('');
    setAddModalOpen(true);
  }
  function openEditModal(catId, idx) {
    const it = categories.find(c => c.id === catId).items[idx];
    setEditCatId(catId);
    setEditIndex(idx);
    setEditName(it.name);
    setEditDesc(it.desc);
    setEditModalOpen(true);
  }
  function openDelItemModal(catId, idx) {
    setDelItemCatId(catId);
    setDelItemIndex(idx);
    setDelItemModalOpen(true);
  }
  function openDeleteCategoryModal(catId) {
    setDelCatId(catId);
    setDelCatModalOpen(true);
  }
  function closeAllModals() {
    setAddModalOpen(false);
    setEditModalOpen(false);
    setDelItemModalOpen(false);
    setDelCatModalOpen(false);
  }

  return (
    <div className="w-screen h-screen bg-gray-50 overflow-auto flex flex-col p-8">
      {/* Header */}
      <header className="mb-8 text-center">
        <h1 className="text-4xl font-bold text-gray-800">技能</h1>
        <p className="text-xl text-gray-600 mt-2">Skills</p>
      </header>

      {/* Main Content */}
      <main className="flex-grow space-y-8">
        {categories.map(cat => (
          <section key={cat.id} className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-semibold text-gray-800">{cat.name}</h2>
              <div className="space-x-2">
                <button onClick={() => openAddModal(cat.id)} className="!bg-blue-500 !text-white hover:!bg-blue-600 px-3 py-1 rounded-lg shadow transition">
                  新增項目
                </button>
                <button onClick={() => openDeleteCategoryModal(cat.id)} className="!bg-red-500 !text-white hover:!bg-red-600 px-3 py-1 rounded-lg shadow transition">
                  刪除欄位
                </button>
              </div>
            </div>

            <div className="space-y-3">
              {cat.items.map((item, idx) => (
                <div key={item.id} className="bg-gray-100 border border-gray-300 rounded-lg p-4 flex items-center justify-between">
                  <div className="flex-1 grid grid-cols-[120px_minmax(0,1fr)] gap-4 items-center">
                    <span className="text-xl font-extrabold text-gray-900">
                      {item.name}
                    </span>
                    <span className="text-gray-700">{item.desc}</span>
                  </div>
                  <div className="space-x-2">
                    <button onClick={() => openEditModal(cat.id, idx)} className="!bg-green-400 !text-white hover:!bg-green-500 px-2 py-1 rounded transition">
                      修改
                    </button>
                    <button onClick={() => openDelItemModal(cat.id, idx)} className="!bg-red-500 !text-white hover:!bg-red-600 px-2 py-1 rounded transition">
                      刪除
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        ))}
        {/* Footer: 新增欄位 */}
          <div className="flex max-w-lg mx-auto">
            <input
              type="text"
              placeholder="新增欄位名稱，例如「資料庫」"
              value={newCategoryName}
              onChange={e => setNewCategoryName(e.target.value)}
              className="flex-1 border border-gray-300 rounded-l-lg px-4 py-2 text-gray-800 focus:outline-none"
            />
            <button onClick={addCategory} className="!bg-blue-500 !text-white hover:!bg-blue-600 px-4 py-2 rounded-r-lg transition">
              新增欄位
            </button>
          </div>
        </main>

      {/* Add Item Modal */}
      {addModalOpen && (
          <div
          className="fixed inset-0 flex items-center justify-center"
          style={{
            backgroundImage: 
              // 第一層：深黑漸層；第二層：你的圖片
              "linear-gradient(rgba(0,0,0,0.7), rgba(0,0,0,0.7)), url('/images/image3.jpg')",
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
          }}          
          >
          <div className="bg-white rounded-lg p-6 w-full max-w-sm">
            <h3 className="text-2xl font-semibold mb-4 text-gray-800 text-center">新增項目</h3>
            <div className="mb-4">
              <label className="block mb-2 text-gray-700 font-medium">技能名稱</label>
              <input
                type="text"
                value={tempName}
                onChange={e => setTempName(e.target.value)}
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none text-gray-800"
              />
            </div>
            <div className="mb-4">
              <label className="block mb-2 text-gray-700 font-medium">說明</label>
              <input
                type="text"
                value={tempDesc}
                onChange={e => setTempDesc(e.target.value)}
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none text-gray-800"
              />
            </div>
            <div className="flex justify-center space-x-4 mt-4">
              <button onClick={closeAllModals} className="!bg-gray-500 !text-white hover:!bg-gray-600 px-4 py-2 rounded-lg transition">取消</button>
              <button onClick={() => addItem(modalCatId, tempName.trim(), tempDesc.trim())} className="!bg-blue-500 !text-white hover:!bg-blue-600 px-4 py-2 rounded-lg transition">確認</button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Item Modal */}
      {editModalOpen && (
          <div
          className="fixed inset-0 flex items-center justify-center"
          style={{
            backgroundImage: 
              // 第一層：深黑漸層；第二層：你的圖片
              "linear-gradient(rgba(0,0,0,0.7), rgba(0,0,0,0.7)), url('/images/image4.jpg')",
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
          }}          
          >
          <div className="bg-white rounded-lg p-6 w-full max-w-sm">
            <h3 className="text-2xl font-semibold mb-4 text-gray-800 text-center">修改項目</h3>
            <div className="mb-4">
              <label className="block mb-2 text-gray-700 font-medium">技能名稱</label>
              <input
                type="text"
                value={editName}
                onChange={e => setEditName(e.target.value)}
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none text-gray-800"
              />
            </div>
            <div className="mb-4">
              <label className="block mb-2 text-gray-700 font-medium">說明</label>
              <input
                type="text"
                value={editDesc}
                onChange={e => setEditDesc(e.target.value)}
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none text-gray-800"
              />
            </div>
            <div className="flex justify-center space-x-4 mt-4">
              <button onClick={closeAllModals} className="!bg-gray-500 !text-white hover:!bg-gray-600 px-4 py-2 rounded-lg transition">取消</button>
              <button onClick={updateItem} className="!bg-blue-500 !text-white hover:!bg-blue-600 px-4 py-2 rounded-lg transition">確認</button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Item Modal */}
      {delItemModalOpen && (
          <div
          className="fixed inset-0 flex items-center justify-center"
          style={{
            backgroundImage: 
              // 第一層：深黑漸層；第二層：你的圖片
              "linear-gradient(rgba(0,0,0,0.7), rgba(0,0,0,0.7)), url('/images/image1.jpg')",
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
          }}          
          >
          <div className="bg-white rounded-lg p-6 w-full max-w-sm">
            <h3 className="text-2xl font-semibold mb-4 text-gray-800 text-center">刪除項目</h3>
            <p className="text-center text-gray-700 mb-4">確定要刪除此項目嗎？</p>
            <div className="flex justify-center space-x-4 mt-4">
              <button onClick={closeAllModals} className="!bg-gray-500 !text-white hover:!bg-gray-600 px-4 py-2 rounded-lg transition">取消</button>
              <button onClick={deleteItem} className="!bg-red-500 !text-white hover:!bg-red-600 px-4 py-2 rounded-lg transition">刪除</button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Category Modal */}
      {delCatModalOpen && (
          <div
          className="fixed inset-0 flex items-center justify-center"
          style={{
            backgroundImage: 
              // 第一層：深黑漸層；第二層：你的圖片
              "linear-gradient(rgba(0,0,0,0.7), rgba(0,0,0,0.7)), url('/images/image1.jpg')",
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
          }}          
          >
          <div className="bg-white rounded-lg p-6 w-full max-w-sm">
            <h3 className="text-2xl font-semibold mb-4 text-gray-800 text-center">刪除欄位</h3>
            <p className="text-center text-gray-700 mb-4">確定要刪除此欄位嗎？</p>
            <div className="flex justify-center space-x-4 mt-4">
              <button onClick={closeAllModals} className="!bg-gray-500 !text-white hover:!bg-gray-600 px-4 py-2 rounded-lg transition">取消</button>
              <button onClick={deleteCategory} className="!bg-red-500 !text-white hover:!bg-red-600 px-4 py-2 rounded-lg transition">刪除</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
