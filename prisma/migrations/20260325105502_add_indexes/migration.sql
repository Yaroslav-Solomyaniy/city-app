-- CreateIndex
CREATE INDEX "ActivityLog_userId_idx" ON "ActivityLog"("userId");

-- CreateIndex
CREATE INDEX "ActivityLog_categoryId_idx" ON "ActivityLog"("categoryId");

-- CreateIndex
CREATE INDEX "ActivityLog_resourceId_idx" ON "ActivityLog"("resourceId");

-- CreateIndex
CREATE INDEX "InviteToken_createdBy_idx" ON "InviteToken"("createdBy");

-- CreateIndex
CREATE INDEX "Resource_categoryId_idx" ON "Resource"("categoryId");

-- CreateIndex
CREATE INDEX "Resource_subcategoryId_idx" ON "Resource"("subcategoryId");

-- CreateIndex
CREATE INDEX "Subcategory_categoryId_idx" ON "Subcategory"("categoryId");
