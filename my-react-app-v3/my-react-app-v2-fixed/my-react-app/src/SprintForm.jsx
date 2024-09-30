import React, { useState, useEffect } from 'react';
import './SprintForm.css';

function SprintForm({ onCancel, onSave, sprint, existingSprints }) {
  const [sprintName, setSprintName] = useState(sprint ? sprint.name : '');
  const [startDate, setStartDate] = useState(sprint ? sprint.startDate : '');
  const [endDate, setEndDate] = useState(sprint ? sprint.endDate : '');
  const [duration, setDuration] = useState(sprint ? sprint.duration : 0);
  const [productOwner, setProductOwner] = useState(sprint ? sprint.productOwner : '');
  const [scrumMaster, setScrumMaster] = useState(sprint ? sprint.scrumMaster : '');
  const [developers, setDevelopers] = useState(sprint ? sprint.developers : []);

  const availableUsers = ['Teammate 1', 'Teammate 2', 'Teammate 3', 'Teammate 4', 'Teammate 5'];

  useEffect(() => {
    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      const diffTime = Math.abs(end - start);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      setDuration(diffDays);
    }
  }, [startDate, endDate]);

  useEffect(() => {
    if (!sprintName) {
      setDefaultSprintName();
    }
  }, [existingSprints]);

  const setDefaultSprintName = () => {
    // Count the number of existing sprints
    const nextNumber = existingSprints.length + 1; // Increment by 1 to get the next sprint number
    setSprintName(`Sprint ${nextNumber}`);
  };

  const handleDeveloperChange = (e) => {
    const { value, checked } = e.target;
    if (checked) {
      setDevelopers([...developers, value]);
    } else {
      setDevelopers(developers.filter((dev) => dev !== value));
    }
  };

  const handleProductOwnerChange = (e) => {
    const selected = e.target.value;
    setProductOwner(selected);
    if (selected === scrumMaster) {
      setScrumMaster('');
    }
    setDevelopers(developers.filter((dev) => dev !== selected));
  };

  const handleScrumMasterChange = (e) => {
    const selected = e.target.value;
    setScrumMaster(selected);
    if (selected === productOwner) {
      setProductOwner('');
    }
    setDevelopers(developers.filter((dev) => dev !== selected));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const today = new Date().toISOString().split('T')[0];
    if (startDate < today || endDate < today) {
      alert('Dates cannot be in the past.');
      return;
    }
    if (endDate < startDate) {
      alert('End date cannot be before start date.');
      return;
    }
    if (!productOwner || !scrumMaster || developers.length === 0) {
      alert('Please fill in all roles.');
      return;
    }

    const newSprint = {
      id: sprint ? sprint.id : null,
      name: sprintName || `Sprint ${existingSprints.length + 1}`, // Default name if not provided
      startDate,
      endDate,
      duration,
      productOwner,
      scrumMaster,
      developers,
      status: sprint ? sprint.status : 'Inactive',
      tasks: sprint ? sprint.tasks : [],
    };

    onSave(newSprint);
  };

  return (
    <div className="outer-container">
      <div className="sprint-form">
        <h2>{sprint ? 'Edit Sprint' : 'Add Sprint'}</h2>
        <form onSubmit={handleSubmit}>
          {/* Sprint Name */}
          <div className="form-group">
            <label htmlFor="sprintName">Sprint Name</label>
            <input
              type="text"
              id="sprintName"
              value={sprintName}
              onChange={(e) => setSprintName(e.target.value)}
              placeholder="Enter sprint name..."
            />
          </div>

          {/* Start Date */}
          <div className="form-group">
            <label htmlFor="startDate">Start Date</label>
            <input
              type="date"
              id="startDate"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              required
              min={new Date().toISOString().split('T')[0]}
            />
          </div>

          {/* End Date */}
          <div className="form-group">
            <label htmlFor="endDate">End Date</label>
            <input
              type="date"
              id="endDate"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              required
              min={startDate || new Date().toISOString().split('T')[0]}
            />
          </div>

          {/* Duration */}
          <div className="form-group">
            <label>Duration</label>
            <p>{duration} days</p>
          </div>

          {/* Roles */}
          <div className="form-group roles-section">
            <hr />
            <h3>Roles</h3>
            <div className="roles-container">
              {/* Product Owner */}
              <div className="role">
                <label htmlFor="productOwner">Product Owner</label>
                <select
                  id="productOwner"
                  value={productOwner}
                  onChange={handleProductOwnerChange}
                  required
                >
                  <option value="">Select Product Owner</option>
                  {availableUsers
                    .filter((user) => user !== scrumMaster && !developers.includes(user))
                    .map((user) => (
                      <option key={user} value={user}>
                        {user}
                      </option>
                    ))}
                </select>
              </div>

              {/* Scrum Master */}
              <div className="role">
                <label htmlFor="scrumMaster">Scrum Master</label>
                <select
                  id="scrumMaster"
                  value={scrumMaster}
                  onChange={handleScrumMasterChange}
                  required
                >
                  <option value="">Select Scrum Master</option>
                  {availableUsers
                    .filter((user) => user !== productOwner && !developers.includes(user))
                    .map((user) => (
                      <option key={user} value={user}>
                        {user}
                      </option>
                    ))}
                </select>
              </div>

              {/* Developers */}
              <div className="role">
                <label>Developers</label>
                <div className="developers-checkbox">
                  {availableUsers
                    .filter((dev) => dev !== productOwner && dev !== scrumMaster)
                    .map((dev) => (
                      <label key={dev}>
                        <input
                          type="checkbox"
                          value={dev}
                          checked={developers.includes(dev)}
                          onChange={handleDeveloperChange}
                        />
                        {dev}
                      </label>
                    ))}
                </div>
              </div>
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

export default SprintForm;
