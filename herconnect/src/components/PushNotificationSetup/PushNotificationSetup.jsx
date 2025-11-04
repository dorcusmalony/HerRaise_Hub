import React, { useState, useEffect } from 'react';
import pushNotificationService from '../../services/pushNotificationService';
import './PushNotificationSetup.css';

const PushNotificationSetup = () => {
  const [showPermissionModal, setShowPermissionModal] = useState(false);

  const requestNotificationPermission = async () => {
    const success = await pushNotificationService.initialize();
    setShowPermissionModal(false);
    
    if (success) {
      pushNotificationService.showNotification('Notifications Enabled!', {
        body: 'You\'ll now receive real-time updates about opportunities and forum activity.',
        icon: '/icon-192x192.png'
      });
    }
  };

  // Show permission prompt on first visit
  useEffect(() => {
    if (!localStorage.getItem('notificationPermissionAsked')) {
      setTimeout(() => {
        setShowPermissionModal(true);
        localStorage.setItem('notificationPermissionAsked', 'true');
      }, 3000);
    }
  }, []);

  if (!showPermissionModal) return null;

  return (
    <div className="permission-modal-overlay">
      <div className="permission-modal">
        <div className="modal-icon">🔔</div>
        <h3>Stay Updated!</h3>
        <p>Get instant notifications about new opportunities, forum posts, and important updates.</p>
        <div className="modal-buttons">
          <button onClick={requestNotificationPermission} className="allow-btn">
            Allow Notifications
          </button>
          <button onClick={() => setShowPermissionModal(false)} className="later-btn">
            Maybe Later
          </button>
        </div>
      </div>
    </div>
  );
};

export default PushNotificationSetup;