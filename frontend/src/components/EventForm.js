import React, { useState } from 'react';
import './EventList.css'; // Importer le fichier CSS

const EventForm = ({ onEventCreated }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [maxAttendees, setMaxAttendees] = useState(10);

  const handleSubmit = (e) => {
    e.preventDefault();
    const newEvent = { title, description, date, maxAttendees };
    if (typeof onEventCreated === 'function') {
      onEventCreated(newEvent); // Appeler la fonction onEventCreated avec les données du nouvel événement
    }
    setTitle('');
    setDescription('');
    setDate('');
    setMaxAttendees(10);
  };

  return (
    <form className="event-form" onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      />
      <textarea
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        required
      ></textarea>
      <input
        type="datetime-local"
        value={date}
        onChange={(e) => setDate(e.target.value)}
        required
      />
      <input
        type="number"
        placeholder="Max Attendees"
        value={maxAttendees}
        onChange={(e) => setMaxAttendees(parseInt(e.target.value, 10))}
        required
      />
      <button type="submit">Create Event</button>
    </form>
  );
};

export default EventForm;
