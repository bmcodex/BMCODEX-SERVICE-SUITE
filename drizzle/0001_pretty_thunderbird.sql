CREATE TABLE `bookings` (
	`id` int AUTO_INCREMENT NOT NULL,
	`clientId` int NOT NULL,
	`vehicleId` int,
	`projectId` int,
	`serviceType` enum('coding','stage1','stage2','xhp','diagnostics','repair','other') NOT NULL,
	`scheduledDate` timestamp NOT NULL,
	`duration` int DEFAULT 120,
	`status` enum('pending','confirmed','completed','cancelled') NOT NULL DEFAULT 'pending',
	`notes` text,
	`notification24hSent` boolean DEFAULT false,
	`notification2hSent` boolean DEFAULT false,
	`notificationCompletedSent` boolean DEFAULT false,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `bookings_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `clients` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	`email` varchar(320),
	`phone` varchar(50),
	`address` text,
	`notes` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `clients_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `dtcCodes` (
	`id` int AUTO_INCREMENT NOT NULL,
	`vehicleId` int NOT NULL,
	`projectId` int,
	`code` varchar(20) NOT NULL,
	`description` text,
	`checklist` text,
	`probableCauses` text,
	`estimatedCostMin` int,
	`estimatedCostMax` int,
	`laborCost` int,
	`risks` text,
	`tuningCompatibility` text,
	`resolved` boolean DEFAULT false,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `dtcCodes_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `notifications` (
	`id` int AUTO_INCREMENT NOT NULL,
	`clientId` int NOT NULL,
	`bookingId` int,
	`projectId` int,
	`notificationType` enum('booking_24h','booking_2h','service_completed','service_reminder','recurring_error','other') NOT NULL,
	`title` varchar(255) NOT NULL,
	`message` text NOT NULL,
	`sentAt` timestamp NOT NULL DEFAULT (now()),
	`read` boolean DEFAULT false,
	CONSTRAINT `notifications_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `projects` (
	`id` int AUTO_INCREMENT NOT NULL,
	`vehicleId` int NOT NULL,
	`clientId` int NOT NULL,
	`title` varchar(255) NOT NULL,
	`description` text,
	`status` enum('received','in_progress','waiting_parts','ready_pickup','completed') NOT NULL DEFAULT 'received',
	`serviceType` enum('coding','stage1','stage2','xhp','diagnostics','repair','other') NOT NULL,
	`startDate` timestamp,
	`completionDate` timestamp,
	`estimatedCost` int,
	`finalCost` int,
	`notes` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `projects_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `protocols` (
	`id` int AUTO_INCREMENT NOT NULL,
	`projectId` int NOT NULL,
	`vehicleId` int NOT NULL,
	`clientId` int NOT NULL,
	`protocolType` enum('intake','release') NOT NULL,
	`vehicleCondition` text,
	`workPerformed` text,
	`clientNotes` text,
	`clientConsents` text,
	`clientSignature` text,
	`signedAt` timestamp,
	`pdfFileKey` varchar(500),
	`pdfFileUrl` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `protocols_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `serviceHistory` (
	`id` int AUTO_INCREMENT NOT NULL,
	`vehicleId` int NOT NULL,
	`projectId` int,
	`serviceType` varchar(100) NOT NULL,
	`description` text,
	`mileageAtService` int,
	`cost` int,
	`performedBy` varchar(255),
	`serviceDate` timestamp NOT NULL,
	`nextServiceDue` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `serviceHistory_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `softwareFiles` (
	`id` int AUTO_INCREMENT NOT NULL,
	`vehicleId` int NOT NULL,
	`projectId` int,
	`fileType` enum('ecu_stock','ecu_mod','tcu_stock','tcu_mod') NOT NULL,
	`fileName` varchar(255) NOT NULL,
	`fileKey` varchar(500) NOT NULL,
	`fileUrl` text NOT NULL,
	`fileSize` int,
	`version` varchar(100),
	`notes` text,
	`uploadedAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `softwareFiles_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `vehicleMedia` (
	`id` int AUTO_INCREMENT NOT NULL,
	`vehicleId` int NOT NULL,
	`projectId` int,
	`protocolId` int,
	`mediaType` enum('photo','video','log') NOT NULL,
	`fileKey` varchar(500) NOT NULL,
	`fileUrl` text NOT NULL,
	`fileName` varchar(255),
	`fileSize` int,
	`category` varchar(100),
	`notes` text,
	`uploadedAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `vehicleMedia_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `vehicles` (
	`id` int AUTO_INCREMENT NOT NULL,
	`clientId` int NOT NULL,
	`vin` varchar(17) NOT NULL,
	`brand` varchar(100) NOT NULL,
	`model` varchar(100) NOT NULL,
	`year` int NOT NULL,
	`mileage` int,
	`engine` varchar(100),
	`transmission` varchar(100),
	`color` varchar(50),
	`licensePlate` varchar(20),
	`notes` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `vehicles_id` PRIMARY KEY(`id`),
	CONSTRAINT `vehicles_vin_unique` UNIQUE(`vin`)
);
