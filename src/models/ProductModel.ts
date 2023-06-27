import mongoose, { Document, Schema, Model } from 'mongoose';

export interface Product extends Document {
  _id: string;
  name: string;
  category: string;
  price: number;
}

const productSchema = new Schema<Product>({
  name: { type: String, required: true },
  category: { type: String, required: true },
  price: { type: Number, required: true },
});

const ProductModel: Model<Product> = mongoose.model<Product>('Product', productSchema);

export default ProductModel;
