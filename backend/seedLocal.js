const { db } = require('./config/firebaseSetup');
const fs = require('fs');
const path = require('path');

const categoriesData = [
  {
    category: "Burger", cuisine: "Burger, Fast Food",
    restaurants: [
      { name: "Burger King", img: "https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=600&q=80" },
      { name: "The Burger Club", img: "https://images.unsplash.com/photo-1550547660-d9450f859349?w=600&q=80" },
      { name: "Big Bite Burgers", img: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600&q=80" },
      { name: "Grill & Thrill", img: "https://images.unsplash.com/photo-1586816001966-79b736744398?w=600&q=80" },
      { name: "Patty Junction", img: "https://images.unsplash.com/photo-1594212691516-ac83a699c235?w=600&q=80" }
    ],
    foods: [
      { name: "Classic Veg Burger", img: "https://images.unsplash.com/photo-1550547660-d9450f859349?w=600&q=80" },
      { name: "Double Cheese Blast", img: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600&q=80" },
      { name: "Spicy Paneer Burger", img: "https://images.unsplash.com/photo-1581318691548-eb5efc68fd86?w=600&q=80" },
      { name: "Aloo Tikki Burger", img: "https://images.unsplash.com/photo-1520072959219-c595dc870360?w=600&q=80" },
      { name: "Mushroom Swiss Burger", img: "https://images.unsplash.com/photo-1586816001966-79b736744398?w=600&q=80" }
    ]
  },
  {
    category: "Pizza", cuisine: "Pizza, Italian",
    restaurants: [
      { name: "Pizza Hut", img: "https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?w=600&q=80" },
      { name: "Domino’s Pizza", img: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=600&q=80" },
      { name: "La Pino’z Pizza", img: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=600&q=80" },
      { name: "Oven Story", img: "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=600&q=80" },
      { name: "Mojo Pizza", img: "https://images.unsplash.com/photo-1590947132387-155cc02f3212?w=600&q=80" }
    ],
    foods: [
      { name: "Margherita Pizza", img: "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=600&q=80" },
      { name: "Farmhouse Pizza", img: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=600&q=80" },
      { name: "Cheese Burst Pizza", img: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=600&q=80" },
      { name: "Paneer Makhani Pizza", img: "https://images.unsplash.com/photo-1590947132387-155cc02f3212?w=600&q=80" },
      { name: "Veggie Supreme", img: "https://images.unsplash.com/photo-1571407970349-bc81e7e96d47?w=600&q=80" }
    ]
  },
  {
    category: "Gujrati", cuisine: "Gujrati, Thali",
    restaurants: [
      { name: "Rajdhani Thali", img: "https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=600&q=80" },
      { name: "Gopi Dining Hall", img: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&q=80" },
      { name: "Kansar Gujarati Thali", img: "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=600&q=80" },
      { name: "Sasumaa Thali", img: "https://images.unsplash.com/photo-1482049016688-2d3e1b311543?w=600&q=80" },
      { name: "Honest Restaurant", img: "https://images.unsplash.com/photo-1505253716362-afaea1d3d1af?w=600&q=80" }
    ],
    foods: [
      { name: "Special Gujrati Thali", img: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=600&q=80" },
      { name: "Dhokla & Khandvi Plate", img: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&q=80" },
      { name: "Undhiyu Puri", img: "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=600&q=80" },
      { name: "Dal Dhokli", img: "https://images.unsplash.com/photo-1482049016688-2d3e1b311543?w=600&q=80" },
      { name: "Thepla with Chunda", img: "https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=600&q=80" }
    ]
  },
  {
    category: "Drinks", cuisine: "Drinks, Beverages, Shakes",
    restaurants: [
      { name: "Cool Sip", img: "https://images.unsplash.com/photo-1544145945-f90425340c7e?w=600&q=80" },
      { name: "Juice Junction", img: "https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=600&q=80" },
      { name: "Shake Factory", img: "https://images.unsplash.com/photo-1572490122747-3968b75f284c?w=600&q=80" },
      { name: "Brew Bros", img: "https://images.unsplash.com/photo-1497935586351-b67a49e012bf?w=600&q=80" },
      { name: "Drinkify", img: "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=600&q=80" }
    ],
    foods: [
      { name: "Cold Coffee", img: "https://images.unsplash.com/photo-1497935586351-b67a49e012bf?w=600&q=80" },
      { name: "Chocolate Milkshake", img: "https://images.unsplash.com/photo-1572490122747-3968b75f284c?w=600&q=80" },
      { name: "Mango Smoothie", img: "https://images.unsplash.com/photo-1544145945-f90425340c7e?w=600&q=80" },
      { name: "Fresh Orange Juice", img: "https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=600&q=80" },
      { name: "Mojito", img: "https://images.unsplash.com/photo-1551538827-9c037cb4f32a?w=600&q=80" }
    ]
  }
];

const LOCAL_IMAGES_DIR = path.join(__dirname, '..', 'frontend', 'public', 'images');

// Helper to sanitize filenames
const getFilename = (name) => name.toLowerCase().replace(/[^a-z0-9]/g, '_') + '.jpg';

async function downloadImage(url, filepath) {
  if (fs.existsSync(filepath)) {
    return true; // Already downloaded
  }
  try {
    const response = await fetch(url);
    if (!response.ok) {
      console.warn(`[WARN] Unsplash Failed to fetch ${url}: ${response.statusText}`);
      return false;
    }
    const arrayBuffer = await response.arrayBuffer();
    fs.writeFileSync(filepath, Buffer.from(arrayBuffer));
    return true;
  } catch(e) {
    console.warn(`[WARN] Exception downloading ${url}:`, e.message);
    return false;
  }
}

async function prepareImagesAndSeed() {
  if (!db) { process.exit(1); }

  console.log("Setting up local images directory...");
  if (!fs.existsSync(LOCAL_IMAGES_DIR)) {
    fs.mkdirSync(LOCAL_IMAGES_DIR, { recursive: true });
  }

  console.log("Downloading/Processing images from Unsplash to local directory...");

  // Mutate categoriesData references
  for (const cat of categoriesData) {
    for (const rest of cat.restaurants) {
      if (rest.img.startsWith('http')) {
        const localName = getFilename(rest.name + '_rest');
        const success = await downloadImage(rest.img, path.join(LOCAL_IMAGES_DIR, localName));
        if (success) rest.img = `/images/${localName}`; // Rebind to local path
      }
    }
    for (const food of cat.foods) {
      if (food.img.startsWith('http')) {
        const localName = getFilename(food.name + '_food');
        const success = await downloadImage(food.img, path.join(LOCAL_IMAGES_DIR, localName));
        if (success) food.img = `/images/${localName}`; // Rebind to local path
      }
    }
  }

  console.log("Images downloaded successfully! Now seeding database with LOCAL paths...");

  try {
    console.log("Clearing old data...");
    const restDocs = await db.collection('restaurants').get();
    for (const doc of restDocs.docs) { try { await doc.ref.delete(); } catch(e) {} }
    
    const foodDocs = await db.collection('food_items').get();
    for (const doc of foodDocs.docs) { try { await doc.ref.delete(); } catch(e) {} }

    for (const cat of categoriesData) {
      console.log(`Seeding category: ${cat.category}...`);
      const restIds = [];
      for (const rest of cat.restaurants) {
        try {
          const restDoc = await db.collection('restaurants').add({
            name: rest.name, cuisine: cat.cuisine,
            rating: (Math.random() * (5.0 - 4.0) + 4.0).toFixed(1),
            deliveryTime: "20-40",
            costForTwo: Math.floor(Math.random() * 500) + 200,
            isOpen: true, 
            image: rest.img // Now holds the fast local path!
          });
          restIds.push(restDoc.id);
        } catch(e) { console.error("Skip rest:", e.message); }
      }
      for (const restId of restIds) {
        for (let i = 0; i < cat.foods.length; i++) {
          try {
            const food = cat.foods[i];
            await db.collection('food_items').add({
              name: food.name, 
              price: Math.floor(Math.random() * 300) + 100,
              isVeg: true, 
              description: `Delicious 100% pure veg ${food.name} prepared fresh to order.`,
              image: food.img, 
              restaurantId: restId
            });
          } catch(e) { console.error("Skip food:", e.message); }
        }
      }
    }
    console.log("✅ Ultra-Fast Seeding completed successfully!");
    process.exit(0);
  } catch (error) { 
    console.error("Crash details:", error);
    process.exit(1); 
  }
}

prepareImagesAndSeed();
