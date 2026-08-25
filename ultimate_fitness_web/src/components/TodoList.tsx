import { useState } from 'react';
import { useAppState } from '../context/AppStateContext';
import type { TaskType, TaskItem } from '../models/types';

export function TodoList() {
  const { tasks, addTask, toggleTaskCompletion } = useAppState();
  const [newTaskText, setNewTaskText] = useState('');
  const [selectedType, setSelectedType] = useState<TaskType>('Exercise');

  const handleAddTask = () => {
    if (!newTaskText.trim()) return;
    
    const newTask: TaskItem = {
      id: Date.now().toString(),
      type: selectedType,
      description: newTaskText,
      isCompleted: false,
      date: new Date().toISOString(),
    };
    
    addTask(newTask);
    setNewTaskText('');
  };

  const getIconForType = (type: TaskType) => {
    switch(type) {
      case 'Exercise': return '💪';
      case 'Fasting': return '⏳';
      case 'Meal': return '🥗';
      default: return '✅';
    }
  };

  return (
    <div className="todo-container">
      <h3>Daily Goals</h3>
      
      <div className="add-task-form">
        <div className="input-group">
          <select 
            value={selectedType} 
            onChange={(e) => setSelectedType(e.target.value as TaskType)}
          >
            <option value="Exercise">Exercise</option>
            <option value="Fasting">Fasting</option>
            <option value="Meal">Meal Prep</option>
          </select>
          <input 
            type="text" 
            placeholder="Add to-do..." 
            value={newTaskText}
            onChange={(e) => setNewTaskText(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAddTask()}
          />
        </div>
        <button onClick={handleAddTask} className="add-btn">+</button>
      </div>

      <ul className="task-list">
        {tasks.length === 0 ? (
          <li className="empty-state">No tasks for today. Build a habit!</li>
        ) : (
          tasks.map(task => (
            <li 
              key={task.id} 
              className={`task-row ${task.isCompleted ? 'completed' : ''}`}
              onClick={() => toggleTaskCompletion(task.id)}
            >
              <div className="task-icon">{getIconForType(task.type)}</div>
              <div className="task-desc">{task.description}</div>
              <div className="task-check">
                <input 
                  type="checkbox" 
                  checked={task.isCompleted} 
                  readOnly
                />
              </div>
            </li>
          ))
        )}
      </ul>
    </div>
  );
}
