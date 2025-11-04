import React, { useState } from 'react';
import './ApplicationInterestModal.css';

const ApplicationInterestModal = ({ opportunity, onClose, onConfirm }) => {
  const [interested, setInterested] = useState(null);
  const [wantsReminder, setWantsReminder] = useState(false);

  const handleSubmit = () => {
    if (interested === true) {
      onConfirm({
        opportunityId: opportunity.id,
        title: opportunity.title,
        deadline: opportunity.deadline,
        wantsReminder
      });
    }
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="interest-modal">
        <h3>Application Interest</h3>
        <p>Are you interested in applying for <strong>{opportunity.title}</strong>?</p>
        
        <div className="interest-options">
          <label>
            <input 
              type="radio" 
              name="interest" 
              value="yes"
              onChange={() => setInterested(true)}
            />
            Yes, I'm interested
          </label>
          <label>
            <input 
              type="radio" 
              name="interest" 
              value="no"
              onChange={() => setInterested(false)}
            />
            No, not interested
          </label>
        </div>

        {interested === true && (
          <div className="reminder-option">
            <label>
              <input 
                type="checkbox"
                checked={wantsReminder}
                onChange={(e) => setWantsReminder(e.target.checked)}
              />
              Send me reminders about this application (3 days before deadline)
            </label>
          </div>
        )}

        <div className="modal-buttons">
          <button onClick={handleSubmit} className="confirm-btn">
            Confirm
          </button>
          <button onClick={onClose} className="cancel-btn">
            Skip
          </button>
        </div>
      </div>
    </div>
  );
};

export default ApplicationInterestModal;