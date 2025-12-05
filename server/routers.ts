import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import { z } from "zod";
import * as db from "./db";
import { TRPCError } from "@trpc/server";
import {
  send24HourReminder,
  send2HourReminder,
  sendServiceCompletionNotification,
} from "./notifications";

export const appRouter = router({
  system: systemRouter,
  
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return { success: true } as const;
    }),
  }),

  // ============ CLIENT PROCEDURES ============
  clients: router({
    list: protectedProcedure.query(async () => {
      return await db.getAllClients();
    }),

    getById: protectedProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        const client = await db.getClientById(input.id);
        if (!client) throw new TRPCError({ code: "NOT_FOUND", message: "Klient nie znaleziony" });
        return client;
      }),

    create: protectedProcedure
      .input(z.object({
        name: z.string().min(1),
        email: z.string().email().optional(),
        phone: z.string().optional(),
        address: z.string().optional(),
        notes: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        const id = await db.createClient(input);
        return { id };
      }),

    update: protectedProcedure
      .input(z.object({
        id: z.number(),
        name: z.string().min(1).optional(),
        email: z.string().email().optional(),
        phone: z.string().optional(),
        address: z.string().optional(),
        notes: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        const { id, ...data } = input;
        await db.updateClient(id, data);
        return { success: true };
      }),

    search: protectedProcedure
      .input(z.object({ query: z.string() }))
      .query(async ({ input }) => {
        return await db.searchClients(input.query);
      }),
  }),

  // ============ VEHICLE PROCEDURES ============
  vehicles: router({
    list: protectedProcedure.query(async () => {
      return await db.getAllVehicles();
    }),

    getById: protectedProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        const vehicle = await db.getVehicleById(input.id);
        if (!vehicle) throw new TRPCError({ code: "NOT_FOUND", message: "Pojazd nie znaleziony" });
        return vehicle;
      }),

    getByVin: protectedProcedure
      .input(z.object({ vin: z.string() }))
      .query(async ({ input }) => {
        return await db.getVehicleByVin(input.vin);
      }),

    getByClientId: protectedProcedure
      .input(z.object({ clientId: z.number() }))
      .query(async ({ input }) => {
        return await db.getVehiclesByClientId(input.clientId);
      }),

    create: protectedProcedure
      .input(z.object({
        clientId: z.number(),
        vin: z.string().length(17),
        brand: z.string(),
        model: z.string(),
        year: z.number(),
        mileage: z.number().optional(),
        engine: z.string().optional(),
        transmission: z.string().optional(),
        color: z.string().optional(),
        licensePlate: z.string().optional(),
        notes: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        const id = await db.createVehicle(input);
        return { id };
      }),

    update: protectedProcedure
      .input(z.object({
        id: z.number(),
        mileage: z.number().optional(),
        engine: z.string().optional(),
        transmission: z.string().optional(),
        color: z.string().optional(),
        licensePlate: z.string().optional(),
        notes: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        const { id, ...data } = input;
        await db.updateVehicle(id, data);
        return { success: true };
      }),
  }),

  // ============ PROJECT PROCEDURES ============
  projects: router({
    list: protectedProcedure.query(async () => {
      return await db.getAllProjects();
    }),

    getById: protectedProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        const project = await db.getProjectById(input.id);
        if (!project) throw new TRPCError({ code: "NOT_FOUND", message: "Projekt nie znaleziony" });
        return project;
      }),

    getByVehicleId: protectedProcedure
      .input(z.object({ vehicleId: z.number() }))
      .query(async ({ input }) => {
        return await db.getProjectsByVehicleId(input.vehicleId);
      }),

    getByClientId: protectedProcedure
      .input(z.object({ clientId: z.number() }))
      .query(async ({ input }) => {
        return await db.getProjectsByClientId(input.clientId);
      }),

    create: protectedProcedure
      .input(z.object({
        vehicleId: z.number(),
        clientId: z.number(),
        title: z.string(),
        description: z.string().optional(),
        serviceType: z.enum(["coding", "stage1", "stage2", "xhp", "diagnostics", "repair", "other"]),
        estimatedCost: z.number().optional(),
        notes: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        const id = await db.createProject(input);
        return { id };
      }),

    update: protectedProcedure
      .input(z.object({
        id: z.number(),
        title: z.string().optional(),
        description: z.string().optional(),
        status: z.enum(["received", "in_progress", "waiting_parts", "ready_pickup", "completed"]).optional(),
        startDate: z.date().optional(),
        completionDate: z.date().optional(),
        estimatedCost: z.number().optional(),
        finalCost: z.number().optional(),
        notes: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        const { id, ...data } = input;
        await db.updateProject(id, data);
        return { success: true };
      }),
  }),

  // ============ DTC ANALYZER PROCEDURES ============
  dtc: router({
    analyze: protectedProcedure
      .input(z.object({
        code: z.string(),
        vehicleId: z.number(),
        projectId: z.number().optional(),
      }))
      .mutation(async ({ input }) => {
        // Simulate DTC analysis with realistic data
        const dtcData = generateDtcAnalysis(input.code);
        
        const id = await db.createDtcCode({
          vehicleId: input.vehicleId,
          projectId: input.projectId,
          code: input.code,
          description: dtcData.description,
          checklist: JSON.stringify(dtcData.checklist),
          probableCauses: JSON.stringify(dtcData.probableCauses),
          estimatedCostMin: dtcData.estimatedCostMin,
          estimatedCostMax: dtcData.estimatedCostMax,
          laborCost: dtcData.laborCost,
          risks: JSON.stringify(dtcData.risks),
          tuningCompatibility: JSON.stringify(dtcData.tuningCompatibility),
        });

        return { id, ...dtcData };
      }),

    getByVehicleId: protectedProcedure
      .input(z.object({ vehicleId: z.number() }))
      .query(async ({ input }) => {
        const codes = await db.getDtcCodesByVehicleId(input.vehicleId);
        return codes.map(code => ({
          ...code,
          checklist: code.checklist ? JSON.parse(code.checklist) : [],
          probableCauses: code.probableCauses ? JSON.parse(code.probableCauses) : [],
          risks: code.risks ? JSON.parse(code.risks) : [],
          tuningCompatibility: code.tuningCompatibility ? JSON.parse(code.tuningCompatibility) : {},
        }));
      }),

    markResolved: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        await db.updateDtcCode(input.id, { resolved: true });
        return { success: true };
      }),
  }),

  // ============ SOFTWARE FILES PROCEDURES ============
  software: router({
    upload: protectedProcedure
      .input(z.object({
        vehicleId: z.number(),
        projectId: z.number().optional(),
        fileType: z.enum(["ecu_stock", "ecu_mod", "tcu_stock", "tcu_mod"]),
        fileName: z.string(),
        fileKey: z.string(),
        fileUrl: z.string(),
        fileSize: z.number().optional(),
        version: z.string().optional(),
        notes: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        const id = await db.createSoftwareFile(input);
        return { id };
      }),

    getByVehicleId: protectedProcedure
      .input(z.object({ vehicleId: z.number() }))
      .query(async ({ input }) => {
        return await db.getSoftwareFilesByVehicleId(input.vehicleId);
      }),

    getByProjectId: protectedProcedure
      .input(z.object({ projectId: z.number() }))
      .query(async ({ input }) => {
        return await db.getSoftwareFilesByProjectId(input.projectId);
      }),
  }),

  // ============ VEHICLE MEDIA PROCEDURES ============
  media: router({
    upload: protectedProcedure
      .input(z.object({
        vehicleId: z.number(),
        projectId: z.number().optional(),
        protocolId: z.number().optional(),
        mediaType: z.enum(["photo", "video", "log"]),
        fileKey: z.string(),
        fileUrl: z.string(),
        fileName: z.string().optional(),
        fileSize: z.number().optional(),
        category: z.string().optional(),
        notes: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        const id = await db.createVehicleMedia(input);
        return { id };
      }),

    getByVehicleId: protectedProcedure
      .input(z.object({ vehicleId: z.number() }))
      .query(async ({ input }) => {
        return await db.getVehicleMediaByVehicleId(input.vehicleId);
      }),

    getByProjectId: protectedProcedure
      .input(z.object({ projectId: z.number() }))
      .query(async ({ input }) => {
        return await db.getVehicleMediaByProjectId(input.projectId);
      }),

    getByProtocolId: protectedProcedure
      .input(z.object({ protocolId: z.number() }))
      .query(async ({ input }) => {
        return await db.getVehicleMediaByProtocolId(input.protocolId);
      }),
  }),

  // ============ PROTOCOL PROCEDURES ============
  protocols: router({
    create: protectedProcedure
      .input(z.object({
        projectId: z.number(),
        vehicleId: z.number(),
        clientId: z.number(),
        protocolType: z.enum(["intake", "release"]),
        vehicleCondition: z.string().optional(),
        workPerformed: z.string().optional(),
        clientNotes: z.string().optional(),
        clientConsents: z.string().optional(),
        clientSignature: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        const id = await db.createProtocol(input);
        return { id };
      }),

    getById: protectedProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        const protocol = await db.getProtocolById(input.id);
        if (!protocol) throw new TRPCError({ code: "NOT_FOUND", message: "Protokół nie znaleziony" });
        return protocol;
      }),

    getByProjectId: protectedProcedure
      .input(z.object({ projectId: z.number() }))
      .query(async ({ input }) => {
        return await db.getProtocolsByProjectId(input.projectId);
      }),

    getByVehicleId: protectedProcedure
      .input(z.object({ vehicleId: z.number() }))
      .query(async ({ input }) => {
        return await db.getProtocolsByVehicleId(input.vehicleId);
      }),

    update: protectedProcedure
      .input(z.object({
        id: z.number(),
        vehicleCondition: z.string().optional(),
        workPerformed: z.string().optional(),
        clientNotes: z.string().optional(),
        clientConsents: z.string().optional(),
        clientSignature: z.string().optional(),
        signedAt: z.date().optional(),
        pdfFileKey: z.string().optional(),
        pdfFileUrl: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        const { id, ...data } = input;
        await db.updateProtocol(id, data);
        return { success: true };
      }),
  }),

  // ============ BOOKING PROCEDURES ============
  bookings: router({
    list: protectedProcedure.query(async () => {
      return await db.getAllBookings();
    }),

    upcoming: protectedProcedure.query(async () => {
      return await db.getUpcomingBookings();
    }),

    getById: protectedProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        const booking = await db.getBookingById(input.id);
        if (!booking) throw new TRPCError({ code: "NOT_FOUND", message: "Rezerwacja nie znaleziona" });
        return booking;
      }),

    getByClientId: protectedProcedure
      .input(z.object({ clientId: z.number() }))
      .query(async ({ input }) => {
        return await db.getBookingsByClientId(input.clientId);
      }),

    create: protectedProcedure
      .input(z.object({
        clientId: z.number(),
        vehicleId: z.number().optional(),
        serviceType: z.enum(["coding", "stage1", "stage2", "xhp", "diagnostics", "repair", "other"]),
        scheduledDate: z.date(),
        duration: z.number().default(120),
        notes: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        const id = await db.createBooking(input);
        return { id };
      }),

    update: protectedProcedure
      .input(z.object({
        id: z.number(),
        status: z.enum(["pending", "confirmed", "completed", "cancelled"]).optional(),
        scheduledDate: z.date().optional(),
        duration: z.number().optional(),
        notes: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        const { id, ...data } = input;
        await db.updateBooking(id, data);
        return { success: true };
      }),
  }),

  // ============ SERVICE HISTORY PROCEDURES ============
  serviceHistory: router({
    getByVehicleId: protectedProcedure
      .input(z.object({ vehicleId: z.number() }))
      .query(async ({ input }) => {
        return await db.getServiceHistoryByVehicleId(input.vehicleId);
      }),

    create: protectedProcedure
      .input(z.object({
        vehicleId: z.number(),
        projectId: z.number().optional(),
        serviceType: z.string(),
        description: z.string().optional(),
        mileageAtService: z.number().optional(),
        cost: z.number().optional(),
        performedBy: z.string().optional(),
        serviceDate: z.date(),
        nextServiceDue: z.date().optional(),
      }))
      .mutation(async ({ input }) => {
        const id = await db.createServiceHistory(input);
        return { id };
      }),
  }),

  // ============ NOTIFICATION PROCEDURES ============
  notifications: router({
    getByClientId: protectedProcedure
      .input(z.object({ clientId: z.number() }))
      .query(async ({ input }) => {
        return await db.getNotificationsByClientId(input.clientId);
      }),

    create: protectedProcedure
      .input(z.object({
        clientId: z.number(),
        bookingId: z.number().optional(),
        projectId: z.number().optional(),
        notificationType: z.enum([
          "booking_24h",
          "booking_2h",
          "service_completed",
          "service_reminder",
          "recurring_error",
          "other"
        ]),
        title: z.string(),
        message: z.string(),
      }))
      .mutation(async ({ input }) => {
        const id = await db.createNotification(input);
        return { id };
      }),

    markAsRead: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        await db.markNotificationAsRead(input.id);
        return { success: true };
      }),
  }),

  // ============ NOTIFICATION PROCEDURES ============
  emailNotifications: router({
    send24HourReminder: protectedProcedure
      .input(
        z.object({
          clientName: z.string(),
          clientEmail: z.string().email(),
          clientPhone: z.string().optional(),
          serviceType: z.string(),
          scheduledDate: z.date(),
          vehicleInfo: z.string().optional(),
        })
      )
      .mutation(async ({ input }) => {
        const success = await send24HourReminder(input);
        return { success };
      }),

    send2HourReminder: protectedProcedure
      .input(
        z.object({
          clientName: z.string(),
          clientEmail: z.string().email(),
          clientPhone: z.string().optional(),
          serviceType: z.string(),
          scheduledDate: z.date(),
          vehicleInfo: z.string().optional(),
        })
      )
      .mutation(async ({ input }) => {
        const success = await send2HourReminder(input);
        return { success };
      }),

    sendServiceCompletion: protectedProcedure
      .input(
        z.object({
          clientName: z.string(),
          clientEmail: z.string().email(),
          clientPhone: z.string().optional(),
          serviceType: z.string(),
          scheduledDate: z.date(),
          vehicleInfo: z.string().optional(),
        })
      )
      .mutation(async ({ input }) => {
        const success = await sendServiceCompletionNotification(input);
        return { success };
      }),
  }),
});

export type AppRouter = typeof appRouter;

// Helper function to generate realistic DTC analysis
function generateDtcAnalysis(code: string) {
  const dtcDatabase: Record<string, any> = {
    "P0171": {
      description: "System za ubogi (Bank 1)",
      checklist: [
        "Sprawdź szczelność układu dolotowego",
        "Sprawdź czujnik MAF (masowego przepływu powietrza)",
        "Sprawdź czujnik MAP (ciśnienia w kolektorze)",
        "Sprawdź sondy lambda",
        "Sprawdź ciśnienie paliwa",
        "Sprawdź korekty paliwowe długo- i krótkoterminowe",
        "Sprawdź zawór PCV",
        "Sprawdź układ EVAP"
      ],
      probableCauses: [
        { cause: "Nieszczelność układu dolotowego", probability: 55 },
        { cause: "Brudny lub uszkodzony MAF", probability: 20 },
        { cause: "Niska wydajność pompy paliwa", probability: 10 },
        { cause: "Uszkodzona sonda lambda", probability: 8 },
        { cause: "Nieszczelny zawór PCV", probability: 5 },
        { cause: "Inne przyczyny", probability: 2 }
      ],
      estimatedCostMin: 150,
      estimatedCostMax: 1500,
      laborCost: 200,
      risks: [
        "Zwiększone zużycie paliwa",
        "Utrata mocy silnika",
        "Uszkodzenie katalizatora przy długotrwałym ignorowaniu",
        "Nieprawidłowe spalanie - możliwe uszkodzenie tłoków"
      ],
      tuningCompatibility: {
        canTune: false,
        stage1: "Nie zalecane - najpierw napraw błąd",
        stage2: "Nie zalecane - najpierw napraw błąd",
        requiredLogs: ["Korekty paliwowe", "AFR", "Ciśnienie paliwa"],
        mustRepairFirst: true
      }
    },
    "P0300": {
      description: "Wykryto losowe wypadanie zapłonu",
      checklist: [
        "Sprawdź świece zapłonowe",
        "Sprawdź cewki zapłonowe",
        "Sprawdź przewody zapłonowe",
        "Sprawdź kompresję silnika",
        "Sprawdź wtryskiwacze paliwa",
        "Sprawdź ciśnienie paliwa",
        "Sprawdź zawory silnika",
        "Sprawdź układ dolotowy"
      ],
      probableCauses: [
        { cause: "Zużyte świece zapłonowe", probability: 40 },
        { cause: "Uszkodzone cewki zapłonowe", probability: 30 },
        { cause: "Problemy z wtryskiwaczami", probability: 15 },
        { cause: "Niska kompresja", probability: 10 },
        { cause: "Inne przyczyny", probability: 5 }
      ],
      estimatedCostMin: 200,
      estimatedCostMax: 3000,
      laborCost: 300,
      risks: [
        "Poważne uszkodzenie katalizatora",
        "Uszkodzenie silnika przy kontynuacji jazdy",
        "Znaczna utrata mocy",
        "Możliwe uszkodzenie turbosprężarki (jeśli dotyczy)"
      ],
      tuningCompatibility: {
        canTune: false,
        stage1: "Absolutnie nie - krytyczny błąd",
        stage2: "Absolutnie nie - krytyczny błąd",
        requiredLogs: ["Misfires", "Ignition timing", "Fuel pressure"],
        mustRepairFirst: true
      }
    }
  };

  // Default response for unknown codes
  const defaultResponse = {
    description: `Kod błędu: ${code}`,
    checklist: [
      "Sprawdź szczegółowy opis kodu w dokumentacji producenta",
      "Wykonaj diagnostykę komputerową",
      "Sprawdź powiązane czujniki i układy",
      "Sprawdź okablowanie i złącza"
    ],
    probableCauses: [
      { cause: "Wymaga szczegółowej diagnostyki", probability: 100 }
    ],
    estimatedCostMin: 200,
    estimatedCostMax: 2000,
    laborCost: 250,
    risks: [
      "Wymaga profesjonalnej diagnostyki",
      "Możliwe różne skutki w zależności od przyczyny"
    ],
    tuningCompatibility: {
      canTune: false,
      stage1: "Wymaga diagnostyki przed tunningiem",
      stage2: "Wymaga diagnostyki przed tunningiem",
      requiredLogs: ["Wszystkie dostępne logi"],
      mustRepairFirst: true
    }
  };

  return dtcDatabase[code] || defaultResponse;
}
