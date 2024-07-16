const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    date: { type: Date, required: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Référence à l'utilisateur créateur
    attendees: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], // Liste des utilisateurs inscrits
    maxAttendees: { type: Number, required: true }, // Nombre maximum de participants
});

module.exports = mongoose.model('Event', eventSchema);
