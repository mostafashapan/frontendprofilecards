import { useState } from 'react';

const useHandleTeamMemberDeletion = (teamMembers, setTeamMembers) => {
  const [checkedMembers, setCheckedMembers] = useState([]);

  const handleCheckboxChange = (id, isChecked) => {
    setCheckedMembers(prev =>
      isChecked ? [...prev, id] : prev.filter(memberId => memberId !== id)
    );
  };

  const handleDelete = async () => {
    if (checkedMembers.length === 0) {
      return;
    }

    try {
      // Create an array of fetch promises to delete each team member
      const requests = checkedMembers.map(id =>
        fetch(`${process.env.REACT_APP_API_URL}/teamMembers/${id}`, {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
        })
      );

      // Wait for all requests to complete
      const responses = await Promise.all(requests);

      // Check if all responses are OK
      const allSuccessful = responses.every(response => response.ok);

      if (allSuccessful) {
        // If all requests are successful, update the UI
        setTeamMembers(teamMembers.filter(member => !checkedMembers.includes(member.id)));
        setCheckedMembers([]);  // Clear selected members
      } else {
        // Handle errors if some requests failed
        const errorMessages = await Promise.all(responses.map(response => 
          response.ok ? null : response.json().then(err => err.error || 'Unknown error')
        ));
        console.error('Error deleting team members:', errorMessages.filter(msg => msg));
      }
    } catch (error) {
      console.error('Error deleting team members:', error);
    }
  };

  return { checkedMembers, handleCheckboxChange, handleDelete };
};

export default useHandleTeamMemberDeletion;
