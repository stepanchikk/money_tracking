const mongoose = require('mongoose');
const { Schema } = mongoose;

const accountSchema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true, trim: true, maxlength: 50 },
    balance: { type: Schema.Types.Decimal128, default: 0.00 },
    currency: { type: String, default: 'UAH', uppercase: true, maxlength: 3 }
}, { timestamps: true });

module.exports = mongoose.model('Account', accountSchema);