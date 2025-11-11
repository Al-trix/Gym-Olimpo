-- DropIndex
DROP INDEX "Subscriptions_userId_active_endDate_startDate_idx";

-- DropIndex
DROP INDEX "UserLogs_userId_action_timestamp_idx";

-- CreateIndex
CREATE INDEX "Subscriptions_type_startDate_endDate_active_idx" ON "Subscriptions"("type", "startDate", "endDate", "active");

-- CreateIndex
CREATE INDEX "UserLogs_action_timestamp_userId_idx" ON "UserLogs"("action", "timestamp", "userId");
