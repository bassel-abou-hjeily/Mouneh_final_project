const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'products',
  },
  seller: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    },
    buyer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
  },
  quantity: {
    type: Number,
    required: true,
    default: 1,
  },
  totalPrice: {
    type: Number,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  phoneNumber: {
    type: String,
    required: true,
  },
  notes: {
    type: String,
    default: '',
  },
  status: {
    type: String,
    enum: ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled','Received'],
    default: 'Pending',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
},{timestamps:true});

module.exports = mongoose.model('Order', OrderSchema);
