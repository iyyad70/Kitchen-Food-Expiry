import { BarcodeProductData, PantryItem } from '../types';

// Curated catalog of well-known items for instant offline demo or fallback
const KNOWN_BARCODES: Record<string, BarcodeProductData> = {
  '9556185000433': {
    barcode: '9556185000433',
    productName: 'Dutch Lady PureFarm Fresh Milk 1L',
    brand: 'Dutch Lady',
    category: 'Dairy',
    imageUrl: 'https://images.openfoodfacts.org/images/products/955/618/500/0433/front_en.12.400.jpg',
    quantityStr: '1 Litre',
    nutriscore: 'B',
    storageSuggestion: 'Keep refrigerated below 4°C. Consume within 3 days after opening.',
    estimatedPrice: 7.50,
  },
  '9556172000085': {
    barcode: '9556172000085',
    productName: 'Gardenia Original Classic Enriched White Bread',
    brand: 'Gardenia',
    category: 'Bakery',
    imageUrl: 'https://images.openfoodfacts.org/images/products/955/617/200/0085/front_en.4.400.jpg',
    quantityStr: '400g',
    nutriscore: 'C',
    storageSuggestion: 'Store in a cool dry place. Freeze slices if not consuming within 3 days.',
    estimatedPrice: 3.20,
  },
  '9556358000104': {
    barcode: '9556358000104',
    productName: 'Farm Fresh Pasteurized Pure Fresh Milk',
    brand: 'Farm Fresh',
    category: 'Dairy',
    imageUrl: 'https://images.openfoodfacts.org/images/products/955/635/800/0104/front_en.10.400.jpg',
    quantityStr: '1L',
    nutriscore: 'A',
    storageSuggestion: 'Keep refrigerated between 2°C and 4°C.',
    estimatedPrice: 8.90,
  },
  '5449000000996': {
    barcode: '5449000000996',
    productName: 'Coca-Cola Original Taste',
    brand: 'Coca-Cola',
    category: 'Beverages',
    imageUrl: 'https://images.openfoodfacts.org/images/products/544/900/000/0996/front_en.760.400.jpg',
    quantityStr: '330ml',
    nutriscore: 'E',
    storageSuggestion: 'Store in a cool, dry place away from direct sunlight.',
    estimatedPrice: 2.80,
  },
  '3017620422003': {
    barcode: '3017620422003',
    productName: 'Nutella Hazelnut Spread with Cocoa',
    brand: 'Ferrero / Nutella',
    category: 'Pantry & Grains',
    imageUrl: 'https://images.openfoodfacts.org/images/products/301/762/042/2003/front_en.616.400.jpg',
    quantityStr: '350g',
    nutriscore: 'E',
    storageSuggestion: 'Store at room temperature (18°C-24°C). Do not refrigerate.',
    estimatedPrice: 16.50,
  },
  '9556073100010': {
    barcode: '9556073100010',
    productName: 'Ayam Brand Tuna Chunks in Mineral Water',
    brand: 'Ayam Brand',
    category: 'Pantry & Grains',
    imageUrl: 'https://images.openfoodfacts.org/images/products/955/607/310/0010/front_en.7.400.jpg',
    quantityStr: '150g',
    nutriscore: 'A',
    storageSuggestion: 'After opening, transfer unused portion to a plastic or glass container and refrigerate.',
    estimatedPrice: 7.20,
  },
  '7622210449283': {
    barcode: '7622210449283',
    productName: 'Oreo Original Sandwich Cookies',
    brand: 'Oreo / Mondelez',
    category: 'Bakery',
    imageUrl: 'https://images.openfoodfacts.org/images/products/762/221/044/9283/front_en.214.400.jpg',
    quantityStr: '133g',
    nutriscore: 'D',
    storageSuggestion: 'Store in an airtight container once opened to prevent staleness.',
    estimatedPrice: 4.50,
  },
  '030000010204': {
    barcode: '030000010204',
    productName: 'Quaker Quick 1-Minute Rolled Oats',
    brand: 'Quaker',
    category: 'Pantry & Grains',
    imageUrl: 'https://images.openfoodfacts.org/images/products/003/000/001/0204/front_en.16.400.jpg',
    quantityStr: '800g',
    nutriscore: 'A',
    storageSuggestion: 'Store in a cool dry pantry. Use within 12 months.',
    estimatedPrice: 12.00,
  }
};

export const SAMPLE_BARCODES = [
  { code: '9556185000433', label: 'Dutch Lady Milk', category: 'Dairy' },
  { code: '9556172000085', label: 'Gardenia Bread', category: 'Bakery' },
  { code: '9556358000104', label: 'Farm Fresh Milk', category: 'Dairy' },
  { code: '3017620422003', label: 'Nutella Spread', category: 'Pantry' },
  { code: '9556073100010', label: 'Ayam Brand Tuna', category: 'Canned' },
  { code: '5449000000996', label: 'Coca-Cola', category: 'Beverages' },
];

/**
 * Maps raw Open Food Facts categories tags to our clean app categories
 */
function mapCategory(categoriesTags: string[] = [], productName = ''): PantryItem['category'] {
  const combined = (categoriesTags.join(' ') + ' ' + productName).toLowerCase();
  if (combined.includes('milk') || combined.includes('dairy') || combined.includes('cheese') || combined.includes('yogurt') || combined.includes('butter') || combined.includes('egg')) {
    return 'Dairy';
  }
  if (combined.includes('bread') || combined.includes('bakery') || combined.includes('cake') || combined.includes('cookie') || combined.includes('pastry') || combined.includes('biscuit')) {
    return 'Bakery';
  }
  if (combined.includes('meat') || combined.includes('chicken') || combined.includes('beef') || combined.includes('poultry') || combined.includes('sausage') || combined.includes('pork')) {
    return 'Meat & Poultry';
  }
  if (combined.includes('fruit') || combined.includes('vegetable') || combined.includes('salad') || combined.includes('produce') || combined.includes('apple') || combined.includes('banana')) {
    return 'Produce';
  }
  if (combined.includes('drink') || combined.includes('beverage') || combined.includes('soda') || combined.includes('juice') || combined.includes('water') || combined.includes('tea') || combined.includes('coffee')) {
    return 'Beverages';
  }
  if (combined.includes('frozen') || combined.includes('ice cream')) {
    return 'Frozen';
  }
  if (combined.includes('sauce') || combined.includes('condiment') || combined.includes('mayo') || combined.includes('ketchup') || combined.includes('dressing')) {
    return 'Condiments';
  }
  return 'Pantry & Grains';
}

/**
 * Fetch product data from Open Food Facts API with timeout and fallback
 */
export async function lookupBarcode(barcode: string): Promise<{ data: BarcodeProductData; fromApi: boolean; rawJson?: any }> {
  const cleaned = barcode.trim().replace(/\D/g, '');

  // 1. Try real Open Food Facts API v2
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 6000);

    const response = await fetch(`https://world.openfoodfacts.org/api/v2/product/${cleaned}.json`, {
      signal: controller.signal,
      headers: {
        'User-Agent': 'SmartPantryCapstoneApp - Web - Version 1.0 (Student Capstone Project)'
      }
    });
    clearTimeout(timeoutId);

    if (response.ok) {
      const json = await response.json();
      if (json.status === 1 && json.product) {
        const prod = json.product;
        const brand = prod.brands || (prod.brands_tags && prod.brands_tags[0]) || 'Generic';
        const name = prod.product_name || prod.product_name_en || `Item (${cleaned})`;
        const category = mapCategory(prod.categories_tags || [], name);
        const imageUrl = prod.image_front_url || prod.image_url || 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=400&auto=format&fit=crop&q=80';

        return {
          fromApi: true,
          rawJson: json,
          data: {
            barcode: cleaned,
            productName: name,
            brand: brand,
            category: category,
            imageUrl: imageUrl,
            quantityStr: prod.quantity || '1 unit',
            nutriscore: prod.nutriscore_grade?.toUpperCase() || 'N/A',
            storageSuggestion: prod.conservation_conditions || 'Store in accordance with package guidelines.',
            estimatedPrice: category === 'Meat & Poultry' ? 14.0 : category === 'Dairy' ? 7.5 : 5.0,
          }
        };
      }
    }
  } catch (err) {
    console.warn('Open Food Facts API call timed out or failed, falling back to local catalog:', err);
  }

  // 2. Check local curated catalog
  if (KNOWN_BARCODES[cleaned]) {
    return {
      data: KNOWN_BARCODES[cleaned],
      fromApi: false,
      rawJson: { status: 1, source: 'Local Curated Catalog', product: KNOWN_BARCODES[cleaned] }
    };
  }

  // 3. Fallback smart generic product based on barcode
  const sampleFallbackNames = [
    { name: 'Pure Farm Milk', brand: 'Dairy Farms', cat: 'Dairy' as const, price: 6.90 },
    { name: 'Toasted Sandwich Bread', brand: 'Daily Baker', cat: 'Bakery' as const, price: 3.50 },
    { name: 'Whole Rolled Oats', brand: 'Harvest Mills', cat: 'Pantry & Grains' as const, price: 8.50 },
    { name: 'Organic Fruit Juice', brand: 'Nature Orchard', cat: 'Beverages' as const, price: 5.20 },
  ];
  const hash = cleaned.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const picked = sampleFallbackNames[hash % sampleFallbackNames.length];

  return {
    fromApi: false,
    rawJson: { status: 0, status_verbose: 'product not found in live database, generated fallback' },
    data: {
      barcode: cleaned,
      productName: `${picked.name} (#${cleaned.slice(-4)})`,
      brand: picked.brand,
      category: picked.cat,
      imageUrl: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=400&auto=format&fit=crop&q=80',
      quantityStr: '1 pack',
      nutriscore: 'B',
      storageSuggestion: 'Store in a cool dry area or refrigerate according to product packaging.',
      estimatedPrice: picked.price,
    }
  };
}
