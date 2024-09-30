import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './Header.css';

function Header({ onAddTaskClick, onAddSprintClick, sprints }) {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const [currentPage, setCurrentPage] = useState('Product Backlog');
  const settingsDropdownRef = useRef(null);

  useEffect(() => {
    if (location.pathname === '/sprint-board') {
      setCurrentPage('Sprint Board');
    } else if (location.pathname.startsWith('/sprint/')) {
      setCurrentPage('Sprint');
    } else if (location.pathname.startsWith('/sprint-task-view')) {
      setCurrentPage('Sprint');
    } else {
      setCurrentPage('Product Backlog');
    }
  }, [location.pathname]);

  useEffect(() => {
    // Close the settings dropdown when clicking outside
    const handleClickOutside = (event) => {
      if (settingsDropdownRef.current && !settingsDropdownRef.current.contains(event.target)) {
        setIsSettingsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const toggleSettings = () => {
    setIsSettingsOpen(!isSettingsOpen);
  };

  const handleDropdownChange = (e) => {
    const selected = e.target.value;
    if (selected === 'Product Backlog') {
      navigate('/');
    } else if (selected === 'Sprint Board') {
      navigate('/sprint-board');
    } else if (selected === 'Sprint') {
      // Handle navigation to the appropriate sprint
      let targetSprint = null;
      const today = new Date();

      // Find the oldest active sprint
      const activeSprints = sprints.filter((sprint) => {
        const startDate = new Date(sprint.startDate);
        const endDate = new Date(sprint.endDate);
        return sprint.status === 'Active' || (today >= startDate && today <= endDate);
      });

      if (activeSprints.length > 0) {
        // Sort by startDate ascending
        activeSprints.sort((a, b) => new Date(a.startDate) - new Date(b.startDate));
        targetSprint = activeSprints[0];
      } else {
        // No active sprints, find the oldest not started sprint
        const notStartedSprints = sprints.filter((sprint) => {
          const startDate = new Date(sprint.startDate);
          return sprint.status === 'Inactive' || today < startDate;
        });

        if (notStartedSprints.length > 0) {
          // Sort by startDate ascending
          notStartedSprints.sort((a, b) => new Date(a.startDate) - new Date(b.startDate));
          targetSprint = notStartedSprints[0];
        }
      }

      if (targetSprint) {
        // Check if the sprint is active
        if (targetSprint.status === 'Active') {
          // Navigate to sprint task view page for active sprint
          navigate(`/sprint-task-view/${targetSprint.id}`);
        } else {
          // Navigate to sprint detail page for non-active sprint
          navigate(`/sprint/${targetSprint.id}`);
        }
      } else {
        // No active or not started sprints, navigate to sprint backlog
        navigate('/sprint-board');
      }
    }
  };

  return (
    <header className="header">
      <div className="header-left">
        <h1 className="header-title">{currentPage}</h1>
        {currentPage === 'Product Backlog' && (
          <button className="add-task-btn" onClick={onAddTaskClick}>
            Add Task
          </button>
        )}
        {currentPage === 'Sprint Board' && (
          <button className="add-task-btn" onClick={onAddSprintClick}>
            Add Sprint
          </button>
        )}
      </div>
      <div className="header-right">
        <select
          className="dropdown-btn"
          onChange={handleDropdownChange}
          value={currentPage}
        >
          <option>Product Backlog</option>
          <option>Sprint Board</option>
          <option>Sprint</option>
        </select>

        <button className="settings-btn" onClick={toggleSettings}>
          ⚙️
        </button>
        {/* {isSettingsOpen && (
          <div ref={settingsDropdownRef} className="settings-dropdown">
            <ul>
              <li>Option 1</li>
              <li>Option 2</li>
              <li>Option 3</li>
            </ul>
          </div>
        )} */}
      </div>
    </header>
  );
}

export default Header;
