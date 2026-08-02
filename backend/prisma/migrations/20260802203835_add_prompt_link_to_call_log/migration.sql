-- AlterTable
ALTER TABLE "llm_call_logs" ADD COLUMN     "promptName" TEXT,
ADD COLUMN     "promptVersion" INTEGER;

-- CreateIndex
CREATE INDEX "llm_call_logs_promptName_idx" ON "llm_call_logs"("promptName");

