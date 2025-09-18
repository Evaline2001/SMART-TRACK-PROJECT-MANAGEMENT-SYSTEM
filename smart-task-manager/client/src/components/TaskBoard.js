import React from 'react';

export default function TaskBoard({ tasks, token, onUpdate, onDelete }) {
  const updateStatus = async (id, status) => {
    await fetch(`/api/tasks/${id}`, { method:'PUT', headers:{'Content-Type':'application/json', Authorization:`Bearer ${token}`}, body:JSON.stringify({ status }) });
    onUpdate();
  };
  const del = async (id) => {
    await fetch(`/api/tasks/${id}`, { method:'DELETE', headers:{ Authorization:`Bearer ${token}` }});
    onDelete();
  };
  return (
    <div>
      <h3>Your Tasks</h3>
      <ul>
        {tasks.map(t => (
          <li key={t._id}>
            <strong>{t.title}</strong> - {t.status} <br/>
            <button onClick={()=>updateStatus(t._id,'in-progress')}>In Progress</button>
            <button onClick={()=>updateStatus(t._1d ?? t._id,'completed')}>Complete</button>
            <button onClick={()=>del(t._id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
