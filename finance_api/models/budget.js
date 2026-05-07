const mongoose = require('mongoose');
const { Schema } = mongoose;

const budgetSchema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    category: { type: Schema.Types.ObjectId, ref: 'Category', required: true },
    amountLimit: { type: Schema.Types.Decimal128, required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true }
}, { timestamps: true });

module.exports = mongoose.model('Budget', budgetSchema);