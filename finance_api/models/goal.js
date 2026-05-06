const mongoose = require('mongoose');
const { Schema } = mongoose;

const goalSchema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true, trim: true, maxlength: 100 },
    targetAmount: { type: Schema.Types.Decimal128, required: true },
    deadline: { type: Date }
}, { timestamps: true });

module.exports = mongoose.model('Goal', goalSchema);