const { Schema, model, Types } = require('mongoose');
const dateFormat = require('../utils/dateFormat');

// create the comment reply schema
const ReplySchema = new Schema({
    // set custom id to avoid confusion with parent comment _id
    replyId: {
        type: Schema.Types.ObjectId,
        default: () => new Types.ObjectId()
    },
    replyBody: {
        type: String
    },
    writtenBy: {
        type: String
    },
    createdAt: {
        type: Date,
        default: Date.now,
        get: createdAtVal => dateFormat(createdAtVal)
    }
}, {
    toJSON: {
        getters: true
    }
});

const CommentSchema = new Schema({
    writtenBy: {
        type: String
    },
    commentBody: {
        type: String
    },
    createdAt: {
        type: Date,
        default: Date.now,
        // add getters to all timestamp-related fields.
        get: createdAtVal => dateFormat(createdAtVal)
    },
    // use ReplySchema to validate data for a reply
    // associate replies with comments. 
    replies: [ReplySchema]
}, {
    toJSON: {
        virtuals: true,
        getters: true
    },
    id: false
});

//add a virtual for CommentSchema to get the total reply count.
CommentSchema.virtual('replyCount').get(function() {
    return this.replies.length;
});

// create the Pizza model using the PizzaSchema
const Comment = model('Comment', CommentSchema);

// export the Pizza model
module.exports = Comment;