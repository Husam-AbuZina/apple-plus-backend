import { z } from 'zod';
import Product from '../models/Product.js';
import AppError from '../utils/AppError.js';
import asyncHandler from '../utils/asyncHandler.js';
import { makeSlug } from '../utils/slug.js';

const categories = ['MacBooks', 'iPads', 'iPhones', 'Accessories'];
const productFields = z.object({
  name: z.string().trim().min(2).max(160), slug: z.string().trim().max(180).optional(), category: z.enum(categories),
  description: z.string().trim().max(5000).optional(), specifications: z.string().trim().max(1200).optional(),
  condition: z.string().trim().max(100).optional(), warranty: z.string().trim().max(200).optional(),
  price: z.coerce.number().min(0), salePrice: z.coerce.number().min(0).nullable().optional(), stock: z.coerce.number().int().min(0),
  tag: z.string().trim().max(80).optional(), isPublished: z.coerce.boolean().optional(),
  images: z.array(z.object({ url: z.string().min(1), alt: z.string().max(180).optional() })).max(6).optional()
});
const productSchema = productFields.refine((data) => data.salePrice === null || data.salePrice === undefined || data.salePrice <= data.price, { message: 'Sale price cannot exceed price', path: ['salePrice'] });
const updateProductSchema = productFields.partial().refine((data) => data.salePrice === null || data.salePrice === undefined || data.price === undefined || data.salePrice <= data.price, { message: 'Sale price cannot exceed price', path: ['salePrice'] });

function queryFor(req) { return req.user ? {} : { isPublished: true }; }

export const listProducts = asyncHandler(async (req, res) => {
  const page = Math.max(Number(req.query.page) || 1, 1); const limit = Math.min(Math.max(Number(req.query.limit) || 20, 1), 100);
  const filter = queryFor(req);
  if (categories.includes(req.query.category)) filter.category = req.query.category;
  if (req.query.q?.trim()) filter.$text = { $search: req.query.q.trim() };
  const [products, total] = await Promise.all([Product.find(filter).sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit), Product.countDocuments(filter)]);
  res.json({ products, pagination: { page, limit, total, pages: Math.ceil(total / limit) } });
});

export const getProduct = asyncHandler(async (req, res) => {
  const filter = { _id: req.params.id, ...queryFor(req) }; const product = await Product.findOne(filter);
  if (!product) throw new AppError('Product not found', 404); res.json({ product });
});

async function uniqueSlug(input, exceptId) {
  const base = makeSlug(input) || 'product'; let slug = base; let count = 2;
  while (await Product.exists({ slug, ...(exceptId ? { _id: { $ne: exceptId } } : {}) })) slug = `${base}-${count++}`;
  return slug;
}

export const createProduct = asyncHandler(async (req, res) => {
  const data = productSchema.parse(req.body); data.slug = await uniqueSlug(data.slug || data.name);
  const product = await Product.create(data); res.status(201).json({ product });
});

export const updateProduct = asyncHandler(async (req, res) => {
  const data = updateProductSchema.parse(req.body); const product = await Product.findById(req.params.id);
  if (!product) throw new AppError('Product not found', 404);
  if (data.slug || data.name) data.slug = await uniqueSlug(data.slug || data.name, product.id);
  Object.assign(product, data); await product.save(); res.json({ product });
});

export const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findByIdAndDelete(req.params.id); if (!product) throw new AppError('Product not found', 404);
  res.status(204).send();
});

export const uploadImages = asyncHandler(async (req, res) => {
  const files = req.files || []; if (!files.length) throw new AppError('Provide at least one image', 400);
  const baseUrl = `${req.protocol}://${req.get('host')}`;
  res.status(201).json({ images: files.map((file) => ({ url: `${baseUrl}/uploads/${file.filename}`, alt: file.originalname })) });
});
