-- Elimina cron previo si existe (idempotente)
SELECT cron.unschedule('sitemap-monitor-daily')
WHERE EXISTS (SELECT 1 FROM cron.job WHERE jobname = 'sitemap-monitor-daily');

-- Programa verificación diaria a las 08:00 UTC (05:00 hora Chile en invierno)
SELECT cron.schedule(
  'sitemap-monitor-daily',
  '0 8 * * *',
  $$
  SELECT net.http_post(
    url := 'https://oegvwjxrlmtwortyhsrv.supabase.co/functions/v1/sitemap-monitor',
    headers := '{"Content-Type": "application/json"}'::jsonb,
    body := '{}'::jsonb
  ) AS request_id;
  $$
);