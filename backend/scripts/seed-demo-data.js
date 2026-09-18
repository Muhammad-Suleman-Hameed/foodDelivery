const { Client } = require('pg');
const bcrypt = require('bcryptjs');

async function seed() {
  const client = new Client({
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432', 10),
    user: process.env.DB_USERNAME || 'PC',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'food_delivery_db',
  });

  await client.connect();
  console.log('Connected to PostgreSQL database');

  try {
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash('Password123!', salt);

    // 1. Users to seed / ensure exist
    const usersData = [
      {
        name: 'Master Chef',
        email: 'chef@cravo.com',
        role: 'RESTAURANT_OWNER',
        phone: '+92 300 9998877',
        address: 'Commercial Area, Gulberg, Lahore',
      },
      {
        name: 'Muhammad Suleman',
        email: 'suleman@example.com',
        role: 'REGULAR_USER',
        phone: '+92 300 1234567',
        address: 'Johar Town, Block G, Lahore',
      },
      {
        name: 'Ayesha Khan',
        email: 'ayesha@cravo.com',
        role: 'REGULAR_USER',
        phone: '+92 321 9876543',
        address: 'DHA Phase 5, Sector C, Lahore',
      },
      {
        name: 'Bilal Ahmed',
        email: 'bilal@example.com',
        role: 'REGULAR_USER',
        phone: '+92 333 4567890',
        address: 'Gulberg III, Main Boulevard, Lahore',
      },
      {
        name: 'Zainab Fatima',
        email: 'zainab@example.com',
        role: 'REGULAR_USER',
        phone: '+92 345 6789012',
        address: 'Model Town, Block B, Lahore',
      },
      {
        name: 'Hamza Ali',
        email: 'hamza@example.com',
        role: 'REGULAR_USER',
        phone: '+92 312 3456789',
        address: 'Bahria Town, Sector B, Lahore',
      },
    ];

    const usersMap = {};

    for (const u of usersData) {
      const existing = await client.query('SELECT * FROM users WHERE email = $1', [u.email]);
      if (existing.rows.length > 0) {
        const row = existing.rows[0];
        // Ensure role and password match
        await client.query(
          'UPDATE users SET name = $1, role = $2, phone = $3, address = $4, password = $5 WHERE id = $6',
          [u.name, u.role, u.phone, u.address, passwordHash, row.id]
        );
        usersMap[u.email] = row.id;
        console.log(`Updated user ${u.email} (ID: ${row.id})`);
      } else {
        const inserted = await client.query(
          'INSERT INTO users (name, email, password, role, phone, address, "isBlocked", "createdAt", "updatedAt") VALUES ($1, $2, $3, $4, $5, $6, $7, NOW(), NOW()) RETURNING id',
          [u.name, u.email, passwordHash, u.role, u.phone, u.address, false]
        );
        const id = inserted.rows[0].id;
        usersMap[u.email] = id;
        console.log(`Created user ${u.email} (ID: ${id})`);
      }
    }

    const chefId = usersMap['chef@cravo.com'];
    const sulemanId = usersMap['suleman@example.com'];
    const ayeshaId = usersMap['ayesha@cravo.com'];
    const bilalId = usersMap['bilal@example.com'];
    const zainabId = usersMap['zainab@example.com'];
    const hamzaId = usersMap['hamza@example.com'];

    // 2. Assign restaurants 1, 2, 5 to chefId so owner has complete control
    await client.query(
      'UPDATE restaurants SET "ownerId" = $1 WHERE id IN (1, 2, 5)',
      [chefId]
    );
    console.log(`Assigned restaurants 1, 2, 5 to Owner (ID: ${chefId})`);

    // 3. Add extra meals for restaurant 5 (Suleman Gourmet Grill) if not existing
    const existingMeals = await client.query('SELECT id, name FROM meals WHERE "restaurantId" = 5');
    const existingMealNames = existingMeals.rows.map((r) => r.name);

    if (!existingMealNames.includes('Smoked Beef Brisket Platter')) {
      await client.query(
        'INSERT INTO meals (name, description, price, "restaurantId", "isAvailable", "createdAt", "updatedAt") VALUES ($1, $2, $3, 5, true, NOW(), NOW())',
        ['Smoked Beef Brisket Platter', '14-hour hickory smoked beef brisket with garlic mashed potatoes and barbecue glaze', 21.99]
      );
      console.log('Added Smoked Beef Brisket Platter to restaurant 5');
    }
    if (!existingMealNames.includes('Grilled Chicken Tikka Skewers')) {
      await client.query(
        'INSERT INTO meals (name, description, price, "restaurantId", "isAvailable", "createdAt", "updatedAt") VALUES ($1, $2, $3, 5, true, NOW(), NOW())',
        ['Grilled Chicken Tikka Skewers', 'Juicy chargrilled chicken marinated in traditional spices served with mint chutney and naan', 12.50]
      );
      console.log('Added Grilled Chicken Tikka Skewers to restaurant 5');
    }

    // 4. Clear existing orders for a clean, deterministic demo state
    await client.query('DELETE FROM order_items');
    await client.query('DELETE FROM orders');
    console.log('Cleared previous orders');

    // 5. Create orders covering ALL statuses
    const ordersToCreate = [
      {
        userId: sulemanId,
        restaurantId: 2, // Crust & Co. Artisan Pizza
        status: 'PLACED',
        deliveryAddress: 'Johar Town, Block G, House 14, Lahore',
        paymentMethod: 'CARD',
        notes: 'Please keep garlic sauce on the side',
        items: [
          { mealId: 9, mealName: 'Pizza Party Deal (2 Large Pizzas + Garlic Bread)', price: 24.99, quantity: 1 },
          { mealId: 10, mealName: 'Italian Tiramisu Cup', price: 5.49, quantity: 1 },
        ],
      },
      {
        userId: ayeshaId,
        restaurantId: 1, // The Burger Lab
        status: 'PREPARING',
        deliveryAddress: 'DHA Phase 5, Sector C, Street 8, Lahore',
        paymentMethod: 'CASH_ON_DELIVERY',
        notes: 'Extra napkins please',
        items: [
          { mealId: 3, mealName: 'Cravo Duo Combo Deal (2 Burgers + Fries + 2 Drinks)', price: 18.99, quantity: 1 },
          { mealId: 4, mealName: 'Loaded Truffle Parmesan Fries', price: 4.99, quantity: 1 },
        ],
      },
      {
        userId: bilalId,
        restaurantId: 2, // Crust & Co. Artisan Pizza
        status: 'PREPARING',
        deliveryAddress: 'Gulberg III, Main Boulevard, Apt 402, Lahore',
        paymentMethod: 'CARD',
        notes: 'Ring the doorbell on arrival',
        items: [
          { mealId: 8, mealName: 'Pepperoni & Hot Honey Feast', price: 15.49, quantity: 1 },
          { mealId: 7, mealName: 'Margherita Burrata Pizza (12 inch)', price: 13.99, quantity: 1 },
        ],
      },
      {
        userId: sulemanId,
        restaurantId: 1, // The Burger Lab
        status: 'ON_THE_WAY',
        deliveryAddress: 'Johar Town, Block G, House 14, Lahore',
        paymentMethod: 'CASH_ON_DELIVERY',
        notes: 'Call before reaching',
        items: [
          { mealId: 1, mealName: 'Smash Angus Double Cheeseburger', price: 9.49, quantity: 1 },
          { mealId: 2, mealName: 'Crispy Nashville Hot Chicken Burger', price: 8.99, quantity: 1 },
          { mealId: 6, mealName: 'Fresh Mint Lemonade Cooler', price: 2.99, quantity: 1 },
        ],
      },
      {
        userId: zainabId,
        restaurantId: 5, // Suleman Gourmet Grill
        status: 'ON_THE_WAY',
        deliveryAddress: 'Model Town, Block B, House 29, Lahore',
        paymentMethod: 'CARD',
        notes: 'Leave at front gate with security',
        items: [
          { mealId: 17, mealName: 'Gourmet Truffle Burger', price: 15.99, quantity: 1 },
          { mealId: 18, mealName: 'Smoked Beef Brisket Platter', price: 21.99, quantity: 1 },
        ],
      },
      {
        userId: ayeshaId,
        restaurantId: 2, // Crust & Co. Artisan Pizza
        status: 'DELIVERED',
        deliveryAddress: 'DHA Phase 5, Sector C, Street 8, Lahore',
        paymentMethod: 'CARD',
        notes: 'Delivered to reception',
        items: [
          { mealId: 7, mealName: 'Margherita Burrata Pizza (12 inch)', price: 13.99, quantity: 1 },
          { mealId: 10, mealName: 'Italian Tiramisu Cup', price: 5.49, quantity: 1 },
        ],
      },
      {
        userId: bilalId,
        restaurantId: 1, // The Burger Lab
        status: 'DELIVERED',
        deliveryAddress: 'Gulberg III, Main Boulevard, Apt 402, Lahore',
        paymentMethod: 'CASH_ON_DELIVERY',
        notes: 'Delivered',
        items: [
          { mealId: 3, mealName: 'Cravo Duo Combo Deal (2 Burgers + Fries + 2 Drinks)', price: 18.99, quantity: 1 },
          { mealId: 5, mealName: 'Thick Salted Caramel Milkshake', price: 4.49, quantity: 1 },
        ],
      },
      {
        userId: sulemanId,
        restaurantId: 5, // Suleman Gourmet Grill
        status: 'DELIVERED',
        deliveryAddress: 'Johar Town, Block G, House 14, Lahore',
        paymentMethod: 'CARD',
        notes: 'Delivered successfully',
        items: [
          { mealId: 17, mealName: 'Gourmet Truffle Burger', price: 15.99, quantity: 1 },
          { mealId: 19, mealName: 'Grilled Chicken Tikka Skewers', price: 12.50, quantity: 1 },
        ],
      },
      {
        userId: hamzaId,
        restaurantId: 1, // The Burger Lab
        status: 'CANCELLED',
        deliveryAddress: 'Bahria Town, Sector B, House 55, Lahore',
        paymentMethod: 'CASH_ON_DELIVERY',
        notes: 'Customer cancelled prior to dispatch',
        items: [
          { mealId: 2, mealName: 'Crispy Nashville Hot Chicken Burger', price: 8.99, quantity: 2 },
        ],
      },
    ];

    const deliveryFee = 1.49;

    for (const ord of ordersToCreate) {
      const subtotal = ord.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
      const totalAmount = subtotal + deliveryFee;

      const orderRes = await client.query(
        `INSERT INTO orders ("userId", "restaurantId", status, subtotal, "deliveryFee", "totalAmount", "deliveryAddress", "paymentMethod", notes, "createdAt", "updatedAt")
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, NOW(), NOW())
         RETURNING id`,
        [
          ord.userId,
          ord.restaurantId,
          ord.status,
          subtotal.toFixed(2),
          deliveryFee.toFixed(2),
          totalAmount.toFixed(2),
          ord.deliveryAddress,
          ord.paymentMethod,
          ord.notes,
        ]
      );

      const orderId = orderRes.rows[0].id;

      for (const item of ord.items) {
        await client.query(
          `INSERT INTO order_items ("orderId", "mealId", "mealName", price, quantity)
           VALUES ($1, $2, $3, $4, $5)`,
          [orderId, item.mealId, item.mealName, item.price.toFixed(2), item.quantity]
        );
      }
      console.log(`Created Order #${orderId} (${ord.status}) for User ID ${ord.userId}`);
    }

    // 6. Set Hamza Ali as blocked by Master Chef
    await client.query('DELETE FROM blocked_users WHERE "ownerId" = $1', [chefId]);
    await client.query(
      `INSERT INTO blocked_users ("ownerId", "userId", reason, "createdAt")
       VALUES ($1, $2, $3, NOW())`,
      [chefId, hamzaId, 'Repeated order cancellation at door step']
    );
    console.log(`Blocked User Hamza Ali (ID: ${hamzaId}) by Chef (ID: ${chefId})`);

    console.log('\nDemo database seed completed successfully!');
    console.log('----------------------------------------------------');
    console.log('ACCOUNTS READY FOR DEMO:');
    console.log('1. Restaurant Owner: chef@cravo.com / Password123!');
    console.log('2. Customer: suleman@example.com / Password123!');
    console.log('3. Customer: ayesha@cravo.com / Password123!');
    console.log('4. Customer: bilal@example.com / Password123!');
    console.log('5. Customer: zainab@example.com / Password123!');
    console.log('6. Customer (Blocked): hamza@example.com / Password123!');
    console.log('----------------------------------------------------');
  } catch (err) {
    console.error('Error seeding database:', err);
  } finally {
    await client.end();
  }
}

seed();
