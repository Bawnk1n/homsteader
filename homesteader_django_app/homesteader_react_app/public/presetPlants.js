const gardenPlants = [
  { name: 'Tomatoes', description: 'Easy to grow and versatile in recipes.', category: 'Vegetables' },
  { name: 'Cucumbers', description: 'Great for salads and pickling.', category: 'Vegetables' },
  { name: 'Lettuce', description: 'A staple for salads, quick to grow.', category: 'Vegetables' },
  { name: 'Bell Peppers', description: 'Sweet and colorful, good for many dishes.', category: 'Vegetables' },
  { name: 'Carrots', description: 'Root vegetable, easy to store.', category: 'Vegetables' },
  { name: 'Basil', description: 'Aromatic and versatile for cooking.', category: 'Herbs' },
  { name: 'Mint', description: 'Spreads quickly, great in drinks and salads.', category: 'Herbs' },
  { name: 'Parsley', description: 'Commonly used as a garnish or in soups.', category: 'Herbs' },
  { name: 'Chives', description: 'Onion-flavored, good in salads and as a garnish.', category: 'Herbs' },
  { name: 'Rosemary', description: 'Woody herb, excellent for meats and bread.', category: 'Herbs' },
  { name: 'Strawberries', description: 'Sweet and easy to grow in containers.', category: 'Fruits' },
  { name: 'Blueberries', description: 'Require acidic soil but are very rewarding.', category: 'Fruits' },
  { name: 'Raspberries', description: 'Prolific and require some trellising.', category: 'Fruits' },
  { name: 'Lemons/Limes', description: 'If climate allows, great for cooking and drinks.', category: 'Fruits' },
  { name: 'Marigolds', description: 'Repel pests and are low maintenance.', category: 'Flowers' },
  { name: 'Lavender', description: 'Aromatic and beautiful, attracts pollinators.', category: 'Flowers' },
  { name: 'Sunflowers', description: 'Tall and bright, seeds are edible.', category: 'Flowers' },
  { name: 'Petunias', description: 'Colorful and easy to care for.', category: 'Flowers' },
  { name: 'Aloe Vera', description: 'Useful for skin ailments, easy to care for.', category: 'Others' },
  { name: 'Green Beans', description: 'Easy to grow and good yields.', category: 'Vegetables' }
];


const gardenSupplies = [
  { name: 'Gloves', description: 'To protect your hands while working.', category: 'Basic Tools' },
  { name: 'Hand Trowel', description: 'For digging small holes and planting.', category: 'Basic Tools' },
  { name: 'Spade', description: 'Larger than a trowel and good for breaking soil.', category: 'Basic Tools' },
  { name: 'Pruning Shears', description: 'For cutting back plants and harvesting.', category: 'Basic Tools' },
  { name: 'Hoe', description: 'For weeding and breaking up soil.', category: 'Basic Tools' },
  { name: 'Compost Bin', description: 'For making your own soil enricher.', category: 'Soil & Fertilizers' },
  { name: 'Fertilizer', description: 'Organic or synthetic, tailored to your plants\' needs.', category: 'Soil & Fertilizers' },
  { name: 'Soil Test Kit', description: 'To check pH and nutrient levels.', category: 'Soil & Fertilizers' },
  { name: 'Watering Can', description: 'For precise watering.', category: 'Watering Supplies' },
  { name: 'Garden Hose', description: 'With adjustable nozzle for different watering needs.', category: 'Watering Supplies' },
  { name: 'Drip Irrigation System', description: 'For automated, efficient watering.', category: 'Watering Supplies' },
  { name: 'Seeds or Seedlings', description: 'Choose based on what you want to grow.', category: 'Planting Supplies' },
  { name: 'Planters/Pots', description: 'If you\'re not planting directly in the ground.', category: 'Planting Supplies' },
  { name: 'Stakes and Trellises', description: 'For plants that need support as they grow.', category: 'Planting Supplies' },
  { name: 'Insecticide', description: 'Natural or chemical.', category: 'Pest Control' },
  { name: 'Mulch', description: 'Helps retain moisture and deter weeds.', category: 'Pest Control' },
  { name: 'Measuring Tape', description: 'For proper spacing between plants.', category: 'Measuring Tools' },
  { name: 'Thermometer', description: 'To monitor soil temperature.', category: 'Measuring Tools' },
  { name: 'Garden Cart', description: 'For moving soil, compost, and tools.', category: 'Storage and Maintenance' },
  { name: 'Tool Organizer', description: 'To keep all your tools in one place.', category: 'Storage and Maintenance' }
];

const commonClimates = [
  { title: 'Tropical', description: 'Hot and humid year-round, often with a wet and dry season.' },
  { title: 'Subtropical', description: 'Hot summers and mild winters, often humid.' },
  { title: 'Desert', description: 'Hot and dry, cold nights, very little precipitation.' },
  { title: 'Mediterranean', description: 'Hot, dry summers and mild, wet winters.' },
  { title: 'Oceanic / Maritime', description: 'Moderate temperatures year-round, frequent rainfall.' },
  { title: 'Continental', description: 'Hot summers and cold winters, can have high variations in temperature.' },
  { title: 'Subarctic', description: 'Short summers and long, extremely cold winters.' },
  { title: 'Polar / Arctic', description: 'Cold year-round, extremely harsh winters.' },
  { title: 'Highland / Mountainous', description: 'Varies with altitude, often cooler than surrounding lowlands.' },
  { title: 'Temperate', description: 'Four distinct seasons with moderate temperature variations.' }
];
