export interface PantryItem {
  id: string;
  barcode: string;
  productName: string;
  brand: string;
  category: 'Dairy' | 'Bakery' | 'Produce' | 'Meat & Poultry' | 'Pantry & Grains' | 'Beverages' | 'Frozen' | 'Condiments';
  quantity: number;
  unit: string;
  location: 'Fridge' | 'Freezer' | 'Pantry Shelf';
  purchaseDate: string;
  expiryDate: string;
  addedBy: string;
  householdId: string;
  status: 'active' | 'consumed' | 'wasted';
  imageUrl?: string;
  estimatedPrice: number; // in local currency (e.g. RM or $)
  consumedDate?: string;
  notes?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'household_head' | 'member';
  householdId: string;
  householdName: string;
  avatarColor: string;
}

export interface NotificationItem {
  id: string;
  userId: string;
  title: string;
  message: string;
  createdAt: string;
  type: 'urgent' | 'warning' | 'info';
  read: boolean;
  itemId?: string;
}

export interface RecipeSuggestion {
  title: string;
  description: string;
  prepTime: string;
  usedExpiringIngredient: string;
  otherIngredients: string[];
  steps: string[];
  difficulty: 'Easy' | 'Medium';
}

export interface BarcodeProductData {
  barcode: string;
  productName: string;
  brand: string;
  category: PantryItem['category'];
  imageUrl: string;
  quantityStr?: string;
  nutriscore?: string;
  storageSuggestion?: string;
  estimatedPrice?: number;
}
