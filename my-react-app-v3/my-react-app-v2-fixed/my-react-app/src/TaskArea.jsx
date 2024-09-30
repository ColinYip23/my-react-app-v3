// src/TaskArea.jsx
import React, { useState, useEffect } from 'react';
import './TaskArea.css';

function TaskArea({
  tasks,
  onEdit,
  onDelete,
  onHistory,
  onView,
  onSortChange,
  onFilterChange,
  filterTags,
}) {
  const [openMenuId, setOpenMenuId] = useState(null);

  useEffect(() => {
    // Close the kebab menu when clicking outside
    const handleClickOutside = (event) => {
      if (
        !event.target.closest('.task-area__kebab-menu') &&
        !event.target.closest('.task-area__kebab-dropdown')
      ) {
        setOpenMenuId(null);
      }
    };

    document.addEventListener('click', handleClickOutside);

    // Cleanup event listener on unmount
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  const toggleMenu = (taskId) => {
    setOpenMenuId(openMenuId === taskId ? null : taskId);
  };

  const getStoryPointColor = (value) => {
    // Map story point values to colors
    const colors = [
      '#008000', // 1
      '#008000', // 2
      '#D5B60A', // 3
      '#D5B60A', // 4
      '#ffA500', // 5
      '#ffA500', // 6
      '#ff3652', // 7
      '#ff3652', // 8
      '#ff0500', // 9
      '#ff0500', // 10
    ];
    return colors[value - 1] || '#f0a574'; // default color
  };

  const [selectedTags, setSelectedTags] = useState(filterTags || []);

  const handleTagFilterChange = (tag) => {
    let updatedTags;
    if (selectedTags.includes(tag)) {
      updatedTags = selectedTags.filter((t) => t !== tag);
    } else {
      updatedTags = [...selectedTags, tag];
    }
    setSelectedTags(updatedTags);
    onFilterChange(updatedTags);
  };

  return (
    <div className="task-area">
      {/* Sort and Filter Options */}
      <div className="task-area__filter-sort-container">
        <div className="task-area__sort-options">
          <label htmlFor="sort-select">Sort By:</label>
          <select id="sort-select" onChange={(e) => onSortChange(e.target.value)}>
            <option value="Newest to Oldest">Newest to Oldest</option>
            <option value="Oldest to Newest">Oldest to Newest</option>
            <option value="Urgent to Low">Urgent to Low</option>
            <option value="Low to Urgent">Low to Urgent</option>
          </select>
        </div>
        <div className="task-area__filter-options">
          <label>Filter Tags:</label>
          <div className="task-area__filter-tags">
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
              <label key={tag} className="task-area__filter-tag" data-tag={tag}>
                <input
                  type="checkbox"
                  value={tag}
                  checked={selectedTags.includes(tag)}
                  onChange={() => handleTagFilterChange(tag)}
                />
                {tag}
              </label>
            ))}
          </div>
        </div>
      </div>

      {/* Task List */}
      {tasks && tasks.length > 0 ? (
        tasks.map((task) => (
          <div key={task.id} className="task-area__task-wrapper">
            <div className="task-area__task-bubble" onClick={() => onView(task.id)}>
              {/* Task Name */}
              <p className="task-area__task-name">{task.name}</p>

              {/* Priority, Story Point, Tags, and Kebab Button */}
              <div
                className="task-area__task-info-container"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="task-area__task-info priority">
                  <span className={`task-area__priority-tag ${task.priority.toLowerCase()}`}>
                    {task.priority}
                  </span>
                </div>
                <div
                  className="task-area__task-info story-point"
                  style={{
                    backgroundColor: getStoryPointColor(task.storyPoint),
                  }}
                >
                  <span>{task.storyPoint}</span>
                </div>
                {/* Conditionally render the tag-container only if tags exist */}
                {task.tags && task.tags.length > 0 && (
                  <div className="task-area__tag-container">
                    {task.tags.map((tag) => (
                      <span key={tag} className={`task-area__selected-tag`} data-tag={tag}>
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
                {/* Kebab Menu Button */}
                <div className="task-area__kebab-menu">
                  <button
                    className="task-area__kebab-menu-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleMenu(task.id);
                    }}
                  >
                    ⋮
                  </button>
                  {openMenuId === task.id && (
                    <div className="task-area__kebab-dropdown">
                      <ul>
                        <li onClick={() => onEdit(task.id)}>Edit</li>
                        <hr /> {/* Separator */}
                        <li onClick={() => onDelete(task.id)}>Delete</li>
                        <hr /> {/* Separator */}
                        <li onClick={() => onHistory(task.id)}>History</li>
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))
      ) : (
        <div className="task-area__no-tasks">No Active Tasks</div>
      )}
    </div>
  );
}

export default TaskArea;
