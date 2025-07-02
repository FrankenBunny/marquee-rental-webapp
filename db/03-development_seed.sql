INSERT INTO app_user (username, name, email, password_hash)
VALUES
  ('Admin', 'Administrator', 'acces@all.now', '123'),
  ('Manager', 'Manager Person', 'some@access.now', '123');

DO
$$
DECLARE
    i INT;
BEGIN
    FOR i IN 1..250 LOOP
        INSERT INTO app_user (username, name, email, password_hash)
        VALUES (
            'user' || i,
            'User ' || i,
            'user' || i || '@example.com',
            '123'
        );
    END LOOP;
END
$$;

-- Rentable seeding
INSERT INTO rentable (name)
VALUES
  ('Basic Tent'),
  ('Custom Tent'),
  ('Basic Event Tent'),
  ('Custom Event Tent'),
  ('Extendable Event Tent');

UPDATE availability
SET
  total = v.total,
  maintenance = v.maintenance,
  broken = v.broken
FROM (
  VALUES
    ('Basic Tent', 12, 4, 2),
    ('Custom Tent', 24, 4, 4),
    ('Basic Event Tent', 10, 2, 0),
    ('Custom Event Tent', 2, 0, 0),
    ('Extendable Event Tent', 6, 3, 1)
) AS v(name, total, maintenance, broken)
JOIN rentable r ON r.name = v.name
WHERE availability.id = r.availability_id;


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

UPDATE availability
SET
  total = v.total,
  maintenance = v.maintenance,
  broken = v.broken
FROM (
  VALUES
    ('Wall for Tent', 48, 16, 8),
    ('Custom Wall for Tent', 96, 16, 16),
    ('Wall for Event Tent', 40, 8, 0),
    ('Custom Wall for Event Tent', 8, 0, 0),
    ('Custom Wall for Event Tent', 8, 0, 0)
) AS v(name, total, maintenance, broken)
JOIN part p ON p.name = v.name
WHERE availability.id = p.availability_id;

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

UPDATE availability
SET
  total = v.total,
  maintenance = v.maintenance,
  broken = v.broken
FROM (
  VALUES
    ('White wall', 48, 8, 8),
    ('Window wall', 48, 8, 8),
    ('White wall Event Tent', 4, 0, 0),
    ('Window wall Event Tent', 4, 0, 0),
    ('White roof Event Tent', 20, 0, 0),
    ('Window roof Event Tent', 20, 0, 0)
) AS v(name, total, maintenance, broken)
JOIN part_variant pv ON pv.name = v.name
WHERE availability.id = pv.availability_id;

-- Extension seeding
INSERT INTO extension (name, rentable_id)
SELECT '+5m', id FROM rentable WHERE name = 'Extendable Event Tent';

UPDATE availability
SET
  total = v.total,
  maintenance = v.maintenance,
  broken = v.broken
FROM (
  VALUES
    ('Extendable Event Tent', 8, 0, 0)
) AS v(name, total, maintenance, broken)
JOIN extension e ON e.name = v.name
WHERE availability.id = e.availability_id;


-- Extension part seeding
INSERT INTO extension_part_from_rentable_part (part_id, extension_id)
SELECT
  (SELECT id FROM part WHERE name = 'Custom Wall for Event Tent'),
  (SELECT id FROM extension WHERE name = '+5m')
UNION ALL
SELECT
  (SELECT id FROM part WHERE name = 'Custom Roof for Event Tent'),
  (SELECT id FROM extension WHERE name = '+5m');


-- Item seeding
INSERT INTO item (name)
VALUES
  ('10kg Cement Blocks'),
  ('Ground bolts');

UPDATE availability
SET
  total = v.total,
  maintenance = v.maintenance,
  broken = v.broken
FROM (
  VALUES
    ('10kg Cement Blocks', 100, 0, 0),
    ('Ground bolts', 1000, 0, 0)
) AS v(name, total, maintenance, broken)
JOIN item i ON i.name = v.name
WHERE availability.id = i.availability_id;