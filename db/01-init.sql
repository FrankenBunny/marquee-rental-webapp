-- Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- User Management
CREATE TABLE app_user (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    username VARCHAR(32) NOT NULL UNIQUE,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(254) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE role (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(32) NOT NULL UNIQUE
);

CREATE TABLE user_role (
    user_id UUID NOT NULL,
    role_id UUID NOT NULL,
    PRIMARY KEY (user_id, role_id),
    FOREIGN KEY (user_id) REFERENCES app_user(id) ON DELETE CASCADE,
    FOREIGN KEY (role_id) REFERENCES role(id) ON DELETE CASCADE
);


-- Inventory Management System 
CREATE TABLE availability (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    total INTEGER DEFAULT 0 NOT NULL,
    maintanence INTEGER DEFAULT 0 NOT NULL,
    broken INTEGER DEFAULT 0 NOT NULL
);

/* 
 *  Has trigger which updates has_extension, has_part if 
 *  extensions or parts are added referencing a tuple in
 *  the table.
*/
CREATE TABLE rentable (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(32) NOT NULL UNIQUE,
    description varchar(255),
    has_extensions BOOLEAN DEFAULT FALSE NOT NULL,
    has_parts BOOLEAN DEFAULT FALSE NOT NULL,
    availability_id UUID NOT NULL,
    FOREIGN KEY (availability_id) REFERENCES availability(id) ON DELETE CASCADE
);

CREATE TABLE part (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(32) NOT NULL UNIQUE,
    description VARCHAR(255),
    interchangeable BOOLEAN DEFAULT FALSE NOT NULL,
    quantity INTEGER DEFAULT 0 NOT NULL,
    rentable_id UUID NOT NULL,
    availability_id UUID,
    FOREIGN KEY (rentable_id) REFERENCES rentable(id) ON DELETE CASCADE,
    FOREIGN KEY (availability_id) REFERENCES availability(id) ON DELETE SET NULL
);

CREATE TABLE part_variant (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(32) NOT NULL UNIQUE,
    description VARCHAR(255),
    part_id UUID NOT NULL,
    availability_id UUID NOT NULL,
    FOREIGN KEY (part_id) REFERENCES part(id) ON DELETE CASCADE,
    FOREIGN KEY (availability_id) REFERENCES availability(id) ON DELETE CASCADE
);

CREATE TABLE extension (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(32) NOT NULL UNIQUE,
    description VARCHAR(255),
    has_parts BOOLEAN DEFAULT FALSE NOT NULL,
    rentable_id UUID NOT NULL,
    availability_id UUID NOT NULL,
    FOREIGN KEY (rentable_id) REFERENCES rentable(id) ON DELETE CASCADE,
    FOREIGN KEY (availability_id) REFERENCES availability(id) ON DELETE CASCADE
);

CREATE TABLE extension_part_from_rentable_part (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    part_id UUID NOT NULL,
    extension_id UUID NOT NULL,
    FOREIGN KEY (part_id) REFERENCES part(id) ON DELETE CASCADE,
    FOREIGN KEY (extension_id) REFERENCES extension(id) ON DELETE CASCADE
);

CREATE TABLE item (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(32) NOT NULL UNIQUE,
    description VARCHAR(255),
    availability_id UUID NOT NULL,
    FOREIGN KEY (availability_id) REFERENCES availability(id) ON DELETE CASCADE
);

-- Create availability tuple on INSERT
CREATE OR REPLACE FUNCTION assign_availability()
RETURNS TRIGGER AS $$
DECLARE
    new_availability_id UUID;
BEGIN
    INSERT INTO availability DEFAULT VALUES
    RETURNING id INTO new_availability_id;

    NEW.availability_id := new_availability_id;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER insert_rentable_availability
BEFORE INSERT ON rentable
FOR EACH ROW
EXECUTE FUNCTION assign_availability();

CREATE TRIGGER insert_part_availability
BEFORE INSERT ON part
FOR EACH ROW
EXECUTE FUNCTION assign_availability();

CREATE TRIGGER insert_part_variant_availability
BEFORE INSERT ON part_variant
FOR EACH ROW
EXECUTE FUNCTION assign_availability();

CREATE TRIGGER insert_extension_availability
BEFORE INSERT ON extension
FOR EACH ROW
EXECUTE FUNCTION assign_availability();

CREATE TRIGGER insert_item_availability
BEFORE INSERT ON item
FOR EACH ROW
EXECUTE FUNCTION assign_availability();


-- Remove availability
CREATE OR REPLACE FUNCTION on_delete_remove_availability()
RETURNS TRIGGER AS $$
BEGIN
    DELETE FROM availability
    WHERE id = OLD.availability_id;

    RETURN OLD;
END
$$ LANGUAGE plpgsql;

CREATE TRIGGER delete_rentable_availability
AFTER DELETE ON rentable
FOR EACH ROW
WHEN (OLD.availability_id IS NOT NULL)
EXECUTE FUNCTION on_delete_remove_availability();

CREATE TRIGGER delete_part_availability
AFTER DELETE ON part
FOR EACH ROW
WHEN (OLD.availability_id IS NOT NULL)
EXECUTE FUNCTION on_delete_remove_availability();

CREATE TRIGGER delete_part_variant_availability
AFTER DELETE ON part_variant
FOR EACH ROW
WHEN (OLD.availability_id IS NOT NULL)
EXECUTE FUNCTION on_delete_remove_availability();

CREATE TRIGGER delete_extension_availability
AFTER DELETE ON extension
FOR EACH ROW
WHEN (OLD.availability_id IS NOT NULL)
EXECUTE FUNCTION on_delete_remove_availability();

CREATE TRIGGER delete_item_availability
AFTER DELETE ON item
FOR EACH ROW
WHEN (OLD.availability_id IS NOT NULL)
EXECUTE FUNCTION on_delete_remove_availability();



-- If part INSERT update rentable
CREATE OR REPLACE FUNCTION update_rentable_has_parts()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE rentable
    SET has_parts = TRUE
    WHERE id = NEW.rentable_id;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;


CREATE TRIGGER on_part_insert_update_rentable
AFTER INSERT ON part
FOR EACH ROW
EXECUTE FUNCTION update_rentable_has_parts();

-- If part variants are added to part
CREATE OR REPLACE FUNCTION update_part_as_interchangeable()
RETURNS TRIGGER AS $$
DECLARE
    part_availability_id UUID;
BEGIN
    SELECT availability_id INTO part_availability_id
    FROM part
    WHERE id = NEW.part_id;

    DELETE FROM availability WHERE id = part_availability_id;

    UPDATE part
    SET interchangeable = TRUE,
        availability_id = NULL
    WHERE id = NEW.part_id;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;


CREATE TRIGGER on_part_variant_insert_update_part
AFTER INSERT ON part_variant
FOR EACH ROW
EXECUTE FUNCTION update_part_as_interchangeable();


-- If extenstion_part_from_rentable_part INSERT update rentable
CREATE OR REPLACE FUNCTION update_extension_has_parts()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE extension
    SET has_parts = TRUE
    WHERE id = NEW.extension_id;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;


CREATE TRIGGER on_part_insert_update_rentable
AFTER INSERT ON extension_part_from_rentable_part
FOR EACH ROW
EXECUTE FUNCTION update_extension_has_parts();
