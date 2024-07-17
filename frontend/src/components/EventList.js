import React, { useState, useEffect } from 'react';
import { useLazyQuery, gql } from '@apollo/client';
import { fetchEvents, deleteEvent, attendEvent, unattendEvent, createEvent, updateEvent } from '../api';
import Event from './Event';
import EventForm from './EventForm';
import './EventList.css';

const GET_EVENTS = gql`
  query GetEvents($title: String) {
    events(title: $title) {
      _id
      title
      description
      date
      createdBy {
        _id
        name
      }
      attendees {
        _id
      }
      maxAttendees
    }
  }
`;

const EventList = () => {
  const [events, setEvents] = useState([]);
  const [filter, setFilter] = useState('');

  const [getEvents, { loading, error, data }] = useLazyQuery(GET_EVENTS);

  useEffect(() => {
    const fetchInitialEvents = async () => {
      try {
        const events = await fetchEvents();
        console.log('Fetched events:', events);
        setEvents(events);
      } catch (err) {
        console.error('Error fetching initial events:', err);
      }
    };

    fetchInitialEvents();
  }, []);

  useEffect(() => {
    if (data) {
      console.log('GraphQL Response:', data);
      setEvents(data.events);
    }
  }, [data]);

  const handleFilterChange = (e) => {
    setFilter(e.target.value);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    getEvents({ variables: { title: filter } });
  };

  const handleDelete = async (id) => {
    try {
      await deleteEvent(id);
      setEvents(events.filter(event => event._id !== id));
    } catch (error) {
      console.error('Error deleting event:', error);
    }
  };

  const handleAttend = async (id) => {
    try {
      const updatedEvent = await attendEvent(id);
      setEvents(events.map(event => (event._id === id ? updatedEvent : event)));
    } catch (error) {
      console.error('Error attending event:', error);
    }
  };

  const handleUnattend = async (id) => {
    try {
      const updatedEvent = await unattendEvent(id);
      setEvents(events.map(event => (event._id === id ? updatedEvent : event)));
    } catch (error) {
      console.error('Error unattending event:', error);
    }
  };

  const handleEventCreated = async (newEvent) => {
    try {
      const createdEvent = await createEvent(newEvent);
      setEvents([...events, createdEvent]);
    } catch (error) {
      console.error('Error creating event:', error);
    }
  };

  const handleEventUpdated = async (id, updatedEvent) => {
    try {
      const event = await updateEvent(id, updatedEvent);
      setEvents(events.map(e => (e._id === id ? event : e)));
    } catch (error) {
      console.error('Error updating event:', error);
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) {
    console.error('GraphQL Error:', error);
    return <p>Error: {error.message}</p>;
  }

  return (
    <div className="event-list">
      <form onSubmit={handleSearch}>
        <input
          type="text"
          placeholder="Filter by title"
          value={filter}
          onChange={handleFilterChange}
          className="filter-input"
        />
        <button type="submit">Search</button>
      </form>
      <EventForm onEventCreated={handleEventCreated} />
      {events.map(event => (
        <Event
          key={event._id}
          event={event}
          onDelete={handleDelete}
          onAttend={handleAttend}
          onUnattend={handleUnattend}
          onUpdate={handleEventUpdated} // Pass the update handler
        />
      ))}
    </div>
  );
};

export default EventList;
