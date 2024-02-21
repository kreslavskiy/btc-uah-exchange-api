-- CreateEnum
CREATE TYPE "MetricsType" AS ENUM ('sent_emails_counter', 'sent_emails_error_counter', 'subscription_counter', 'unsubscription_counter', 'rate_gauge');

-- CreateTable
CREATE TABLE "Metrics" (
    "type" "MetricsType" NOT NULL,
    "value" DOUBLE PRECISION NOT NULL DEFAULT 0
);

-- CreateIndex
CREATE UNIQUE INDEX "Metrics_type_key" ON "Metrics"("type");
