import mongoose from 'mongoose';

// Define the schema for a product
const productSchema = new mongoose.Schema({
  url: { 
    type: String, 
    required: true, 
    unique: true,
    index: true // Index for fast lookups
  },
  currency: { 
    type: String, 
    required: true 
  },
  image: { 
    type: String, 
    required: true 
  },
  title: { 
    type: String, 
    required: true 
  },
  currentPrice: { 
    type: Number, 
    required: true 
  },
  originalPrice: { 
    type: Number, 
    required: true 
  },
  priceHistory: [
    { 
      price: { 
        type: Number, 
        required: true 
      },
      date: { 
        type: Date, 
        default: Date.now 
      }
    },
  ],
  lowestPrice: { 
    type: Number,
    default: null // Default value to null
  },
  highestPrice: { 
    type: Number,
    default: null // Default value to null
  },
  averagePrice: { 
    type: Number,
    default: null // Default value to null
  },
  discountRate: { 
    type: Number,
    default: null // Default value to null
  },
  description: { 
    type: String,
    default: '' // Default empty string
  },
  category: { 
    type: String,
    default: '' // Default empty string
  },
  reviewsCount: { 
    type: Number,
    default: 0 // Default to 0
  },
  isOutOfStock: { 
    type: Boolean, 
    default: false 
  },
  users: [
    {
      email: { 
        type: String, 
        required: true,
        match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ // Basic email validation
      }
    }
  ],
}, { 
  timestamps: true 
});

// Create the model if it does not already exist
const Product = mongoose.models.Product || mongoose.model('Product', productSchema);

export default Product;
