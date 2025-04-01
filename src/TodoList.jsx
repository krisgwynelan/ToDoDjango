import React, { useState, useEffect } from "react";
import axios from "axios";

const API_URL = "https://tododjango-jw0w.onrender.com/todoapp/api/tasks/";

function TodoList() {
  const [tasks, setTasks] = useState([]);
  const [taskTitle, setTaskTitle] = useState("");
  const [taskDescription, setTaskDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [dueTime, setDueTime] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editTaskIndex, setEditTaskIndex] = useState(null);
  const [filter, setFilter] = useState("all");

  // Fetch tasks from the backend on initial load
  useEffect(() => {
    axios.get(API_URL)
      .then((response) => {
        setTasks(response.data);
      })
      .catch((error) => {
        console.error("Error fetching tasks:", error);
      });
  }, []);

  // Add or update a task
  const addTask = () => {
    if (taskTitle.trim() !== "" && taskDescription.trim() !== "" && dueDate !== "" && dueTime !== "") {
      const taskData = {
        title: taskTitle,
        description: taskDescription,
        due_date: dueDate,
        due_time: dueTime,
        completed: false,
      };

      if (editTaskIndex !== null) {
        // Edit existing task (PUT)
        axios.put(`${API_URL}${tasks[editTaskIndex].id}/`, taskData)
          .then((response) => {
            const updatedTasks = [...tasks];
            updatedTasks[editTaskIndex] = response.data;
            setTasks(updatedTasks);
            setEditTaskIndex(null);
          })
          .catch((error) => console.error("Error updating task:", error));
      } else {
        // Add new task (POST)
        axios.post(API_URL, taskData)
          .then((response) => {
            setTasks([...tasks, response.data]);
          })
          .catch((error) => console.error("Error adding task:", error));
      }

      // Reset inputs
      setTaskTitle("");
      setTaskDescription("");
      setDueDate("");
      setDueTime("");
      setShowModal(false);
    }
  };

  // Edit a task
  const editTask = (index) => {
    setEditTaskIndex(index);
    setTaskTitle(tasks[index].title);
    setTaskDescription(tasks[index].description);
    setDueDate(tasks[index].due_date);
    setDueTime(tasks[index].due_time);
    setShowModal(true);
  };

  // Mark task as done (PATCH)
  const markAsDone = (index) => {
    const updatedTask = { ...tasks[index], completed: true };
    axios.patch(`${API_URL}${tasks[index].id}/`, updatedTask)
      .then((response) => {
        const updatedTasks = [...tasks];
        updatedTasks[index] = response.data;
        setTasks(updatedTasks);
      })
      .catch((error) => console.error("Error marking task as done:", error));
  };

  // Delete a task (DELETE)
  const deleteTask = (index) => {
    axios.delete(`${API_URL}${tasks[index].id}/`)
      .then(() => {
        setTasks(tasks.filter((_, i) => i !== index));
      })
      .catch((error) => console.error("Error deleting task:", error));
  };

  // Filter tasks based on the filter state
  const filteredTasks = tasks.filter((task) => {
    if (filter === "completed") return task.completed;
    if (filter === "pending") return !task.completed;
    return true; 
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
          <li key={task.id} style={{ color: task.completed ? "green" : "black" }}>
            <div>
              <strong>Title: {task.title}</strong>  
              <p>Description: {task.description}</p>  
              <small>Due: {task.due_date} {task.due_time}</small>
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
