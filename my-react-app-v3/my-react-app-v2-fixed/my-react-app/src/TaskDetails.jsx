import React from 'react';
import './TaskDetails.css';

function TaskDetails({ task, onClose }) {
  if (!task) return null;

  return (
    <div className="outer-container">
      <div className="task-details">


        <div className="form-group">
          <label>Task Name</label>
          <div className="input-bubble">
            <p>{task.name}</p>
          </div>
        </div>

        <div className="form-group">
          <label>Status</label>
          <div className={`status-label ${task.status.replace(' ', '-').toLowerCase()}`}>
            {task.status}
          </div>
        </div>

        <div className="form-group">
          <label>Type</label>
          <div className="input-bubble">
            <p>{task.type}</p>
          </div>
        </div>

        <div className="form-group">
          <label>Description</label>
          <div className="input-bubble">
            <p>{task.description}</p>
          </div>
        </div>

        <div className="form-group">
          <label>Priority</label>
          <div className="input-bubble">
            <p>{task.priority}</p>
          </div>
        </div>

        <div className="form-group">
          <label>Story Point</label>
          <div className="input-bubble">
            <p>{task.storyPoint}</p>
          </div>
        </div>

        <div className="form-group">
          <label>Stage</label>
          <div className="input-bubble">
            <p>{task.stages}</p>
          </div>
        </div>

        <div className="form-group">
          <label>Tags</label>
          <div className="selected-tags">
            {task.tags.map((tag) => (
              <span key={tag} className="selected-tag" data-tag={tag}>
                {tag}
              </span>
            ))}
          </div>
        </div>

        <div className="form-group">
          <label>Assignee</label>
          <div className="input-bubble">
            <p>{task.assignTo}</p>
          </div>
        </div>

        <div className="form-actions">
          <button type="button" className="cancel-btn" onClick={onClose}>
            Back
          </button>
        </div>
      </div>
    </div>
  );
}

export default TaskDetails;
