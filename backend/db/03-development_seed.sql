INSERT INTO app_user (username, name, email, password_hash)
VALUES
  ('Admin', 'Administrator', 'acces@all.now', '123'),
  ('Manager', 'Manager Person', 'some@access.now', '123');

INSERT INTO rentable (name)
VALUES
  ('Basic Tent'),
  ('Custom Tent'),
  ('Basic Event Tent'),
  ('Custom Event Tent'),
  ('Extendable Event Tent');

-- Part seeding
INSERT INTO part (name, quantity, rentable_id)
SELECT 'Wall for Tent', 4, id FROM rentable WHERE name = 'Basic Tent'
UNION ALL
SELECT 'Custom Wall for Tent', 4, id FROM rentable WHERE name = 'Custom Tent'
UNION ALL
SELECT 'Wall for Event Tent', 4, id FROM rentable WHERE name = 'Basic Event Tent'
UNION ALL
SELECT 'Custom Wall for Event Tent', 4, id FROM rentable WHERE name = 'Custom Event Tent'
UNION ALL
SELECT 'Custom Roof for Event Tent', 4, id FROM rentable WHERE name = 'Custom Event Tent';

-- Part variant seeding
INSERT INTO part_variant (name, part_id)
SELECT 'White wall', id FROM part WHERE name = 'Custom Wall for Tent'
UNION ALL
SELECT 'Window wall', id FROM part WHERE name = 'Custom Wall for Tent'
UNION ALL
SELECT 'White wall Event Tent', id FROM part WHERE name = 'Custom Wall for Event Tent'
UNION ALL
SELECT 'Window wall Event Tent', id FROM part WHERE name = 'Custom Wall for Event Tent'
UNION ALL
SELECT 'White roof Event Tent', id FROM part WHERE name = 'Custom Roof for Event Tent'
UNION ALL
SELECT 'Window roof Event Tent', id FROM part WHERE name = 'Custom Roof for Event Tent';


-- Extension seeding
INSERT INTO extension (name, rentable_id)
SELECT '+5m', id FROM rentable WHERE name = 'Extendable Event Tent';


-- Extension part seeding
INSERT INTO extension_part_from_rentable_part (part_id, extension_id)
SELECT
  (SELECT id FROM part WHERE name = 'Custom Wall for Event Tent'),
  (SELECT id FROM extension WHERE name = '+5m')
UNION ALL
SELECT
  (SELECT id FROM part WHERE name = 'Custom Roof for Event Tent'),
  (SELECT id FROM extension WHERE name = '+5m');