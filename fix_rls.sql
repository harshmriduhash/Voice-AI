-- 1. DROP the existing insecure update policy
DROP POLICY IF EXISTS "Users can update own profile." ON profiles;

-- 2. CREATE a more restrictive update policy
-- Users can only update their own profile, but we should ideally prevent 
-- them from updating 'credits_remaining' directly.
-- In Supabase, RLS applies to the whole row. To restrict specific columns,
-- we usually use a separate table or a security definer function.
-- For a quick fix, we enable updates ONLY if the user is not trying to 
-- change their credits (this is tricky in pure SQL RLS without seeing the NEW vs OLD).
-- A better approach for now: ONLY allow updates to 'email' and 'subscription_status' 
-- if you have a management UI. If users don't need to update anything, we can just REMOVE it.

CREATE POLICY "Users can update limited profile data." ON profiles
  FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (
    auth.uid() = id 
    -- This is a soft check; a more robust solution is a database trigger 
    -- that rejects credit changes from non-service-role users.
  );

-- 3. Robust fix: Add a trigger to prevent credit updates from the client
CREATE OR REPLACE FUNCTION protect_credits()
RETURNS TRIGGER AS $$
BEGIN
  IF (TG_OP = 'UPDATE') THEN
    IF (NEW.credits_remaining <> OLD.credits_remaining AND current_setting('role') = 'authenticated') THEN
      -- Reset the credit change if it didn't come from the service_role/API
      NEW.credits_remaining := OLD.credits_remaining;
    END IF;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS tr_protect_credits ON profiles;
CREATE TRIGGER tr_protect_credits
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION protect_credits();

-- 4. Update the select policy to be private (Users only see their own credits)
DROP POLICY IF EXISTS "Public profiles are viewable by everyone." ON profiles;
CREATE POLICY "Users can view own profile." ON profiles
  FOR SELECT USING (auth.uid() = id);
