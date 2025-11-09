-- CreateIndex
CREATE INDEX "User_document_email_fullName_active_idx" ON "User"("document", "email", "fullName", "active");
