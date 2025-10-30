-- Insert default certification categories
INSERT INTO certification_categories (slug, name, description, icon, is_active, display_order, premium_price_clp, criteria, free_tier_features, premium_features) VALUES
('mejor-hosting-chile', 'Mejor Hosting Chile', 'Certificación para el mejor proveedor de hosting en Chile', '🏆', true, 1, 99000, 
  '{"min_rating": 4.5, "min_reviews": 10, "min_uptime": 99.9}',
  '["Badge en perfil", "Listado en categoría"]',
  '["Posición destacada", "Badge premium", "Prioridad en resultados", "Soporte prioritario"]'
),
('mejor-soporte', 'Mejor Soporte', 'Reconocimiento por excelencia en soporte técnico', '🎧', true, 2, 79000,
  '{"min_support_rating": 4.5, "response_time_hours": 24}',
  '["Badge en perfil", "Listado en categoría"]',
  '["Posición destacada", "Badge premium", "Destacado en búsquedas", "Soporte prioritario"]'
),
('mejor-relacion-precio', 'Mejor Relación Precio/Calidad', 'Mejor balance entre precio y calidad de servicio', '💰', true, 3, 69000,
  '{"min_price_rating": 4.0, "min_overall_rating": 4.0}',
  '["Badge en perfil", "Listado en categoría"]',
  '["Posición destacada", "Badge premium", "Destacado en comparativas", "Analytics avanzado"]'
),
('hosting-wordpress', 'Hosting WordPress Especializado', 'Certificación para hosting optimizado para WordPress', '🔷', true, 4, 89000,
  '{"wordpress_optimization": true, "min_speed_rating": 4.0}',
  '["Badge en perfil", "Listado en categoría"]',
  '["Posición destacada", "Badge premium", "Guía WordPress exclusiva", "Soporte WordPress prioritario"]'
),
('hosting-verde', 'Hosting Sustentable', 'Reconocimiento por prácticas sustentables y energía renovable', '🌱', true, 5, 79000,
  '{"green_energy": true, "carbon_neutral": true}',
  '["Badge en perfil", "Listado en categoría"]',
  '["Posición destacada", "Badge premium", "Sello verde destacado", "Marketing sustentable"]'
),
('hosting-seguro', 'Hosting Más Seguro', 'Certificación por mejores prácticas de seguridad', '🔒', true, 6, 89000,
  '{"ssl_free": true, "backup_daily": true, "firewall": true}',
  '["Badge en perfil", "Listado en categoría"]',
  '["Posición destacada", "Badge premium", "Sello de seguridad", "Auditoría gratuita"]'
)
ON CONFLICT (slug) DO NOTHING;