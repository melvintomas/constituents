
const parse = require("csv-parser");
const fs = require("fs");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

type Row = {
  first_name: string;
  last_name: string;
  email: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  phone: string;
};

async function seedDatabase() {
  try {
    const parser = fs.createReadStream("prisma/MOCK_DATA.csv").pipe(
      parse({ delimiter: ",", from_line: 2 })
    );

    for await (const row of parser) {
      console.log("Seeding row:", row);


      await prisma.constituent.create({
        data: {
          firstName: row.first_name,
          lastName: row.last_name,
          email: row.email,
          address: row.street_address,
          city: row.city,
          state: row.state,
          zip: row.zip,
          phone: row.phone,
        },
      });
    }

    console.log("Database seeding completed.");
  } catch (error) {
    console.error("Error seeding database:", error);
  } finally {
    await prisma.$disconnect();
  }
}

seedDatabase();