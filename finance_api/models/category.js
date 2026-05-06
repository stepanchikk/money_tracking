const mongoose = require('mongoose');
const { Schema } = mongoose;

const categorySchema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: 'User', default: null },
    name: { type: String, required: true, trim: true, maxlength: 100 },
    type: { type: String, enum: ['income', 'expense'], required: true },
    icon: { type: String, trim: true, maxlength: 50 }
}, { timestamps: true });

module.exports = mongoose.model('Category', categorySchema);