import React, { useState } from 'react';

export default function TaskForm({ token, onCreate }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const submit = async (e) => {
    e.preventDefault();
    await fetch('/api/tasks', { method:'POST', headers:{'Content-Type':'application/json', Authorization:`Bearer ${token}`}, body:JSON.stringify({ title, description }) });
    setTitle(''); setDescription('');
    onCreate();
  };
  return (
    <form onSubmit={submit}>
      <h3>Create Task</h3>
      <input placeholder="Title" value={title} onChange={e=>setTitle(e.target.value)} /><br/>
      <textarea placeholder="Description" value={description} onChange={e=>setDescription(e.target.value)}></textarea><br/>
      <button type="submit">Create</button>
    </form>
  )
}
