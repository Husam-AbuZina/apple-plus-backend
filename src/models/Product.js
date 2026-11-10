import mongoose from 'mongoose';

const imageSchema = new mongoose.Schema({
  url: { type: String, required: true },
  alt: { type: String, trim: true, maxlength: 180 }
}, { _id: false });

const productSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true, maxlength: 160 },
  slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
  category: { type: String, required: true, enum: ['MacBooks', 'iPads', 'iPhones', 'Accessories'] },
  description: { type: String, trim: true, maxlength: 5000, default: '' },
  specifications: { type: String, trim: true, maxlength: 1200, default: '' },
  condition: { type: String, trim: true, maxlength: 100, default: '' },
  warranty: { type: String, trim: true, maxlength: 200, default: '' },
  price: { type: Number, required: true, min: 0 },
  salePrice: { type: Number, min: 0, default: null },
  currency: { type: String, enum: ['ILS'], default: 'ILS' },
  stock: { type: Number, required: true, min: 0, default: 0 },
  tag: { type: String, trim: true, maxlength: 80, default: '' },
  images: { type: [imageSchema], default: [] },
  isPublished: { type: Boolean, default: true }
}, { timestamps: true });

productSchema.index({ category: 1, isPublished: 1, createdAt: -1 });
productSchema.index({ name: 'text', specifications: 'text', description: 'text' });

export default mongoose.model('Product', productSchema);
