const { db } = require('./config/firebaseSetup');

const categoriesData = [
  {
    category: "Burger",
    cuisine: "Burger, Fast Food",
    image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=600&q=80",
    restaurants: [
      "Burger King", "The Burger Club", "Big Bite Burgers", "Grill & Thrill", 
      "Patty Junction", "Bun & Beyond", "Smash House", "Urban Burger Co."
    ],
    foods: [
      "Classic Veg Burger", "Double Cheese Blast Burger", "Crispy Chicken Burger", 
      "Paneer Tikka Burger", "Peri Peri Chicken Burger", "BBQ Bacon Burger", 
      "Aloo Tikki Burger", "Loaded Monster Burger"
    ]
  },
  {
    category: "Pizza",
    cuisine: "Pizza, Italian",
    image: "https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?auto=format&fit=crop&w=600&q=80",
    restaurants: [
      "Pizza Hut", "Domino’s Pizza", "La Pino’z Pizza", "Oven Story", 
      "Mojo Pizza", "Slice Square", "Crust & Craft", "FireStone Pizzeria"
    ],
    foods: [
      "Margherita Pizza", "Farmhouse Pizza", "Pepperoni Pizza", "Cheese Burst Pizza", 
      "Paneer Makhani Pizza", "BBQ Chicken Pizza", "Veggie Supreme", "Mexican Green Wave"
    ]
  },
  {
    category: "Healthy",
    cuisine: "Healthy, Salad",
    image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=600&q=80",
    restaurants: [
      "Eat Fit", "Healthify Meals", "Green Bowl", "Fit Feast", 
      "NutriBox", "Salad Studio", "Freshly Yours", "Clean Bites"
    ],
    foods: [
      "Quinoa Salad", "Grilled Chicken Salad", "Paneer Protein Bowl", "Avocado Toast", 
      "Veg Detox Bowl", "Fruit Salad Mix", "Smoothie Bowl", "Oats & Nuts Bowl"
    ]
  },
  {
    category: "Asian",
    cuisine: "Asian, Chinese, Japanese",
    image: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?auto=format&fit=crop&w=600&q=80",
    restaurants: [
      "Wok Express", "Chinese Wok", "Asia Kitchen", "Tokyo Bites", 
      "Noodle Bar", "Dragon Bowl", "Zen Asian", "Chopstick City"
    ],
    foods: [
      "Hakka Noodles", "Schezwan Fried Rice", "Chicken Manchurian", "Veg Spring Rolls", 
      "Sushi Rolls", "Ramen Bowl", "Thai Green Curry", "Chilli Paneer"
    ]
  },
  {
    category: "Dessert",
    cuisine: "Dessert, Sweets",
    image: "https://images.unsplash.com/photo-1551024601-bec78aea704b?auto=format&fit=crop&w=600&q=80",
    restaurants: [
      "The Dessert Heaven", "Sweet Truth", "Frozen Hub", "Creamy Delights", 
      "Sugar Rush", "Dessertino", "Cake Studio", "Choco Bliss"
    ],
    foods: [
      "Chocolate Lava Cake", "Red Velvet Cupcake", "Donuts Box", "Ice Cream Sundae", 
      "Brownie Fudge", "Cheesecake Slice", "Gulab Jamun", "Waffles with Chocolate"
    ]
  },
  {
    category: "Drinks",
    cuisine: "Beverages, Shakes",
    image: "https://images.unsplash.com/photo-1544145945-f90425340c7e?auto=format&fit=crop&w=600&q=80",
    restaurants: [
      "Cool Sip", "Juice Junction", "Shake Factory", "Brew Bros", 
      "Drinkify", "Sip & Chill", "The Beverage Bar", "Liquid Lounge"
    ],
    foods: [
      "Cold Coffee", "Chocolate Milkshake", "Mango Smoothie", "Oreo Shake", 
      "Bubble Tea", "Fresh Orange Juice", "Mojito", "Iced Latte"
    ]
  }
];

async function seedDatabase() {
  if (!db) {
    console.error("Database not strictly initialized. Check serviceAccountKey.json.");
    process.exit(1);
  }

  console.log("Starting Firebase seeding process...");

  try {
    for (const cat of categoriesData) {
      console.log(`Seeding category: ${cat.category}...`);
      
      const restIds = [];
      // 1. Create restaurants
      for (const restName of cat.restaurants) {
        const restDoc = await db.collection('restaurants').add({
          name: restName,
          cuisine: cat.cuisine,
          rating: (Math.random() * (5.0 - 4.0) + 4.0).toFixed(1), // Random rating between 4.0 and 5.0
          deliveryTime: "20-40",
          costForTwo: Math.floor(Math.random() * 500) + 200,
          isOpen: true,
          image: cat.image
        });
        restIds.push(restDoc.id);
      }

      // 2. Create food items evenly distributed across the 8 restaurants
      for (let i = 0; i < cat.foods.length; i++) {
        const foodName = cat.foods[i];
        const assignedRestId = restIds[i % restIds.length];
        const isVeg = !foodName.toLowerCase().includes('chicken') && !foodName.toLowerCase().includes('bacon') && !foodName.toLowerCase().includes('tuna') && !foodName.toLowerCase().includes('pepperoni');

        await db.collection('food_items').add({
          name: foodName,
          price: Math.floor(Math.random() * 300) + 100, // random price
          isVeg: isVeg,
          description: `Delicious ${foodName} prepared fresh to order.`,
          image: cat.image,
          restaurantId: assignedRestId
        });
      }
    }
    
    console.log("✅ Seed completed successfully! Restaurants and Foods injected.");
    process.exit(0);
  } catch (error) {
    console.error("Failed to seed:", error);
    process.exit(1);
  }
}

seedDatabase();
