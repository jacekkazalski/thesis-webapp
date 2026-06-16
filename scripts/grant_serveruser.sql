BEGIN;
GRANT USAGE ON SCHEMA public TO server_user;
-- Read-only tables
GRANT SELECT ON TABLE public."Category"            TO server_user;
GRANT SELECT ON TABLE public."Ingredient"          TO server_user;
GRANT SELECT ON TABLE public."Ingredient_category" TO server_user;

-- Full access tables
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public."Diet"              TO server_user;
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public."Favourite"         TO server_user;
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public."Ingredient_diet"   TO server_user;
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public."Ingredient_recipe" TO server_user;
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public."Rating"            TO server_user;
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public."Recipe"            TO server_user;
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public."User"              TO server_user;
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public."User_ingredient"   TO server_user;

GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO server_user;


COMMIT;
