import React, { useEffect, useState } from 'react';
import {jwtDecode} from 'jwt-decode'; // Importation par défaut
import { getToken } from '../api';
import UpdateEventForm from './UpdateEventForm'; // Assurez-vous d'avoir ce composant
import './EventList.css';
import { format, parseISO, isValid } from 'date-fns';

const Event = ({ event, onDelete, onAttend, onUnattend, onUpdate }) => {
  const [showUpdateForm, setShowUpdateForm] = useState(false);
  const [showAttendees, setShowAttendees] = useState(false);

  // Get user ID from token
  const token = getToken(); 
  const decodedToken = jwtDecode(token);
  const userId = decodedToken.id;

  const isAttendee = event.attendees.some(attendee => attendee._id === userId);

  useEffect(() => {
    console.log('Event updated:', event);
  }, [event]);

  const handleToggleAttend = () => {
    if (isAttendee) {
      onUnattend(event._id);
    } else {
      onAttend(event._id);
    }
  };

  const handleToggleUpdateForm = () => {
    setShowUpdateForm(!showUpdateForm);
  };

  const parsedDate = parseISO(event.date);
  const formattedDate = isValid(parsedDate) ? format(parsedDate, 'dd/MM/yyyy HH:mm:ss') : 'Invalid date';

  const toggleAttendees = () => {
    setShowAttendees(!showAttendees);
  };

  return (
    <div className="event">
      <h3>{event.title}</h3>
      <p>{event.description}</p>
      <p>{formattedDate}</p> {/* Display date as is */}
      <p>Created by: {event.createdBy.name}</p>
      <p>Attendees: {event.attendees.length} / {event.maxAttendees}</p>

      {event.createdBy._id === userId && (
        <>
          <button className="delete" onClick={() => onDelete(event._id)}>
            Delete
          </button>
          {showUpdateForm && (
            <UpdateEventForm event={event} onUpdateEvent={onUpdate} />
          )}
          <button className="update" onClick={handleToggleUpdateForm}>
            {showUpdateForm ? 'Cancel' : 'Update'}
          </button>
          <button className="show-attendees" onClick={toggleAttendees}>
            {showAttendees ? 'Hide' : 'Show'}
          </button>
          
          {showAttendees && (
            <ul className="attendees-list">
              {event.attendees.map(attendee => (
                <li key={attendee._id}>{attendee.name}</li>
              ))}
            </ul>
          )}
        </>
      )}

      {event.createdBy._id !== userId && (
        <button
          className={isAttendee ? 'unattend' : 'attend'}
          onClick={handleToggleAttend}
        >
          {isAttendee ? 'Unattend' : 'Attend'}
        </button>
      )}
    </div>
  );
};

export default Event;
