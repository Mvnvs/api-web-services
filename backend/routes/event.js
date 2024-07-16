const express = require('express');
const jwt = require('jsonwebtoken');
const Event = require('../models/Event');
const router = express.Router();

const authenticateToken = (req, res, next) => {
    const token = req.query.token || req.headers['authorization']?.split(' ')[1];
    console.log('Token:', token); // Ajoutez ce log pour vérifier le token
    if (token == null) {
        console.log('No token provided'); // Log si aucun token n'est fourni
        return res.sendStatus(401);
    }

    jwt.verify(token, process.env.SECRET_KEY, (err, user) => {
        if (err) {
            console.log('JWT Verification Error:', err); // Ajoutez ce log pour vérifier les erreurs JWT
            return res.sendStatus(403);
        }
        req.user = user;
        console.log('Token verified, user:', user); // Log si le token est vérifié
        next();
    });
};

router.use(authenticateToken);

router.use((req, res, next) => {
    console.log('Inside events router middleware'); // Ajoutez ce log pour vérifier que le middleware de route est appelé
    next();
});

router.get('/', async (req, res) => {
    try {
        const events = await Event.find().populate('createdBy', 'name').populate('attendees', 'name');
        res.json(events);
    } catch (error) {
        console.log('Error fetching events:', error); // Ajoutez ce log pour vérifier les erreurs de récupération
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

router.post('/', async (req, res) => {
    console.log('Request body:', req.body); // Ajoutez ce log pour vérifier les données reçues
    const { title, description, date, maxAttendees } = req.body;
    console.log('Received event data:', { title, description, date }); // Ajoutez ce log pour vérifier les données reçues
    try {
        const event = new Event({ title, description, date, createdBy: req.user.id, maxAttendees });
        await event.save();
        const populatedEvent = await Event.findById(event._id).populate('createdBy', 'name').populate('attendees', 'name');
        res.status(201).json(populatedEvent);
    } catch (error) {
        console.log('Error adding event:', error); // Ajoutez ce log pour vérifier les erreurs d'ajout
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { title, description, date, maxAttendees } = req.body;
    try {
        const event = await Event.findOneAndUpdate(
            { _id: id, createdBy: req.user.id },
            { title, description, date, maxAttendees },
            { new: true }
        ).populate('createdBy', 'name').populate('attendees', 'name');
        if (!event) return res.status(404).json({ error: 'Event not found or not authorized' });
        res.json(event);
    } catch (error) {
        console.log('Error updating event:', error); // Ajoutez ce log pour vérifier les erreurs de mise à jour
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const event = await Event.findOneAndDelete({ _id: id, createdBy: req.user.id });
        if (!event) return res.status(404).json({ error: 'Event not found or not authorized' });
        res.status(204).send();
    } catch (error) {
        console.log('Error deleting event:', error); // Ajoutez ce log pour vérifier les erreurs de suppression
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

router.post('/:id/attend', async (req, res) => {
    const { id } = req.params;
    try {
        const event = await Event.findById(id).populate('createdBy', 'name').populate('attendees', 'name');
        if (!event) return res.status(404).json({ error: 'Event not found' });
        if (event.attendees.length >= event.maxAttendees) return res.status(400).json({ error: 'Event is full' });
        if (event.attendees.some(attendee => attendee._id.toString() === req.user.id)) return res.status(400).json({ error: 'Already registered' });
        event.attendees.push(req.user.id);
        await event.save();
        const populatedEvent = await Event.findById(event._id).populate('createdBy', 'name').populate('attendees', 'name');
        res.status(200).json(populatedEvent);
    } catch (error) {
        console.log('Error attending event:', error); // Ajoutez ce log pour vérifier les erreurs d'inscription
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

router.post('/:id/unattend', async (req, res) => {
    const { id } = req.params;
    try {
        const event = await Event.findById(id).populate('createdBy', 'name').populate('attendees', 'name');
        if (!event) return res.status(404).json({ error: 'Event not found' });
        if (!event.attendees.some(attendee => attendee._id.toString() === req.user.id)) return res.status(400).json({ error: 'Not registered for this event' });
        event.attendees = event.attendees.filter(attendee => attendee._id.toString() !== req.user.id);
        await event.save();
        const populatedEvent = await Event.findById(event._id).populate('createdBy', 'name').populate('attendees', 'name');
        res.status(200).json(populatedEvent);
    } catch (error) {
        console.log('Error unattending event:', error); // Ajoutez ce log pour vérifier les erreurs de désinscription
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

module.exports = router;
