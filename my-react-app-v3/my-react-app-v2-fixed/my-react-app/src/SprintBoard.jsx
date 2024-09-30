import React from 'react';
import { useNavigate } from 'react-router-dom';
import './SprintBoard.css';

function SprintBoard({ sprints, onEditSprint, onDeleteSprint }) {
  const navigate = useNavigate();

  return (
    <div className="sprint-board">
      <div className="sprint-board__content">
        {sprints.length > 0 ? (
          sprints.map((sprint) => (
            <SprintBubble
              key={sprint.id}
              sprint={sprint}
              onEdit={onEditSprint}
              onDelete={onDeleteSprint}
              navigate={navigate}
            />
          ))
        ) : (
          <p>No Sprints available</p>
        )}
      </div>
    </div>
  );
}

function SprintBubble({ sprint, onEdit, onDelete, navigate }) {
  const getStatusTag = (status) => {
    switch (status) {
      case 'Active':
        return { text: 'Active', color: 'orange' };
      case 'Completed':
        return { text: 'Completed', color: 'green' };
      default:
        return { text: 'Not Started', color: 'grey' };
    }
  };

  const statusTag = getStatusTag(sprint.status);
  const isEditable = !(sprint.status === 'Active' || sprint.status === 'Completed');

  const handleClick = () => {
    if (sprint.status === 'Active' || sprint.status === 'Completed') {
      navigate(`/sprint-task-view/${sprint.id}`);
    } else {
      navigate(`/sprint/${sprint.id}`);
    }
  };

  const handleEdit = (e) => {
    e.stopPropagation();
    if (isEditable) {
      onEdit(sprint.id);
    }
  };

  const handleDelete = (e) => {
    e.stopPropagation();
    if (isEditable) {
      onDelete(sprint.id);
    }
  };

  return (
    <div className="sprint-bubble" onClick={handleClick}>
      <div className="sprint-bubble__info">
        <p className="sprint-bubble__name">{sprint.name}</p>
        <p>Date: {sprint.startDate} to {sprint.endDate}</p>
        <p>Duration: {sprint.duration} days</p>
        <span
          className="sprint-bubble__status-tag"
          style={{ backgroundColor: statusTag.color }}
        >
          {statusTag.text}
        </span>
      </div>
      <div className="sprint-bubble__actions">
        <button onClick={handleEdit} disabled={!isEditable}>Edit</button>
        <button onClick={handleDelete} disabled={!isEditable}>Delete</button>
      </div>
    </div>
  );
}

export default SprintBoard;
