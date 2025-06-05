-- Add new columns to Room table
ALTER TABLE "Room" ADD COLUMN "image" TEXT DEFAULT 'https://images.pexels.com/photos/164595/pexels-photo-164595.jpeg';
ALTER TABLE "Room" ADD COLUMN "description" TEXT;
ALTER TABLE "Room" ADD COLUMN "capacity" INTEGER DEFAULT 2;
ALTER TABLE "Room" ADD COLUMN "amenities" TEXT[] DEFAULT ARRAY[]::TEXT[]; 