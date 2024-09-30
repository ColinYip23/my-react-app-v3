import React, { useState } from 'react';
import './ContributionPopup.css';

function ContributionPopup({ task, onClose, onAddContribution }) {
  const [date, setDate] = useState('');
  const [duration, setDuration] = useState('');

  const handleAddContribution = (e) => {
    e.preventDefault(); // Prevent default form submission behavior

    if (date && duration) {
      // Create the contribution object without description
      const contribution = { date, duration: parseInt(duration, 10) };
      // Call the onAddContribution function
      onAddContribution(contribution);
      // Reset fields
      setDate('');
      setDuration('');
      // Close the popup
      onClose();
    } else {
      alert('Please fill in all fields.');
    }
  };

  return (
    <div className="outer-container">
      <div className="contribution-popup">
        <h2>Add Contribution: {task.name}</h2>
        <form onSubmit={handleAddContribution}>
          <div className="form-group">
            <label>Date</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>Duration (minutes)</label>
            <input
              type="number"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              required
            />
          </div>

          <div className="form-actions">
            <button type="button" className="cancel-btn" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="save-btn">
              Add Contribution
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ContributionPopup;
