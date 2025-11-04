import './NotificationToast.css'

const NotificationToast = ({ notification, onClose }) => {
  if (!notification) return null;
  
  return (
    <div className="notification-toast">
      <div className="toast-icon">🎯</div>
      <div className="toast-content">
        <h4>{notification?.title || 'Notification'}</h4>
        <p>{notification?.message || ''}</p>
        {notification?.opportunityId && (
          <button onClick={() => window.location.href = `/opportunities/${notification.opportunityId}`}>
            View Opportunity
          </button>
        )}
      </div>
      {onClose && <button onClick={onClose}>×</button>}
    </div>
  );
}

export default NotificationToast
