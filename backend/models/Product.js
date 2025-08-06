import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
  {
    user: String,
    rating: { type: Number, min: 1, max: 5 },
    comment: String,
  },
  { _id: false }
);

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    brand: String,
    price: Number,
    image: String,
    countInStock: Number,
    colors: [String],
    onSale: Boolean,
    salePercent: Number,
    category: String,
    description: String,
    reviews: [reviewSchema],
  },
  { timestamps: true }
);

export default mongoose.model("Product", productSchema);
