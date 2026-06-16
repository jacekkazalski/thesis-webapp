



SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;


CREATE EXTENSION IF NOT EXISTS pg_stat_statements WITH SCHEMA public;


SET default_tablespace = '';

SET default_table_access_method = heap;


CREATE TABLE public."Category" (
    id_category integer PRIMARY KEY,
    name character varying(20) NOT NULL UNIQUE
);


CREATE TABLE public."Ingredient" (
    id_ingredient integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    name character varying(50) NOT NULL UNIQUE
);


CREATE TABLE public."Ingredient_category" (
    id_ingredient integer NOT NULL REFERENCES public."Ingredient"(id_ingredient) ON DELETE CASCADE,
    id_category integer NOT NULL REFERENCES public."Category"(id_category) ON DELETE CASCADE,
	PRIMARY KEY(id_ingredient, id_category)
);


CREATE TABLE public."Diet" (
    id_diet integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    name character varying(25) NOT NULL UNIQUE
);


CREATE TABLE public."Ingredient_diet" (
    id_ingredient integer  NOT NULL REFERENCES public."Ingredient"(id_ingredient) ON DELETE CASCADE,
    id_diet integer NOT NULL REFERENCES public."Diet"(id_diet) ON DELETE CASCADE,
	PRIMARY KEY(id_diet, id_ingredient)
);


CREATE TABLE public."User" (
    id_user integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    username character varying(50) NOT NULL UNIQUE,
    password character varying(255) NOT NULL,
    email character varying(50) NOT NULL UNIQUE,
    refresh_token character varying(255),
    id_diet integer REFERENCES public."Diet"(id_diet),
	banned_until TIMESTAMPTZ,
    role character varying(20) DEFAULT 'user'::character varying NOT NULL
);


CREATE TABLE public."User_ingredient" (
    id_ingredient integer NOT NULL REFERENCES public."Ingredient"(id_ingredient) ON DELETE CASCADE,
    id_user integer NOT NULL REFERENCES public."User"(id_user) ON DELETE CASCADE,
    is_excluded boolean DEFAULT false NOT NULL,
	PRIMARY KEY(id_user, id_ingredient)
);


CREATE TABLE public."Recipe" (
    id_recipe integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    name character varying(50) NOT NULL,
    instructions text NOT NULL,
    image_path character varying(255),
    added_by integer NOT NULL REFERENCES public."User"(id_user),
	created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
	updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
	is_checked BOOLEAN NOT NULL DEFAULT FALSE
);


CREATE TABLE public."Favourite" (
    id_user integer NOT NULL REFERENCES public."User"(id_user) ON DELETE CASCADE,
    id_recipe integer NOT NULL REFERENCES public."Recipe"(id_recipe) ON DELETE CASCADE,
	PRIMARY KEY(id_user, id_recipe)
);


CREATE TABLE public."Ingredient_recipe" (
    id_ingredient integer  NOT NULL REFERENCES public."Ingredient"(id_ingredient) ON DELETE CASCADE,
    id_recipe integer  NOT NULL REFERENCES public."Recipe"(id_recipe) ON DELETE CASCADE,
    quantity character varying(20),
	PRIMARY KEY(id_recipe, id_ingredient)
);



CREATE TABLE public."Rating" (
    id_user integer  NOT NULL REFERENCES public."User"(id_user) ON DELETE CASCADE,
    id_recipe integer  NOT NULL REFERENCES public."Recipe"(id_recipe) ON DELETE CASCADE,
    value integer CHECK (value >= 1 AND value <= 5),
	PRIMARY KEY(id_user, id_recipe)
);


CREATE INDEX idx_recipe_added_by ON public."Recipe" USING btree (added_by);

CREATE INDEX idx_rating_id_recipe ON public."Rating" USING btree (id_recipe) INCLUDE (value);

CREATE INDEX idx_ir_id_ingredient ON public."Ingredient_recipe" (id_ingredient, id_recipe)






