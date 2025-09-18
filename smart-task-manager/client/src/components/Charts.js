import React from 'react';
import { Chart, registerables } from 'chart.js';
Chart.register(...registerables);

export default function Charts({ tasks }) {
  // simple counts
  const todo = tasks.filter(t=>t.status==='todo').length;
  const inProg = tasks.filter(t=>t.status==='in-progress').length;
  const done = tasks.filter(t=>t.status==='completed').length;

  // render basic info (chart can be added later)
  return (
    <div>
      <h3>Progress</h3>
      <p>ToDo: {todo} | In-Progress: {inProg} | Completed: {done}</p>
    </div>
  );
}
