import { eq, desc, and, or, sql, gte, lte } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { 
  InsertUser, users,
  clients, InsertClient,
  vehicles, InsertVehicle,
  projects, InsertProject,
  dtcCodes, InsertDtcCode,
  softwareFiles, InsertSoftwareFile,
  vehicleMedia, InsertVehicleMedia,
  protocols, InsertProtocol,
  bookings, InsertBooking,
  serviceHistory, InsertServiceHistoryEntry,
  notifications, InsertNotification
} from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

// ============ USER QUERIES ============

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

// ============ CLIENT QUERIES ============

export async function createClient(client: InsertClient) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const result = await db.insert(clients).values(client);
  return result[0].insertId;
}

export async function getClientById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  
  const result = await db.select().from(clients).where(eq(clients.id, id)).limit(1);
  return result[0];
}

export async function getAllClients() {
  const db = await getDb();
  if (!db) return [];
  
  return db.select().from(clients).orderBy(desc(clients.createdAt));
}

export async function updateClient(id: number, data: Partial<InsertClient>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.update(clients).set(data).where(eq(clients.id, id));
}

export async function deleteClient(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  // Delete client (cascade will handle related records if configured)
  await db.delete(clients).where(eq(clients.id, id));
}

export async function searchClients(query: string) {
  const db = await getDb();
  if (!db) return [];
  
  return db.select().from(clients).where(
    or(
      sql`${clients.name} LIKE ${`%${query}%`}`,
      sql`${clients.email} LIKE ${`%${query}%`}`,
      sql`${clients.phone} LIKE ${`%${query}%`}`
    )
  );
}

// ============ VEHICLE QUERIES ============

export async function createVehicle(vehicle: InsertVehicle) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const result = await db.insert(vehicles).values(vehicle);
  return result[0].insertId;
}

export async function getVehicleById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  
  const result = await db.select().from(vehicles).where(eq(vehicles.id, id)).limit(1);
  return result[0];
}

export async function getVehicleByVin(vin: string) {
  const db = await getDb();
  if (!db) return undefined;
  
  const result = await db.select().from(vehicles).where(eq(vehicles.vin, vin)).limit(1);
  return result[0];
}

export async function getVehiclesByClientId(clientId: number) {
  const db = await getDb();
  if (!db) return [];
  
  return db.select().from(vehicles).where(eq(vehicles.clientId, clientId)).orderBy(desc(vehicles.createdAt));
}

export async function getAllVehicles() {
  const db = await getDb();
  if (!db) return [];
  
  return db.select().from(vehicles).orderBy(desc(vehicles.createdAt));
}

export async function updateVehicle(id: number, data: Partial<InsertVehicle>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.update(vehicles).set(data).where(eq(vehicles.id, id));
}

// ============ PROJECT QUERIES ============

export async function createProject(project: InsertProject) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const result = await db.insert(projects).values(project);
  return result[0].insertId;
}

export async function getProjectById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  
  const result = await db.select().from(projects).where(eq(projects.id, id)).limit(1);
  return result[0];
}

export async function getProjectsByVehicleId(vehicleId: number) {
  const db = await getDb();
  if (!db) return [];
  
  return db.select().from(projects).where(eq(projects.vehicleId, vehicleId)).orderBy(desc(projects.createdAt));
}

export async function getProjectsByClientId(clientId: number) {
  const db = await getDb();
  if (!db) return [];
  
  return db.select().from(projects).where(eq(projects.clientId, clientId)).orderBy(desc(projects.createdAt));
}

export async function getAllProjects() {
  const db = await getDb();
  if (!db) return [];
  
  return db.select().from(projects).orderBy(desc(projects.createdAt));
}

export async function updateProject(id: number, data: Partial<InsertProject>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.update(projects).set(data).where(eq(projects.id, id));
}

export async function deleteProject(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.delete(projects).where(eq(projects.id, id));
}

// ============ DTC CODE QUERIES ============

export async function createDtcCode(dtcCode: InsertDtcCode) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const result = await db.insert(dtcCodes).values(dtcCode);
  return result[0].insertId;
}

export async function getDtcCodesByVehicleId(vehicleId: number) {
  const db = await getDb();
  if (!db) return [];
  
  return db.select().from(dtcCodes).where(eq(dtcCodes.vehicleId, vehicleId)).orderBy(desc(dtcCodes.createdAt));
}

export async function getDtcCodesByProjectId(projectId: number) {
  const db = await getDb();
  if (!db) return [];
  
  return db.select().from(dtcCodes).where(eq(dtcCodes.projectId, projectId)).orderBy(desc(dtcCodes.createdAt));
}

export async function updateDtcCode(id: number, data: Partial<InsertDtcCode>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.update(dtcCodes).set(data).where(eq(dtcCodes.id, id));
}

// ============ SOFTWARE FILE QUERIES ============

export async function createSoftwareFile(file: InsertSoftwareFile) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const result = await db.insert(softwareFiles).values(file);
  return result[0].insertId;
}

export async function getSoftwareFilesByVehicleId(vehicleId: number) {
  const db = await getDb();
  if (!db) return [];
  
  return db.select().from(softwareFiles).where(eq(softwareFiles.vehicleId, vehicleId)).orderBy(desc(softwareFiles.uploadedAt));
}

export async function getSoftwareFilesByProjectId(projectId: number) {
  const db = await getDb();
  if (!db) return [];
  
  return db.select().from(softwareFiles).where(eq(softwareFiles.projectId, projectId)).orderBy(desc(softwareFiles.uploadedAt));
}

// ============ VEHICLE MEDIA QUERIES ============

export async function createVehicleMedia(media: InsertVehicleMedia) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const result = await db.insert(vehicleMedia).values(media);
  return result[0].insertId;
}

export async function getVehicleMediaByVehicleId(vehicleId: number) {
  const db = await getDb();
  if (!db) return [];
  
  return db.select().from(vehicleMedia).where(eq(vehicleMedia.vehicleId, vehicleId)).orderBy(desc(vehicleMedia.uploadedAt));
}

export async function getVehicleMediaByProjectId(projectId: number) {
  const db = await getDb();
  if (!db) return [];
  
  return db.select().from(vehicleMedia).where(eq(vehicleMedia.projectId, projectId)).orderBy(desc(vehicleMedia.uploadedAt));
}

export async function getVehicleMediaByProtocolId(protocolId: number) {
  const db = await getDb();
  if (!db) return [];
  
  return db.select().from(vehicleMedia).where(eq(vehicleMedia.protocolId, protocolId)).orderBy(desc(vehicleMedia.uploadedAt));
}

// ============ PROTOCOL QUERIES ============

export async function createProtocol(protocol: InsertProtocol) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const result = await db.insert(protocols).values(protocol);
  return result[0].insertId;
}

export async function getProtocolById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  
  const result = await db.select().from(protocols).where(eq(protocols.id, id)).limit(1);
  return result[0];
}

export async function getProtocolsByProjectId(projectId: number) {
  const db = await getDb();
  if (!db) return [];
  
  return db.select().from(protocols).where(eq(protocols.projectId, projectId)).orderBy(desc(protocols.createdAt));
}

export async function getProtocolsByVehicleId(vehicleId: number) {
  const db = await getDb();
  if (!db) return [];
  
  return db.select().from(protocols).where(eq(protocols.vehicleId, vehicleId)).orderBy(desc(protocols.createdAt));
}

export async function updateProtocol(id: number, data: Partial<InsertProtocol>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.update(protocols).set(data).where(eq(protocols.id, id));
}

// ============ BOOKING QUERIES ============

export async function createBooking(booking: InsertBooking) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const result = await db.insert(bookings).values(booking);
  return result[0].insertId;
}

export async function getBookingById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  
  const result = await db.select().from(bookings).where(eq(bookings.id, id)).limit(1);
  return result[0];
}

export async function getBookingsByClientId(clientId: number) {
  const db = await getDb();
  if (!db) return [];
  
  return db.select().from(bookings).where(eq(bookings.clientId, clientId)).orderBy(desc(bookings.scheduledDate));
}

export async function getAllBookings() {
  const db = await getDb();
  if (!db) return [];
  
  return db.select().from(bookings).orderBy(bookings.scheduledDate);
}

export async function getUpcomingBookings() {
  const db = await getDb();
  if (!db) return [];
  
  return db.select().from(bookings)
    .where(
      and(
        gte(bookings.scheduledDate, new Date()),
        or(
          eq(bookings.status, "pending"),
          eq(bookings.status, "confirmed")
        )
      )
    )
    .orderBy(bookings.scheduledDate);
}

export async function updateBooking(id: number, data: Partial<InsertBooking>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.update(bookings).set(data).where(eq(bookings.id, id));
}

// ============ SERVICE HISTORY QUERIES ============

export async function createServiceHistory(entry: InsertServiceHistoryEntry) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const result = await db.insert(serviceHistory).values(entry);
  return result[0].insertId;
}

export async function getServiceHistoryByVehicleId(vehicleId: number) {
  const db = await getDb();
  if (!db) return [];
  
  return db.select().from(serviceHistory).where(eq(serviceHistory.vehicleId, vehicleId)).orderBy(desc(serviceHistory.serviceDate));
}

// ============ NOTIFICATION QUERIES ============

export async function createNotification(notification: InsertNotification) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const result = await db.insert(notifications).values(notification);
  return result[0].insertId;
}

export async function getNotificationsByClientId(clientId: number) {
  const db = await getDb();
  if (!db) return [];
  
  return db.select().from(notifications).where(eq(notifications.clientId, clientId)).orderBy(desc(notifications.sentAt));
}

export async function markNotificationAsRead(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.update(notifications).set({ read: true }).where(eq(notifications.id, id));
}
