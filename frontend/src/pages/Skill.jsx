import React, { useState } from 'react';

export default function SkillsPage() {
  const [categories, setCategories] = useState([
    {
      id: 1,
      name: '程式語言',
      items: [
        { name: 'Python', desc: '刷題、資料探勘使用' },
        { name: 'Java', desc: '後端開發' }
      ]
    },
    {
      id: 2,
      name: '網頁設計',
      items: [
        { name: 'HTML', desc: '骨架標記' },
        { name: 'CSS', desc: '樣式設計' }
      ]
    }
  ]);
  const [newCategoryName, setNewCategoryName] = useState('');

  // Add-Item Modal state
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [modalCatId, setModalCatId] = useState(null);
  const [tempName, setTempName] = useState('');
  const [tempDesc, setTempDesc] = useState('');

  // Edit-Item Modal state
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editCatId, setEditCatId] = useState(null);
  const [editIndex, setEditIndex] = useState(null);
  const [editName, setEditName] = useState('');
  const [editDesc, setEditDesc] = useState('');

  // Delete-Item Modal state
  const [delModalOpen, setDelModalOpen] = useState(false);
  const [delCatId, setDelCatId] = useState(null);
  const [delIndex, setDelIndex] = useState(null);

  // Functions for CRUD operations
  const addCategory = () => {
    if (!newCategoryName.trim()) return;
    setCategories([
      ...categories,
      { id: Date.now(), name: newCategoryName.trim(), items: [] }
    ]);
    setNewCategoryName('');
  };

  const addItem = (catId, name, desc) => {
    setCategories(categories.map(cat => {
      if (cat.id === catId) {
        return {
          ...cat,
          items: [...cat.items, { name: name.trim(), desc: desc.trim() }]
        };
      }
      return cat;
    }));
  };

  const updateItem = () => {
    setCategories(categories.map(cat => {
      if (cat.id === editCatId) {
        const items = [...cat.items];
        items[editIndex] = { name: editName.trim(), desc: editDesc.trim() };
        return { ...cat, items };
      }
      return cat;
    }));
  };

  const deleteItem = () => {
    setCategories(categories.map(cat => {
      if (cat.id === delCatId) {
        const items = cat.items.filter((_, idx) => idx !== delIndex);
        return { ...cat, items };
      }
      return cat;
    }));
  };

  // Modal open handlers
  const openAddModal = catId => {
    setModalCatId(catId);
    setTempName(''); setTempDesc('');
    setAddModalOpen(true);
  };

  const openEditModal = (catId, idx) => {
    const item = categories.find(c => c.id === catId).items[idx];
    setEditCatId(catId); setEditIndex(idx);
    setEditName(item.name); setEditDesc(item.desc);
    setEditModalOpen(true);
  };

  const openDelModal = (catId, idx) => {
    setDelCatId(catId); setDelIndex(idx);
    setDelModalOpen(true);
  };

  const closeModals = () => {
    setAddModalOpen(false);
    setEditModalOpen(false);
    setDelModalOpen(false);
    setModalCatId(null); setEditCatId(null); setDelCatId(null);
  };

  return (
    <div className="w-screen h-screen bg-gray-50 overflow-auto flex flex-col p-8">
      {/* Header */}
      <header className="flex-shrink-0">
        <h1 className="text-4xl font-bold text-gray-800 text-center mb-4">技能</h1>
        <h2 className="text-2xl text-gray-600 text-center mb-8">Skills</h2>
      </header>

      {/* Main Content */}
      <main className="flex-grow space-y-8">
        {categories.map(cat => (
          <section key={cat.id} className="w-full bg-white rounded-lg shadow p-6">
            <h2 className="text-3xl font-bold text-gray-800 mb-4 text-center">{cat.name}</h2>
            <div className="space-y-3 mb-4">
              {cat.items.map((item, idx) => (
                <div
                  key={idx}
                  className="bg-gray-100 border border-gray-300 rounded-lg p-4 flex justify-between items-center"
                >
                  <div>
                    <span className="text-lg font-bold text-gray-900 mr-4">{item.name}</span>
                    <span className="text-gray-700">{item.desc}</span>
                  </div>
                  <div className="space-x-2">
                    <button
                      onClick={() => openEditModal(cat.id, idx)}
                      className="px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600 transition"
                    >修改</button>
                    <button
                      onClick={() => openDelModal(cat.id, idx)}
                      className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition"
                    >刪除</button>
                  </div>
                </div>
              ))}
            </div>
            <div className="text-center">
              <button
                onClick={() => openAddModal(cat.id)}
                className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition"
              >新增項目</button>
            </div>
          </section>
        ))}
      </main>

      {/* Footer: 新增分類 */}
      <footer className="flex-shrink-0 mt-12">
        <div className="flex w-full max-w-lg mx-auto">
          <input
            type="text"
            placeholder="新增欄位名稱，例如「資料庫」"
            value={newCategoryName}
            onChange={e => setNewCategoryName(e.target.value)}
            className="flex-1 border border-gray-300 rounded-l-lg px-4 py-3 focus:outline-none"
          />
          <button
            onClick={addCategory}
            className="bg-blue-600 text-white px-6 py-3 rounded-r-lg hover:bg-blue-700 transition"
          >新增欄位</button>
        </div>
      </footer>

      {/* Add Item Modal */}
      {addModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 w-full max-w-sm">
            <h3 className="text-2xl font-semibold mb-4 text-gray-800 text-center">新增項目</h3>
            <div className="mb-4">
              <label className="block mb-2 text-gray-700 font-medium">技能名稱</label>
              <input
                type="text"
                value={tempName}
                onChange={e => setTempName(e.target.value)}
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none"
              />
            </div>
            <div className="mb-4">
              <label className="block mb-2 text-gray-700 font-medium">說明</label>
              <input
                type="text"
                value={tempDesc}
                onChange={e => setTempDesc(e.target.value)}
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none"
              />
            </div>
            <div className="flex justify-end space-x-3">
              <button onClick={closeModals} className="px-4 py-2 border rounded hover:bg-gray-100 transition">取消</button>
              <button
                onClick={() => {
                  if (tempName.trim() && tempDesc.trim()) {
                    addItem(modalCatId, tempName, tempDesc);
                    closeModals();
                  }
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
              >確認</button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Item Modal */}
      {editModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 w-full max-w-sm">
            <h3 className="text-2xl font-semibold mb-4 text-gray-800 text-center">修改項目</h3>
            <div className="mb-4">
              <label className="block mb-2 text-gray-700 font-medium">技能名稱</label>
              <input
                type="text"
                value={editName}
                onChange={e => setEditName(e.target.value)}
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none"
              />
            </div>
            <div className="mb-4">
              <label className="block mb-2 text-gray-700 font-medium">說明</label>
              <input
                type="text"
                value={editDesc}
                onChange={e => setEditDesc(e.target.value)}
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none"
              />
            </div>
            <div className="flex justify-end space-x-3">
              <button onClick={closeModals} className="px-4 py-2 border rounded hover:bg-gray-100 transition">取消</button>
              <button
                onClick={() => {
                  if (editName.trim() && editDesc.trim()) {
                    updateItem();
                    closeModals();
                  }
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
              >確認</button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {delModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 w-full max-w-sm">
            <h3 className="text-2xl font-semibold mb-4 text-gray-800 text-center">刪除項目</h3>
            <p className="text-center text-gray-700 mb-4">確定要刪除此項目嗎？</p>
            <div className="flex justify-end space-x-3">
              <button onClick={closeModals} className="px-4 py-2 border rounded hover:bg-gray-100 transition">取消</button>
              <button
                onClick={() => {
                  deleteItem();
                  closeModals();
                }}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
              >刪除</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
