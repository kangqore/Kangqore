-- AlterTable
ALTER TABLE "llm_call_logs" ADD COLUMN     "toolExecutionIds" TEXT[] DEFAULT ARRAY[]::TEXT[];

-- AlterTable
ALTER TABLE "ontology_actions" ADD COLUMN     "toolCallable" BOOLEAN NOT NULL DEFAULT false;

