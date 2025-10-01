-- Fix assignment status check constraint
-- Remove the existing constraint and add a new one with correct values
ALTER TABLE assignments DROP CONSTRAINT IF EXISTS assignments_status_check;

-- Add new constraint with correct status values
ALTER TABLE assignments ADD CONSTRAINT assignments_status_check 
CHECK (status IN ('pending', 'active', 'completed', 'cancelled'));

-- Fix payment status check constraint
-- Remove the existing constraint and add a new one with correct values
ALTER TABLE payments DROP CONSTRAINT IF EXISTS payments_payment_status_check;

-- Add new constraint with correct payment status values
ALTER TABLE payments ADD CONSTRAINT payments_payment_status_check 
CHECK (payment_status IN ('pending', 'paid', 'overdue', 'cancelled', 'failed'));

-- Ensure default values are correct
ALTER TABLE assignments ALTER COLUMN status SET DEFAULT 'pending';
ALTER TABLE payments ALTER COLUMN payment_status SET DEFAULT 'pending';