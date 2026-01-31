-- Function to check tolerance and update status
CREATE OR REPLACE FUNCTION check_attendance_tolerance()
RETURNS TRIGGER AS $$
DECLARE
    emp_shift_id UUID;
    shift_start TIME;
    tolerance_mins INT;
    tolerance_interval INTERVAL;
    allowed_time TIME;
BEGIN
    -- Get employee's shift_id
    SELECT shift_id INTO emp_shift_id
    FROM employees
    WHERE id = NEW.employee_id;

    -- If no shift assigned, keep original status
    IF emp_shift_id IS NULL THEN
        RETURN NEW;
    END IF;

    -- Get shift details
    SELECT start_time, late_tolerance_minutes INTO shift_start, tolerance_mins
    FROM shifts
    WHERE id = emp_shift_id;

    -- If shift not found, return
    IF shift_start IS NULL THEN
        RETURN NEW;
    END IF;

    -- Default tolerance to 0 if null
    IF tolerance_mins IS NULL THEN
        tolerance_mins := 0;
    END IF;

    -- Calculate allowed time
    tolerance_interval := make_interval(mins => tolerance_mins);
    allowed_time := shift_start + tolerance_interval;

    -- Update status if within allowed time (Start Time + Tolerance)
    IF NEW.check_in <= allowed_time THEN
        NEW.status := 'Present';
    ELSE
        -- If check_in is after allowed_time, it is Late.
        -- We explicitly set it ensuring the DB enforces the rule.
        NEW.status := 'Late';
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Drop trigger if exists to allow clean re-creation
DROP TRIGGER IF EXISTS trigger_check_attendance_tolerance ON attendance;

-- Create Trigger
CREATE TRIGGER trigger_check_attendance_tolerance
BEFORE INSERT ON attendance
FOR EACH ROW
EXECUTE FUNCTION check_attendance_tolerance();
