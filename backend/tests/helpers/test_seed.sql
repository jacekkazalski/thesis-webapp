BEGIN;

DELETE FROM public."User_ingredient";
DELETE FROM public."Favourite";
DELETE FROM public."Rating";
DELETE FROM public."Ingredient_recipe";
DELETE FROM public."Recipe";
DELETE FROM public."User";
DELETE FROM public."Ingredient_diet";
DELETE FROM public."Diet";
DELETE FROM public."Ingredient_category";
DELETE FROM public."Ingredient";
DELETE FROM public."Category";

ALTER SEQUENCE public."Ingredient_id_ingredient_seq" RESTART WITH 1;
ALTER SEQUENCE public."Diet_id_diet_seq" RESTART WITH 1;
ALTER SEQUENCE public."Recipe_id_recipe_seq" RESTART WITH 1;
ALTER SEQUENCE public."User_id_user_seq" RESTART WITH 1;

INSERT INTO public."Category"(id_category, name)
	VALUES
		(1, 'Mięso'),
		(2, 'Inne');

INSERT INTO public."Ingredient"(name)
	VALUES
		('Wieprzowina'),
		('Wołowina'),
		('Marchewka'),
		('Mleko'),
		('Mąka'),
		('Jajko'),
		('Jabłko');

INSERT INTO public."Ingredient_category"(id_ingredient, id_category)
	VALUES
		(1, 1),
		(2, 1),
		(3, 2),
		(4, 2),
		(5, 2),
		(6, 2),
		(7, 2);


INSERT INTO public."User"(username, password, email, role)
	VALUES 
		('user_1', 
		'$2b$10$krmeY/NrgyxzSZLliaub/ugUtV/KbXs0zWyAaJo4DAJq9XKHwBpPK',
		'user_1@seed.com',
		'user'), 
		('user_2',
		'$2b$10$krmeY/NrgyxzSZLliaub/ugUtV/KbXs0zWyAaJo4DAJq9XKHwBpPK',
		'user_2@seed.com',
		'user'),
		('mod_1',
		'$2b$10$krmeY/NrgyxzSZLliaub/ugUtV/KbXs0zWyAaJo4DAJq9XKHwBpPK',
		'mod_1@seed.com',
		'mod');

INSERT INTO public."Recipe"(name, instructions, added_by)
	VALUES
		('User_1 Recipe_1 (Meat)', 'Instructions', 1),
		('User_1 Recipe_2 (No meat)', 'Instructions', 1),
		('User_2 Recipe_1', 'Instructions', 2);


INSERT INTO public."Ingredient_recipe"(id_recipe, id_ingredient)
	VALUES
		(1, 1),
		(1, 2),
		(1, 3),
		(2, 3),
		(2, 4),
		(2, 5),
		(3, 6),
		(3, 5);

INSERT INTO public."Rating"(id_user, id_recipe, value)
	VALUES
		(1, 2, 5),
		(1, 3, 2),
		(2, 2, 4),
		(2, 3, 5);

INSERT INTO public."Favourite"(id_user, id_recipe)
	VALUES
		(1, 1),
		(2, 2),
		(1, 2);


INSERT INTO public."User_ingredient"(id_ingredient, id_user, is_excluded)
	VALUES
		(1, 1, false),
		(2, 1, false),
		(7, 2, true);


INSERT INTO public."Diet" (name)
	VALUES
		('Wegetariańska');

INSERT INTO public."Ingredient_diet" (id_ingredient, id_diet)
	SELECT DISTINCT ic.id_ingredient, 1
		FROM public."Ingredient_category" ic
		JOIN public."Category" c ON c.id_category = ic.id_category
		WHERE c.name IN ('Mięso');

UPDATE public."User" SET id_diet = 1 WHERE id_user = 2;

COMMIT;

-- check counts
SELECT
  (SELECT COUNT(*) FROM public."User") users,
  (SELECT COUNT(*) FROM public."Recipe") recipes,
  (SELECT COUNT(*) FROM public."Ingredient_recipe") ingredient_recipe,
  (SELECT COUNT(*) FROM public."Rating") ratings,
  (SELECT COUNT(*) FROM public."Favourite") favourites,
  (SELECT COUNT(*) FROM public."User_ingredient") user_ingredient,
  (SELECT COUNT(*) FROM public."User" WHERE id_diet IS NOT NULL) users_with_diet;

