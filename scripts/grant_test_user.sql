GRANT DELETE, INSERT, UPDATE, SELECT ON ALL TABLES IN SCHEMA public TO test_user;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO test_user;
ALTER TABLE public."User"                   OWNER TO test_user;
ALTER TABLE public."Recipe"                 OWNER TO test_user;
ALTER TABLE public."Ingredient"             OWNER TO test_user;
ALTER TABLE public."Category"               OWNER TO test_user;
ALTER TABLE public."Ingredient_category"    OWNER TO test_user;
ALTER TABLE public."Rating"                 OWNER TO test_user;
ALTER TABLE public."Favourite"              OWNER TO test_user;
ALTER TABLE public."User_ingredient"        OWNER TO test_user;
ALTER TABLE public."Diet"                   OWNER TO test_user;
ALTER TABLE public."Ingredient_diet"        OWNER TO test_user;
ALTER TABLE public."Ingredient_recipe"      OWNER TO test_user;

ALTER SEQUENCE public."Ingredient_id_ingredient_seq" OWNER TO test_user;
ALTER SEQUENCE public."Diet_id_diet_seq"           OWNER TO test_user;
ALTER SEQUENCE public."Recipe_id_recipe_seq"       OWNER TO test_user;
ALTER SEQUENCE public."User_id_user_seq"           OWNER TO test_user;