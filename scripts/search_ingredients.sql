WITH  
  candidates AS (
    SELECT DISTINCT ir.id_recipe
    FROM public."Ingredient_recipe" ir
    WHERE ir.id_ingredient = ANY(ARRAY[1, 2, 3]::int[])
  ),
  excluded AS (
    SELECT DISTINCT irx.id_recipe
    FROM public."Ingredient_recipe" irx
    WHERE irx.id_ingredient = ANY(ARRAY[]::int[])
  ),
  ir_aggr AS (
    SELECT
      ir.id_recipe,
      COUNT(ir.id_ingredient) AS total_count,
      COUNT(*) FILTER (WHERE ir.id_ingredient = ANY(ARRAY[1, 2, 3]::int[])) AS matched_count
    FROM public."Ingredient_recipe" ir
    JOIN candidates c ON ir.id_recipe = c.id_recipe
    GROUP BY ir.id_recipe
  ),
  rt_aggr AS (
    SELECT
      rt.id_recipe,
      COALESCE(AVG(rt.value), 0) AS rating
    FROM public."Rating" rt
    JOIN candidates c ON rt.id_recipe = c.id_recipe
    GROUP BY rt.id_recipe
  )
SELECT
  r.id_recipe,
  r.name,
  r.image_path,
  ir_aggr.total_count AS total_count,
  ir_aggr.matched_count AS matched_count,
  rt_aggr.rating AS rating
FROM public."Recipe" r
JOIN candidates c ON r.id_recipe = c.id_recipe
LEFT JOIN excluded e ON e.id_recipe = r.id_recipe
LEFT JOIN ir_aggr ON ir_aggr.id_recipe = r.id_recipe
LEFT JOIN rt_aggr ON rt_aggr.id_recipe = r.id_recipe
WHERE e.id_recipe IS NULL
  AND (NULL::text IS NULL OR r.name ILIKE NULL)
ORDER BY matched_count DESC, total_count ASC, r.id_recipe DESC
LIMIT 48 OFFSET 0;