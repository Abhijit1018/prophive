import {
  PrismaClient,
  PropertyType,
  PropertyMode,
  FurnishingStatus,
  PropertyStatus,
  Role,
} from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const cities = ["Jaipur", "Delhi", "Gurugram"];

const sampleProperties = [
  {
    title: "Luxury 3BHK Apartment",
    type: PropertyType.APARTMENT,
    mode: PropertyMode.SALE,
    price: 8500000,
    area: 1450,
    bhk: 3,
    furnishing: FurnishingStatus.FURNISHED,
    description: "Spacious 3BHK luxury apartment with modern amenities, 24/7 security, gym, and swimming pool.",
  },
  {
    title: "Modern 2BHK Flat for Rent",
    type: PropertyType.APARTMENT,
    mode: PropertyMode.RENT,
    price: 25000,
    area: 950,
    bhk: 2,
    furnishing: FurnishingStatus.SEMI_FURNISHED,
    description: "Well-maintained 2BHK flat in prime location. Near metro station, schools, and shopping centers.",
  },
  {
    title: "Independent 4BHK Villa",
    type: PropertyType.VILLA,
    mode: PropertyMode.SALE,
    price: 15000000,
    area: 3200,
    bhk: 4,
    furnishing: FurnishingStatus.UNFURNISHED,
    description: "Spacious independent villa with private garden, parking for 3 cars, and premium finishes.",
  },
  {
    title: "Commercial Office Space",
    type: PropertyType.COMMERCIAL,
    mode: PropertyMode.RENT,
    price: 80000,
    area: 2000,
    bhk: null,
    furnishing: FurnishingStatus.FURNISHED,
    description: "Grade-A office space in business district. Fully furnished with high-speed internet and parking.",
  },
  {
    title: "Residential Plot — Prime Location",
    type: PropertyType.PLOT,
    mode: PropertyMode.SALE,
    price: 4500000,
    area: 500,
    bhk: null,
    furnishing: null,
    description: "RERA-approved residential plot in gated community. Clear title, ready for immediate construction.",
  },
];

const cityCoords: Record<string, { lat: number; lng: number }> = {
  Jaipur: { lat: 26.9124, lng: 75.7873 },
  Delhi: { lat: 28.6139, lng: 77.209 },
  Gurugram: { lat: 28.4595, lng: 77.0266 },
};

async function main() {
  console.log("Seeding database...");

  const adminHash = await bcrypt.hash("admin123", 12);
  const admin = await prisma.user.upsert({
    where: { email: "admin@prophive.in" },
    update: {},
    create: {
      name: "Admin",
      email: "admin@prophive.in",
      passwordHash: adminHash,
      role: Role.ADMIN,
    },
  });
  console.log("Admin created:", admin.email);

  const sellerHash = await bcrypt.hash("seller123", 12);
  const seller = await prisma.user.upsert({
    where: { email: "seller@prophive.in" },
    update: {},
    create: {
      name: "Demo Seller",
      email: "seller@prophive.in",
      passwordHash: sellerHash,
      role: Role.SELLER,
      phone: "+91 98765 43210",
      sellerProfile: {
        create: {
          agency: "PropHive Realty",
          bio: "10+ years in real estate across Delhi NCR and Jaipur",
        },
      },
    },
  });
  console.log("Seller created:", seller.email);

  const buyerHash = await bcrypt.hash("buyer123", 12);
  const buyer = await prisma.user.upsert({
    where: { email: "buyer@prophive.in" },
    update: {},
    create: {
      name: "Demo Buyer",
      email: "buyer@prophive.in",
      passwordHash: buyerHash,
      role: Role.BUYER,
      buyerProfile: {
        create: {
          preferredCities: "Delhi,Gurugram",
          budgetMin: 5000000,
          budgetMax: 20000000,
        },
      },
    },
  });
  console.log("Buyer created:", buyer.email);

  for (const city of cities) {
    const coords = cityCoords[city];
    for (const prop of sampleProperties) {
      const property = await prisma.property.create({
        data: {
          ...prop,
          city,
          address: `Sector 12, ${city}`,
          pincode: "110001",
          landmark: `Near ${city} Metro Station`,
          lat: coords.lat + (Math.random() - 0.5) * 0.1,
          lng: coords.lng + (Math.random() - 0.5) * 0.1,
          status: PropertyStatus.ACTIVE,
          sellerId: seller.id,
          images: {
            create: [
              {
                url: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800",
                isPrimary: true,
              },
              {
                url: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800",
              },
            ],
          },
        },
      });
      console.log(`Created: ${property.title} in ${city}`);
    }
  }

  console.log("\nSeeding complete. 15 properties created across 3 cities.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
