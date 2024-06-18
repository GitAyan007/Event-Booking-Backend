const Booking = require("../../models/booking.js");
const Event = require('../../models/event.js');
// const mongoose = require('mongoose'); 
// const ObjectId = mongoose.Types.ObjectId;


const {transformBooking, transformEvent} = require('./populate-transform.js')



// exporting booking Queries and Mutations
module.exports = {
    // Queries

    bookings: async (args,req) => {
        if(!req.isAuth) throw new Error("You must be logged in to create a new event"); 

        const bookings = await Booking.find({user: req.userId});
        return bookings.map(booking => {
            return transformBooking(booking);
        });
    },

    // mutations

    bookEvent: async (args,req) => {
        if(!req.isAuth) throw new Error("You must be logged in to create a new event"); 

        // const eventId = new ObjectId(args.eventId);
        const fetchedEvent = await Event.findOne({ _id: args.eventId });
        const booking = await Booking({
            event: fetchedEvent,
            user: req.userId,
        })
        const result = await booking.save();
        return transformBooking(result);
    },
    cancelEvent: async (args, req) => {
        if(!req.isAuth) throw new Error("You must be logged in to create a new event"); 

        try {
            // first fetching the booking
            const booking = await Booking.findById(args.bookingId).populate('event');
            // extracting the event from the booking

            const event = transformEvent(booking.event);

            // deleting the booking
            await Booking.deleteOne({ _id: args.bookingId });
            return event;

        } catch (error) {
            throw new Error(error.message);
        }
    }
};