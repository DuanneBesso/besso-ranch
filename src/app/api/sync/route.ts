import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';

// Sync secret for authentication between apps
const SYNC_SECRET = process.env.SYNC_SECRET || 'besso-ranch-sync-2024';

interface LivestockAnimal {
  id: string;
  name: string;
  type: string;
  breed: string;
  gender: string;
  dateOfBirth: string;
  status: string;
  forSale?: boolean;
  salePrice?: number;
  saleDescription?: string;
  imageUrl?: string;
  photos?: string[];
  notes?: string;
  weight?: number;
  healthRecords?: unknown[];
}

interface SyncPayload {
  type: 'animals' | 'inventory' | 'photos' | 'full';
  animals?: LivestockAnimal[];
  inventory?: {
    productSlug: string;
    quantity: number;
  }[];
  photos?: {
    animalId: string;
    filename: string;
    data: string; // base64 encoded
  }[];
}

export async function POST(request: NextRequest) {
  // Verify sync secret
  const authHeader = request.headers.get('x-sync-secret');
  if (authHeader !== SYNC_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const payload: SyncPayload = await request.json();
    const results: Record<string, unknown> = {};

    // Handle animals sync
    if (payload.type === 'animals' || payload.type === 'full') {
      if (payload.animals && payload.animals.length > 0) {
        results.animals = await syncAnimals(payload.animals);
      }
    }

    // Handle inventory sync
    if (payload.type === 'inventory' || payload.type === 'full') {
      if (payload.inventory && payload.inventory.length > 0) {
        results.inventory = await syncInventory(payload.inventory);
      }
    }

    // Handle photos sync
    if (payload.type === 'photos' || payload.type === 'full') {
      if (payload.photos && payload.photos.length > 0) {
        results.photos = await syncPhotos(payload.photos);
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Sync completed successfully',
      results,
    });
  } catch (error) {
    console.error('Sync error:', error);
    return NextResponse.json(
      { error: 'Sync failed', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

async function syncAnimals(animals: LivestockAnimal[]) {
  const synced = [];
  const errors = [];

  for (const animal of animals) {
    try {
      // Map livestock app data to website schema
      const animalData = {
        name: animal.name,
        type: mapAnimalType(animal.type),
        breed: animal.breed || '',
        birthDate: animal.dateOfBirth ? new Date(animal.dateOfBirth) : null,
        gender: animal.gender?.toLowerCase() === 'male' ? 'Male' : 'Female',
        status: animal.forSale ? 'For Sale' : mapAnimalStatus(animal.status),
        price: animal.salePrice || null,
        description: animal.saleDescription || animal.notes || '',
        imageUrl: animal.imageUrl || (animal.photos && animal.photos[0]) || null,
        featured: animal.forSale || false,
        livestockAppId: animal.id, // Track the source ID
      };

      // Check if animal already exists (by livestockAppId)
      const existing = await prisma.animal.findFirst({
        where: { livestockAppId: animal.id },
      });

      if (existing) {
        // Update existing
        await prisma.animal.update({
          where: { id: existing.id },
          data: animalData,
        });
        synced.push({ id: animal.id, action: 'updated', name: animal.name });
      } else {
        // Create new
        await prisma.animal.create({
          data: animalData,
        });
        synced.push({ id: animal.id, action: 'created', name: animal.name });
      }
    } catch (err) {
      errors.push({
        id: animal.id,
        name: animal.name,
        error: err instanceof Error ? err.message : 'Unknown error',
      });
    }
  }

  return { synced, errors };
}

async function syncInventory(inventory: { productSlug: string; quantity: number }[]) {
  const synced = [];
  const errors = [];

  for (const item of inventory) {
    try {
      // Find product by slug
      const product = await prisma.product.findUnique({
        where: { slug: item.productSlug },
      });

      if (product) {
        const previousStock = product.stockQuantity;

        // Update stock
        await prisma.product.update({
          where: { id: product.id },
          data: { stockQuantity: item.quantity },
        });

        // Log inventory change
        await prisma.inventoryLog.create({
          data: {
            productId: product.id,
            changeType: 'set',
            quantity: item.quantity - previousStock,
            previousQty: previousStock,
            newQty: item.quantity,
            source: 'livestock_app',
            notes: 'Sync from Livestock App',
          },
        });

        synced.push({
          slug: item.productSlug,
          previousStock,
          newStock: item.quantity,
        });
      } else {
        errors.push({
          slug: item.productSlug,
          error: 'Product not found',
        });
      }
    } catch (err) {
      errors.push({
        slug: item.productSlug,
        error: err instanceof Error ? err.message : 'Unknown error',
      });
    }
  }

  return { synced, errors };
}

async function syncPhotos(photos: { animalId: string; filename: string; data: string }[]) {
  const synced = [];
  const errors = [];

  // Ensure uploads directory exists
  const uploadsDir = path.join(process.cwd(), 'public', 'uploads', 'animals');
  await mkdir(uploadsDir, { recursive: true });

  for (const photo of photos) {
    try {
      // Find animal by livestockAppId
      const animal = await prisma.animal.findFirst({
        where: { livestockAppId: photo.animalId },
      });

      if (!animal) {
        errors.push({
          animalId: photo.animalId,
          filename: photo.filename,
          error: 'Animal not found',
        });
        continue;
      }

      // Save photo to disk
      const buffer = Buffer.from(photo.data, 'base64');
      const filename = `${animal.id}-${Date.now()}-${photo.filename}`;
      const filepath = path.join(uploadsDir, filename);
      await writeFile(filepath, buffer);

      // Update animal with new photo URL
      const imageUrl = `/uploads/animals/${filename}`;
      await prisma.animal.update({
        where: { id: animal.id },
        data: { imageUrl },
      });

      synced.push({
        animalId: photo.animalId,
        filename,
        url: imageUrl,
      });
    } catch (err) {
      errors.push({
        animalId: photo.animalId,
        filename: photo.filename,
        error: err instanceof Error ? err.message : 'Unknown error',
      });
    }
  }

  return { synced, errors };
}

function mapAnimalType(type: string): string {
  const typeMap: Record<string, string> = {
    chicken: 'Chicken',
    duck: 'Duck',
    goat: 'Goat',
    pig: 'Pig',
    cow: 'Cow',
    sheep: 'Sheep',
    horse: 'Horse',
    turkey: 'Turkey',
    rabbit: 'Rabbit',
  };
  return typeMap[type.toLowerCase()] || type;
}

function mapAnimalStatus(status: string): string {
  const statusMap: Record<string, string> = {
    active: 'Active',
    healthy: 'Active',
    breeding: 'Breeding',
    pregnant: 'Breeding',
    sold: 'Sold',
    deceased: 'Deceased',
  };
  return statusMap[status.toLowerCase()] || 'Active';
}

// GET endpoint to check sync status and get product list for mapping
export async function GET(request: NextRequest) {
  const authHeader = request.headers.get('x-sync-secret');
  if (authHeader !== SYNC_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Get list of products for inventory mapping
  const products = await prisma.product.findMany({
    select: {
      slug: true,
      name: true,
      stockQuantity: true,
      category: true,
    },
    orderBy: { category: 'asc' },
  });

  // Get synced animals
  const syncedAnimals = await prisma.animal.findMany({
    where: {
      livestockAppId: { not: null },
    },
    select: {
      id: true,
      livestockAppId: true,
      name: true,
      status: true,
    },
  });

  return NextResponse.json({
    status: 'ready',
    products,
    syncedAnimals,
  });
}
