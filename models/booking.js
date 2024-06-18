const { Schema, Types, model, models} = require('mongoose');

const bookingSchema = new Schema({
    event:{
        type: Types.ObjectId,
        ref: "Event"
    },
    user:{
        type: Types.ObjectId,
        ref: "User"
    }
},
{
    timestamps: true,
});

module.exports = models.Booking || model("Booking", bookingSchema);