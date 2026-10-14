import { RecipeSuggestion } from '../types';

// Curated recipes mapped by key ingredients for instant responsiveness
const CURATED_RECIPES: Record<string, RecipeSuggestion[]> = {
  milk: [
    {
      title: 'Golden Fluffy Pancakes',
      description: 'Quick breakfast classic that uses 1 full cup of milk. Saves fresh or slightly souring milk from going to waste.',
      prepTime: '15 mins',
      usedExpiringIngredient: 'Fresh Milk',
      otherIngredients: ['1 cup Flour', '1 Egg', '2 tbsp Sugar', '1 tsp Baking Powder', 'Butter'],
      steps: [
        'Whisk milk, egg, and melted butter in a medium bowl.',
        'Fold in flour, sugar, and baking powder until barely mixed (lumps are fine).',
        'Pour 1/4 cup batter onto a hot greased griddle. Flip when bubbles pop and edges set.',
        'Serve warm with maple syrup, honey, or sliced fruits.'
      ],
      difficulty: 'Easy',
    },
    {
      title: 'Creamy Garlic White Pasta Sauce',
      description: 'A comforting stovetop pasta sauce made with milk, garlic, butter, and cheese instead of heavy cream.',
      prepTime: '20 mins',
      usedExpiringIngredient: 'Fresh Milk',
      otherIngredients: ['Pasta (Penne or Fettuccine)', '2 tbsp Butter', '2 cloves Garlic', '1 tbsp Flour', 'Parmesan or Cheddar cheese'],
      steps: [
        'Boil pasta in salted water until al dente.',
        'Melt butter in a skillet, sauté minced garlic for 1 min until fragrant.',
        'Whisk in 1 tbsp flour, cook 1 min, then gradually pour in cold milk while whisking to avoid clumps.',
        'Simmer until thickened, stir in grated cheese, toss with pasta, and season with black pepper.'
      ],
      difficulty: 'Easy',
    },
    {
      title: 'Frosted Banana & Honey Milkshake',
      description: 'A refreshing blender drink that pairs expiring milk with ripe bananas to stop two waste streams at once.',
      prepTime: '5 mins',
      usedExpiringIngredient: 'Fresh Milk',
      otherIngredients: ['1 Ripe Banana', '1 tbsp Honey', 'Ice cubes', 'Pinch of Cinnamon (optional)'],
      steps: [
        'Slice ripe banana and add to blender.',
        'Pour in 1.5 cups cold milk, add honey, and a handful of ice cubes.',
        'Blend on high for 45 seconds until thick and frothy.',
        'Pour into tall glasses and dust with cinnamon.'
      ],
      difficulty: 'Easy',
    }
  ],
  bread: [
    {
      title: 'Cinnamon French Toast',
      description: 'The ultimate recipe for stale or near-expiry bread. The drier the bread, the better it absorbs the custard without getting soggy.',
      prepTime: '12 mins',
      usedExpiringIngredient: 'White or Wholemeal Bread',
      otherIngredients: ['2 Eggs', '1/3 cup Milk', '1/2 tsp Cinnamon', '1 tbsp Sugar', 'Butter'],
      steps: [
        'Whisk eggs, milk, cinnamon, and sugar in a shallow dish.',
        'Dip bread slices for 10-15 seconds per side until soaked.',
        'Cook on a buttered medium-hot skillet for 2-3 mins per side until golden brown.',
        'Dust with powdered sugar or drizzle with honey.'
      ],
      difficulty: 'Easy',
    },
    {
      title: 'Garlic Herb Bread Croutons',
      description: 'Crunchy homemade croutons that keep for 3 weeks in an airtight jar. Perfect for soups and salads.',
      prepTime: '18 mins',
      usedExpiringIngredient: 'Sliced Bread',
      otherIngredients: ['2 tbsp Olive Oil', '1/2 tsp Garlic Powder', '1/2 tsp Italian Dried Herbs', 'Pinch of Salt'],
      steps: [
        'Cut bread slices into 1.5 cm cubes.',
        'Toss with olive oil, garlic powder, salt, and dried herbs in a bowl.',
        'Spread on a baking sheet and bake at 180°C (350°F) for 10-12 mins until crisp and golden.',
        'Cool completely before storing or serving atop tomato soup.'
      ],
      difficulty: 'Easy',
    },
    {
      title: 'Savory Bread Pudding (Strata)',
      description: 'A hearty breakfast bake using cubed bread, leftover eggs, and any diced deli meat or cheese.',
      prepTime: '35 mins',
      usedExpiringIngredient: 'Bread Loaf',
      otherIngredients: ['3 Eggs', '1 cup Milk', '1/2 cup Shredded Cheese', 'Diced Onions or Herbs'],
      steps: [
        'Cube 4-5 slices of bread and place in a greased baking dish.',
        'Beat eggs with milk, salt, pepper, and cheese.',
        'Pour egg mixture evenly over bread, pressing down to submerge.',
        'Bake at 175°C (350°F) for 25-30 mins until puffed and golden.'
      ],
      difficulty: 'Medium',
    }
  ],
  banana: [
    {
      title: 'One-Bowl Moist Banana Bread',
      description: 'Uses brown, overripe bananas. Deeply sweet, fragrant, and stays moist for days.',
      prepTime: '45 mins',
      usedExpiringIngredient: 'Ripe Bananas',
      otherIngredients: ['1/3 cup Melted Butter', '1/2 cup Sugar', '1 Egg', '1 tsp Vanilla', '1 tsp Baking Soda', '1.5 cups Flour'],
      steps: [
        'Mash 3 ripe bananas in a bowl with a fork until smooth.',
        'Stir in melted butter, sugar, beaten egg, and vanilla.',
        'Sprinkle baking soda and salt, then gently stir in flour until just combined.',
        'Pour into a greased loaf pan and bake at 175°C (350°F) for 45-50 mins.'
      ],
      difficulty: 'Easy',
    },
    {
      title: '2-Ingredient Healthy Banana Pancakes',
      description: 'Grain-free, flourless pancakes made solely from mashed banana and eggs. High protein and delicious.',
      prepTime: '10 mins',
      usedExpiringIngredient: 'Ripe Banana',
      otherIngredients: ['2 Eggs', 'Pinch of Salt', 'Dash of Cinnamon'],
      steps: [
        'Mash 1 large banana thoroughly with a fork.',
        'Whisk in 2 eggs until smooth and bubbly.',
        'Spoon small 3-inch pancakes onto a non-stick greased pan over medium-low heat.',
        'Cook gently for 2 mins, carefully flip, and cook 1 more minute.'
      ],
      difficulty: 'Easy',
    }
  ],
  spinach: [
    {
      title: 'Quick Garlic Butter Sauteed Greens',
      description: 'Shrinks down an entire tub of wilting spinach in just 4 minutes into a rich, nutrient-packed side dish.',
      prepTime: '6 mins',
      usedExpiringIngredient: 'Baby Spinach',
      otherIngredients: ['1 tbsp Butter or Olive Oil', '2 cloves sliced Garlic', 'Pinch of Chili Flakes', 'Lemon juice'],
      steps: [
        'Heat butter or oil in a wide skillet over medium heat.',
        'Add sliced garlic and sizzle for 30 seconds until aromatic.',
        'Add washed spinach in batches, turning with tongs until wilted.',
        'Season with salt, pepper, and a squeeze of fresh lemon juice.'
      ],
      difficulty: 'Easy',
    },
    {
      title: 'Green Immunity Smoothie Boost',
      description: 'Blends 2 big handfuls of spinach with fruit so you cannot even taste the greens.',
      prepTime: '5 mins',
      usedExpiringIngredient: 'Fresh Spinach',
      otherIngredients: ['1 Apple or Banana', '1/2 cup Milk or Water', '1 tsp Honey', 'Ice cubes'],
      steps: [
        'Pack fresh spinach leaves into the bottom of a blender pitcher.',
        'Top with fruit, liquid, and ice.',
        'Blend on high speed until completely vibrant and silky smooth.'
      ],
      difficulty: 'Easy',
    }
  ],
  egg: [
    {
      title: 'Loaded Veggie & Cheese Frittata',
      description: 'An Italian crustless quiche that takes 4 to 6 eggs and clears out any expiring veggies from your crisper drawer.',
      prepTime: '20 mins',
      usedExpiringIngredient: 'Eggs',
      otherIngredients: ['1/4 cup Milk', 'Diced Tomatoes or Spinach', 'Shredded Cheese', 'Salt & Pepper'],
      steps: [
        'Beat 4-6 eggs with milk, salt, and pepper in a bowl.',
        'Sauté vegetables in an oven-safe skillet until tender.',
        'Pour beaten eggs over veggies and top with cheese.',
        'Cook on low for 4 mins until edges set, then broil in oven or cover with lid until cooked through.'
      ],
      difficulty: 'Easy',
    }
  ],
  default: [
    {
      title: 'Pantry Clean-Out Fried Rice',
      description: 'A versatile stir-fry designed to absorb leftover proteins, vegetables, and condiments in under 15 minutes.',
      prepTime: '15 mins',
      usedExpiringIngredient: 'Assorted Pantry Ingredients',
      otherIngredients: ['2 cups Cooked Rice (day-old preferred)', '2 Eggs', '2 tbsp Soy Sauce', '1 tbsp Sesame Oil', 'Garlic & Scallions'],
      steps: [
        'Heat 1 tbsp oil in a wok or large pan over high heat.',
        'Scramble eggs and set aside. Sauté garlic and your chopped expiring items for 2 mins.',
        'Add rice, breaking up lumps with spatula.',
        'Drizzle soy sauce and sesame oil around edge of pan. Toss everything together for 3 mins and fold in eggs.'
      ],
      difficulty: 'Easy',
    },
    {
      title: 'Rustic Vegetable & Broth Soup',
      description: 'Simmer expiring vegetables, meats, or grains into a comforting, restorative warm broth.',
      prepTime: '25 mins',
      usedExpiringIngredient: 'Pantry & Fridge Items',
      otherIngredients: ['3 cups Broth or Water', '1 Diced Onion', '1 Bay Leaf', 'Salt, Pepper, Dried Herbs'],
      steps: [
        'Sauté onions and garlic in a pot with olive oil.',
        'Chop and add your expiring items, stirring for 3 mins.',
        'Pour in broth, season with salt and herbs, and bring to a simmer for 15-20 mins until tender.',
        'Serve with crusty toast or crackers.'
      ],
      difficulty: 'Easy',
    }
  ]
};

export async function getRecipeSuggestions(itemName: string, category: string): Promise<RecipeSuggestion[]> {
  const lower = (itemName + ' ' + category).toLowerCase();

  if (lower.includes('milk') || lower.includes('dairy')) {
    return CURATED_RECIPES.milk;
  }
  if (lower.includes('bread') || lower.includes('toast') || lower.includes('bakery')) {
    return CURATED_RECIPES.bread;
  }
  if (lower.includes('banana')) {
    return CURATED_RECIPES.banana;
  }
  if (lower.includes('spinach') || lower.includes('lettuce') || lower.includes('kale') || lower.includes('leaf')) {
    return CURATED_RECIPES.spinach;
  }
  if (lower.includes('egg')) {
    return CURATED_RECIPES.egg;
  }

  // Customize default recipes with the item name
  return CURATED_RECIPES.default.map(recipe => ({
    ...recipe,
    usedExpiringIngredient: itemName,
    description: `Quick and delicious way to use your expiring ${itemName} and avoid unnecessary food waste.`
  }));
}
