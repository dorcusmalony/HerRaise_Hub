import { toast } from 'react-toastify';

export const playNotificationSound = () => {
  const audio = new Audio('/notification-sound.mp3');
  audio.volume = 0.3;
  audio.play().catch(e => console.log('Could not play sound:', e));
};

export const showToast = (notification) => {
  if (!notification) return;
  
  const toastElement = (
    <div className="notification-toast">
      <div className="toast-icon">🎯</div>
      <div>
        <h4>{notification?.title || 'Notification'}</h4>
        <p>{notification?.message || ''}</p>
      </div>
      {notification?.action && (
        <button onClick={() => {
          toast.dismiss();
          notification.action();
        }}>
          View
        </button>
      )}
    </div>
  );

  toast.success(toastElement, { 
    duration: 6000,
    position: "top-right",
    autoClose: 6000,
    closeOnClick: true,
    pauseOnHover: true,
  });
};