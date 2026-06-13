import { useState, useEffect } from "react";

function App() {
  const [task, setTask] = useState("");
const [floatingXP, setFloatingXP] = useState([]);
  const [tasks, setTasks] = useState(() => {
    const saved = localStorage.getItem("tasks");
    return saved ? JSON.parse(saved) : [];
  });
const [darkMode, setDarkMode] = useState(false);
  const [xp, setXP] = useState(() => {
    const saved = localStorage.getItem("xp");
    return saved ? JSON.parse(saved) : 0;
  });
const [streak, setStreak] = useState(() => {
  const saved = localStorage.getItem("streak");
  return saved ? JSON.parse(saved) : 0;
});

const [achievements, setAchievements] = useState(() => {
  const saved = localStorage.getItem("achievements");
  return saved ? JSON.parse(saved) : [];
});
  // 🎯 Pomodoro customization
  const [pomodoroMinutes, setPomodoroMinutes] = useState(25);
  const [seconds, setSeconds] = useState(25 * 60);
  const [running, setRunning] = useState(false);

  const level = Math.floor(xp / 100) + 1;

  const getCharacter = () => {
    if (level < 5) return "🥚";
    if (level < 10) return "🐣";
    if (level < 20) return "🐥";
    if (level < 30) return "🦅";
    return "🐉";
  };

  const addTask = () => {
    if (!task.trim()) return;

    setTasks([
      ...tasks,
      {
        id: Date.now(),
        text: task,
        completed: false,
      },
    ]);

    setTask("");
  };

  const completeTask = (id) => {
  setTasks(
    tasks.map((item) => {
      if (item.id === id && !item.completed) {
        setXP((prev) => prev + 20);

        // 🎉 FLOATING XP
        const idFloat = Date.now();
        setFloatingXP((prev) => [...prev, { id: idFloat, text: "+20 XP" }]);

        setTimeout(() => {
          setFloatingXP((prev) => prev.filter((f) => f.id !== idFloat));
        }, 1000);

        return { ...item, completed: true };
      }
      return item;
    })
  );
};

  const deleteTask = (id) => {
    setTasks(tasks.filter((item) => item.id !== id));
  };

  const progress = xp % 100;

  // ⏱️ Timer logic
  useEffect(() => {
    let timer;

    if (running && seconds > 0) {
      timer = setInterval(() => {
        setSeconds((prev) => prev - 1);
      }, 1000);
    }

    if (seconds === 0) {
      setRunning(false);
      setXP((prev) => prev + 50);
      setSeconds(pomodoroMinutes * 60); // ✅ FIXED
      alert("🎉 Pomodoro Complete! +50 XP");
    }

    return () => clearInterval(timer);
  }, [running, seconds, pomodoroMinutes]);
useEffect(() => {
  localStorage.setItem("streak", JSON.stringify(streak));
}, [streak]);

useEffect(() => {
  localStorage.setItem("achievements", JSON.stringify(achievements));
}, [achievements]);
useEffect(() => {
  const newAchievements = [];

  if (tasks.length >= 1) newAchievements.push("📝 First Task");
  if (tasks.filter(t => t.completed).length >= 5) newAchievements.push("🔥 5 Tasks Done");
  if (xp >= 100) newAchievements.push("⭐ 100 XP Earned");
  if (level >= 5) newAchievements.push("🏅 Level 5 Reached");

  setAchievements(prev => {
    const merged = Array.from(new Set([...prev, ...newAchievements]));
    return merged;
  });

}, [tasks, xp, level]);
useEffect(() => {
  const lastVisit = localStorage.getItem("lastVisit");
  const today = new Date().toDateString();

  if (lastVisit !== today) {
    setStreak(prev => prev + 1);
    localStorage.setItem("lastVisit", today);
  }
}, []);
  // 💾 localStorage
  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem("xp", JSON.stringify(xp));
  }, [xp]);

  const formatTime = () => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;

    return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  };

  return (
    <div className={`container ${darkMode ? "dark" : ""}`}>
<div className="floating-xp-container">
  {floatingXP.map((f) => (
    <div key={f.id} className="floating-xp">
      {f.text}
    </div>
  ))}
</div>
<div className="stats-grid">

  <div className="stat-card">
    <h4>Focus Warrior</h4>
    <h3>⭐ XP</h3>
    <p>{xp}</p>
  </div>

  <div className="stat-card">
    <h3>🎯 Level</h3>
    <p>{level}</p>
  </div>

  <div className="stat-card">
    
    <h3>📋 Today's Missions</h3>
    <p>{tasks.length}</p>
  </div>

</div>
      <h1>🎮 FocusQuest</h1>

      {/* HERO */}
      <div className="hero">
        <button
  onClick={() => setDarkMode(!darkMode)}
>
  {darkMode ? "☀️ Light Mode" : "🌙 Dark Mode"}
</button>
        <h2>{getCharacter()}</h2>
        <h3>Level {level}</h3>
        <p>Total XP : {xp}</p>

        <div className="xp-bar">
          <div className="xp-fill" style={{ width: `${progress}%` }} />
        </div>
      </div>
       <div className="game-stats">

  <div className="streak-card">
    🔥 Daily Streak: {streak} days
  </div>
<div className ="dashboard-grid">
  <div>
  <div className="achievement-card">
    <h3>🏆 Achievements</h3>

    {achievements.length === 0 && (
      <p>No achievements yet</p>
    )}

    {achievements.map((a, i) => (
      <div key={i} className="badge">
        {a}
      </div>
    ))}

  </div>
</div>
</div>
      {/* TIMER */}
      <div>
      <div className="timer-card">
        <h2>⏲️ Focus Session</h2>

        {/* STEP 5: PRESET BUTTONS */}
        <div className="preset-buttons">
          <button onClick={() => { setPomodoroMinutes(15); setSeconds(15 * 60); setRunning(false); }}>
            15

          </button>
          <br />
          <button onClick={() => { setPomodoroMinutes(25); setSeconds(25 * 60); setRunning(false); }}>
            25
          </button>
          <br />
          <button onClick={() => { setPomodoroMinutes(45); setSeconds(45 * 60); setRunning(false); }}>
            45
          </button>
          <br />
          <button onClick={() => { setPomodoroMinutes(60); setSeconds(60 * 60); setRunning(false); }}>
            60
          </button>
          <br />
        </div>
</div>
</div>
        {/* Custom input */}
        <div className="time-input">
          <label>Pomodoro Time (minutes): </label>
          <input
            type="number"
            min="1"
            max="120"
            value={pomodoroMinutes}
            onChange={(e) => {
              const mins = Number(e.target.value);
              setPomodoroMinutes(mins);
              setSeconds(mins * 60);
              setRunning(false);
            }}
          />
        </div>

        <h1>{formatTime()}</h1>

        <div className="timer-buttons">

          <button onClick={() => setRunning(true)}>
            Start
          </button>

          <button onClick={() => setRunning(false)}>
            Pause
          </button>

          {/* STEP 3 FIX */}
          <button
            onClick={() => {
              setRunning(false);
              setSeconds(pomodoroMinutes * 60);
            }}
          >
            Reset
          </button>

        </div>
      </div>

      {/* TASK INPUT */}
      <div className="add-box">
        <input
          type="text"
          placeholder="Enter a task..."
          value={task}
          onChange={(e) => setTask(e.target.value)}
        />
        <button onClick={addTask}>Add</button>
      </div>

      {/* TASK LIST */}
      <div className="tasks">
        {tasks.length === 0 && <p>No tasks yet!</p>}

        {tasks.map((item) => (
          <div className="task-card" key={item.id}>
            <span>
              {item.completed ? "✅" : "⬜"} {item.text}
            </span>

            <div>
              {!item.completed && (
                <button className="complete" onClick={() => completeTask(item.id)}>
                  Complete
                </button>
              )}

              <button className="delete" onClick={() => deleteTask(item.id)}>
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}

export default App;
