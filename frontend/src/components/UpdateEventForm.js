// src/components/UpdateEventForm.js
import React, { useState } from 'react';
import './EventList.css';

const UpdateEventForm = ({ event, onUpdateEvent }) => {
  const [title, setTitle] = useState(event.title);
  const [description, setDescription] = useState(event.description);
  const [date, setDate] = useState(event.date);
  const [maxAttendees, setMaxAttendees] = useState(event.maxAttendees);

  const handleSubmit = (e) => {
    e.preventDefault();
    const updatedEvent = { title, description, date, maxAttendees };
    onUpdateEvent(event._id, updatedEvent);
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
      <button type="submit">Update Event</button>
    </form>
  );
};

export default UpdateEventForm;
