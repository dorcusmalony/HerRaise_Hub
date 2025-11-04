import { useState, useEffect } from 'react';

export const useApplicationTracking = () => {
  const [trackedApplications, setTrackedApplications] = useState([]);

  useEffect(() => {
    loadTrackedApplications();
  }, []);

  const loadTrackedApplications = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/applications/tracked`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        setTrackedApplications(data.applications || []);
      }
    } catch (error) {
      console.error('Failed to load tracked applications:', error);
    }
  };

  const trackApplication = async (applicationData) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/applications/track`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(applicationData)
      });
      
      if (response.ok) {
        loadTrackedApplications();
        return true;
      }
    } catch (error) {
      console.error('Failed to track application:', error);
    }
    return false;
  };

  const checkIfVisited = (opportunityId) => {
    const visited = localStorage.getItem(`visited_${opportunityId}`);
    return visited === 'true';
  };

  const markAsVisited = (opportunityId) => {
    localStorage.setItem(`visited_${opportunityId}`, 'true');
  };

  const shouldShowInterestModal = (opportunityId) => {
    const visited = checkIfVisited(opportunityId);
    const alreadyTracked = trackedApplications.some(app => app.opportunityId === opportunityId);
    const modalShown = localStorage.getItem(`modal_shown_${opportunityId}`);
    
    return visited && !alreadyTracked && !modalShown;
  };

  const markModalShown = (opportunityId) => {
    localStorage.setItem(`modal_shown_${opportunityId}`, 'true');
  };

  return {
    trackedApplications,
    trackApplication,
    checkIfVisited,
    markAsVisited,
    shouldShowInterestModal,
    markModalShown,
    loadTrackedApplications
  };
};

export default useApplicationTracking;