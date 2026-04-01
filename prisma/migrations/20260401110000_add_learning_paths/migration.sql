CREATE TABLE "LearningPath" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "topicId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "status" TEXT NOT NULL,

    CONSTRAINT "LearningPath_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "LearningPathStep" (
    "id" TEXT NOT NULL,
    "learningPathId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "order" INTEGER NOT NULL,
    "completed" BOOLEAN NOT NULL DEFAULT false,
    "completedAt" TIMESTAMP(3),

    CONSTRAINT "LearningPathStep_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "LearningPath_userId_topicId_status_idx" ON "LearningPath"("userId", "topicId", "status");
CREATE UNIQUE INDEX "LearningPathStep_learningPathId_order_key" ON "LearningPathStep"("learningPathId", "order");
CREATE INDEX "LearningPathStep_learningPathId_idx" ON "LearningPathStep"("learningPathId");

ALTER TABLE "LearningPath"
ADD CONSTRAINT "LearningPath_userId_fkey"
FOREIGN KEY ("userId") REFERENCES "User"("id")
ON DELETE CASCADE
ON UPDATE CASCADE;

ALTER TABLE "LearningPath"
ADD CONSTRAINT "LearningPath_topicId_fkey"
FOREIGN KEY ("topicId") REFERENCES "Topic"("id")
ON DELETE CASCADE
ON UPDATE CASCADE;

ALTER TABLE "LearningPathStep"
ADD CONSTRAINT "LearningPathStep_learningPathId_fkey"
FOREIGN KEY ("learningPathId") REFERENCES "LearningPath"("id")
ON DELETE CASCADE
ON UPDATE CASCADE;
