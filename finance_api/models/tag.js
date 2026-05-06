const mongoose = require('mongoose');
const { Schema } = mongoose;

const tagSchema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true, trim: true, maxlength: 50 }
}, { timestamps: true });

module.exports = mongoose.model('Tag', tagSchema);