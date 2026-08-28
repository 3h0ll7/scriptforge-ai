CREATE TABLE public.user_usage (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL UNIQUE REFERENCES public.profiles(id) ON DELETE CASCADE,
  generations_used integer NOT NULL DEFAULT 0,
  free_limit integer NOT NULL DEFAULT 5,
  current_period_start timestamptz NOT NULL DEFAULT date_trunc('month', now()),
  current_period_end timestamptz NOT NULL DEFAULT (date_trunc('month', now()) + interval '1 month'),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT ON public.user_usage TO authenticated;
GRANT ALL ON public.user_usage TO service_role;

ALTER TABLE public.user_usage ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own usage row"
ON public.user_usage FOR SELECT TO authenticated
USING (auth.uid() = user_id);

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

REVOKE EXECUTE ON FUNCTION public.update_updated_at_column() FROM PUBLIC, anon, authenticated;

CREATE TRIGGER update_user_usage_updated_at
BEFORE UPDATE ON public.user_usage
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Read-only status for the signed-in user (period-aware, never mutates)
CREATE OR REPLACE FUNCTION public.get_usage_status()
RETURNS TABLE (
  generations_used integer,
  free_limit integer,
  remaining integer,
  current_period_start timestamptz,
  current_period_end timestamptz
)
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  u public.user_usage%ROWTYPE;
BEGIN
  IF auth.uid() IS NULL THEN
    RETURN;
  END IF;

  SELECT * INTO u FROM public.user_usage WHERE user_id = auth.uid();

  IF NOT FOUND OR u.current_period_end <= now() THEN
    RETURN QUERY SELECT 0, COALESCE(u.free_limit, 5), COALESCE(u.free_limit, 5),
      date_trunc('month', now()), date_trunc('month', now()) + interval '1 month';
  ELSE
    RETURN QUERY SELECT u.generations_used, u.free_limit,
      GREATEST(u.free_limit - u.generations_used, 0), u.current_period_start, u.current_period_end;
  END IF;
END;
$$;

REVOKE EXECUTE ON FUNCTION public.get_usage_status() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.get_usage_status() TO authenticated;

-- Server-only: atomically roll the period and consume one generation
CREATE OR REPLACE FUNCTION public.consume_generation(_user_id uuid)
RETURNS TABLE (
  allowed boolean,
  generations_used integer,
  free_limit integer,
  remaining integer
)
LANGUAGE plpgsql
VOLATILE
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  u public.user_usage%ROWTYPE;
BEGIN
  INSERT INTO public.user_usage (user_id)
  VALUES (_user_id)
  ON CONFLICT (user_id) DO NOTHING;

  SELECT * INTO u FROM public.user_usage WHERE user_id = _user_id FOR UPDATE;

  IF u.current_period_end <= now() THEN
    UPDATE public.user_usage
    SET generations_used = 0,
        current_period_start = date_trunc('month', now()),
        current_period_end = date_trunc('month', now()) + interval '1 month'
    WHERE user_id = _user_id
    RETURNING * INTO u;
  END IF;

  IF u.generations_used >= u.free_limit THEN
    RETURN QUERY SELECT false, u.generations_used, u.free_limit, 0;
    RETURN;
  END IF;

  UPDATE public.user_usage
  SET generations_used = u.generations_used + 1
  WHERE user_id = _user_id
  RETURNING * INTO u;

  RETURN QUERY SELECT true, u.generations_used, u.free_limit,
    GREATEST(u.free_limit - u.generations_used, 0);
END;
$$;

REVOKE EXECUTE ON FUNCTION public.consume_generation(uuid) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.consume_generation(uuid) TO service_role;