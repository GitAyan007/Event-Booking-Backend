const Event = require('../../models/event.js');
const User = require('../../models/user.js')
const { dateTransform } = require('../../helpers/date.js');
const DataLoader = require('dataloader');

// using dataloader to reduce the server calls--------->

// // one for event
// const eventLoader = new DataLoader((eventIds) => {
//     return events(eventIds);
// });

// // for user
// const userLoader = new DataLoader((userIds) => {
//     // console.log(userIds);
//     return User.find({ _id: { $in: userIds } });
// });



// dynamically populating
const events = async (eventId) => {
    try {
        const events = await Event.find({ _id: { $in: eventId } })
        return events.map(event => {
            return transformEvent(event);
        });
    } catch (error) {
        throw new Error(error.message);
    }

}

// dynamically populating
const singleEvent = async (eventId) => {
    try {
        const event = await Event.findById(eventId);
        return transformEvent(event);
    } catch (error) {
        throw new Error(error.message);
    }
}


// dynamically populating 
const user = (userId) => {
    return User.findById(userId)
        .then(user => {
            return {
                ...user._doc,
                _id: user._id,
                // sending the event _id from the user schema to the event function
                createdEvents: events.bind(this, user._doc.createdEvents)
            }
        })
        .catch(err => {
            throw err;
        })
}




// for reusing -------------->
const transformEvent = (event) => {
    return {
        ...event._doc,
        _id: event._id,
        date: dateTransform(event._doc.date),
        // sending the creator _id from event schema in the user function
        creator: user.bind(this, event._doc.creator),
    }
}

// for reusing
const transformBooking = (booking) => {
    return {
        ...booking._doc,
        _id: booking._id,
        // populating event and user
        event: singleEvent.bind(this, booking._doc.event),
        user: user.bind(this, booking._doc.user),
        // formatting
        createdAt: dateTransform(booking._doc.createdAt),
        updatedAt: dateTransform(booking._doc.updatedAt)
    }
}


exports.transformBooking = transformBooking;
exports.transformEvent = transformEvent;

// exports.user = user;
// exports.singleEvent = singleEvent;
// exports.events = events;