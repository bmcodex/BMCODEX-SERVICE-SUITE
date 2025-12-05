import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();

const sampleClients = [
  {
    name: "Jan Kowalski",
    email: "jan.kowalski@example.com",
    phone: "+48 123 456 789",
    address: "ul. Główna 1, 00-001 Warszawa",
    notes: "Stały klient, preferuje wizyty w godzinach popołudniowych",
  },
  {
    name: "Anna Nowak",
    email: "anna.nowak@example.com",
    phone: "+48 234 567 890",
    address: "ul. Kwiatowa 15, 30-002 Kraków",
    notes: "Właścicielka BMW M3 F80",
  },
  {
    name: "Piotr Wiśniewski",
    email: "piotr.wisniewski@example.com",
    phone: "+48 345 678 901",
    address: "ul. Słoneczna 8, 50-003 Wrocław",
    notes: "Zainteresowany Stage 2 tuningiem",
  },
];

const sampleVehicles = [
  {
    clientId: 1,
    vin: "WBA3B5C50DF123456",
    brand: "BMW",
    model: "330i",
    year: 2020,
    mileage: 45000,
    engine: "B48 2.0L Turbo",
    transmission: "8-speed automatic",
    licensePlate: "WA 12345",
    notes: "Stage 1 tuning wykonany w 2022",
  },
  {
    clientId: 2,
    vin: "WBS8M9C55FP234567",
    brand: "BMW",
    model: "M3 F80",
    year: 2015,
    mileage: 78000,
    engine: "S55 3.0L Twin-Turbo",
    transmission: "7-speed DCT",
    licensePlate: "KR 67890",
    notes: "Wymiana turbin w 2023",
  },
  {
    clientId: 3,
    vin: "WBA5A5C50ED345678",
    brand: "BMW",
    model: "520d",
    year: 2019,
    mileage: 120000,
    engine: "B47 2.0L Diesel",
    transmission: "8-speed automatic",
    licensePlate: "WR 11223",
    notes: "Regularny serwis co 15000 km",
  },
  {
    clientId: 1,
    vin: "WBA8E9C57HK456789",
    brand: "BMW",
    model: "X5 M50d",
    year: 2021,
    mileage: 32000,
    engine: "B57 3.0L Quad-Turbo Diesel",
    transmission: "8-speed automatic",
    licensePlate: "WA 99887",
    notes: "Nowy pojazd, pierwszy serwis",
  },
];

async function seed() {
  console.log("🌱 Rozpoczynam seed bazy danych...");

  const connection = await mysql.createConnection(process.env.DATABASE_URL);

  try {
    // Insert clients
    console.log("📝 Dodawanie klientów...");
    for (const client of sampleClients) {
      await connection.execute(
        `INSERT INTO clients (name, email, phone, address, notes) VALUES (?, ?, ?, ?, ?)`,
        [client.name, client.email, client.phone, client.address, client.notes]
      );
    }
    console.log(`✅ Dodano ${sampleClients.length} klientów`);

    // Insert vehicles
    console.log("🚗 Dodawanie pojazdów...");
    for (const vehicle of sampleVehicles) {
      await connection.execute(
        `INSERT INTO vehicles (clientId, vin, brand, model, year, mileage, engine, transmission, licensePlate, notes) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          vehicle.clientId,
          vehicle.vin,
          vehicle.brand,
          vehicle.model,
          vehicle.year,
          vehicle.mileage,
          vehicle.engine,
          vehicle.transmission,
          vehicle.licensePlate,
          vehicle.notes,
        ]
      );
    }
    console.log(`✅ Dodano ${sampleVehicles.length} pojazdów`);

    console.log("🎉 Seed zakończony pomyślnie!");
  } catch (error) {
    console.error("❌ Błąd podczas seed:", error);
    process.exit(1);
  } finally {
    await connection.end();
  }
}

seed();
