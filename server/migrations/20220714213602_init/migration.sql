-- CreateTable
CREATE TABLE "oauthuser" (
    "user_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "live" BOOLEAN NOT NULL,
    "userKey" TEXT NOT NULL,

    CONSTRAINT "oauthuser_pkey" PRIMARY KEY ("user_id")
);
