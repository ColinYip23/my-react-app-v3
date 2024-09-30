// src/SprintTaskView.jsx
import React, { useState, useRef, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ContributionPopup from './ContributionPopup';
import ContributionViewPopup from './ContributionViewPopup'; // Ensure you have this component
import './SprintTaskView.css'; // Ensure you have appropriate styles

function SprintTaskView({
  tasks,
  sprints,
  onView,
  onAddContribution,
  onUpdateTaskStatus,
  onEdit,
  onViewContribution,
  onMoveTasksBackToBacklog, // Accept the function
}) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [currentSprint, setCurrentSprint] = useState(null);
  const [sprintTasks, setSprintTasks] = useState([]);
  const [totalStoryPoints, setTotalStoryPoints] = useState(0);
  const [storyPointsCompleted, setStoryPointsCompleted] = useState(0);
  const [viewMode, setViewMode] = useState('kanban');
  const [selectedTask, setSelectedTask] = useState(null);
  const hasMovedTasksBack = useRef(false); // To prevent multiple executions

  // Fetch sprint data based on ID
  useEffect(() => {
    const sprintId = parseInt(id, 10);
    const foundSprint = sprints.find((s) => s.id === sprintId);
    if (foundSprint) {
      setCurrentSprint(foundSprint);
    } else {
      navigate('/sprint-board');
    }
  }, [id, sprints, navigate]);

  // Update sprintTasks whenever tasks or currentSprint changes
  useEffect(() => {
    if (currentSprint) {
      const associatedTasks = tasks.filter((task) => task.sprintId === currentSprint.id);
      setSprintTasks(associatedTasks);
    }
  }, [tasks, currentSprint]);

  // Move tasks back to backlog when sprint is completed
  useEffect(() => {
    if (
      currentSprint &&
      currentSprint.status === 'Completed' &&
      !hasMovedTasksBack.current
    ) {
      onMoveTasksBackToBacklog(currentSprint.id);
      hasMovedTasksBack.current = true;
    }
  }, [currentSprint, onMoveTasksBackToBacklog]);

  // Calculate total and completed story points
  useEffect(() => {
    const total = sprintTasks.reduce((sum, task) => sum + Number(task.storyPoint || 0), 0);
    setTotalStoryPoints(total);

    const completed = sprintTasks
      .filter((task) => task.status === 'Completed')
      .reduce((sum, task) => sum + Number(task.storyPoint || 0), 0);
    setStoryPointsCompleted(completed);
  }, [sprintTasks]);

  // Handle drag and drop
  const handleDragStart = (e, taskId) => {
    e.dataTransfer.setData('taskId', taskId);
  };

  const handleDrop = (e, newStatus) => {
    const taskId = parseInt(e.dataTransfer.getData('taskId'), 10);
    onUpdateTaskStatus(taskId, newStatus);
    e.preventDefault();
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleShowContributionPopup = (task) => {
    setSelectedTask(task);
  };

  const handleCloseContributionPopup = () => {
    setSelectedTask(null);
  };

  const handleAddContribution = (taskId, contribution) => {
    onAddContribution(taskId, contribution);
    handleCloseContributionPopup();
  };

  const handleReturn = () => {
    navigate('/sprint-board');
  };

  const renderKanbanView = () => {
    if (currentSprint && currentSprint.status === 'Completed') {
      // Sprint is completed, only show Completed column
      return (
        <div className="kanban-view">
          {/* Completed Column */}
          <div className="kanban-column">
            <h3>Completed</h3>
            <div className="kanban-tasks">
              {sprintTasks
                .filter((task) => task.status === 'Completed')
                .map((task) => (
                  <TaskBubble
                    key={task.id}
                    task={task}
                    onView={onView}
                    onEdit={onEdit}
                    onAddContribution={() => handleShowContributionPopup(task)}
                    onViewContribution={onViewContribution}
                    handleDragStart={null} // Disable dragging
                    isDraggable={false}
                  />
                ))}
              {sprintTasks.filter((task) => task.status === 'Completed').length === 0 && (
                <p className="kanban-no-tasks">No Tasks Completed</p>
              )}
            </div>
          </div>
        </div>
      );
    } else {
      // Sprint is not completed, render all columns
      return (
        <div className="kanban-view">
          {/* Not Started Column */}
          <div
            className="kanban-column"
            onDrop={(e) => handleDrop(e, 'Not Started')}
            onDragOver={handleDragOver}
          >
            <h3>Not Started</h3>
            <div className="kanban-tasks">
              {sprintTasks
                .filter((task) => task.status === 'Not Started')
                .map((task) => (
                  <TaskBubble
                    key={task.id}
                    task={task}
                    onView={onView}
                    onEdit={onEdit}
                    onAddContribution={() => handleShowContributionPopup(task)}
                    onViewContribution={onViewContribution}
                    handleDragStart={handleDragStart}
                    isDraggable={true}
                  />
                ))}
              {sprintTasks.filter((task) => task.status === 'Not Started').length === 0 && (
                <p className="kanban-no-tasks">No Tasks in Not Started</p>
              )}
            </div>
          </div>
          {/* In Progress Column */}
          <div
            className="kanban-column"
            onDrop={(e) => handleDrop(e, 'In Progress')}
            onDragOver={handleDragOver}
          >
            <h3>In Progress</h3>
            <div className="kanban-tasks">
              {sprintTasks
                .filter(
                  (task) => task.status === 'In Progress' || task.status === 'Active'
                )
                .map((task) => (
                  <TaskBubble
                    key={task.id}
                    task={task}
                    onView={onView}
                    onEdit={onEdit}
                    onAddContribution={() => handleShowContributionPopup(task)}
                    onViewContribution={onViewContribution}
                    handleDragStart={handleDragStart}
                    isDraggable={true}
                  />
                ))}
              {sprintTasks.filter(
                (task) => task.status === 'In Progress' || task.status === 'Active'
              ).length === 0 && (
                <p className="kanban-no-tasks">No Tasks In Progress</p>
              )}
            </div>
          </div>
          {/* Completed Column */}
          <div
            className="kanban-column"
            onDrop={(e) => handleDrop(e, 'Completed')}
            onDragOver={handleDragOver}
          >
            <h3>Completed</h3>
            <div className="kanban-tasks">
              {sprintTasks
                .filter((task) => task.status === 'Completed')
                .map((task) => (
                  <TaskBubble
                    key={task.id}
                    task={task}
                    onView={onView}
                    onEdit={onEdit}
                    onAddContribution={() => handleShowContributionPopup(task)}
                    onViewContribution={onViewContribution}
                    handleDragStart={handleDragStart}
                    isDraggable={true}
                  />
                ))}
              {sprintTasks.filter((task) => task.status === 'Completed').length === 0 && (
                <p className="kanban-no-tasks">No Tasks Completed</p>
              )}
            </div>
          </div>
        </div>
      );
    }
  };

  const renderListView = () => (
    <div className="list-view">
      {sprintTasks.map((task) => (
        <TaskBubble
          key={task.id}
          task={task}
          onView={onView}
          onEdit={onEdit}
          onAddContribution={() => handleShowContributionPopup(task)}
          onViewContribution={onViewContribution}
          handleDragStart={
            currentSprint && currentSprint.status !== 'Completed' ? handleDragStart : null
          }
          isDraggable={currentSprint && currentSprint.status !== 'Completed'}
        />
      ))}
    </div>
  );

  return (
    <div className="sprint-task-view">
      {/* Sprint Details Section */}
      <div className="sprint-detail__header">
        {currentSprint && (
          <div className="sprint-detail__info">
            <h2>{currentSprint.name}</h2>
            <p>
              <strong>Date:</strong> {currentSprint.startDate} to {currentSprint.endDate} (
              {currentSprint.duration} days)
            </p>
            <p>
              <strong>Product Owner:</strong> {currentSprint.productOwner} |{' '}
              <strong>Scrum Master:</strong> {currentSprint.scrumMaster} |{' '}
              <strong>Developers:</strong> {currentSprint.developers.join(', ')}
            </p>
            <p>
              <strong>Total Story Points:</strong> {totalStoryPoints}
            </p>
            <p>
              <strong>Story Points Completed:</strong> {storyPointsCompleted}
            </p>
          </div>
        )}
        <button className="sprint-detail__return-btn" onClick={handleReturn}>
          Return to Sprint Board
        </button>
      </div>

      {/* View Toggle Buttons */}
      <div className="view-toggle">
        <button
          onClick={() => setViewMode('kanban')}
          className={viewMode === 'kanban' ? 'active' : ''}
        >
          Kanban View
        </button>
        <button
          onClick={() => setViewMode('list')}
          className={viewMode === 'list' ? 'active' : ''}
        >
          List View
        </button>
      </div>

      {/* Render Kanban or List View */}
      {viewMode === 'kanban' ? renderKanbanView() : renderListView()}

      {/* Contribution Popup */}
      {selectedTask && (
        <ContributionPopup
          task={selectedTask}
          onClose={handleCloseContributionPopup}
          onAddContribution={(contribution) =>
            handleAddContribution(selectedTask.id, contribution)
          }
        />
      )}
    </div>
  );
}

function TaskBubble({
  task,
  onView,
  onAddContribution,
  handleDragStart,
  onEdit,
  onViewContribution,
  isDraggable,
}) {
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef(null);

  // Handle clicks outside the kebab menu
  const handleClickOutside = (event) => {
    if (
      menuRef.current &&
      !menuRef.current.contains(event.target) &&
      !event.target.closest('.task-bubble__kebab-menu-btn')
    ) {
      setShowMenu(false);
    }
  };

  useEffect(() => {
    if (showMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showMenu]);

  return (
    <div
      className="task-bubble"
      onClick={() => onView(task.id)}
      draggable={isDraggable}
      onDragStart={isDraggable ? (e) => handleDragStart(e, task.id) : null}
    >
      {/* Kebab Menu */}
      <div className="task-bubble__kebab-menu">
        <button
          className="task-bubble__kebab-menu-btn"
          onClick={(e) => {
            e.stopPropagation();
            setShowMenu(!showMenu);
          }}
        >
          ⋮
        </button>
        {showMenu && (
          <div className="task-bubble__kebab-dropdown" ref={menuRef}>
            <ul>
              <li
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit(task.id);
                  setShowMenu(false);
                }}
              >
                Edit
              </li>
              <li
                onClick={(e) => {
                  e.stopPropagation();
                  onViewContribution(task.id);
                  setShowMenu(false);
                }}
              >
                View Contribution
              </li>
              <li
                onClick={(e) => {
                  e.stopPropagation();
                  onAddContribution(task.id);
                  setShowMenu(false);
                }}
              >
                Add Contribution
              </li>
            </ul>
          </div>
        )}
      </div>
      {/* Task Content */}
      <div className="task-content">
        <h4 className="task-bubble__name">
          {task.name}
          <span className={`task-status-tag ${task.status.replace(' ', '-').toLowerCase()}`}>
            {task.status}
          </span>
        </h4>
        <div className="task-bubble__info-container">
          <span className={`task-bubble__priority-tag ${task.priority.toLowerCase()}`}>
            {task.priority}
          </span>
          <span
            className="task-bubble__info story-point"
            style={{ backgroundColor: getStoryPointColor(task.storyPoint) }}
          >
            {task.storyPoint}
          </span>
          {task.tags && task.tags.length > 0 && (
            <div className="task-bubble__tag-container">
              {task.tags.map((tag) => (
                <span key={tag} className="task-bubble__selected-tag" data-tag={tag}>
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Helper function for story point color
function getStoryPointColor(value) {
  const colors = [
    '#008000', // 1
    '#008000', // 2
    '#D5B60A', // 3
    '#D5B60A', // 4
    '#FFA500', // 5
    '#FFA500', // 6
    '#FF3652', // 7
    '#FF3652', // 8
    '#FF0500', // 9
    '#FF0500', // 10
  ];
  return colors[value - 1] || '#f0a574';
}

export default SprintTaskView;
