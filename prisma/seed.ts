import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting seed...');

  // Create admin user
  const hashedPassword = await bcrypt.hash('admin123', 10); // Change this password!

  const admin = await prisma.adminUser.upsert({
    where: { email: 'admin@bessoranch.com' },
    update: {},
    create: {
      email: 'admin@bessoranch.com',
      password: hashedPassword,
      name: 'Ranch Admin',
      role: 'super_admin',
    },
  });
  console.log('✅ Admin user created:', admin.email);

  // Create products
  const products = [
    // Eggs
    {
      name: 'Farm Fresh Chicken Eggs',
      slug: 'chicken-eggs',
      description: 'Free-range, pasture-raised chicken eggs from happy hens. Available in beautiful colors from brown to blue to green.',
      price: 8.00,
      unit: 'dozen',
      category: 'eggs',
      subcategory: 'chicken',
      stockQuantity: 24,
      featured: true,
      displayOrder: 1,
      images: JSON.stringify(['/images/products/chicken-eggs.jpg']),
    },
    {
      name: 'Duck Eggs',
      slug: 'duck-eggs',
      description: 'Rich, creamy duck eggs perfect for baking. Larger yolks make for fluffier baked goods.',
      price: 12.00,
      unit: 'half dozen',
      category: 'eggs',
      subcategory: 'duck',
      stockQuantity: 12,
      featured: true,
      displayOrder: 2,
      images: JSON.stringify(['/images/animals/ducks.jpg']),
    },
    {
      name: 'Turkey Eggs',
      slug: 'turkey-eggs',
      description: 'Large, nutrient-rich eggs from heritage turkeys. About 50% larger than chicken eggs.',
      price: 15.00,
      unit: 'half dozen',
      category: 'eggs',
      subcategory: 'turkey',
      stockQuantity: 0,
      inStock: false,
      images: JSON.stringify(['/images/animals/turkeys.jpg']),
    },
    {
      name: 'Goose Eggs',
      slug: 'goose-eggs',
      description: 'Seasonal delicacy. One goose egg equals about three chicken eggs. Rich and flavorful.',
      price: 8.00,
      unit: 'each',
      category: 'eggs',
      subcategory: 'goose',
      stockQuantity: 6,
      featured: true,
      displayOrder: 4,
      images: JSON.stringify(['/images/animals/geese.jpg']),
    },
    // Poultry
    {
      name: 'Laying Hen - Rhode Island Red',
      slug: 'rhode-island-red-hen',
      description: 'Excellent brown egg layer, friendly and hardy. Perfect for backyard flocks.',
      price: 35.00,
      unit: 'each',
      category: 'poultry',
      subcategory: 'chicken',
      stockQuantity: 5,
    },
    {
      name: 'Laying Hen - Ameraucana',
      slug: 'ameraucana-hen',
      description: 'The famous "Easter Egger" - lays beautiful blue-green eggs. Friendly and cold-hardy.',
      price: 40.00,
      unit: 'each',
      category: 'poultry',
      subcategory: 'chicken',
      stockQuantity: 3,
    },
    {
      name: 'Heritage Turkey - Bourbon Red',
      slug: 'bourbon-red-turkey',
      description: 'Beautiful heritage breed with rich, mahogany plumage. Excellent for breeding or meat.',
      price: 75.00,
      unit: 'each',
      category: 'poultry',
      subcategory: 'turkey',
      stockQuantity: 2,
    },
    // Goat Milk Products
    {
      name: 'Goat Milk Soap - Lavender',
      slug: 'goat-milk-soap-lavender',
      description: 'Soothing lavender essential oil blend. Gentle, moisturizing soap perfect for sensitive skin.',
      price: 8.00,
      unit: 'bar',
      category: 'goat-milk',
      subcategory: 'soap',
      stockQuantity: 20,
      featured: true,
      displayOrder: 3,
      images: JSON.stringify(['/images/products/soap-lavender.jpg']),
    },
    {
      name: 'Goat Milk Soap - Oatmeal Honey',
      slug: 'goat-milk-soap-oatmeal-honey',
      description: 'Gentle exfoliation with natural oats and local honey. Perfect for dry skin.',
      price: 8.00,
      unit: 'bar',
      category: 'goat-milk',
      subcategory: 'soap',
      stockQuantity: 15,
    },
    {
      name: 'Goat Milk Soap - Unscented',
      slug: 'goat-milk-soap-unscented',
      description: 'Pure and simple. Perfect for fragrance sensitivities or baby\'s delicate skin.',
      price: 8.00,
      unit: 'bar',
      category: 'goat-milk',
      subcategory: 'soap',
      stockQuantity: 12,
    },
    {
      name: 'Goat Milk Lotion',
      slug: 'goat-milk-lotion',
      description: 'Luxuriously creamy lotion that absorbs quickly. Deep moisturizing without greasy residue.',
      price: 12.00,
      unit: '4 oz',
      category: 'goat-milk',
      subcategory: 'lotion',
      stockQuantity: 10,
    },
    {
      name: 'Goat Milk Lip Balm',
      slug: 'goat-milk-lip-balm',
      description: 'Keep lips soft and protected with our nourishing lip balm. Light vanilla flavor.',
      price: 4.00,
      unit: 'tube',
      category: 'goat-milk',
      subcategory: 'lip-balm',
      stockQuantity: 30,
    },
  ];

  for (const product of products) {
    await prisma.product.upsert({
      where: { slug: product.slug },
      update: product,
      create: product,
    });
  }
  console.log(`✅ ${products.length} products created`);

  // Create sample animals with new schema
  const animals = [
    { name: 'Henrietta', type: 'Chicken', breed: 'Rhode Island Red', gender: 'Female', status: 'Active', description: 'Our most reliable layer', featured: true },
    { name: 'Blue Belle', type: 'Chicken', breed: 'Ameraucana', gender: 'Female', status: 'Active', description: 'Lays beautiful blue eggs', featured: true },
    { name: 'Donald', type: 'Duck', breed: 'Khaki Campbell', gender: 'Male', status: 'Active', description: 'Prolific duck egg layer' },
    { name: 'Gobbles', type: 'Turkey', breed: 'Bourbon Red', gender: 'Male', status: 'Breeding', description: 'Our heritage tom turkey', featured: true },
    { name: 'Gary', type: 'Goose', breed: 'Embden', gender: 'Male', status: 'Active', description: 'Protects the flock' },
    { name: 'Buttercup', type: 'Goat', breed: 'Nigerian Dwarf', gender: 'Female', status: 'Active', description: 'Sweet and friendly milk goat', featured: true },
  ];

  // Delete existing animals and recreate with new schema
  await prisma.animal.deleteMany({});

  for (const animal of animals) {
    await prisma.animal.create({
      data: animal,
    });
  }
  console.log(`✅ ${animals.length} animals created`);

  // Create sample blog post
  await prisma.blogPost.upsert({
    where: { slug: 'welcome-to-besso-ranch' },
    update: {},
    create: {
      title: 'Welcome to Besso Ranch',
      slug: 'welcome-to-besso-ranch',
      excerpt: 'Learn about our sustainable farming journey in the California High Desert.',
      content: `# Welcome to Besso Ranch!

We're excited to share our journey of sustainable farming with you. Located in beautiful Yucca Valley, California, our ranch is home to chickens, ducks, turkeys, geese, and goats.

## Our Mission

To achieve a self-sustaining, organic, all-natural solution to everyday living and provide products and services to the community through regenerative agriculture and animal husbandry practices.

## What We Offer

- **Farm Fresh Eggs** - From our free-range chickens, ducks, turkeys, and geese
- **Live Poultry** - Healthy, well-socialized birds for your flock
- **Goat Milk Products** - Handcrafted soaps, lotions, and lip balms

Stay tuned for more updates from the ranch!`,
      category: 'farm-updates',
      published: true,
      publishedAt: new Date(),
    },
  });
  console.log('✅ Sample blog post created');

  // Create default settings
  const settings = [
    { key: 'site_name', value: 'Besso Ranch', type: 'string' },
    { key: 'site_tagline', value: 'Regenerative Agriculture, Naturally', type: 'string' },
    { key: 'contact_email', value: 'hello@bessoranch.com', type: 'string' },
    { key: 'contact_phone', value: '(760) 555-1234', type: 'string' },
    { key: 'delivery_radius_miles', value: '25', type: 'number' },
    { key: 'delivery_fee', value: '5', type: 'number' },
    { key: 'quiet_hours_start', value: '21', type: 'number' },
    { key: 'quiet_hours_end', value: '7', type: 'number' },
  ];

  for (const setting of settings) {
    await prisma.setting.upsert({
      where: { key: setting.key },
      update: { value: setting.value, type: setting.type },
      create: setting,
    });
  }
  console.log(`✅ ${settings.length} settings created`);

  console.log('🌱 Seed completed!');
}

main()
  .catch((e) => {
    console.error('Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
