// App.jsx
import { useEffect, useState } from 'react';
import TailwindTest from './TailwindTest';   // ① 引入

function App() {
  const [msg, setMsg] = useState('Loading...');

  useEffect(() => {
    fetch('/api/hello')
      .then(res => res.text())
      .then(txt => setMsg(txt))
      .catch(err => setMsg('Error: ' + err.message));
  }, []);

  return (
    <>                                        {/* ② 用 Fragment 包起來 */}
      <div style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
        <h1>{msg}</h1>
      </div>
      <TailwindTest />                        {/* ③ 在這裡渲染 */}
    </>
  );
}

export default App;

