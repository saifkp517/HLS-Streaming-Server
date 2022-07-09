-- CreateTable
CREATE TABLE "oauthuser" (
    "user_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "latitude" INTEGER NOT NULL,
    "longitude" INTEGER NOT NULL,

    CONSTRAINT "oauthuser_pkey" PRIMARY KEY ("user_id")
);
