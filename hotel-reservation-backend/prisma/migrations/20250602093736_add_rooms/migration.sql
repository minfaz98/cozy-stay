-- Add sample rooms
INSERT INTO "Room" ("id", "number", "type", "price", "status", "image", "description", "capacity", "amenities", "createdAt", "updatedAt")
VALUES
  ('1', '101', 'SINGLE', 119.00, 'AVAILABLE', 'https://images.pexels.com/photos/164595/pexels-photo-164595.jpeg', 'Cozy single room with a comfortable bed', 1, ARRAY['WiFi', 'TV', 'Air Conditioning'], NOW(), NOW()),
  ('2', '102', 'DOUBLE', 159.00, 'AVAILABLE', 'https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg', 'Spacious double room with city view', 2, ARRAY['WiFi', 'TV', 'Air Conditioning', 'Mini Bar'], NOW(), NOW()),
  ('3', '201', 'FAMILY', 199.00, 'AVAILABLE', 'https://images.pexels.com/photos/164595/pexels-photo-164595.jpeg', 'Family room with two double beds', 4, ARRAY['WiFi', 'TV', 'Air Conditioning', 'Mini Bar', 'Sofa'], NOW(), NOW()),
  ('4', '202', 'DELUXE', 249.00, 'AVAILABLE', 'https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg', 'Deluxe room with separate living area', 2, ARRAY['WiFi', 'TV', 'Air Conditioning', 'Mini Bar', 'Sofa', 'Ocean View'], NOW(), NOW()),
  ('5', '301', 'SUITE', 399.00, 'AVAILABLE', 'https://images.pexels.com/photos/164595/pexels-photo-164595.jpeg', 'Luxury suite with panoramic views', 2, ARRAY['WiFi', 'TV', 'Air Conditioning', 'Mini Bar', 'Sofa', 'Ocean View', 'Private Balcony'], NOW(), NOW()); 