// src/SprintDetail.jsx
import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './SprintDetail.css';

function SprintDetail({ tasks, setTasks, sprints, onView, onEdit }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [sprint, setSprint] = useState(null);
  const [sprintTasks, setSprintTasks] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const [openMenuId, setOpenMenuId] = useState(null);

  // New state for total story points
  const [totalStoryPoints, setTotalStoryPoints] = useState(0);

  // Fetch sprint data based on ID
  useEffect(() => {
    const sprintId = parseInt(id, 10);
    const foundSprint = sprints.find((s) => s.id === sprintId);
    if (foundSprint) {
      setSprint(foundSprint);
      const associatedTasks = tasks.filter((task) => task.sprintId === sprintId);
      setSprintTasks(associatedTasks);
    } else {
      navigate('/sprint-board');
    }
  }, [id, sprints, tasks, navigate]);

  // Calculate total story points whenever sprintTasks change
  useEffect(() => {
    const total = sprintTasks.reduce((sum, task) => sum + Number(task.storyPoint), 0);
    setTotalStoryPoints(total);
  }, [sprintTasks]);

  const handleReturn = () => {
    navigate('/sprint-board');
  };

  const handleDragStart = (e, taskId) => {
    e.dataTransfer.setData('taskId', taskId);
    setIsDragging(true);
  };

  const handleDrop = (e, destination) => {
    const taskId = parseInt(e.dataTransfer.getData('taskId'), 10);
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === taskId ? { ...task, sprintId: destination === 'sprint' ? sprint.id : null } : task
      )
    );
    e.preventDefault();
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDragEnd = () => {
    setIsDragging(false);
  };

  const toggleMenu = (taskId) => {
    setOpenMenuId(openMenuId === taskId ? null : taskId);
  };

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        !event.target.closest('.task-bubble__kebab-menu') &&
        !event.target.closest('.task-bubble__kebab-dropdown')
      ) {
        setOpenMenuId(null);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  return (
    <div className="sprint-detail">
      <div className="sprint-detail__header">
        {sprint && (
          <div className="sprint-detail__info">
            <h2>{sprint.name}</h2>
            <p>
              <strong>Date:</strong> {sprint.startDate} to {sprint.endDate} ({sprint.duration} days)
            </p>
            <p>
              <strong>Product Owner:</strong> {sprint.productOwner} | <strong>Scrum Master:</strong> {sprint.scrumMaster} |{' '}
              <strong>Developers:</strong> {sprint.developers.join(', ')}
            </p>
            {/* Display Total Story Points */}
            <p><strong>Total Story Points:</strong> {totalStoryPoints}</p>
          </div>
        )}
        <button className="sprint-detail__return-btn" onClick={handleReturn}>
          Return to Sprint Board
        </button>
      </div>

      <div className="sprint-detail__content">
        {/* Product Backlog Section */}
        <div
          className="sprint-detail__product-backlog"
          onDrop={(e) => handleDrop(e, 'product')}
          onDragOver={handleDragOver}
        >
          <h2>Product Backlog</h2>
          <hr />
          <div className="sprint-detail__task-list">
            {tasks.filter((task) => !task.sprintId).length > 0 ? (
              tasks.filter((task) => !task.sprintId).map((task) => (
                <TaskBubble
                  key={task.id}
                  task={task}
                  onView={onView}
                  onEdit={onEdit}
                  handleDragStart={handleDragStart}
                  handleDragEnd={handleDragEnd}
                  isDragging={isDragging}
                  openMenuId={openMenuId}
                  toggleMenu={toggleMenu}
                />
              ))
            ) : (
              <p className="sprint-detail__no-tasks">No Tasks in Product Backlog</p>
            )}
          </div>
        </div>

        {/* Sprint Backlog Section */}
        <div
          className="sprint-detail__sprint-backlog"
          onDrop={(e) => handleDrop(e, 'sprint')}
          onDragOver={handleDragOver}
        >
          <h2>Sprint Backlog</h2>
          <hr />
          
          <div className="sprint-detail__task-list">
            {sprintTasks.length > 0 ? (
              sprintTasks.map((task) => (
                <TaskBubble
                  key={task.id}
                  task={task}
                  onView={onView}
                  onEdit={onEdit}
                  handleDragStart={handleDragStart}
                  handleDragEnd={handleDragEnd}
                  isDragging={isDragging}
                  openMenuId={openMenuId}
                  toggleMenu={toggleMenu}
                />
              ))
            ) : (
              <p className="sprint-detail__no-tasks">No Tasks in Sprint Backlog</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function TaskBubble({ task, onView, onEdit, handleDragStart, handleDragEnd, isDragging, openMenuId, toggleMenu }) {
  const getStoryPointColor = (value) => {
    const colors = [
      '#008000', '#008000', '#D5B60A', '#D5B60A', '#ffA500', '#ffA500',
      '#ff3652', '#ff3652', '#ff0500', '#ff0500'
    ];
    return colors[value - 1] || '#f0a574';
  };

  return (
    <div
      className="task-bubble"
      draggable
      onDragStart={(e) => handleDragStart(e, task.id)}
      onDragEnd={handleDragEnd}
      onClick={() => {
        if (!isDragging) onView(task.id);
      }}
    >
      <p className="task-bubble__name">{task.name}</p>

      <div className="task-bubble__info-container" onClick={(e) => e.stopPropagation()}>
        <div className="task-bubble__info priority">
          <span className={`task-bubble__priority-tag ${task.priority.toLowerCase()}`}>
            {task.priority}
          </span>
        </div>
        <div
          className="task-bubble__info story-point"
          style={{ backgroundColor: getStoryPointColor(task.storyPoint) }}
        >
          <span>{task.storyPoint}</span>
        </div>

        {task.tags && task.tags.length > 0 && (
          <div className="task-bubble__tag-container">
            {task.tags.map((tag) => (
              <span key={tag} className="task-bubble__selected-tag" data-tag={tag}>
                {tag}
              </span>
            ))}
          </div>
        )}

        <div className="task-bubble__kebab-menu">
          <button
            className="task-bubble__kebab-menu-btn"
            onClick={(e) => toggleMenu(task.id)}
          >
            ⋮
          </button>
          {openMenuId === task.id && (
            <div className="task-bubble__kebab-dropdown">
              <ul>
                <li onClick={() => onEdit(task.id)}>Edit</li>
                {/* Additional options like History can be added */}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default SprintDetail;
