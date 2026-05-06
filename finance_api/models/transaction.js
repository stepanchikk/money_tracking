const mongoose = require('mongoose');
const { Schema } = mongoose;

const transactionSchema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    account: { type: Schema.Types.ObjectId, ref: 'Account', required: true },

    toAccount: { type: Schema.Types.ObjectId, ref: 'Account', default: null },
    category: { type: Schema.Types.ObjectId, ref: 'Category', default: null },

    type: { type: String, enum: ['income', 'expense', 'transfer'], required: true },
    amount: { type: Schema.Types.Decimal128, required: true },
    date: { type: Date, default: Date.now, index: true },
    description: { type: String, trim: true, maxlength: 255 },

    tags: [{ type: Schema.Types.ObjectId, ref: 'Tag' }]
}, { timestamps: true });

module.exports = mongoose.model('Transaction', transactionSchema);