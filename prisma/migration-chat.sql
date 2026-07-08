CREATE TYPE "ConversationType" AS ENUM ('SPACE', 'ADMIN_SUPPORT');

CREATE TABLE "Conversation" (
  "id" TEXT NOT NULL,
  "type" "ConversationType" NOT NULL DEFAULT 'SPACE',
  "subject" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  "lastMessageAt" TIMESTAMP(3),
  "buyerId" TEXT,
  "sellerId" TEXT,
  "adminId" TEXT,
  "spaceId" TEXT,
  CONSTRAINT "Conversation_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "ConversationMessage" (
  "id" TEXT NOT NULL,
  "content" TEXT NOT NULL,
  "isRead" BOOLEAN NOT NULL DEFAULT false,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "conversationId" TEXT NOT NULL,
  "senderId" TEXT NOT NULL,
  CONSTRAINT "ConversationMessage_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "Conversation_buyerId_idx" ON "Conversation"("buyerId");
CREATE INDEX "Conversation_sellerId_idx" ON "Conversation"("sellerId");
CREATE INDEX "Conversation_adminId_idx" ON "Conversation"("adminId");
CREATE INDEX "Conversation_spaceId_idx" ON "Conversation"("spaceId");
CREATE INDEX "Conversation_type_idx" ON "Conversation"("type");
CREATE INDEX "ConversationMessage_conversationId_createdAt_idx" ON "ConversationMessage"("conversationId", "createdAt");
CREATE INDEX "ConversationMessage_senderId_idx" ON "ConversationMessage"("senderId");

ALTER TABLE "Conversation"
  ADD CONSTRAINT "Conversation_buyerId_fkey"
  FOREIGN KEY ("buyerId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "Conversation"
  ADD CONSTRAINT "Conversation_sellerId_fkey"
  FOREIGN KEY ("sellerId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "Conversation"
  ADD CONSTRAINT "Conversation_adminId_fkey"
  FOREIGN KEY ("adminId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "Conversation"
  ADD CONSTRAINT "Conversation_spaceId_fkey"
  FOREIGN KEY ("spaceId") REFERENCES "Space"("id") ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "ConversationMessage"
  ADD CONSTRAINT "ConversationMessage_conversationId_fkey"
  FOREIGN KEY ("conversationId") REFERENCES "Conversation"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "ConversationMessage"
  ADD CONSTRAINT "ConversationMessage_senderId_fkey"
  FOREIGN KEY ("senderId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
