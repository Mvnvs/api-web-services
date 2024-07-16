const { GraphQLObjectType, GraphQLSchema, GraphQLString, GraphQLList, GraphQLID } = require('graphql');
const { GraphQLDateTime } = require('graphql-iso-date');
const Event = require('../models/Event');
const User = require('../models/User');

const UserType = new GraphQLObjectType({
  name: 'User',
  fields: () => ({
    _id: { type: GraphQLID },
    googleId: { type: GraphQLString },
    name: { type: GraphQLString },
  })
});

const EventType = new GraphQLObjectType({
  name: 'Event',
  fields: () => ({
    _id: { type: GraphQLID },
    title: { type: GraphQLString },
    description: { type: GraphQLString },
    date: { type: GraphQLDateTime },
    createdBy: {
      type: UserType,
      resolve(parent, args) {
        return User.findById(parent.createdBy);
      }
    },
    attendees: {
      type: new GraphQLList(UserType),
      resolve(parent, args) {
        return User.find({ _id: { $in: parent.attendees } });
      }
    },
    maxAttendees: { type: GraphQLString }
  })
});

const RootQuery = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: {
    events: {
      type: new GraphQLList(EventType),
      args: {
        title: { type: GraphQLString },
        createdBy: { type: GraphQLID },
      },
      resolve(parent, args) {
        let filter = {};
        if (args.title) {
          filter.title = { $regex: args.title, $options: 'i' }; // Filtrage par titre avec insensibilité à la casse
        }
        if (args.createdBy) {
          filter.createdBy = args.createdBy;
        }
        return Event.find(filter);
      }
    },
    event: {
      type: EventType,
      args: { id: { type: GraphQLID } },
      resolve(parent, args) {
        return Event.findById(args.id);
      }
    }
  }
});

module.exports = new GraphQLSchema({
  query: RootQuery
});