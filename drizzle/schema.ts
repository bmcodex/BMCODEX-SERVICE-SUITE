import { int, mysqlEnum, mysqlTable, text, timestamp, varchar, boolean, decimal } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 */
export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * Clients table - stores customer information
 */
export const clients = mysqlTable("clients", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 320 }),
  phone: varchar("phone", { length: 50 }),
  address: text("address"),
  notes: text("notes"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Client = typeof clients.$inferSelect;
export type InsertClient = typeof clients.$inferInsert;

/**
 * Vehicles table - stores vehicle information
 */
export const vehicles = mysqlTable("vehicles", {
  id: int("id").autoincrement().primaryKey(),
  clientId: int("clientId").notNull(),
  vin: varchar("vin", { length: 17 }).notNull().unique(),
  brand: varchar("brand", { length: 100 }).notNull(),
  model: varchar("model", { length: 100 }).notNull(),
  year: int("year").notNull(),
  mileage: int("mileage"),
  engine: varchar("engine", { length: 100 }),
  transmission: varchar("transmission", { length: 100 }),
  color: varchar("color", { length: 50 }),
  licensePlate: varchar("licensePlate", { length: 20 }),
  notes: text("notes"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Vehicle = typeof vehicles.$inferSelect;
export type InsertVehicle = typeof vehicles.$inferInsert;

/**
 * Projects table - tracks service projects
 */
export const projects = mysqlTable("projects", {
  id: int("id").autoincrement().primaryKey(),
  vehicleId: int("vehicleId").notNull(),
  clientId: int("clientId").notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  status: mysqlEnum("status", [
    "received",
    "in_progress", 
    "waiting_parts",
    "ready_pickup",
    "completed"
  ]).default("received").notNull(),
  serviceType: mysqlEnum("serviceType", [
    "coding",
    "stage1",
    "stage2",
    "xhp",
    "diagnostics",
    "repair",
    "other"
  ]).notNull(),
  startDate: timestamp("startDate"),
  completionDate: timestamp("completionDate"),
  estimatedCost: int("estimatedCost"),
  finalCost: int("finalCost"),
  notes: text("notes"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Project = typeof projects.$inferSelect;
export type InsertProject = typeof projects.$inferInsert;

/**
 * DTC Codes table - stores diagnostic trouble codes analysis
 */
export const dtcCodes = mysqlTable("dtcCodes", {
  id: int("id").autoincrement().primaryKey(),
  vehicleId: int("vehicleId").notNull(),
  projectId: int("projectId"),
  code: varchar("code", { length: 20 }).notNull(),
  description: text("description"),
  checklist: text("checklist"), // JSON string
  probableCauses: text("probableCauses"), // JSON string with percentages
  estimatedCostMin: int("estimatedCostMin"),
  estimatedCostMax: int("estimatedCostMax"),
  laborCost: int("laborCost"),
  risks: text("risks"), // JSON string
  tuningCompatibility: text("tuningCompatibility"), // JSON string
  resolved: boolean("resolved").default(false),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type DtcCode = typeof dtcCodes.$inferSelect;
export type InsertDtcCode = typeof dtcCodes.$inferInsert;

/**
 * Software Files table - stores ECU/TCU software versions
 */
export const softwareFiles = mysqlTable("softwareFiles", {
  id: int("id").autoincrement().primaryKey(),
  vehicleId: int("vehicleId").notNull(),
  projectId: int("projectId"),
  fileType: mysqlEnum("fileType", ["ecu_stock", "ecu_mod", "tcu_stock", "tcu_mod"]).notNull(),
  fileName: varchar("fileName", { length: 255 }).notNull(),
  fileKey: varchar("fileKey", { length: 500 }).notNull(),
  fileUrl: text("fileUrl").notNull(),
  fileSize: int("fileSize"),
  version: varchar("version", { length: 100 }),
  notes: text("notes"),
  uploadedAt: timestamp("uploadedAt").defaultNow().notNull(),
});

export type SoftwareFile = typeof softwareFiles.$inferSelect;
export type InsertSoftwareFile = typeof softwareFiles.$inferInsert;

/**
 * Vehicle Media table - stores photos and videos
 */
export const vehicleMedia = mysqlTable("vehicleMedia", {
  id: int("id").autoincrement().primaryKey(),
  vehicleId: int("vehicleId").notNull(),
  projectId: int("projectId"),
  protocolId: int("protocolId"),
  mediaType: mysqlEnum("mediaType", ["photo", "video", "log"]).notNull(),
  fileKey: varchar("fileKey", { length: 500 }).notNull(),
  fileUrl: text("fileUrl").notNull(),
  fileName: varchar("fileName", { length: 255 }),
  fileSize: int("fileSize"),
  category: varchar("category", { length: 100 }), // e.g., "360_intake", "360_release", "damage", "general"
  notes: text("notes"),
  uploadedAt: timestamp("uploadedAt").defaultNow().notNull(),
});

export type VehicleMedia = typeof vehicleMedia.$inferSelect;
export type InsertVehicleMedia = typeof vehicleMedia.$inferInsert;

/**
 * Protocols table - intake and release protocols
 */
export const protocols = mysqlTable("protocols", {
  id: int("id").autoincrement().primaryKey(),
  projectId: int("projectId"),
  vehicleId: int("vehicleId").notNull(),
  clientId: int("clientId").notNull(),
  protocolType: mysqlEnum("protocolType", ["intake", "release"]).notNull(),
  vehicleCondition: text("vehicleCondition"), // JSON string with damage markers
  workPerformed: text("workPerformed"), // JSON string
  clientNotes: text("clientNotes"),
  clientConsents: text("clientConsents"), // JSON string
  clientSignature: text("clientSignature"), // base64 or URL
  signedAt: timestamp("signedAt"),
  pdfFileKey: varchar("pdfFileKey", { length: 500 }),
  pdfFileUrl: text("pdfFileUrl"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Protocol = typeof protocols.$inferSelect;
export type InsertProtocol = typeof protocols.$inferInsert;

/**
 * Bookings table - appointment scheduling
 */
export const bookings = mysqlTable("bookings", {
  id: int("id").autoincrement().primaryKey(),
  clientId: int("clientId").notNull(),
  vehicleId: int("vehicleId"),
  projectId: int("projectId"),
  serviceType: mysqlEnum("serviceType", [
    "coding",
    "stage1",
    "stage2",
    "xhp",
    "diagnostics",
    "repair",
    "other"
  ]).notNull(),
  scheduledDate: timestamp("scheduledDate").notNull(),
  duration: int("duration").default(120), // minutes
  status: mysqlEnum("status", ["pending", "confirmed", "completed", "cancelled"]).default("pending").notNull(),
  notes: text("notes"),
  notification24hSent: boolean("notification24hSent").default(false),
  notification2hSent: boolean("notification2hSent").default(false),
  notificationCompletedSent: boolean("notificationCompletedSent").default(false),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Booking = typeof bookings.$inferSelect;
export type InsertBooking = typeof bookings.$inferInsert;

/**
 * Service History table - tracks all service visits
 */
export const serviceHistory = mysqlTable("serviceHistory", {
  id: int("id").autoincrement().primaryKey(),
  vehicleId: int("vehicleId").notNull(),
  projectId: int("projectId"),
  serviceType: varchar("serviceType", { length: 100 }).notNull(),
  description: text("description"),
  mileageAtService: int("mileageAtService"),
  cost: int("cost"),
  performedBy: varchar("performedBy", { length: 255 }),
  serviceDate: timestamp("serviceDate").notNull(),
  nextServiceDue: timestamp("nextServiceDue"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type ServiceHistoryEntry = typeof serviceHistory.$inferSelect;
export type InsertServiceHistoryEntry = typeof serviceHistory.$inferInsert;

/**
 * Notifications table - tracks all notifications sent
 */
export const notifications = mysqlTable("notifications", {
  id: int("id").autoincrement().primaryKey(),
  clientId: int("clientId").notNull(),
  bookingId: int("bookingId"),
  projectId: int("projectId"),
  notificationType: mysqlEnum("notificationType", [
    "booking_24h",
    "booking_2h",
    "service_completed",
    "service_reminder",
    "recurring_error",
    "other"
  ]).notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  message: text("message").notNull(),
  sentAt: timestamp("sentAt").defaultNow().notNull(),
  read: boolean("read").default(false),
});

export type Notification = typeof notifications.$inferSelect;
export type InsertNotification = typeof notifications.$inferInsert;
