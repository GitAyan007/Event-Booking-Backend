const { Schema, Types, model, models} = require('mongoose');

const eventSchema = new Schema({
    title:{
        type:String,
        required:true,
    },
    description:{
        type:String,
        required:true,
    },
    price:{
        type: Number,
        required:true,
    },
    date:{
        type: Date,
        required:true,
    },
    creator:{
        type: Types.ObjectId,
        ref: 'User'
    }
});


module.exports = models.Event || model('Event',eventSchema);
