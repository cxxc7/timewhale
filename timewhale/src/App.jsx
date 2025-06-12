import { useEffect, useState } from 'react';
import './App.css';

function App() {
  const [input, setInput] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [category, setCategory] = useState('');
  const [priority, setPriority] = useState('Medium');
  const [recurring, setRecurring] = useState('');
  const [notes, setNotes] = useState('');
  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState({ category: '', priority: '', status: '' });
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('timewhale-tasks');
    const theme = localStorage.getItem('timewhale-theme');
    if (saved) setTasks(JSON.parse(saved));
    if (theme === 'dark') setDarkMode(true);
  }, []);

  useEffect(() => {
    localStorage.setItem('timewhale-tasks', JSON.stringify(tasks));
    localStorage.setItem('timewhale-theme', darkMode ? 'dark' : 'light');
  }, [tasks, darkMode]);

  const addTask = () => {
    if (!input.trim()) return;
    const newTask = {
      id: Date.now(),
      text: input,
      date,
      time,
      category,
      priority,
      recurring,
      notes,
      completed: false,
      pinned: false,
    };
    setTasks([...tasks, newTask]);
    setInput('');
    setDate('');
    setTime('');
    setCategory('');
    setPriority('Medium');
    setRecurring('');
    setNotes('');
  };

  const toggleComplete = (id) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  const togglePin = (id) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, pinned: !t.pinned } : t));
  };

  const deleteTask = (id) => {
    setTasks(tasks.filter(t => t.id !== id));
  };

  const filteredTasks = tasks
    .filter(t =>
      (!filter.category || t.category === filter.category) &&
      (!filter.priority || t.priority === filter.priority) &&
      (!filter.status || (filter.status === 'Completed' ? t.completed : !t.completed))
    )
    .sort((a, b) => (b.pinned - a.pinned) || new Date(a.date) - new Date(b.date));

  const stats = {
    total: tasks.length,
    completed: tasks.filter(t => t.completed).length,
    pending: tasks.filter(t => !t.completed).length,
    pinned: tasks.filter(t => t.pinned).length,
  };

  return (
    <div className={`container ${darkMode ? 'dark' : ''}`}>
      <h1>🐳 TimeWhale</h1>
      <p className="subtitle">The ultimate productivity app</p>

      <button onClick={() => setDarkMode(!darkMode)} className="toggle-dark">
        {darkMode ? '🌞 Light Mode' : '🌙 Dark Mode'}
      </button>

      <div className="analytics">
        📊 Total: {stats.total} | ✅ Done: {stats.completed} | ⏳ Pending: {stats.pending} | 📌 Pinned: {stats.pinned}
      </div>

      <div className="input-row">
        <input value={input} onChange={(e) => setInput(e.target.value)} placeholder="Task title..." />
        <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
        <input type="time" value={time} onChange={(e) => setTime(e.target.value)} />
        <input value={category} onChange={(e) => setCategory(e.target.value)} placeholder="Category..." />
        <select value={priority} onChange={(e) => setPriority(e.target.value)}>
          <option>High</option>
          <option>Medium</option>
          <option>Low</option>
        </select>
        <select value={recurring} onChange={(e) => setRecurring(e.target.value)}>
          <option value="">No Repeat</option>
          <option>Daily</option>
          <option>Weekly</option>
          <option>Monthly</option>
        </select>
        <input value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Notes (optional)" />
        <button onClick={addTask}>Add</button>
      </div>

      <div className="filter-row">
        <select onChange={(e) => setFilter({ ...filter, category: e.target.value })}>
          <option value="">All Categories</option>
          {[...new Set(tasks.map(t => t.category))].map(cat =>
            <option key={cat}>{cat}</option>
          )}
        </select>
        <select onChange={(e) => setFilter({ ...filter, priority: e.target.value })}>
          <option value="">All Priorities</option>
          <option>High</option>
          <option>Medium</option>
          <option>Low</option>
        </select>
        <select onChange={(e) => setFilter({ ...filter, status: e.target.value })}>
          <option value="">All</option>
          <option>Completed</option>
          <option>Pending</option>
        </select>
      </div>

      <ul className="task-list">
        {filteredTasks.map(task => (
          <li key={task.id} className={task.completed ? 'completed' : ''}>
            <div className="task-top">
              <input type="checkbox" checked={task.completed} onChange={() => toggleComplete(task.id)} />
              <span>
                <strong>{task.text}</strong><br />
                {task.date && <>📅 {task.date} </>}
                {task.time && <>⏰ {task.time} </>}
                {task.category && <span className="tag">🏷 {task.category}</span>}<br />
                ⚡ {task.priority} {task.recurring && `🔁 ${task.recurring}`}
                {task.notes && <div className="notes">📝 {task.notes}</div>}
              </span>
            </div>
            <div className="task-actions">
              <button onClick={() => togglePin(task.id)}>{task.pinned ? '📌' : '📍'}</button>
              <button onClick={() => deleteTask(task.id)}>🗑</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
