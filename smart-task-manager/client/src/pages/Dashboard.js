import React, { useEffect, useState } from 'react';
import TaskBoard from '../components/TaskBoard';
import TaskForm from '../components/TaskForm';
import Charts from '../components/Charts';

export default function Dashboard({ token, user, onLogout }) {
  const [tasks, setTasks] = useState([]);

  const fetchTasks = async () => {
    const res = await fetch('/api/tasks', { headers: { Authorization: `Bearer ${token}` }});
    const data = await res.json();
    setTasks(data);
  };

  useEffect(()=> { fetchTasks(); }, []);

  return (
    <div style={{padding:20}}>
      <h2>Welcome, {user?.name}</h2>
      <button onClick={onLogout}>Logout</button>
      <TaskForm token={token} onCreate={fetchTasks} />
      <TaskBoard tasks={tasks} token={token} onUpdate={fetchTasks} onDelete={fetchTasks} />
      <Charts tasks={tasks} />
    </div>
  );
}
