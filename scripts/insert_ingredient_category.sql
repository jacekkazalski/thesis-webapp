BEGIN;

INSERT INTO public."Category"(
	id_category, name)
	VALUES 
		(1, 'Mięso'),
		(2, 'Nabiał'),
		(3, 'Orzechy'),
		(4, 'Owoce'),
		(5, 'Ryby i owoce morza'),
		(6, 'Tłuszcze'),
		(7, 'Warzywa'),
		(8, 'Produkty zbożowe'),
		(9, 'Zioła i przyprawy'),
		(10, 'Inne');

WITH data(category_name, ingredient_name) AS (
    VALUES
    -- Mięso
    ('Mięso','Antrykot wołowy'),
    ('Mięso','Baleron wieprzowy'),
    ('Mięso','Biodrówka wołowa'),
    ('Mięso','Comber jagnięcy'),
    ('Mięso','Flaki wołowe'),
    ('Mięso','Gicz cielęca'),
    ('Mięso','Gicz wołowa'),
    ('Mięso','Golonkа wieprzowa'),
    ('Mięso','Kaczka (tuszka)'),
    ('Mięso','Karczek jagnięcy'),
    ('Mięso','Karkówka wieprzowa'),
    ('Mięso','Mięso mielone drobiowe'),
    ('Mięso','Mięso mielone wieprzowe'),
    ('Mięso','Mięso mielone wołowe'),
    ('Mięso','Mostek wołowy'),
    ('Mięso','Noga indyka'),
    ('Mięso','Ozór wołowy'),
    ('Mięso','Pierś indyka'),
    ('Mięso','Pierś kaczki'),
    ('Mięso','Pierś kurczaka'),
    ('Mięso','Polędwica cielęca'),
    ('Mięso','Polędwica wieprzowa'),
    ('Mięso','Polędwica wołowa'),
    ('Mięso','Pręga wołowa'),
    ('Mięso','Rostbef wołowy'),
    ('Mięso','Schab wieprzowy'),
    ('Mięso','Serce wołowe'),
    ('Mięso','Skrzydła kurczaka'),
    ('Mięso','Smalec'),
    ('Mięso','Stek ribeye'),
    ('Mięso','Stek T-bone'),
    ('Mięso','Szponder wołowy'),
    ('Mięso','Szynka wieprzowa'),
    ('Mięso','Tłuszcz gęsi'),
    ('Mięso','Tłuszcz kaczy'),
    ('Mięso','Udo kaczki'),
    ('Mięso','Udo kurczaka'),
    ('Mięso','Udziec cielęcy'),
    ('Mięso','Udziec jagnięcy'),
    ('Mięso','Udziec wołowy'),
    ('Mięso','Wołowina gulaszowa'),
    ('Mięso','Wątróbka cielęca'),
    ('Mięso','Wątróbka drobiowa'),
    ('Mięso','Wątróbka wieprzowa'),
    ('Mięso','Ćwiartka kurczaka'),
    ('Mięso','Łopatka cielęca'),
    ('Mięso','Łopatka wieprzowa'),
    ('Mięso','Żeberka wieprzowe'),
    ('Mięso','Żeberka wołowe'),
    ('Mięso','Żelatyna'),

    -- Nabiał
    ('Nabiał','Jaja kurze'),
    ('Nabiał','Jaja przepiórcze'),
    ('Nabiał','Jogurt grecki'),
    ('Nabiał','Jogurt naturalny'),
    ('Nabiał','Jogurt pitny'),
    ('Nabiał','Kefir'),
    ('Nabiał','Mascarpone'),
    ('Nabiał','Masło'),
    ('Nabiał','Masło klarowane'),
    ('Nabiał','Maślanka'),
    ('Nabiał','Mleko kozie'),
    ('Nabiał','Mleko krowie'),
    ('Nabiał','Mleko owcze'),
    ('Nabiał','Mozzarella'),
    ('Nabiał','Parmezan'),
    ('Nabiał','Ricotta'),
    ('Nabiał','Ser biały'),
    ('Nabiał','Ser brie'),
    ('Nabiał','Ser camembert'),
    ('Nabiał','Ser cheddar'),
    ('Nabiał','Ser edamski'),
    ('Nabiał','Ser feta'),
    ('Nabiał','Ser gouda'),
    ('Nabiał','Ser halloumi'),
    ('Nabiał','Ser mascarpone'),
    ('Nabiał','Ser mozzarella'),
    ('Nabiał','Ser pleśniowy niebieski'),
    ('Nabiał','Ser ricotta'),
    ('Nabiał','Ser topiony'),
    ('Nabiał','Skyr'),
    ('Nabiał','Twaróg'),
    ('Nabiał','Śmietana'),
    ('Nabiał','Śmietanka kremówka'),
    ('Nabiał','Żółtko jajka'),
    ('Nabiał','Ser żółty'),
    ('Nabiał','Białko jajka'),

    -- Owoce
    ('Owoce','Ananas'),
    ('Owoce','Arbuz'),
    ('Owoce','Awokado'),
    ('Owoce','Banan'),
    ('Owoce','Borówka'),
    ('Owoce','Brzoskwinia'),
    ('Owoce','Cytryna'),
    ('Owoce','Czereśnia'),
    ('Owoce','Daktyl'),
    ('Owoce','Figa'),
    ('Owoce','Granat'),
    ('Owoce','Grapefruit'),
    ('Owoce','Gruszka'),
    ('Owoce','Jabłko'),
    ('Owoce','Jagoda'),
    ('Owoce','Kiwi'),
    ('Owoce','Kokos'),
    ('Owoce','Kumkwat'),
    ('Owoce','Liczi'),
    ('Owoce','Limonka'),
    ('Owoce','Malina'),
    ('Owoce','Mandarynka'),
    ('Owoce','Mango'),
    ('Owoce','Marakuja'),
    ('Owoce','Melon'),
    ('Owoce','Morela'),
    ('Owoce','Nektarynka'),
    ('Owoce','Papaja'),
    ('Owoce','Pigwa'),
    ('Owoce','Pomarańcza'),
    ('Owoce','Porzeczka czarna'),
    ('Owoce','Porzeczka czerwona'),
    ('Owoce','Poziomka'),
    ('Owoce','Truskawka'),
    ('Owoce','Winogrono'),
    ('Owoce','Wiśnia'),
    ('Owoce','Śliwka'),
    ('Owoce','Żurawina'),

    -- Ryby i owoce morza
    ('Ryby i owoce morza','Dorsz'),
    ('Ryby i owoce morza','Flądra'),
    ('Ryby i owoce morza','Halibut'),
    ('Ryby i owoce morza','Homar'),
    ('Ryby i owoce morza','Kalmar'),
    ('Ryby i owoce morza','Karp'),
    ('Ryby i owoce morza','Krab'),
    ('Ryby i owoce morza','Krewetki'),
    ('Ryby i owoce morza','Makrela'),
    ('Ryby i owoce morza','Małże'),
    ('Ryby i owoce morza','Mintaj'),
    ('Ryby i owoce morza','Morszczuk'),
    ('Ryby i owoce morza','Okoń'),
    ('Ryby i owoce morza','Ośmiornica'),
    ('Ryby i owoce morza','Panga'),
    ('Ryby i owoce morza','Pstrąg'),
    ('Ryby i owoce morza','Sandacz'),
    ('Ryby i owoce morza','Sardynki'),
    ('Ryby i owoce morza','Sielawa'),
    ('Ryby i owoce morza','Sola'),
    ('Ryby i owoce morza','Szczupak'),
    ('Ryby i owoce morza','Tilapia'),
    ('Ryby i owoce morza','Tuńczyk'),
    ('Ryby i owoce morza','Węgorz'),
    ('Ryby i owoce morza','Zander'),
    ('Ryby i owoce morza','Łosoś'),
    ('Ryby i owoce morza','Śledź'),

    -- Tłuszcze
    ('Tłuszcze','Margaryna'),
    ('Tłuszcze','Olej arachidowy'),
    ('Tłuszcze','Olej kokosowy'),
    ('Tłuszcze','Olej lniany'),
    ('Tłuszcze','Olej rzepakowy'),
    ('Tłuszcze','Olej sojowy'),
    ('Tłuszcze','Olej słonecznikowy'),
    ('Tłuszcze','Olej z awokado'),
    ('Tłuszcze','Oliwa'),
    ('Tłuszcze','Olej z orzechów włoskich'),
    ('Tłuszcze','Olej z pestek dyni'),
    ('Tłuszcze','Olej z pestek winogron'),

    -- Warzywa
    ('Warzywa','Bakłażan'),
    ('Warzywa','Batat'),
    ('Warzywa','Brokuł'),
    ('Warzywa','Brukselka'),
    ('Warzywa','Burak'),
    ('Warzywa','Burak liściowy'),
    ('Warzywa','Cebula'),
    ('Warzywa','Cebula dymka'),
    ('Warzywa','Cukinia'),
    ('Warzywa','Cykoria'),
    ('Warzywa','Czosnek'),
    ('Warzywa','Dynia'),
    ('Warzywa','Fasola szparagowa'),
    ('Warzywa','Fenkuł'),
    ('Warzywa','Groch'),
    ('Warzywa','Groszek zielony'),
    ('Warzywa','Jarmuż'),
    ('Warzywa','Kabaczek'),
    ('Warzywa','Kalafior'),
    ('Warzywa','Kalarepa'),
    ('Warzywa','Kapusta biała'),
    ('Warzywa','Kapusta czerwona'),
    ('Warzywa','Kapusta pekińska'),
    ('Warzywa','Kapusta włoska'),
    ('Warzywa','Karczoch'),
    ('Warzywa','Kukurydza'),
    ('Warzywa','Maniok'),
    ('Warzywa','Marchew'),
    ('Warzywa','Ogórek'),
    ('Warzywa','Okra'),
    ('Warzywa','Papryka'),
    ('Warzywa','Pasternak'),
    ('Warzywa','Pietruszka (korzeń)'),
    ('Warzywa','Pomidor'),
    ('Warzywa','Por'),
    ('Warzywa','Rabarbar'),
    ('Warzywa','Rzepa'),
    ('Warzywa','Rzeżucha'),
    ('Warzywa','Rzodkiewka'),
    ('Warzywa','Sałata'),
    ('Warzywa','Seler'),
    ('Warzywa','Soja'),
    ('Warzywa','Szalotka'),
    ('Warzywa','Szparagi'),
    ('Warzywa','Szpinak'),
    ('Warzywa','Topinambur'),
    ('Warzywa','Ziemniak'),
    ('Warzywa','Pomidory w puszce'),

    -- Produkty zbożowe
    ('Produkty zbożowe','Bagietka'),
    ('Produkty zbożowe','Bułka kajzerka'),
    ('Produkty zbożowe','Bułka tarta'),
    ('Produkty zbożowe','Chleb graham'),
    ('Produkty zbożowe','Chleb pszenny'),
    ('Produkty zbożowe','Chleb razowy'),
    ('Produkty zbożowe','Chleb żytni'),
    ('Produkty zbożowe','Kasza bulgur'),
    ('Produkty zbożowe','Kasza gryczana'),
    ('Produkty zbożowe','Kasza jaglana'),
    ('Produkty zbożowe','Kasza jęczmienna'),
    ('Produkty zbożowe','Kasza kuskus'),
    ('Produkty zbożowe','Kasza manna'),
    ('Produkty zbożowe','Kasza owsiana'),
    ('Produkty zbożowe','Kasza pęczak'),
    ('Produkty zbożowe','Makaron bezglutenowy'),
    ('Produkty zbożowe','Makaron jajeczny'),
    ('Produkty zbożowe','Makaron pszenny'),
    ('Produkty zbożowe','Makaron ramen'),
    ('Produkty zbożowe','Makaron ryżowy'),
    ('Produkty zbożowe','Makaron soba'),
    ('Produkty zbożowe','Makaron udon'),
    ('Produkty zbożowe','Mąka gryczana'),
    ('Produkty zbożowe','Mąka kukurydziana'),
    ('Produkty zbożowe','Mąka orkiszowa'),
    ('Produkty zbożowe','Mąka owsiana'),
    ('Produkty zbożowe','Mąka pszenna'),
    ('Produkty zbożowe','Mąka ryżowa'),
    ('Produkty zbożowe','Mąka tapiokowa'),
    ('Produkty zbożowe','Mąka żytnia'),
    ('Produkty zbożowe','Otręby pszenne'),
    ('Produkty zbożowe','Płatki jaglane'),
    ('Produkty zbożowe','Płatki kukurydziane'),
    ('Produkty zbożowe','Płatki owsiane'),
    ('Produkty zbożowe','Ryż basmati'),
    ('Produkty zbożowe','Ryż brązowy'),
    ('Produkty zbożowe','Ryż jaśminowy'),
    ('Produkty zbożowe','Ryż kleisty'),
    ('Produkty zbożowe','Ryż parboiled'),
    ('Produkty zbożowe','Ryż sushi'),
    ('Produkty zbożowe','Skrobia ziemniaczana'),
    ('Produkty zbożowe','Tortilla kukurydziana'),
    ('Produkty zbożowe','Tortilla pszenna'),
    ('Produkty zbożowe','Wafle ryżowe'),
    ('Produkty zbożowe','Ziarna owsa'),
    ('Produkty zbożowe','Ziarna pszenicy'),
    ('Produkty zbożowe','Ziarna żyta'),
    ('Produkty zbożowe','Ryż biały'),

    -- Zioła i przyprawy
    ('Zioła i przyprawy','Anyż'),
    ('Zioła i przyprawy','Bazylia'),
    ('Zioła i przyprawy','Cebula granulowana'),
    ('Zioła i przyprawy','Chilli'),
    ('Zioła i przyprawy','Cynamon'),
    ('Zioła i przyprawy','Czosnek granulowany'),
    ('Zioła i przyprawy','Estragon'),
    ('Zioła i przyprawy','Gałka muszkatołowa'),
    ('Zioła i przyprawy','Gorczyca'),
    ('Zioła i przyprawy','Goździki'),
    ('Zioła i przyprawy','Imbir'),
    ('Zioła i przyprawy','Kardamon'),
    ('Zioła i przyprawy','Kmin rzymski (kumin)'),
    ('Zioła i przyprawy','Kminek'),
    ('Zioła i przyprawy','Kolendra (liście)'),
    ('Zioła i przyprawy','Kolendra (ziarna)'),
    ('Zioła i przyprawy','Koper'),
    ('Zioła i przyprawy','Kozieradka'),
    ('Zioła i przyprawy','Kurkuma'),
    ('Zioła i przyprawy','Liść laurowy'),
    ('Zioła i przyprawy','Lubczyk'),
    ('Zioła i przyprawy','Majeranek'),
    ('Zioła i przyprawy','Mięta'),
    ('Zioła i przyprawy','MSG'),
    ('Zioła i przyprawy','Nasiona kopru włoskiego'),
    ('Zioła i przyprawy','Oregano'),
    ('Zioła i przyprawy','Papryka ostra'),
    ('Zioła i przyprawy','Papryka słodka'),
    ('Zioła i przyprawy','Papryka wędzona'),
    ('Zioła i przyprawy','Pieprz biały'),
    ('Zioła i przyprawy','Pieprz czarny'),
    ('Zioła i przyprawy','Rozmaryn'),
    ('Zioła i przyprawy','Sezam'),
    ('Zioła i przyprawy','Sumak'),
    ('Zioła i przyprawy','Szafran'),
    ('Zioła i przyprawy','Szałwia'),
    ('Zioła i przyprawy','Sól'),
    ('Zioła i przyprawy','Tymianek'),
    ('Zioła i przyprawy','Wasabi'),
    ('Zioła i przyprawy','Ziele angielskie'),

    -- Inne
    ('Inne','Bulion'),
    ('Inne','Bulion drobiowy'),
    ('Inne','Bulion warzywny'),
    ('Inne','Bulion wołowy'),
    ('Inne','Cukier biały'),
    ('Inne','Cukier brązowy'),
    ('Inne','Cukier puder'),
    ('Inne','Drożdże suszone'),
    ('Inne','Drożdże świeże'),
    ('Inne','Kakao'),
    ('Inne','Keczup'),
    ('Inne','Koncentrat pomidorowy'),
    ('Inne','Majonez'),
    ('Inne','Miód'),
    ('Inne','Musztarda'),
    ('Inne','Ocet balsamiczny'),
    ('Inne','Ocet jabłkowy'),
    ('Inne','Ocet spirytusowy'),
    ('Inne','Ocet ryżowy'),
    ('Inne','Proszek do pieczenia'),
    ('Inne','Soda oczyszczona'),
    ('Inne','Sos barbecue'),
    ('Inne','Sos pomidorowy'),
    ('Inne','Sos sojowy'),
    ('Inne','Syrop klonowy')
),
distinct_ingredients AS (
    SELECT DISTINCT ingredient_name
    FROM data
),
-- 1) Insert do Ingredient (idempotentnie)
ins AS (
    INSERT INTO public."Ingredient"(name)
    SELECT di.ingredient_name
    FROM distinct_ingredients di
    ON CONFLICT (name) DO UPDATE
        SET name = EXCLUDED.name
    RETURNING id_ingredient, name
),
-- 2) Zbierz ID dla wszystkich (nowych + już istniejących)
all_ingredients AS (
    SELECT id_ingredient, name FROM ins
    UNION ALL
    SELECT i.id_ingredient, i.name
    FROM public."Ingredient" i
    JOIN distinct_ingredients di
      ON di.ingredient_name = i.name
),
category_map AS (
    SELECT id_category, name
    FROM public."Category"
),
pairs AS (
    SELECT
        ai.id_ingredient,
        cm.id_category
    FROM data d
    JOIN all_ingredients ai
      ON ai.name = d.ingredient_name
    JOIN category_map cm
      ON cm.name = d.category_name
)
-- 3) Insert do Ingredient_category
INSERT INTO public."Ingredient_category"(id_ingredient, id_category)
SELECT DISTINCT id_ingredient, id_category
FROM pairs
ON CONFLICT (id_ingredient, id_category) DO NOTHING;

-- 4) predefiniowane diety
INSERT INTO public."Diet" (name) VALUES ('Wegetariańska');

INSERT INTO public."Ingredient_diet" (id_ingredient, id_diet)
SELECT DISTINCT ic.id_ingredient, 1
FROM public."Ingredient_category" ic
JOIN public."Category" c ON c.id_category = ic.id_category
WHERE c.name IN ('Mięso', 'Ryby i owoce morza');


INSERT INTO public."Diet" (name) VALUES ('Wegańska');

INSERT INTO public."Ingredient_diet" (id_ingredient, id_diet)
SELECT DISTINCT ic.id_ingredient, 2
FROM public."Ingredient_category" ic
JOIN public."Category" c ON c.id_category = ic.id_category
WHERE c.name IN ('Mięso', 'Ryby i owoce morza', 'Nabiał');

COMMIT;

SELECT (SELECT COUNT(1) FROM public."Ingredient") AS ing_count,
 (SELECT COUNT(1) FROM public."Category") AS cat_count,
 (SELECT COUNT(1) FROM public."Ingredient_category") AS ic_count,
 (SELECT COUNT(1) FROM public."Diet") AS diet_count,
 (SELECT COUNT(1) FROM public."Ingredient_diet") AS id_count;

