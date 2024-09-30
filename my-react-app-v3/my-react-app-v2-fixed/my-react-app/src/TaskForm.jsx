// src/TaskForm.jsx
import React, { useState, useEffect } from 'react';
import './TaskForm.css';

function TaskForm({ onCancel, onSave, task }) {
  const [taskDetails, setTaskDetails] = useState({
    name: '',
    type: '',
    description: '',
    priority: '',
    storyPoint: '',
    status: 'Not Started',
    stages: '',
    tags: [],
    assignTo: '',
    sprintId: null, // Ensure sprintId is part of the taskDetails
  });

  useEffect(() => {
    if (task) {
      setTaskDetails({
        ...task,
        sprintId: task.sprintId || null, // Default to null if sprintId is undefined
      });
    }
  }, [task]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === 'checkbox') {
      setTaskDetails((prevDetails) => ({
        ...prevDetails,
        tags: checked
          ? [...prevDetails.tags, value]
          : prevDetails.tags.filter((tag) => tag !== value),
      }));
    } else {
      // Prevent status change if task is in Product Backlog
      if (name === 'status' && taskDetails.sprintId === null) {
        return;
      }
      setTaskDetails((prevDetails) => ({
        ...prevDetails,
        [name]: value,
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Validation
    if (!taskDetails.type) {
      alert('Please select a type.');
      return;
    }
    if (taskDetails.tags.length === 0) {
      alert('Please select at least one tag.');
      return;
    }
    if (!taskDetails.description.trim()) {
      alert('Please enter a description.');
      return;
    }
    if (!taskDetails.priority) {
      alert('Please select a priority.');
      return;
    }
    if (!taskDetails.storyPoint) {
      alert('Please select a story point.');
      return;
    }
    if (!taskDetails.stages) {
      alert('Please select a stage.');
      return;
    }
    if (!taskDetails.assignTo) {
      alert('Please select an assignee.');
      return;
    }

    // Ensure that tasks in Product Backlog always have status 'Not Started'
    if (taskDetails.sprintId === null) {
      taskDetails.status = 'Not Started';
    }

    onSave(taskDetails);
  };

  return (
    <div className="outer-container">
      <div className="task-details">
        <h2>{task ? 'Edit Task' : 'Add Task'}</h2>
        <form id="task-form" onSubmit={handleSubmit}>
          {/* Task Name */}
          <div className="form-group">
            <label htmlFor="name">Task Name</label>
            <div className="input-bubble">
              <input
                type="text"
                id="name"
                name="name"
                placeholder="Enter task title..."
                value={taskDetails.name}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          {/* Status */}
          <div className="form-group">
            <label>Status</label>
            {taskDetails.sprintId === null ? (
              // Product Backlog (status fixed to Not Started)
              <div className="status-label">Not Started</div>
            ) : (
              // Sprint Task (status editable)
              <div className="input-bubble">
                <select
                  id="status"
                  name="status"
                  value={taskDetails.status}
                  onChange={handleChange}
                  required
                >
                  <option value="Not Started">Not Started</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Completed">Completed</option>
                </select>
              </div>
            )}
          </div>

          {/* Type */}
          <div className="form-group">
            <label htmlFor="type">Type</label>
            <div className="input-bubble">
              <select
                id="type"
                name="type"
                value={taskDetails.type}
                onChange={handleChange}
                required
              >
                <option value="">Please select</option>
                <option value="Story">Story</option>
                <option value="Bug">Bug</option>
              </select>
            </div>
          </div>

          {/* Description */}
          <div className="form-group">
            <label htmlFor="description">Description</label>
            <div className="input-bubble">
              <textarea
                id="description"
                name="description"
                placeholder="Enter task description..."
                value={taskDetails.description}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          {/* Priority */}
          <div className="form-group">
            <label htmlFor="priority">Priority</label>
            <div className="input-bubble">
              <select
                id="priority"
                name="priority"
                value={taskDetails.priority}
                onChange={handleChange}
                required
              >
                <option value="">Please select</option>
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="Important">Important</option>
                <option value="Urgent">Urgent</option>
              </select>
            </div>
          </div>

          {/* Story Point */}
          <div className="form-group">
            <label htmlFor="storyPoint">Story Point</label>
            <div className="input-bubble">
              <select
                id="storyPoint"
                name="storyPoint"
                value={taskDetails.storyPoint}
                onChange={handleChange}
                required
              >
                <option value="">Please select</option>
                {[...Array(10).keys()].map((i) => (
                  <option key={i + 1} value={i + 1}>
                    {i + 1}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Stage */}
          <div className="form-group">
            <label htmlFor="stages">Stage</label>
            <div className="input-bubble">
              <select
                id="stages"
                name="stages"
                value={taskDetails.stages}
                onChange={handleChange}
                required
              >
                <option value="">Please select</option>
                <option value="Planning">Planning</option>
                <option value="Development">Development</option>
                <option value="Testing">Testing</option>
                <option value="Implementation">Implementation</option>
              </select>
            </div>
          </div>

          {/* Tags */}
          <div className="form-group">
            <label htmlFor="tags">Tags</label>
            <div className="tags-section input-bubble">
              <div className="tags-checkbox">
                {[
                  'Frontend',
                  'Backend',
                  'API',
                  'Database',
                  'Framework',
                  'Testing',
                  'UI',
                  'UX',
                ].map((tag) => (
                  <label key={tag}>
                    <input
                      type="checkbox"
                      name="tags"
                      value={tag}
                      checked={taskDetails.tags.includes(tag)}
                      onChange={handleChange}
                    />
                    {tag}
                  </label>
                ))}
              </div>
            </div>
            <div id="selected-tags" className="selected-tags">
              {taskDetails.tags.map((tag) => (
                <span key={tag} className="selected-tag" data-tag={tag}>
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Assignee */}
          <div className="form-group">
            <label htmlFor="assignTo">Assignee</label>
            <div className="input-bubble">
              <select
                id="assignTo"
                name="assignTo"
                value={taskDetails.assignTo}
                onChange={handleChange}
                required
              >
                <option value="">Please select</option>
                <option value="Teammate 1">Teammate 1</option>
                <option value="Teammate 2">Teammate 2</option>
                <option value="Teammate 3">Teammate 3</option>
                <option value="Teammate 4">Teammate 4</option>
                <option value="Teammate 5">Teammate 5</option>
              </select>
            </div>
          </div>

          {/* Form Actions */}
          <div className="form-actions">
            <button type="button" className="cancel-btn" onClick={onCancel}>
              Cancel
            </button>
            <button type="submit" className="save-btn">
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default TaskForm;
