const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const schema = mongoose.Schema;
// Schema Definition
//TODO: Assignment: Add Validate rule for email to be unique

const AssociationSchema = mongoose.Schema({
    founder: {
        type: schema.Types.ObjectId,
        ref: 'User'
    },
    name: {
        type: String,
    },
    email: {
        type: String
    },
    description: {
        type: String,
    },
    logo: {
        type: String,
    },
    members: [{
        member: {
            type: schema.Types.ObjectId,
            ref: 'User'
        },

        status: {
            type: String,
            enum: ['pending', 'accepted', 'rejected','blocked'],
            default: 'pending',
            required: false
        },
        createdAt: {
            type: Date,
            default: Date.now
        },
    }],
    events: [{
        type: schema.Types.ObjectId,
        ref: 'Event'
    }],

    articles: [{
        article: {
            type: schema.Types.ObjectId,
            ref: 'Article'
        },

    }],
    status: {
        type: String,
        enum: ["pending", "active","suspended"],
        default: 'pending'
    },
});



const Association = mongoose.model("Association", AssociationSchema);

module.exports = Association;