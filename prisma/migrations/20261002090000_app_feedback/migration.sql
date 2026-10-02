CREATE TABLE "app_feedback" (
    "id" TEXT NOT NULL,
    "reference" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "diagnostics" JSONB,
    "status" TEXT NOT NULL DEFAULT 'new',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "delete_after" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "app_feedback_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "app_feedback_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE UNIQUE INDEX "app_feedback_reference_key" ON "app_feedback"("reference");
CREATE INDEX "app_feedback_user_id_created_at_idx" ON "app_feedback"("user_id", "created_at");
CREATE INDEX "app_feedback_delete_after_idx" ON "app_feedback"("delete_after");

ALTER TABLE "app_feedback" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "app_feedback" FORCE ROW LEVEL SECURITY;
REVOKE ALL ON TABLE "app_feedback" FROM anon, authenticated;
