/*
  Warnings:

  - You are about to drop the `Oauthuser` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "Oauthuser";

-- CreateTable
CREATE TABLE "oauthuser" (
    "user_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "latitude" INTEGER NOT NULL,
    "longitude" INTEGER NOT NULL,

    CONSTRAINT "oauthuser_pkey" PRIMARY KEY ("user_id")
);
