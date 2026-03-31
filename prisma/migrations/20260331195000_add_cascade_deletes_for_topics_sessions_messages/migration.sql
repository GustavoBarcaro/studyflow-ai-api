ALTER TABLE "Topic" DROP CONSTRAINT "Topic_userId_fkey";
ALTER TABLE "StudySession" DROP CONSTRAINT "StudySession_topicId_fkey";
ALTER TABLE "StudySession" DROP CONSTRAINT "StudySession_userId_fkey";
ALTER TABLE "Message" DROP CONSTRAINT "Message_sessionId_fkey";

ALTER TABLE "Topic"
ADD CONSTRAINT "Topic_userId_fkey"
FOREIGN KEY ("userId") REFERENCES "User"("id")
ON DELETE CASCADE
ON UPDATE CASCADE;

ALTER TABLE "StudySession"
ADD CONSTRAINT "StudySession_topicId_fkey"
FOREIGN KEY ("topicId") REFERENCES "Topic"("id")
ON DELETE CASCADE
ON UPDATE CASCADE;

ALTER TABLE "StudySession"
ADD CONSTRAINT "StudySession_userId_fkey"
FOREIGN KEY ("userId") REFERENCES "User"("id")
ON DELETE CASCADE
ON UPDATE CASCADE;

ALTER TABLE "Message"
ADD CONSTRAINT "Message_sessionId_fkey"
FOREIGN KEY ("sessionId") REFERENCES "StudySession"("id")
ON DELETE CASCADE
ON UPDATE CASCADE;
