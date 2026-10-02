-- Quick check database tables
SELECT 'Users' as table_name, COUNT(*) as count FROM "User"
UNION ALL
SELECT 'Places', COUNT(*) FROM "Place"
UNION ALL
SELECT 'Trips', COUNT(*) FROM "Trip"
UNION ALL
SELECT 'Interactions', COUNT(*) FROM "UserInteractionEvent";
