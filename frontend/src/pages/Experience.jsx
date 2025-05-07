import React, { useState, useEffect } from "react";

export default function WorkExperience() {
  // 模擬數據 - 已預先填入三筆工作經驗
  const mockExperiences = [
    {
      id: 1,
      company: "資拓宏宇國際股份有限公司",
      position: "資深網路維運工程師",
      logoUrl: "https://www.iisigroup.com/wp-content/uploads/2020/08/logo.svg",
      startDate: "2022/01",
      endDate: "",  // 空字串表示「至今」
      location: "台北市",
      description: "1. 負責企業客戶網路架構規劃與優化，提升整體網路效能與可靠性\n2. 管理與監控核心交換機、路由器和防火牆，確保網路安全\n3. 建置網路自動化管理流程，透過Python腳本減少30%人工維護時間\n4. 處理企業內部網路異常與問題排除，平均回應時間縮短至30分鐘內\n5. 協助制訂網路安全政策，並進行定期安全稽核與報告\n6. 規劃與執行網路擴展專案，支援公司業務成長需求",
      skills: "Cisco, Juniper, OSPF, BGP, Python, Linux, Docker, Network Security, AWS, Wireshark"
    },
    {
      id: 2,
      company: "鈦思科技股份有限公司",
      position: "網路工程師",
      logoUrl: "https://i0.wp.com/techeasesolution.com.tw/wp-content/uploads/2022/05/logo2-1.png",
      startDate: "2019/06",
      endDate: "2021/12",
      location: "新北市",
      description: "1. 建置與維護客戶端網路設備，包含交換機、路由器和無線網路\n2. 執行網路效能分析，找出瓶頸並提出改善方案\n3. 負責網路安全監控，並實施適當防護措施\n4. 開發基礎網路監控工具，使用JavaScript與Python\n5. 協助處理客戶技術支援請求，每月平均解決50+案件\n6. 參與新機房建置專案，負責網路架構設計與實作",
      skills: "Switching, Routing, VLAN, VPN, JavaScript, Python, Network Monitoring, Firewall, Mikrotik"
    },
    {
      id: 3,
      company: "緯創資通股份有限公司",
      position: "資訊助理工程師",
      logoUrl: "https://www.wistron.com/images/logo.png",
      startDate: "2017/09",
      endDate: "2019/05",
      location: "桃園市",
      description: "1. 支援公司內部IT系統維護，包含伺服器、工作站與網路設備\n2. 執行日常網路設備配置與故障排除\n3. 協助建置小型辦公室網路環境\n4. 維護公司內部網路文件與設備清單\n5. 參與資訊安全教育訓練並協助推廣安全意識\n6. 配合資深工程師學習網路自動化基礎技術",
      skills: "Windows Server, Active Directory, LAN/WAN, Troubleshooting, Basic Scripting, HP switches, Documentation"
    }
  ];

  const [experiences, setExperiences] = useState([]);

  
  // --- 新增工作經驗 Modal 狀態 ---
  const [showAddModal, setShowAddModal] = useState(false);
  const [newExp, setNewExp] = useState({
    company: "", position: "", logoUrl: "",
    startDate: "", endDate: "", location: "", 
    description: "", skills: ""
  });

  // --- 編輯工作經驗 Modal 狀態 ---
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingExpId, setEditingExpId] = useState(null);
  const [editExp, setEditExp] = useState({ ...newExp });

  // --- 刪除工作經驗 Modal 狀態 ---
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletingExpId, setDeletingExpId] = useState(null);

  // 初次載入：使用模擬數據
  useEffect(() => {
    // 在實際環境中，這裡應該是API呼叫
    // 目前先使用模擬數據
    setExperiences(mockExperiences);
  }, []);

  // 表單欄位變更
  const handleNewExpChange = e => {
    const { name, value } = e.target;
    setNewExp(prev => ({ ...prev, [name]: value }));
  };
  
  const handleEditExpChange = e => {
    const { name, value } = e.target;
    setEditExp(prev => ({ ...prev, [name]: value }));
  };

  // 新增工作經驗 (無後端時使用前端模擬)
  const handleAddExperience = () => {
    // 模擬ID生成
    const newId = Math.max(0, ...experiences.map(e => e.id)) + 1;
    const created = { ...newExp, id: newId };
    
    setExperiences([...experiences, created]);
    setShowAddModal(false);
    setNewExp({
      company: "", position: "", logoUrl: "",
      startDate: "", endDate: "", location: "", 
      description: "", skills: ""
    });
  };

  // 開啟編輯（帶入原值）
  const openEditModal = id => {
    const target = experiences.find(e => e.id === id);
    if (!target) return;
    setEditExp({ ...target });
    setEditingExpId(id);
    setShowEditModal(true);
  };

  // 儲存編輯 (無後端時使用前端模擬)
  const handleSaveEdit = () => {
    const updated = { ...editExp };
    setExperiences(experiences.map(e => e.id === editingExpId ? updated : e));
    setShowEditModal(false);
  };

  // 開啟刪除
  const openDeleteModal = id => {
    setDeletingExpId(id);
    setShowDeleteModal(true);
  };

  // 確認刪除 (無後端時使用前端模擬)
  const handleDeleteExperience = () => {
    setExperiences(experiences.filter(e => e.id !== deletingExpId));
    setShowDeleteModal(false);
  };

  // 將技能字串轉為陣列
  const parseSkills = skillsStr => {
    return skillsStr.split(',').map(skill => skill.trim()).filter(Boolean);
  };

  // 渲染
  return (
    <div className="w-screen min-h-screen bg-gray-50">
      {/* Header */}
      <div className="w-full text-center py-8 bg-gradient-to-r from-blue-900 to-blue-700 text-white">
        <h1 className="text-4xl font-bold">工作經驗</h1>
        <p className="text-xl mt-2 opacity-90">Work Experience</p>
      </div>

      {/* Main */}
      <div className="max-w-5xl mx-auto px-4 py-10">
        {/* 標題與新增按鈕 */}
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold text-gray-800">專業經歷</h2>
          <button
            onClick={() => setShowAddModal(true)}
            className="bg-blue-700 text-white p-2 rounded-full hover:bg-blue-800 flex items-center justify-center shadow-md transition-all duration-200"
            title="新增工作經驗"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
          </button>
        </div>
        
        {/* 經驗時間軸 */}
        <div className="relative">
          {/* 垂直線 */}
          <div className="absolute left-16 top-0 bottom-0 w-0.5 bg-blue-200 hidden md:block"></div>
          
          {/* 工作經驗列表 */}
          {experiences.length === 0 ? (
            <div className="text-center py-16 text-gray-500">
              <p>尚未新增工作經驗</p>
              <p className="mt-2 text-sm">點擊右上角的 + 按鈕開始新增</p>
            </div>
          ) : (
            <div className="space-y-8">
              {experiences.map((exp, index) => (
                <div key={exp.id} className="flex flex-col md:flex-row items-start gap-4 relative">
                  {/* 左側：公司 Logo + 時間 */}
                  <div className="md:w-32 flex flex-col items-center">
                    {/* 公司 Logo */}
                    <div className="w-20 h-20 rounded-full bg-white shadow-md p-2 z-10 flex items-center justify-center overflow-hidden border border-gray-100">
                      {exp.logoUrl ? (
                        <img 
                          src={exp.logoUrl} 
                          alt={`${exp.company} logo`} 
                          className="w-full h-full object-contain"
                        />
                      ) : (
                        <div className="flex items-center justify-center h-full w-full bg-gray-100 text-gray-400 font-bold text-xl">
                          {exp.company.charAt(0)}
                        </div>
                      )}
                    </div>
                    
                    {/* 時間區間 */}
                    <div className="text-sm text-gray-500 mt-2 text-center">
                      <div>{exp.startDate}</div>
                      <div>～</div>
                      <div>{exp.endDate || '至今'}</div>
                    </div>
                  </div>
                  
                  {/* 右側：公司詳情卡片 */}
                  <div className="flex-1 bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
                    {/* 上方：公司名稱 + 職位 + 操作按鈕 */}
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-xl font-bold text-gray-800">{exp.position}</h3>
                        <div className="flex items-center mt-1 text-gray-600">
                          <span className="font-medium">{exp.company}</span>
                          {exp.location && (
                            <>
                              <span className="mx-2">•</span>
                              <span>{exp.location}</span>
                            </>
                          )}
                        </div>
                      </div>
                      
                      {/* 操作按鈕 */}
                      <div className="flex space-x-2">
                        <button 
                          onClick={() => openEditModal(exp.id)} 
                          className="p-2 rounded hover:bg-gray-100" 
                          title="修改"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                          </svg>
                        </button>
                        <button 
                          onClick={() => openDeleteModal(exp.id)} 
                          className="p-2 rounded hover:bg-gray-100" 
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
                    
                    {/* 工作描述 */}
                    <div className="mb-4">
                      <h4 className="text-sm font-semibold text-gray-600 mb-2">工作內容</h4>
                      <p className="text-gray-700 whitespace-pre-line">{exp.description}</p>
                    </div>
                    
                    {/* 使用技術 & 工具 */}
                    {exp.skills && (
                      <div>
                        <h4 className="text-sm font-semibold text-gray-600 mb-2">使用技術 & 工具</h4>
                        <div className="flex flex-wrap gap-2">
                          {parseSkills(exp.skills).map((skill, i) => (
                            <span 
                              key={i} 
                              className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm"
                            >
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* 新增工作經驗 Modal */}
      {showAddModal && (
        <div 
          className="fixed inset-0 flex items-center justify-center z-50"
          style={{
            backgroundImage: 
              "linear-gradient(rgba(0,0,0,0.7), rgba(0,0,0,0.7)), url('/images/office.jpg')",
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
          }}
        >
          <div className="bg-white rounded-lg p-6 w-full max-w-xl z-10 max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-semibold mb-6 text-gray-800">新增工作經驗</h3>
            <div className="space-y-5">
              {/* 公司名稱 */}
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-1">公司名稱</label>
                <input
                  type="text"
                  name="company"
                  value={newExp.company}
                  onChange={handleNewExpChange}
                  placeholder="例：Google" 
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800"
                />
              </div>
              
              {/* 職位名稱 */}
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-1">職位名稱</label>
                <input
                  type="text"
                  name="position"
                  value={newExp.position}
                  onChange={handleNewExpChange}
                  placeholder="例：資深前端工程師" 
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800"
                />
              </div>
              
              {/* 公司 Logo */}
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-1">公司 Logo URL</label>
                <input
                  type="text"
                  name="logoUrl"
                  value={newExp.logoUrl}
                  onChange={handleNewExpChange}
                  placeholder="https://example.com/logo.png" 
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800"
                />
                <p className="text-xs text-gray-500 mt-1">填入圖片網址，若留空則顯示公司名稱首字</p>
              </div>
              
              {/* 工作地點 */}
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-1">工作地點</label>
                <input
                  type="text"
                  name="location"
                  value={newExp.location}
                  onChange={handleNewExpChange}
                  placeholder="例：台北市" 
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800"
                />
              </div>
              
              {/* 開始和結束日期 */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700 text-sm font-medium mb-1">開始日期</label>
                  <input
                    type="text"
                    name="startDate"
                    value={newExp.startDate}
                    onChange={handleNewExpChange}
                    placeholder="例：2020/06" 
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 text-sm font-medium mb-1">結束日期</label>
                  <input
                    type="text"
                    name="endDate"
                    value={newExp.endDate}
                    onChange={handleNewExpChange}
                    placeholder="留空表示「至今」" 
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800"
                  />
                </div>
              </div>
              
              {/* 工作內容 */}
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-1">工作內容</label>
                <textarea
                  name="description"
                  value={newExp.description}
                  onChange={handleNewExpChange}
                  placeholder="描述你的工作職責、成就和專案等..." 
                  rows="5"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800"
                ></textarea>
              </div>
              
              {/* 使用技術 & 工具 */}
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-1">使用技術 & 工具</label>
                <input
                  type="text"
                  name="skills"
                  value={newExp.skills}
                  onChange={handleNewExpChange}
                  placeholder="以逗號分隔，例：React, TypeScript, Docker" 
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800"
                />
              </div>
            </div>
            
            <div className="flex justify-end space-x-3 mt-8">
              <button 
                onClick={() => setShowAddModal(false)} 
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
              >
                取消
              </button>
              <button 
                onClick={handleAddExperience} 
                className="px-5 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                儲存
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 編輯工作經驗 Modal */}
      {showEditModal && (
        <div 
          className="fixed inset-0 flex items-center justify-center z-50"
          style={{
            backgroundImage: 
              "linear-gradient(rgba(0,0,0,0.7), rgba(0,0,0,0.7)), url('/images/office.jpg')",
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
          }}
        >
          <div className="bg-white rounded-lg p-6 w-full max-w-xl z-10 max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-semibold mb-6 text-gray-800">編輯工作經驗</h3>
            <div className="space-y-5">
              {/* 公司名稱 */}
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-1">公司名稱</label>
                <input
                  type="text"
                  name="company"
                  value={editExp.company}
                  onChange={handleEditExpChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800"
                />
              </div>
              
              {/* 職位名稱 */}
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-1">職位名稱</label>
                <input
                  type="text"
                  name="position"
                  value={editExp.position}
                  onChange={handleEditExpChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800"
                />
              </div>
              
              {/* 公司 Logo */}
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-1">公司 Logo URL</label>
                <input
                  type="text"
                  name="logoUrl"
                  value={editExp.logoUrl}
                  onChange={handleEditExpChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800"
                />
                <p className="text-xs text-gray-500 mt-1">填入圖片網址，若留空則顯示公司名稱首字</p>
              </div>
              
              {/* 工作地點 */}
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-1">工作地點</label>
                <input
                  type="text"
                  name="location"
                  value={editExp.location}
                  onChange={handleEditExpChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800"
                />
              </div>
              
              {/* 開始和結束日期 */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700 text-sm font-medium mb-1">開始日期</label>
                  <input
                    type="text"
                    name="startDate"
                    value={editExp.startDate}
                    onChange={handleEditExpChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 text-sm font-medium mb-1">結束日期</label>
                  <input
                    type="text"
                    name="endDate"
                    value={editExp.endDate}
                    onChange={handleEditExpChange}
                    placeholder="留空表示「至今」" 
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800"
                  />
                </div>
              </div>
              
              {/* 工作內容 */}
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-1">工作內容</label>
                <textarea
                  name="description"
                  value={editExp.description}
                  onChange={handleEditExpChange}
                  rows="5"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800"
                ></textarea>
              </div>
              
              {/* 使用技術 & 工具 */}
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-1">使用技術 & 工具</label>
                <input
                  type="text"
                  name="skills"
                  value={editExp.skills}
                  onChange={handleEditExpChange}
                  placeholder="以逗號分隔，例：React, TypeScript, Docker" 
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800"
                />
              </div>
            </div>
            
            <div className="flex justify-end space-x-3 mt-8">
              <button 
                onClick={() => setShowEditModal(false)} 
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
              >
                取消
              </button>
              <button 
                onClick={handleSaveEdit} 
                className="px-5 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                儲存
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* 刪除確認 Modal */}
      {showDeleteModal && (
        <div 
          className="fixed inset-0 flex items-center justify-center z-50"
          style={{
            backgroundImage: 
              "linear-gradient(rgba(0,0,0,0.7), rgba(0,0,0,0.7))",
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          <div className="bg-white rounded-lg p-6 w-full max-w-md z-10">
            <h3 className="text-xl font-semibold mb-4 text-center text-gray-800">確認刪除</h3>
            <p className="text-center text-gray-600 mb-6">確定要刪除此筆工作經驗嗎？此操作無法復原。</p>
            <div className="flex justify-center space-x-4">
              <button 
                onClick={() => setShowDeleteModal(false)} 
                className="px-5 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
              >
                取消
              </button>
              <button 
                onClick={handleDeleteExperience} 
                className="px-5 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
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