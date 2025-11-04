const API_URL = import.meta.env.VITE_API_URL || '';

export const reminderAPI = {
  // Set up deadline reminder
  setDeadlineReminder: async (opportunityId, deadline) => {
    const token = localStorage.getItem('token');
    try {
      const response = await fetch(`${API_URL}/api/reminders/deadline`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          opportunityId,
          deadline,
          reminderType: 'deadline',
          reminderDays: 3 // 3 days before deadline
        })
      });
      return await response.json();
    } catch (error) {
      console.error('Failed to set deadline reminder:', error);
      throw error;
    }
  },

  // Get user's reminders
  getUserReminders: async () => {
    const token = localStorage.getItem('token');
    try {
      const response = await fetch(`${API_URL}/api/reminders`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      return await response.json();
    } catch (error) {
      console.error('Failed to get reminders:', error);
      throw error;
    }
  },

  // Mark reminder as sent
  markReminderSent: async (reminderId) => {
    const token = localStorage.getItem('token');
    try {
      const response = await fetch(`${API_URL}/api/reminders/${reminderId}/sent`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      return await response.json();
    } catch (error) {
      console.error('Failed to mark reminder as sent:', error);
      throw error;
    }
  }
};

export default reminderAPI;