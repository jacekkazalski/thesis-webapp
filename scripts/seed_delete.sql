BEGIN;


DELETE FROM public."Rating";
DELETE FROM public."Favourite";
DELETE FROM public."Ingredient_recipe";
DELETE FROM public."User_ingredient";
DELETE FROM public."Ingredient_category";
DELETE FROM public."Ingredient_diet";


DELETE FROM public."Recipe";
DELETE FROM public."User";

-- opcjonalnie
DELETE FROM public."Ingredient";
DELETE FROM public."Diet";
DELETE FROM public."Category";
ALTER SEQUENCE public."Ingredient_id_ingredient_seq" RESTART WITH 1;
ALTER SEQUENCE public."Diet_id_diet_seq" RESTART WITH 1;

-- reset sekwencji
ALTER SEQUENCE public."Recipe_id_recipe_seq" RESTART WITH 1;
ALTER SEQUENCE public."User_id_user_seq" RESTART WITH 1;

COMMIT;
