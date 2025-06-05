import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  // Create manager user
  const managerPassword = await bcrypt.hash('manager123', 10);
  const manager = await prisma.user.upsert({
    where: { email: 'manager@cozystay.com' },
    update: {},
    create: {
      email: 'manager@cozystay.com',
      password: managerPassword,
      name: 'System Manager',
      role: 'MANAGER'
    },
  });

  // Create company user
  const companyPassword = await bcrypt.hash('company123', 10);
  const company = await prisma.user.upsert({
    where: { email: 'company@example.com' },
    update: {},
    create: {
      email: 'company@example.com',
      password: companyPassword,
      name: 'Corporate Client',
      role: 'COMPANY'
    },
  });

  // Create regular user
  const userPassword = await bcrypt.hash('user123', 10);
  const user = await prisma.user.upsert({
    where: { email: 'user@example.com' },
    update: {},
    create: {
      email: 'user@example.com',
      password: userPassword,
      name: 'Regular User',
      role: 'CUSTOMER'
    },
  });

  // Create rooms with duplicates
  const roomTypes = ['SINGLE', 'DOUBLE', 'FAMILY', 'DELUXE', 'SUITE'];
  const roomData = [];

  // Create 5 rooms of each type
  for (const type of roomTypes) {
    for (let i = 1; i <= 5; i++) {
      const basePrice = {
        'SINGLE': 119.00,
        'DOUBLE': 159.00,
        'FAMILY': 199.00,
        'DELUXE': 249.00,
        'SUITE': 399.00
      }[type];

      const capacity = {
        'SINGLE': 1,
        'DOUBLE': 2,
        'FAMILY': 4,
        'DELUXE': 2,
        'SUITE': 2
      }[type];

      const amenities = {
        'SINGLE': ['WiFi', 'TV', 'Air Conditioning'],
        'DOUBLE': ['WiFi', 'TV', 'Air Conditioning', 'Mini Bar'],
        'FAMILY': ['WiFi', 'TV', 'Air Conditioning', 'Mini Bar', 'Sofa'],
        'DELUXE': ['WiFi', 'TV', 'Air Conditioning', 'Mini Bar', 'Sofa', 'Ocean View'],
        'SUITE': ['WiFi', 'TV', 'Air Conditioning', 'Mini Bar', 'Sofa', 'Ocean View', 'Private Balcony']
      }[type];

      roomData.push({
        number: `${type.charAt(0)}${i}`,
        type,
        price: basePrice,
        status: 'AVAILABLE',
        amenities,
        description: `Comfortable ${type.toLowerCase()} room with modern amenities`,
        capacity,
        image: `https://images.pexels.com/photos/164595/pexels-photo-164595.jpeg`
      });
    }
  }

  // Create rooms in database
  for (const room of roomData) {
    await prisma.room.upsert({
      where: { number: room.number },
      update: room,
      create: room,
    });
  }

  // Get room IDs for reservations
  const singleRoom = await prisma.room.findFirst({ where: { type: 'SINGLE' } });
  const doubleRoom = await prisma.room.findFirst({ where: { type: 'DOUBLE' } });

  if (singleRoom && doubleRoom) {
    // Create some sample reservations
    const reservations = [
      {
        userId: user.id,
        roomId: singleRoom.id,
        checkIn: new Date('2024-03-01'),
        checkOut: new Date('2024-03-03'),
        status: 'CONFIRMED',
        totalAmount: 238.00
      },
      {
        userId: company.id,
        roomId: doubleRoom.id,
        checkIn: new Date('2024-03-05'),
        checkOut: new Date('2024-03-07'),
        status: 'CONFIRMED',
        totalAmount: 318.00
      }
    ];

    for (const reservation of reservations) {
      await prisma.reservation.create({
        data: reservation
      });
    }
  }

  console.log('Seed data created successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 