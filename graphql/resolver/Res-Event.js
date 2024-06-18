const Event = require('../../models/event.js');
const User = require('../../models/user.js');
const {transformEvent} = require('./populate-transform.js')



// exporting event Queries and Mutations
module.exports = {
    // Queries

    // this query is to retrieve all the events
    events: async () => {
        // instead of using populate i can do this
        // to access the creator it calls the user function
        try {
            const events = await Event.find();
            return events.map(event => {
                return transformEvent(event);
            });
        } catch (error) {
            throw new Error(error.message);
        }
    },
    // mutations

    // mutation (create ) a new event
    createEvent: async (args, req) => {
        if(!req.isAuth) throw new Error("You must be logged in to create a new event"); 
        // saving the data in the mongodb database  
        const event = new Event({
            title: args.eventInput.title,
            description: args.eventInput.description,
            price: +args.eventInput.price,
            date: new Date(args.eventInput.date),
            creator: req.userId,
        });

        let createdEvent;
        try {
            const result = await event.save();

            createdEvent = transformEvent(result);

            // finding the user who has created this event
            const event_creator_user = await User.findById(req.userId);

            if (!event_creator_user) {
                throw new Error("User not found");
            }
            event_creator_user.createdEvents.push(event);
            await event_creator_user.save();

            return createdEvent;

        } catch (error) {
            throw new Error(error.message);
        }

    }
};