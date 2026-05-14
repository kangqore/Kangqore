-- CreateEnum
CREATE TYPE "InviteeStatus" AS ENUM ('PENDING', 'ACCEPTED', 'DECLINED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "ScheduledEventStatus" AS ENUM ('ACTIVE', 'CANCELLED', 'COMPLETED', 'NO_SHOW');

-- CreateTable
CREATE TABLE "availability_schedules" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL DEFAULT 'Working Hours',
    "userId" TEXT NOT NULL,
    "isDefault" BOOLEAN NOT NULL DEFAULT false,
    "timezone" TEXT NOT NULL DEFAULT 'Asia/Kolkata',
    "rules" JSONB NOT NULL,
    "overrides" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "availability_schedules_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "event_invitees" (
    "id" TEXT NOT NULL,
    "eventId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "company" TEXT,
    "timezone" TEXT,
    "responses" JSONB,
    "status" "InviteeStatus" NOT NULL DEFAULT 'ACCEPTED',
    "viewedAt" TIMESTAMP(3),
    "cancelledAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "event_invitees_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "event_types" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "duration" INTEGER NOT NULL,
    "color" TEXT NOT NULL DEFAULT '#2564ea',
    "bufferBefore" INTEGER NOT NULL DEFAULT 0,
    "bufferAfter" INTEGER NOT NULL DEFAULT 0,
    "maxPerDay" INTEGER,
    "minNotice" INTEGER NOT NULL DEFAULT 60,
    "maxAdvanceDays" INTEGER NOT NULL DEFAULT 30,
    "hostId" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "isPublic" BOOLEAN NOT NULL DEFAULT true,
    "location" TEXT,
    "locationType" TEXT NOT NULL DEFAULT 'VIDEO',
    "requirePhone" BOOLEAN NOT NULL DEFAULT false,
    "requireCompany" BOOLEAN NOT NULL DEFAULT false,
    "customQuestions" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "event_types_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "invitee_no_shows" (
    "id" TEXT NOT NULL,
    "eventId" TEXT NOT NULL,
    "inviteeId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdBy" TEXT NOT NULL,

    CONSTRAINT "invitee_no_shows_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "meeting_locations" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "kind" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "isDefault" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "meeting_locations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "org_invitations" (
    "id" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'MEMBER',
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "token" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiresAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "org_invitations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "org_memberships" (
    "id" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'MEMBER',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "org_memberships_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "organizations" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "logoUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "organizations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "routing_forms" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "ownerId" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "questions" JSONB NOT NULL,
    "routingRules" JSONB NOT NULL,
    "fallbackEventTypeId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "routing_forms_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "routing_form_submissions" (
    "id" TEXT NOT NULL,
    "routingFormId" TEXT NOT NULL,
    "answers" JSONB NOT NULL,
    "routedToEventTypeId" TEXT,
    "submitterName" TEXT,
    "submitterEmail" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "routing_form_submissions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "scheduled_events" (
    "id" TEXT NOT NULL,
    "eventTypeId" TEXT NOT NULL,
    "hostId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "startTime" TIMESTAMP(3) NOT NULL,
    "endTime" TIMESTAMP(3) NOT NULL,
    "timezone" TEXT NOT NULL DEFAULT 'Asia/Kolkata',
    "status" "ScheduledEventStatus" NOT NULL DEFAULT 'ACTIVE',
    "locationType" TEXT,
    "locationValue" TEXT,
    "joinUrl" TEXT,
    "cancelledAt" TIMESTAMP(3),
    "cancelledBy" TEXT,
    "cancelReason" TEXT,
    "rescheduledFrom" TEXT,
    "schedulingLinkId" TEXT,
    "consultationId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "scheduled_events_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "scheduling_links" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "eventTypeId" TEXT NOT NULL,
    "ownerId" TEXT NOT NULL,
    "maxUses" INTEGER,
    "useCount" INTEGER NOT NULL DEFAULT 0,
    "expiresAt" TIMESTAMP(3),
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "prefillName" TEXT,
    "prefillEmail" TEXT,
    "prefillCompany" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "scheduling_links_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_AvailabilityScheduleToEventType" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE INDEX "availability_schedules_userId_idx" ON "availability_schedules"("userId");

-- CreateIndex
CREATE INDEX "event_invitees_eventId_idx" ON "event_invitees"("eventId");

-- CreateIndex
CREATE INDEX "event_invitees_email_idx" ON "event_invitees"("email");

-- CreateIndex
CREATE UNIQUE INDEX "event_invitees_eventId_email_key" ON "event_invitees"("eventId", "email");

-- CreateIndex
CREATE UNIQUE INDEX "event_types_slug_key" ON "event_types"("slug");

-- CreateIndex
CREATE INDEX "event_types_hostId_idx" ON "event_types"("hostId");

-- CreateIndex
CREATE INDEX "event_types_slug_idx" ON "event_types"("slug");

-- CreateIndex
CREATE INDEX "event_types_isActive_isPublic_idx" ON "event_types"("isActive", "isPublic");

-- CreateIndex
CREATE UNIQUE INDEX "invitee_no_shows_inviteeId_key" ON "invitee_no_shows"("inviteeId");

-- CreateIndex
CREATE INDEX "invitee_no_shows_eventId_idx" ON "invitee_no_shows"("eventId");

-- CreateIndex
CREATE INDEX "meeting_locations_userId_idx" ON "meeting_locations"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "org_invitations_token_key" ON "org_invitations"("token");

-- CreateIndex
CREATE INDEX "org_invitations_token_idx" ON "org_invitations"("token");

-- CreateIndex
CREATE UNIQUE INDEX "org_memberships_organizationId_userId_key" ON "org_memberships"("organizationId", "userId");

-- CreateIndex
CREATE UNIQUE INDEX "organizations_slug_key" ON "organizations"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "routing_forms_slug_key" ON "routing_forms"("slug");

-- CreateIndex
CREATE INDEX "routing_forms_slug_idx" ON "routing_forms"("slug");

-- CreateIndex
CREATE INDEX "routing_form_submissions_routingFormId_idx" ON "routing_form_submissions"("routingFormId");

-- CreateIndex
CREATE INDEX "scheduled_events_hostId_startTime_idx" ON "scheduled_events"("hostId", "startTime");

-- CreateIndex
CREATE INDEX "scheduled_events_eventTypeId_idx" ON "scheduled_events"("eventTypeId");

-- CreateIndex
CREATE INDEX "scheduled_events_status_idx" ON "scheduled_events"("status");

-- CreateIndex
CREATE UNIQUE INDEX "scheduling_links_slug_key" ON "scheduling_links"("slug");

-- CreateIndex
CREATE INDEX "scheduling_links_slug_idx" ON "scheduling_links"("slug");

-- CreateIndex
CREATE INDEX "scheduling_links_eventTypeId_idx" ON "scheduling_links"("eventTypeId");

-- CreateIndex
CREATE UNIQUE INDEX "_AvailabilityScheduleToEventType_AB_unique" ON "_AvailabilityScheduleToEventType"("A", "B");

-- CreateIndex
CREATE INDEX "_AvailabilityScheduleToEventType_B_index" ON "_AvailabilityScheduleToEventType"("B");

-- AddForeignKey
ALTER TABLE "availability_schedules" ADD CONSTRAINT "availability_schedules_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "event_invitees" ADD CONSTRAINT "event_invitees_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "scheduled_events"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "event_types" ADD CONSTRAINT "event_types_hostId_fkey" FOREIGN KEY ("hostId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "invitee_no_shows" ADD CONSTRAINT "invitee_no_shows_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "scheduled_events"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "invitee_no_shows" ADD CONSTRAINT "invitee_no_shows_inviteeId_fkey" FOREIGN KEY ("inviteeId") REFERENCES "event_invitees"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "meeting_locations" ADD CONSTRAINT "meeting_locations_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "org_invitations" ADD CONSTRAINT "org_invitations_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "organizations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "org_memberships" ADD CONSTRAINT "org_memberships_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "organizations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "org_memberships" ADD CONSTRAINT "org_memberships_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "routing_forms" ADD CONSTRAINT "routing_forms_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "routing_form_submissions" ADD CONSTRAINT "routing_form_submissions_routingFormId_fkey" FOREIGN KEY ("routingFormId") REFERENCES "routing_forms"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "scheduled_events" ADD CONSTRAINT "scheduled_events_eventTypeId_fkey" FOREIGN KEY ("eventTypeId") REFERENCES "event_types"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "scheduled_events" ADD CONSTRAINT "scheduled_events_hostId_fkey" FOREIGN KEY ("hostId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "scheduled_events" ADD CONSTRAINT "scheduled_events_schedulingLinkId_fkey" FOREIGN KEY ("schedulingLinkId") REFERENCES "scheduling_links"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "scheduling_links" ADD CONSTRAINT "scheduling_links_eventTypeId_fkey" FOREIGN KEY ("eventTypeId") REFERENCES "event_types"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "scheduling_links" ADD CONSTRAINT "scheduling_links_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_AvailabilityScheduleToEventType" ADD CONSTRAINT "_AvailabilityScheduleToEventType_A_fkey" FOREIGN KEY ("A") REFERENCES "availability_schedules"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_AvailabilityScheduleToEventType" ADD CONSTRAINT "_AvailabilityScheduleToEventType_B_fkey" FOREIGN KEY ("B") REFERENCES "event_types"("id") ON DELETE CASCADE ON UPDATE CASCADE;

