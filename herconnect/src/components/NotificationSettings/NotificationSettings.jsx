import React, { useState, useEffect } from 'react';
import './NotificationSettings.css';

const NotificationSettings = () => {
  const [settings, setSettings] = useState({
    emailNotifications: true,
    pushNotifications: true,
    opportunityTypes: ['scholarship', 'internship', 'competition']
  });

  const updateSetting = async (key, value) => {
    const newSettings = { ...settings, [key]: value };
    setSettings(newSettings);
    
    // Save to backend
    try {
      const token = localStorage.getItem('token');
      await fetch(`${import.meta.env.VITE_API_URL}/api/notifications/settings`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(newSettings)
      });
    } catch (error) {
      console.error('Failed to update settings:', error);
    }
  };

  const toggleOpportunityType = (type, checked) => {
    const newTypes = checked 
      ? [...settings.opportunityTypes, type]
      : settings.opportunityTypes.filter(t => t !== type);
    updateSetting('opportunityTypes', newTypes);
  };

  return (
    <div className="notification-settings">
      <h3>Notification Preferences</h3>
      
      <div className="setting-group">
        <label>
          <input 
            type="checkbox" 
            checked={settings.emailNotifications}
            onChange={(e) => updateSetting('emailNotifications', e.target.checked)}
          />
          Email notifications for new opportunities
        </label>
      </div>
      
      <div className="setting-group">
        <label>
          <input 
            type="checkbox" 
            checked={settings.pushNotifications}
            onChange={(e) => updateSetting('pushNotifications', e.target.checked)}
          />
          Browser push notifications
        </label>
      </div>
      
      <div className="setting-group">
        <h4>Notify me about:</h4>
        {['scholarship', 'internship', 'competition', 'job'].map(type => (
          <label key={type}>
            <input 
              type="checkbox" 
              checked={settings.opportunityTypes.includes(type)}
              onChange={(e) => toggleOpportunityType(type, e.target.checked)}
            />
            {type.charAt(0).toUpperCase() + type.slice(1)}s
          </label>
        ))}
      </div>
    </div>
  );
};

export default NotificationSettings;