import React, { useState } from "react";

function TodoList() {
  const [tasks, setTasks] = useState([]);
  const [taskTitle, setTaskTitle] = useState("");
  const [taskDescription, setTaskDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [dueTime, setDueTime] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editTaskIndex, setEditTaskIndex] = useState(null);
  const [filter, setFilter] = useState("all");

  const addTask = () => {
    if (taskTitle.trim() !== "" && taskDescription.trim() !== "" && dueDate !== "" && dueTime !== "") {
      if (editTaskIndex !== null) {
        // Editing existing task
        const updatedTasks = [...tasks];
        updatedTasks[editTaskIndex] = { title: taskTitle, description: taskDescription, dueDate, dueTime, completed: false };
        setTasks(updatedTasks);
        setEditTaskIndex(null);
      } else {
        // Adding new task
        setTasks([...tasks, { title: taskTitle, description: taskDescription, dueDate, dueTime, completed: false }]);
      }

      // Reset inputs
      setTaskTitle("");
      setTaskDescription("");
      setDueDate("");
      setDueTime("");
      setShowModal(false);
    }
  };

  const editTask = (index) => {
    setEditTaskIndex(index);
    setTaskTitle(tasks[index].title);
    setTaskDescription(tasks[index].description);
    setDueDate(tasks[index].dueDate);
    setDueTime(tasks[index].dueTime);
    setShowModal(true);
  };

  const markAsDone = (index) => {
    const updatedTasks = [...tasks];
    updatedTasks[index].completed = true;
    setTasks(updatedTasks);
  };

  const deleteTask = (index) => {
    setTasks(tasks.filter((_, i) => i !== index));
  };

  const filteredTasks = tasks.filter((task) => {
    if (filter === "completed") return task.completed;
    if (filter === "pending") return !task.completed;
    return true; // Show all tasks
  });

  return (
    <div className="todo-container">
      <button className="add-task-btn" onClick={() => { 
        setEditTaskIndex(null); 
        setShowModal(true); 
      }}> Add Task</button>

      <div className="filters">
        <button onClick={() => setFilter("all")}>All</button>
        <button onClick={() => setFilter("pending")}>Pending</button>
        <button onClick={() => setFilter("completed")}>Completed</button>
      </div>

      <ul>
        {filteredTasks.map((task, index) => (
          <li key={index} style={{ color: task.completed ? "green" : "black" }}>
            <div>
              <strong>Title: {task.title}</strong>  
              <p>Description: {task.description}</p>  
              <small>Due: {task.dueDate} {task.dueTime}</small>

            </div>
            <div className="task-actions">
              {!task.completed && (
                <>
                  <button onClick={() => markAsDone(index)}>✅ Done</button>
                  <button onClick={() => editTask(index)}>✏️ Edit</button>
                </>
              )}
              <button onClick={() => deleteTask(index)}>🗑️ Delete</button>
            </div>
          </li>
        ))}
      </ul>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>{editTaskIndex !== null ? "Edit Task" : "Add Task"}</h2>
            <input type="text" placeholder="Task Title" value={taskTitle} onChange={(e) => setTaskTitle(e.target.value)} />
            <textarea placeholder="Description" value={taskDescription} onChange={(e) => setTaskDescription(e.target.value)} />
            <input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
            <input type="time" value={dueTime} onChange={(e) => setDueTime(e.target.value)} />
            <div className="modal-buttons">
              <button onClick={addTask}>{editTaskIndex !== null ? "Update Task" : "Add Task"}</button>
              <button onClick={() => setShowModal(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default TodoList;
