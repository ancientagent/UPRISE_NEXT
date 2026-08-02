CREATE TABLE "avatar_profiles" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "identityRender" TEXT NOT NULL,
    "musicCommunity" TEXT NOT NULL,
    "expression" TEXT NOT NULL,
    "starterTopId" TEXT NOT NULL DEFAULT 'uprise-tee-black',
    "configuration" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "avatar_profiles_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "avatar_profiles_userId_key" ON "avatar_profiles"("userId");

ALTER TABLE "avatar_profiles"
ADD CONSTRAINT "avatar_profiles_userId_fkey"
FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
