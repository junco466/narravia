-- CreateEnum
CREATE TYPE "PostType" AS ENUM ('poema', 'reflexion', 'novela');

-- CreateTable
CREATE TABLE "posts" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "type" "PostType" NOT NULL,
    "content" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "excerpt" TEXT,
    "coverQuote" TEXT,
    "slug" TEXT,
    "updatedAt" TIMESTAMP(3),
    "order" INTEGER,
    "seriesSlug" TEXT,
    "seriesTitle" TEXT,
    "chapterNumber" INTEGER,
    "chapterTitle" TEXT,
    "seoDescription" TEXT,

    CONSTRAINT "posts_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "posts_type_idx" ON "posts"("type");

-- CreateIndex
CREATE INDEX "posts_seriesSlug_idx" ON "posts"("seriesSlug");
