BEGIN;

-- 10 000 Users, password Test123!
INSERT INTO public."User"(username, password, email, refresh_token, id_diet, role)
SELECT
  'user_'||gs,
  '$2b$10$krmeY/NrgyxzSZLliaub/ugUtV/KbXs0zWyAaJo4DAJq9XKHwBpPK',
  'user_'||gs||'@example.com',
  NULL,
  NULL,
  'user'
FROM generate_series(1,10000) gs
ON CONFLICT (id_user) DO NOTHING;

-- 20 000 Recipes
INSERT INTO public."Recipe"(name, instructions, image_path, added_by)
SELECT
  'Recipe '||gs,
  'Generated instructions '||gs,
  NULL,
  (1 + floor(random()*10000))::int
FROM generate_series(1,20000) gs
ON CONFLICT (id_recipe) DO NOTHING;

-- Recipe Ingredients
WITH per_recipe AS (
  SELECT id_recipe, (5 + floor(random()*11))::int AS k
  FROM public."Recipe"
)
INSERT INTO public."Ingredient_recipe"(id_recipe, id_ingredient, quantity)
SELECT
  pr.id_recipe,
  s.id_ingredient,
  (1 + floor(random()*900))::int || ' g' AS quantity
FROM per_recipe pr
JOIN LATERAL (
  SELECT gs AS id_ingredient
  FROM generate_series(1, 324) gs
  ORDER BY random()
  LIMIT pr.k
) s ON true;

-- 50 000 Ratings
DO $$
DECLARE target int := 50000;
BEGIN
  WHILE (SELECT COUNT(*) FROM public."Rating") < target LOOP
    INSERT INTO public."Rating"(id_user,id_recipe,value)
    SELECT
      (1+floor(random()*10000))::int,
      (1+floor(random()*20000))::int,
      (1+floor(random()*5))::int
    FROM generate_series(1,200000)
    ON CONFLICT DO NOTHING;
  END LOOP;
END $$;

-- 30 000 Favourties
DO $$
DECLARE target int := 30000;
BEGIN
  WHILE (SELECT COUNT(*) FROM public."Favourite") < target LOOP
    INSERT INTO public."Favourite"(id_user,id_recipe)
    SELECT
      (1+floor(random()*10000))::int,
      (1+floor(random()*20000))::int
    FROM generate_series(1,150000)
    ON CONFLICT DO NOTHING;
  END LOOP;
END $$;

-- User Ingredient, 3 per User for 5000 Users
INSERT INTO public."User_ingredient"(id_ingredient,id_user,is_excluded)
SELECT
  (1+floor(random()*324))::int,
  u,
  random()<0.5
FROM generate_series(1,5000) u
CROSS JOIN generate_series(1,3)
ON CONFLICT DO NOTHING;

-- Select Diet for 5% of Users
UPDATE public."User"
SET id_diet = (SELECT id_diet FROM public."Diet" ORDER BY random() LIMIT 1)
WHERE id_user IN (
  SELECT id_user FROM public."User"
  ORDER BY random()
  LIMIT 500
);

COMMIT;
ANALYZE VERBOSE;
-- check counts
SELECT
  (SELECT COUNT(*) FROM public."User") users,
  (SELECT COUNT(*) FROM public."Recipe") recipes,
  (SELECT COUNT(*) FROM public."Ingredient_recipe") ingredient_recipe,
  (SELECT COUNT(*) FROM public."Rating") ratings,
  (SELECT COUNT(*) FROM public."Favourite") favourites,
  (SELECT COUNT(*) FROM public."User_ingredient") user_ingredient,
  (SELECT COUNT(*) FROM public."User" WHERE id_diet IS NOT NULL) users_with_diet;
