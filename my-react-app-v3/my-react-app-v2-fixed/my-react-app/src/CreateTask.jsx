import React, { useState } from 'react';

const CreateTask = ({ addTask }) => {
  const [taskName, setTaskName] = useState('');
  const [priority, setPriority] = useState('low');
  const [storyPoint, setStoryPoint] = useState(5);
  const [tags, setTags] = useState([]);

  const handleTagChange = (tag) => {
    setTags(prevTags =>
      prevTags.includes(tag) ? prevTags.filter(t => t !== tag) : [...prevTags, tag]
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newTask = {
      name: taskName,
      priority,
      storyPoint,
      tags
    };
    addTask(newTask);
    setTaskName('');
    setPriority('low');
    setStoryPoint(5);
    setTags([]);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Task Name:</label>
        <input
          type="text"
          value={taskName}
          onChange={e => setTaskName(e.target.value)}
        />
      </div>
      <div>
        <label>Priority:</label>
        <select value={priority} onChange={e => setPriority(e.target.value)}>
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="important">Important</option>
          <option value="urgent">Urgent</option>
        </select>
      </div>
      <div>
        <label>Story Point: {storyPoint}</label>
        <input
          type="range"
          value={storyPoint}
          min="1"
          max="10"
          onChange={e => setStoryPoint(e.target.value)}
        />
      </div>
      <div>
        <label>Tags:</label>
        <label>
          <input
            type="checkbox"
            value="Frontend"
            checked={tags.includes('Frontend')}
            onChange={() => handleTagChange('Frontend')}
          />
          Frontend
        </label>
        {/* Add other tag checkboxes similarly */}
      </div>
      <button type="submit">Create Task</button>
    </form>
  );
};

export default CreateTask;
