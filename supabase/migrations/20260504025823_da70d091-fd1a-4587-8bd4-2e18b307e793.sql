
-- Limpiar jobs previos con el mismo nombre por idempotencia
DO $$
BEGIN
  PERFORM cron.unschedule('uptime-monitor-hourly');
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

DO $$
BEGIN
  PERFORM cron.unschedule('benchmark-monthly');
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

SELECT cron.schedule(
  'uptime-monitor-hourly',
  '0 * * * *',
  $$
  SELECT net.http_post(
    url:='https://oegvwjxrlmtwortyhsrv.supabase.co/functions/v1/uptime-monitor',
    headers:='{"Content-Type":"application/json","apikey":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9lZ3Z3anhybG10d29ydHloc3J2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY0NjA4NzEsImV4cCI6MjA2MjAzNjg3MX0.ruA3v0xiTGgH2vubqAnWPgbvwSOlaVp7Oc0e2YeZq4M"}'::jsonb,
    body:='{}'::jsonb
  ) AS request_id;
  $$
);

SELECT cron.schedule(
  'benchmark-monthly',
  '0 6 1 * *',
  $$
  SELECT net.http_post(
    url:='https://oegvwjxrlmtwortyhsrv.supabase.co/functions/v1/run-benchmark',
    headers:='{"Content-Type":"application/json","apikey":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9lZ3Z3anhybG10d29ydHloc3J2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY0NjA4NzEsImV4cCI6MjA2MjAzNjg3MX0.ruA3v0xiTGgH2vubqAnWPgbvwSOlaVp7Oc0e2YeZq4M"}'::jsonb,
    body:='{}'::jsonb
  ) AS request_id;
  $$
);
