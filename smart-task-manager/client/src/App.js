import React, { useState, useEffect } from 'react';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';

function App() {
  const [token, setToken] = useState(localStorage.getItem('token') || '');
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')||'null'));

  useEffect(()=> {
    if (token) {
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
    }
  }, [token, user]);

  if (!token) {
    return <div style={{padding:20}}>
      <h2>Smart Task Manager</h2>
      <Register onAuth={(t,u)=>{setToken(t); setUser(u)}} />
      <hr />
      <Login onAuth={(t,u)=>{setToken(t); setUser(u)}} />
    </div>
  }

  return <Dashboard token={token} user={user} onLogout={()=>{ setToken(''); setUser(null); localStorage.clear(); }} />;
}

export default App;
