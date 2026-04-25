import {
  db,
  stadiumsTable,
  standsTable,
  menuItemsTable,
  ridersTable,
  adminsTable,
  matchesTable,
  ordersTable,
  fanSessionsTable,
  notificationsTable,
  halftimePromosTable,
  type StoredOrderItem,
} from "@workspace/db";
import { sql } from "drizzle-orm";
import { randomUUID } from "node:crypto";

async function main() {
  console.log("Clearing existing seed data...");
  await db.execute(sql`TRUNCATE TABLE
    halftime_promos,
    notifications_log,
    matches,
    orders,
    fan_sessions,
    admins,
    riders,
    menu_items,
    stands,
    stadiums
    RESTART IDENTITY CASCADE`);

  console.log("Seeding stadiums...");
  await db.insert(stadiumsTable).values([
    {
      id: "stadium-casa",
      name: "Grand Stade Hassan II — Casablanca",
      city: "Casablanca",
      cityCode: "CASA",
      sections: ["A", "B", "C", "D", "E", "F", "G", "H"],
      active: true,
    },
    {
      id: "stadium-marrakech",
      name: "Stade de Marrakech",
      city: "Marrakech",
      cityCode: "MARR",
      sections: ["N1", "N2", "S1", "S2", "E1", "E2", "W1", "W2"],
      active: true,
    },
  ]);

  console.log("Seeding stands & menu items...");
  type StandSeed = {
    name: string;
    category: string;
    description: string;
    imageUrl: string;
    avg: number;
    location: string;
    isHalalOnly?: boolean;
    items: Array<{
      name: string;
      description: string;
      price: number;
      category: string;
      allergens?: string[];
      isVegetarian?: boolean;
      isHalal?: boolean;
      isFeatured?: boolean;
      imageUrl: string;
    }>;
  };

  const TEMPLATES: StandSeed[] = [
    {
      name: "Moroccan Bites",
      category: "Moroccan",
      description: "Traditional tagines, kefta, and harira from Marrakech grandmothers.",
      imageUrl: "/assets/stand-moroccan.jpg",
      avg: 12,
      location: "Concourse A · Gate 3",
      isHalalOnly: true,
      items: [
        { name: "Chicken Tagine", description: "Slow-cooked chicken with preserved lemon and olives.", price: 85, category: "Mains", allergens: [], isFeatured: true, imageUrl: "/assets/item-tagine.jpg" },
        { name: "Kefta Sandwich", description: "Spiced beef kebab in fresh khobz with tahini.", price: 55, category: "Sandwiches", allergens: ["gluten", "sesame"], isFeatured: true, imageUrl: "/assets/item-kefta.jpg" },
        { name: "Harira Soup", description: "Hearty tomato-lentil soup with chickpeas.", price: 35, category: "Sides", allergens: ["gluten"], isVegetarian: true, imageUrl: "/assets/item-harira.jpg" },
        { name: "Lamb Couscous", description: "Friday-style with seven vegetables.", price: 110, category: "Mains", allergens: ["gluten"], imageUrl: "/assets/item-couscous.jpg" },
        { name: "Msemen Wrap", description: "Layered flatbread with cheese and honey.", price: 45, category: "Sandwiches", allergens: ["gluten", "dairy"], isVegetarian: true, imageUrl: "/assets/item-msemen.jpg" },
        { name: "Briouates", description: "Crispy almond and honey pastries.", price: 40, category: "Desserts", allergens: ["nuts", "gluten"], isVegetarian: true, imageUrl: "/assets/item-briouates.jpg" },
        { name: "Mint Tea", description: "Atay bil naana, traditionally poured.", price: 20, category: "Drinks", isVegetarian: true, imageUrl: "/assets/item-mint-tea.jpg" },
        { name: "Orange Blossom Lemonade", description: "Cold-pressed with a hint of zhar.", price: 25, category: "Drinks", isVegetarian: true, imageUrl: "/assets/item-lemonade.jpg" },
        { name: "Pastilla Slice", description: "Chicken, almond, cinnamon in flaky warqa.", price: 65, category: "Mains", allergens: ["nuts", "gluten", "dairy"], imageUrl: "/assets/item-pastilla.jpg" },
        { name: "Chebakia", description: "Sesame-honey rosettes.", price: 30, category: "Desserts", allergens: ["sesame", "gluten"], isVegetarian: true, imageUrl: "/assets/item-chebakia.jpg" },
      ],
    },
    {
      name: "Goal Burgers",
      category: "Burgers",
      description: "Smashed-to-order burgers with stadium-sized portions.",
      imageUrl: "/assets/stand-burgers.jpg",
      avg: 8,
      location: "Concourse B · Gate 7",
      items: [
        { name: "Classic Goal Burger", description: "Double smash, cheddar, special sauce.", price: 75, category: "Burgers", allergens: ["gluten", "dairy"], isFeatured: true, imageUrl: "/assets/item-burger.jpg" },
        { name: "Atlas Bacon Burger", description: "Crispy bacon, caramelized onion.", price: 90, category: "Burgers", allergens: ["gluten", "dairy"], imageUrl: "/assets/item-bacon-burger.jpg" },
        { name: "Veggie Striker", description: "Black bean patty, smoked aioli.", price: 70, category: "Burgers", allergens: ["gluten", "dairy"], isVegetarian: true, imageUrl: "/assets/item-veggie-burger.jpg" },
        { name: "Spicy Casa Chicken", description: "Buttermilk fried chicken, harissa mayo.", price: 80, category: "Burgers", allergens: ["gluten", "dairy"], isFeatured: true, imageUrl: "/assets/item-chicken-burger.jpg" },
        { name: "Stadium Fries", description: "Twice-cooked, sea salt.", price: 35, category: "Sides", isVegetarian: true, imageUrl: "/assets/item-fries.jpg" },
        { name: "Loaded Cheese Fries", description: "Fries, cheddar sauce, scallions.", price: 50, category: "Sides", allergens: ["dairy"], isVegetarian: true, imageUrl: "/assets/item-loaded-fries.jpg" },
        { name: "Crispy Onion Rings", description: "Beer-battered, served with ranch.", price: 40, category: "Sides", allergens: ["gluten", "dairy"], isVegetarian: true, imageUrl: "/assets/item-onion-rings.jpg" },
        { name: "Cola Pint", description: "Ice-cold draft cola.", price: 25, category: "Drinks", isVegetarian: true, imageUrl: "/assets/item-cola.jpg" },
        { name: "Atlas Lager (0.0%)", description: "Crisp, alcohol-free lager.", price: 35, category: "Drinks", allergens: ["gluten"], isVegetarian: true, imageUrl: "/assets/item-lager.jpg" },
        { name: "Chocolate Brownie", description: "Warm, gooey, with sea salt.", price: 40, category: "Desserts", allergens: ["gluten", "dairy", "nuts"], isVegetarian: true, imageUrl: "/assets/item-brownie.jpg" },
      ],
    },
    {
      name: "Café Mint",
      category: "Drinks",
      description: "Specialty coffee, fresh juices, and Moroccan pastries.",
      imageUrl: "/assets/stand-cafe.jpg",
      avg: 5,
      location: "Concourse C · Gate 11",
      items: [
        { name: "Cortado", description: "Double shot, steamed milk.", price: 25, category: "Coffee", allergens: ["dairy"], isVegetarian: true, isFeatured: true, imageUrl: "/assets/item-cortado.jpg" },
        { name: "Iced Spanish Latte", description: "Sweet condensed milk on ice.", price: 35, category: "Coffee", allergens: ["dairy"], isVegetarian: true, imageUrl: "/assets/item-latte.jpg" },
        { name: "Saffron Hot Chocolate", description: "Single-origin cocoa with a saffron thread.", price: 40, category: "Coffee", allergens: ["dairy"], isVegetarian: true, imageUrl: "/assets/item-hot-chocolate.jpg" },
        { name: "Atlas Mint Tea", description: "Brewed table-side with Mt. Toubkal mint.", price: 25, category: "Tea", isVegetarian: true, isFeatured: true, imageUrl: "/assets/item-mint-tea-2.jpg" },
        { name: "Fresh Orange Juice", description: "Pressed to order.", price: 30, category: "Juice", isVegetarian: true, imageUrl: "/assets/item-orange-juice.jpg" },
        { name: "Avocado Smoothie", description: "Avocado, almond milk, dates.", price: 40, category: "Juice", allergens: ["nuts"], isVegetarian: true, imageUrl: "/assets/item-avocado.jpg" },
        { name: "Almond Croissant", description: "Buttery, twice-baked.", price: 35, category: "Pastries", allergens: ["gluten", "dairy", "nuts"], isVegetarian: true, imageUrl: "/assets/item-croissant.jpg" },
        { name: "Cornes de Gazelle", description: "Almond paste in delicate dough.", price: 30, category: "Pastries", allergens: ["gluten", "nuts"], isVegetarian: true, imageUrl: "/assets/item-gazelle.jpg" },
        { name: "Pistachio Baklava", description: "Layers of crisp filo, honey syrup.", price: 35, category: "Pastries", allergens: ["nuts", "gluten"], isVegetarian: true, imageUrl: "/assets/item-baklava.jpg" },
        { name: "Sparkling Water", description: "Local Sidi Ali sparkling.", price: 18, category: "Drinks", isVegetarian: true, imageUrl: "/assets/item-water.jpg" },
      ],
    },
    {
      name: "Pizza Corner",
      category: "Pizza",
      description: "Wood-fired Neapolitan slices, ready in minutes.",
      imageUrl: "/assets/stand-pizza.jpg",
      avg: 7,
      location: "Concourse D · Gate 14",
      items: [
        { name: "Margherita Slice", description: "San Marzano, fior di latte, basil.", price: 50, category: "Pizza", allergens: ["gluten", "dairy"], isVegetarian: true, isFeatured: true, imageUrl: "/assets/item-margherita.jpg" },
        { name: "Diavola Slice", description: "Spicy salami, chili oil.", price: 60, category: "Pizza", allergens: ["gluten", "dairy"], isFeatured: true, imageUrl: "/assets/item-diavola.jpg" },
        { name: "Quattro Formaggi", description: "Four cheeses, pepper honey.", price: 65, category: "Pizza", allergens: ["gluten", "dairy"], isVegetarian: true, imageUrl: "/assets/item-formaggi.jpg" },
        { name: "Funghi Truffle", description: "Wild mushroom, truffle cream.", price: 75, category: "Pizza", allergens: ["gluten", "dairy"], isVegetarian: true, imageUrl: "/assets/item-funghi.jpg" },
        { name: "Calzone", description: "Folded with ricotta, salami, mozzarella.", price: 70, category: "Pizza", allergens: ["gluten", "dairy"], imageUrl: "/assets/item-calzone.jpg" },
        { name: "Garlic Knots (6)", description: "Olive oil, parsley, parmesan.", price: 35, category: "Sides", allergens: ["gluten", "dairy"], isVegetarian: true, imageUrl: "/assets/item-knots.jpg" },
        { name: "Caesar Salad", description: "Crisp romaine, anchovy dressing.", price: 55, category: "Salads", allergens: ["gluten", "dairy", "fish"], imageUrl: "/assets/item-caesar.jpg" },
        { name: "Tiramisu Cup", description: "Espresso, mascarpone, cocoa.", price: 45, category: "Desserts", allergens: ["dairy", "gluten"], isVegetarian: true, imageUrl: "/assets/item-tiramisu.jpg" },
        { name: "San Pellegrino Limonata", description: "Sparkling Italian lemon.", price: 25, category: "Drinks", isVegetarian: true, imageUrl: "/assets/item-limonata.jpg" },
        { name: "Espresso", description: "Single shot, Italian roast.", price: 18, category: "Drinks", isVegetarian: true, imageUrl: "/assets/item-espresso.jpg" },
      ],
    },
    {
      name: "Snack Zone",
      category: "Snacks",
      description: "Quick-grab fries, nuggets, popcorn — perfect for pre-kickoff.",
      imageUrl: "/assets/stand-snacks.jpg",
      avg: 4,
      location: "Concourse E · Gate 18",
      items: [
        { name: "Cheesy Nachos", description: "Tortilla chips, queso, jalapeños.", price: 45, category: "Snacks", allergens: ["dairy", "gluten"], isVegetarian: true, isFeatured: true, imageUrl: "/assets/item-nachos.jpg" },
        { name: "Chicken Nuggets (10)", description: "Crispy buttermilk-battered.", price: 55, category: "Snacks", allergens: ["gluten"], imageUrl: "/assets/item-nuggets.jpg" },
        { name: "Curly Fries", description: "Seasoned and twisted.", price: 35, category: "Snacks", isVegetarian: true, imageUrl: "/assets/item-curly.jpg" },
        { name: "Salted Popcorn", description: "Fresh-popped, large bucket.", price: 30, category: "Snacks", isVegetarian: true, imageUrl: "/assets/item-popcorn.jpg" },
        { name: "Caramel Popcorn", description: "Sticky-sweet caramel coat.", price: 35, category: "Snacks", isVegetarian: true, imageUrl: "/assets/item-caramel.jpg" },
        { name: "Hot Dog", description: "Smoked beef wiener, mustard, onion.", price: 50, category: "Snacks", allergens: ["gluten"], isFeatured: true, imageUrl: "/assets/item-hotdog.jpg" },
        { name: "Pretzel", description: "Soft, salted, with cheese dip.", price: 40, category: "Snacks", allergens: ["gluten", "dairy"], isVegetarian: true, imageUrl: "/assets/item-pretzel.jpg" },
        { name: "Ice Cream Cone", description: "Vanilla soft-serve, chocolate dip.", price: 30, category: "Desserts", allergens: ["dairy", "gluten"], isVegetarian: true, imageUrl: "/assets/item-icecream.jpg" },
        { name: "Energy Drink", description: "Stadium-strength caffeine.", price: 35, category: "Drinks", isVegetarian: true, imageUrl: "/assets/item-energy.jpg" },
        { name: "Bottled Water", description: "Sidi Ali still water 500ml.", price: 15, category: "Drinks", isVegetarian: true, imageUrl: "/assets/item-water-bottle.jpg" },
      ],
    },
  ];

  const stadiumIds = ["stadium-casa", "stadium-marrakech"];

  for (const stadiumId of stadiumIds) {
    for (const t of TEMPLATES) {
      const standId = `${stadiumId}-${t.name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`;
      await db.insert(standsTable).values({
        id: standId,
        stadiumId,
        name: t.name,
        description: t.description,
        category: t.category,
        status: "open",
        avgPrepTimeMinutes: t.avg,
        maxPendingOrders: 50,
        imageUrl: t.imageUrl,
        rating: 4.4 + Math.random() * 0.5,
        location: t.location,
        isHalalOnly: t.isHalalOnly ?? false,
      });
      for (const it of t.items) {
        await db.insert(menuItemsTable).values({
          id: `${standId}-${it.name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`,
          standId,
          name: it.name,
          description: it.description,
          priceMad: it.price,
          category: it.category,
          allergens: it.allergens ?? [],
          isHalal: it.isHalal ?? true,
          isVegetarian: it.isVegetarian ?? false,
          isFeatured: it.isFeatured ?? false,
          isAvailable: true,
          imageUrl: it.imageUrl,
        });
      }
    }
  }

  console.log("Seeding riders & admins...");
  const riderSeed = [
    { stadium: "stadium-casa", names: ["Ahmed", "Younes", "Mehdi"] },
    { stadium: "stadium-marrakech", names: ["Sofia", "Omar", "Khalid"] },
  ];
  let pin = 1234;
  for (const group of riderSeed) {
    for (const name of group.names) {
      await db.insert(ridersTable).values({
        id: `rider-${group.stadium}-${name.toLowerCase()}`,
        name,
        stadiumId: group.stadium,
        pin: String(pin++),
        status: "available",
        avatarUrl: null,
      });
    }
  }

  await db.insert(adminsTable).values([
    {
      id: "admin-casa",
      email: "admin@stadiumeats.ma",
      password: "admin2030",
      stadiumId: "stadium-casa",
    },
    {
      id: "admin-marrakech",
      email: "marrakech@stadiumeats.ma",
      password: "admin2030",
      stadiumId: "stadium-marrakech",
    },
  ]);

  console.log("Seeding live matches...");
  await db.insert(matchesTable).values([
    {
      stadiumId: "stadium-casa",
      homeTeam: "Morocco",
      awayTeam: "Brazil",
      homeFlag: "MA",
      awayFlag: "BR",
      homeScore: 1,
      awayScore: 1,
      minute: 38,
      status: "first_half",
      kickoffAt: new Date(Date.now() - 38 * 60 * 1000),
    },
    {
      stadiumId: "stadium-marrakech",
      homeTeam: "Spain",
      awayTeam: "Argentina",
      homeFlag: "ES",
      awayFlag: "AR",
      homeScore: 0,
      awayScore: 2,
      minute: 27,
      status: "first_half",
      kickoffAt: new Date(Date.now() - 27 * 60 * 1000),
    },
  ]);

  console.log("Seeding sample fan sessions and orders...");
  const allStands = await db.select().from(standsTable);
  const allItems = await db.select().from(menuItemsTable);
  const itemsByStand = new Map<string, typeof allItems>();
  for (const i of allItems) {
    const arr = itemsByStand.get(i.standId) ?? [];
    arr.push(i);
    itemsByStand.set(i.standId, arr);
  }
  const allRiders = await db.select().from(ridersTable);
  const ridersByStadium = new Map<string, typeof allRiders>();
  for (const r of allRiders) {
    const arr = ridersByStadium.get(r.stadiumId) ?? [];
    arr.push(r);
    ridersByStadium.set(r.stadiumId, arr);
  }

  // Sample fan sessions (one per stadium so demo orders link to a real fan)
  const sessionCasaId = randomUUID();
  const sessionMarrakechId = randomUUID();
  await db.insert(fanSessionsTable).values([
    {
      id: sessionCasaId,
      stadiumId: "stadium-casa",
      section: "C",
      row: "12",
      seat: "8",
      fanName: "Yassine",
      goalPoints: 30,
      ordersCount: 2,
    },
    {
      id: sessionMarrakechId,
      stadiumId: "stadium-marrakech",
      section: "N1",
      row: "5",
      seat: "11",
      fanName: "Salma",
      goalPoints: 15,
      ordersCount: 1,
    },
  ]);

  function pickItems(items: typeof allItems, count: number): StoredOrderItem[] {
    const shuffled = [...items].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, count).map((m) => ({
      menuItemId: m.id,
      name: m.name,
      quantity: 1 + Math.floor(Math.random() * 2),
      priceMad: m.priceMad,
      imageUrl: m.imageUrl,
    }));
  }

  const seedOrders: Array<typeof ordersTable.$inferInsert> = [];
  const statuses = ["received", "preparing", "on_the_way", "delivered"] as const;

  for (const stadiumId of stadiumIds) {
    const stadiumStands = allStands.filter((s) => s.stadiumId === stadiumId);
    const stadiumRiders = ridersByStadium.get(stadiumId) ?? [];
    const sessionId = stadiumId === "stadium-casa" ? sessionCasaId : sessionMarrakechId;
    const sessionFan = stadiumId === "stadium-casa" ? "Yassine" : "Salma";
    const sessionSection = stadiumId === "stadium-casa" ? "C" : "N1";
    const sessionRow = stadiumId === "stadium-casa" ? "12" : "5";
    const sessionSeat = stadiumId === "stadium-casa" ? "8" : "11";

    for (let i = 0; i < 14; i++) {
      const stand = stadiumStands[i % stadiumStands.length]!;
      const items = pickItems(itemsByStand.get(stand.id) ?? [], 1 + Math.floor(Math.random() * 2));
      const subtotal = items.reduce((s, it) => s + it.priceMad * it.quantity, 0);
      const fee = subtotal >= 100 ? 0 : 8;
      const total = Math.round((subtotal + fee) * 100) / 100;
      const status = statuses[i % statuses.length]!;
      const rider = stadiumRiders[i % Math.max(1, stadiumRiders.length)];
      const minutesAgo = (i + 1) * 4;
      const createdAt = new Date(Date.now() - minutesAgo * 60 * 1000);
      const isOwn = i < 3;
      seedOrders.push({
        id: randomUUID(),
        sessionId: isOwn ? sessionId : randomUUID(),
        standId: stand.id,
        standName: stand.name,
        riderId: rider?.id,
        riderName: rider?.name,
        fanName: isOwn ? sessionFan : ["Imane", "Karim", "Hamza", "Nour", "Reda", "Lina", "Anas", "Aya"][i % 8]!,
        items,
        status,
        seat: {
          stadiumId,
          section: isOwn ? sessionSection : (stadiumId === "stadium-casa" ? ["A", "B", "C", "D", "E"][i % 5]! : ["N1", "N2", "S1", "E1"][i % 4]!),
          row: isOwn ? sessionRow : String(1 + (i % 18)),
          seat: isOwn ? sessionSeat : String(1 + (i % 22)),
        },
        subtotalMad: subtotal,
        deliveryFeeMad: fee,
        totalMad: total,
        etaMinutes: status === "delivered" ? 0 : 5 + (i % 10),
        createdAt,
        deliveredAt: status === "delivered" ? new Date(createdAt.getTime() + (8 + (i % 6)) * 60 * 1000) : null,
        rating: status === "delivered" && i % 2 === 0 ? 5 : null,
        isPreOrder: false,
      });
    }
  }
  await db.insert(ordersTable).values(seedOrders);

  console.log("Seeding initial broadcasts...");
  await db.insert(notificationsTable).values([
    {
      id: randomUUID(),
      stadiumId: "stadium-casa",
      message: "Welcome to the World Cup! Mint tea is 20% off until kickoff.",
      section: "ALL",
      type: "promo",
      sentAt: new Date(Date.now() - 25 * 60 * 1000),
    },
  ]);

  await db.insert(halftimePromosTable).values([
    { stadiumId: "stadium-casa", active: false },
    { stadiumId: "stadium-marrakech", active: false },
  ]);

  console.log("Seed complete.");
  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
