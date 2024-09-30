import React from 'react';
import './HistoryModal.css';

function HistoryModal({ onClose, history, taskName }) {
  return (
    <div className="history-modal">
      <div className="modal-content">
        <div className="modal-header">
          <h2>History Log: {taskName}</h2>
          <button className="close-btn" onClick={onClose}>
            ✖
          </button>
        </div>
        <hr />
        <div className="modal-body">
          <div id="history-log" className="scrollable-container">
            {history.length > 0 ? (
              history.map((entry, index) => (
                <div key={index} className="task-entry">
                  
                  <div className="task-details">
                  <div className="user-icon">👤</div>
                    <p className="username">{entry.assignTo}</p>
                    <p className="modified-date">
                      {entry.action} at{' '}
                      {new Date(entry.timestamp).toLocaleString()}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <p>No history found for this task.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default HistoryModal;
