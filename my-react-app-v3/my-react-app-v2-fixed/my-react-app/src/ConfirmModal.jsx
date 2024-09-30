import React from 'react';
import './ConfirmModal.css';

function ConfirmModal({ onConfirm, onCancel, message }) {
  return (
    <div className="confirm-modal">
      <div className="modal-content">
        <p className="confirm-message">{message}</p>
        <hr />
        <div className="modal-actions">
          <button className="confirm-btn" onClick={onConfirm}>
            Yes
          </button>
          <button className="cancel-btn" onClick={onCancel}>
            No
          </button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmModal;
