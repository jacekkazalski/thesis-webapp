-- Realistyczne dane przykładowe dla aplikacji Recipe App
-- Wymaga wcześniejszego uruchomienia insert_ingredient_category.sql
-- Użytkownicy o id 3-7 muszą istnieć.

BEGIN;
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM generate_series(3, 7) id LEFT JOIN public."User" u ON u.id_user = id WHERE u.id_user IS NULL) THEN
        RAISE EXCEPTION 'Brakuje co najmniej jednego użytkownika o id od 3 do 7';
    END IF;
END $$;
CREATE TEMP TABLE seed_recipe (
    seed_key integer PRIMARY KEY,
    name text NOT NULL,
    instructions text NOT NULL,
    added_by integer NOT NULL
) ON COMMIT DROP;
INSERT INTO seed_recipe (seed_key, name, instructions, added_by) VALUES
(1, 'Jajecznica z pomidorem i szczypiorkiem', '1. Pokrój pomidora i cebulę dymkę.
2. Rozgrzej masło na patelni i krótko podsmaż warzywa.
3. Wbij jajka, dopraw solą i pieprzem.
4. Smaż, mieszając, aż jajka osiągną odpowiednią konsystencję.', 3),
(2, 'Owsianka z bananem i cynamonem', '1. Zagotuj mleko w małym garnku.
2. Wsyp płatki owsiane i gotuj 5 minut, mieszając.
3. Dodaj połowę pokrojonego banana i cynamon.
4. Przełóż do miski, udekoruj resztą banana i polej miodem.', 4),
(3, 'Tosty z awokado i jajkiem', '1. Podpiecz kromki chleba na suchej patelni lub w tosterze.
2. Rozgnieć awokado z sokiem z cytryny, solą i pieprzem.
3. Usmaż jajka sadzone.
4. Posmaruj pieczywo awokado i ułóż na nim jajka.', 5),
(4, 'Omlet ze szpinakiem i fetą', '1. Roztrzep jajka z solą i pieprzem.
2. Podsmaż szpinak na oliwie, aż zwiędnie.
3. Wlej jajka i smaż na małym ogniu.
4. Posyp pokruszoną fetą, złóż omlet i podawaj od razu.', 6),
(5, 'Jogurt z owocami i płatkami', '1. Przełóż jogurt do miski.
2. Pokrój banana i truskawki.
3. Dodaj owoce oraz płatki owsiane.
4. Całość polej miodem.', 7),
(6, 'Placuszki bananowe', '1. Rozgnieć banana widelcem.
2. Wymieszaj go z jajkami, mąką i proszkiem do pieczenia.
3. Nakładaj małe porcje masy na rozgrzaną patelnię z olejem.
4. Smaż placuszki po około 2 minuty z każdej strony.', 3),
(7, 'Kanapki z twarogiem i rzodkiewką', '1. Rozgnieć twaróg z jogurtem.
2. Dodaj pokrojoną rzodkiewkę i koperek.
3. Dopraw solą i pieprzem.
4. Nałóż pastę na kromki chleba.', 4),
(8, 'Kasza manna z jabłkiem', '1. Zagotuj mleko z odrobiną cukru.
2. Wsyp kaszę mannę i gotuj 3–4 minuty, mieszając.
3. Zetrzyj jabłko na tarce.
4. Podaj kaszę z jabłkiem i cynamonem.', 5),
(9, 'Makaron z sosem pomidorowym', '1. Ugotuj makaron al dente.
2. Posiekaj cebulę i czosnek, następnie podsmaż je na oliwie.
3. Dodaj pomidory w puszce, oregano, sól i pieprz.
4. Gotuj sos 12 minut.
5. Wymieszaj sos z odcedzonym makaronem.', 6),
(10, 'Makaron ze szpinakiem i śmietaną', '1. Ugotuj makaron zgodnie z instrukcją.
2. Na maśle podsmaż posiekany czosnek.
3. Dodaj szpinak i smaż, aż zwiędnie.
4. Wlej śmietanę, dopraw i podgrzej.
5. Wymieszaj sos z makaronem i parmezanem.', 7),
(11, 'Makaron z tuńczykiem', '1. Ugotuj makaron.
2. Podsmaż cebulę na oliwie.
3. Dodaj pomidory w puszce i gotuj 8 minut.
4. Dodaj tuńczyka oraz oregano.
5. Połącz sos z makaronem i dopraw.', 3),
(12, 'Makaron z brokułem i serem', '1. Ugotuj makaron, a pod koniec gotowania dodaj różyczki brokułu.
2. Odcedź całość, zachowując trochę wody.
3. Dodaj śmietanę i starty ser.
4. Podgrzewaj, aż powstanie kremowy sos.
5. Dopraw pieprzem.', 4),
(13, 'Ryż smażony z jajkiem i warzywami', '1. Ugotuj ryż i pozostaw do lekkiego ostudzenia.
2. Podsmaż marchew, groszek i cebulę na oleju.
3. Przesuń warzywa na bok patelni i wbij jajka.
4. Dodaj ryż oraz sos sojowy.
5. Smaż kilka minut, dokładnie mieszając.', 5),
(14, 'Ryż z kurczakiem i papryką', '1. Ugotuj ryż.
2. Pokrój kurczaka, paprykę i cebulę.
3. Podsmaż mięso na oleju, następnie dodaj warzywa.
4. Dopraw papryką słodką, solą i pieprzem.
5. Duś 8 minut i podaj z ryżem.', 6),
(15, 'Curry z kalafiora i groszku', '1. Podziel kalafior na małe różyczki.
2. Podsmaż cebulę z imbirem na oleju.
3. Dodaj kalafior, groszek, kurkumę i kumin.
4. Wlej bulion i duś pod przykryciem około 15 minut.
5. Dopraw solą i podaj z ryżem.', 7),
(16, 'Kuskus z warzywami i fetą', '1. Zalej kuskus gorącym bulionem i odstaw na 5 minut.
2. Pokrój paprykę, ogórek i pomidora.
3. Spulchnij kuskus widelcem.
4. Dodaj warzywa, fetę i oliwę.
5. Dopraw solą i pieprzem.', 3),
(17, 'Kasza gryczana z karmelizowaną cebulą', '1. Ugotuj kaszę gryczaną.
2. Pokrój cebulę w piórka i smaż na maśle do zrumienienia.
3. Dodaj ugotowaną kaszę oraz tymianek.
4. Dopraw solą i pieprzem, smaż jeszcze 3 minuty.', 4),
(18, 'Bulgur z pieczoną cukinią', '1. Ugotuj kaszę bulgur.
2. Pokrój cukinię i paprykę, wymieszaj z oliwą.
3. Piecz warzywa 20 minut w 200°C.
4. Połącz warzywa z kaszą.
5. Dodaj sok z cytryny i oregano.', 5),
(19, 'Kurczak pieczony z ziemniakami', '1. Pokrój ziemniaki na ćwiartki.
2. Natrzyj kurczaka i ziemniaki oliwą oraz przyprawami.
3. Ułóż wszystko w naczyniu do pieczenia.
4. Piecz około 45 minut w 200°C, aż mięso będzie gotowe.', 6),
(20, 'Pierś kurczaka w sosie musztardowym', '1. Pokrój pierś kurczaka na mniejsze kawałki.
2. Obsmaż mięso na oleju i odłóż na talerz.
3. Na patelnię wlej śmietanę i dodaj musztardę.
4. Włóż kurczaka z powrotem i duś 8 minut.
5. Dopraw solą i pieprzem.', 7),
(21, 'Gulasz wołowy z marchewką', '1. Pokrój mięso, cebulę i marchew.
2. Obsmaż wołowinę na oleju.
3. Dodaj cebulę, marchew, koncentrat i przyprawy.
4. Wlej bulion i duś pod przykryciem około 90 minut.
5. Dopraw przed podaniem.', 3),
(22, 'Kotlety mielone', '1. Posiekaj cebulę i wymieszaj z mięsem.
2. Dodaj jajko, bułkę tartą, sól i pieprz.
3. Uformuj niewielkie kotlety.
4. Smaż na oleju po kilka minut z każdej strony.', 4),
(23, 'Pulpety drobiowe w sosie pomidorowym', '1. Wymieszaj mięso z jajkiem i bułką tartą.
2. Uformuj małe pulpety.
3. Podsmaż cebulę, dodaj pomidory w puszce i oregano.
4. Włóż pulpety do sosu i duś 20 minut.
5. Dopraw solą i pieprzem.', 5),
(24, 'Schab z cebulą z patelni', '1. Pokrój schab w plastry i lekko rozbij.
2. Dopraw solą, pieprzem i majerankiem.
3. Obsmaż mięso na oleju.
4. Dodaj cebulę pokrojoną w piórka.
5. Wlej odrobinę bulionu i duś 20 minut.', 6),
(25, 'Łosoś pieczony z cytryną', '1. Ułóż łososia w naczyniu do pieczenia.
2. Skrop oliwą i sokiem z cytryny.
3. Posyp koperkiem, solą oraz pieprzem.
4. Piecz 15–18 minut w 190°C.', 7),
(26, 'Dorsz z warzywami', '1. Pokrój marchew, por i paprykę.
2. Podsmaż warzywa na oliwie przez 5 minut.
3. Przełóż je do naczynia, a na wierzchu ułóż dorsza.
4. Dopraw i piecz 20 minut w 190°C.', 3),
(27, 'Krewetki z czosnkiem i makaronem', '1. Ugotuj makaron.
2. Podsmaż czosnek i chilli na oliwie.
3. Dodaj krewetki i smaż 3–4 minuty.
4. Dodaj sok z cytryny oraz makaron.
5. Wymieszaj i dopraw solą.', 4),
(28, 'Zupa pomidorowa z ryżem', '1. Zagotuj bulion.
2. Dodaj pomidory w puszce i koncentrat pomidorowy.
3. Gotuj 15 minut, następnie zblenduj.
4. Dodaj śmietanę i dopraw.
5. Podawaj z osobno ugotowanym ryżem.', 5),
(29, 'Krem z dyni', '1. Pokrój dynię, ziemniaka i cebulę.
2. Podsmaż cebulę na oleju.
3. Dodaj dynię, ziemniaka, imbir i bulion.
4. Gotuj 25 minut.
5. Zblenduj zupę i dopraw solą oraz pieprzem.', 6),
(30, 'Krem z brokułów', '1. Podziel brokuł na różyczki i pokrój ziemniaki.
2. Zalej warzywa bulionem.
3. Gotuj około 20 minut.
4. Dodaj śmietanę i zblenduj.
5. Dopraw solą, pieprzem i gałką muszkatołową.', 7),
(31, 'Zupa kalafiorowa', '1. Pokrój marchew i ziemniaki, kalafior podziel na różyczki.
2. Zagotuj bulion i dodaj warzywa.
3. Gotuj 20 minut.
4. Dodaj śmietanę oraz koperek.
5. Dopraw do smaku.', 3),
(32, 'Zupa porowo-ziemniaczana', '1. Pokrój por, cebulę i ziemniaki.
2. Podsmaż por i cebulę na maśle.
3. Dodaj ziemniaki oraz bulion.
4. Gotuj 25 minut, po czym częściowo zblenduj.
5. Dodaj śmietanę i dopraw.', 4),
(33, 'Kapuśniak z białej kapusty', '1. Poszatkuj kapustę, pokrój ziemniaki i marchew.
2. Zagotuj bulion z liściem laurowym.
3. Dodaj warzywa i gotuj 30 minut.
4. Dopraw majerankiem, solą i pieprzem.', 5),
(34, 'Sałatka grecka', '1. Pokrój pomidory, ogórek, paprykę i cebulę.
2. Przełóż warzywa do miski.
3. Dodaj pokruszoną fetę.
4. Polej oliwą, dopraw oregano i pieprzem.
5. Delikatnie wymieszaj.', 6),
(35, 'Sałatka z kurczakiem i jogurtem', '1. Pokrój kurczaka, dopraw i usmaż na oleju.
2. Pokrój sałatę, ogórek i pomidora.
3. Wymieszaj jogurt z czosnkiem i solą.
4. Połącz warzywa z kurczakiem.
5. Polej sosem jogurtowym.', 7),
(36, 'Sałatka z burakiem i fetą', '1. Ugotuj lub upiecz buraki, następnie pokrój je w kostkę.
2. Dodaj pokruszoną fetę i sałatę.
3. Wymieszaj oliwę z octem balsamicznym.
4. Polej sałatkę sosem i dopraw pieprzem.', 3),
(37, 'Sałatka z tuńczykiem i jajkiem', '1. Ugotuj jajka na twardo.
2. Pokrój sałatę, ogórek, pomidora i jajka.
3. Dodaj odsączonego tuńczyka.
4. Wymieszaj oliwę z sokiem z cytryny.
5. Polej sałatkę i dopraw.', 4),
(38, 'Sałatka ziemniaczana z ogórkiem', '1. Ugotuj ziemniaki w mundurkach i ostudź.
2. Pokrój ziemniaki, ogórek i cebulę.
3. Wymieszaj majonez z musztardą.
4. Połącz wszystkie składniki.
5. Dopraw solą i pieprzem.', 5),
(39, 'Pieczone warzywa z fetą', '1. Pokrój cukinię, paprykę, cebulę i batata.
2. Wymieszaj warzywa z oliwą i oregano.
3. Piecz 30 minut w 200°C.
4. Posyp fetą i piecz jeszcze 5 minut.', 6),
(40, 'Zapiekanka ziemniaczana z serem', '1. Pokrój ziemniaki w cienkie plastry.
2. Wymieszaj śmietanę z czosnkiem, solą i pieprzem.
3. Ułóż ziemniaki warstwami w naczyniu.
4. Zalej śmietaną i posyp serem.
5. Piecz około 50 minut w 190°C.', 7),
(41, 'Cukinia faszerowana mięsem', '1. Przekrój cukinie i wydrąż środki.
2. Podsmaż cebulę oraz mięso mielone.
3. Dodaj pomidory i dopraw oregano.
4. Napełnij cukinie farszem i posyp serem.
5. Piecz 25 minut w 190°C.', 3),
(42, 'Tortilla z kurczakiem', '1. Pokrój kurczaka i paprykę w paski.
2. Usmaż mięso z papryką i przyprawami.
3. Podgrzej tortille na suchej patelni.
4. Nałóż sałatę, pomidora, kurczaka i jogurt.
5. Zawiń ciasno i podawaj.', 4),
(43, 'Quesadilla z serem i warzywami', '1. Pokrój paprykę i cebulę, następnie krótko podsmaż.
2. Na połowie każdej tortilli rozłóż warzywa i ser.
3. Złóż tortille na pół.
4. Smaż na suchej patelni po 2–3 minuty z każdej strony.
5. Pokrój na trójkąty.', 5),
(44, 'Grzanki z pomidorem i mozzarellą', '1. Pokrój bagietkę na kromki.
2. Posmaruj kromki oliwą i natrzyj czosnkiem.
3. Ułóż na nich pomidora i mozzarellę.
4. Posyp bazylią.
5. Piecz 8–10 minut w 200°C.', 6),
(45, 'Chleb w jajku', '1. Roztrzep jajka z mlekiem, solą i pieprzem.
2. Zamocz kromki chleba w masie jajecznej.
3. Rozgrzej masło na patelni.
4. Smaż pieczywo z obu stron na złoty kolor.', 7),
(46, 'Placki ziemniaczane', '1. Zetrzyj ziemniaki i cebulę na drobnej tarce.
2. Odciśnij nadmiar płynu.
3. Dodaj jajko, mąkę i sól.
4. Smaż cienkie placki na rozgrzanym oleju.
5. Odsącz na ręczniku papierowym.', 3),
(47, 'Naleśniki z twarogiem', '1. Wymieszaj mąkę, mleko i jajka na gładkie ciasto.
2. Usmaż cienkie naleśniki na niewielkiej ilości oleju.
3. Wymieszaj twaróg z cukrem i jogurtem.
4. Nałóż farsz na naleśniki i zwiń.', 4),
(48, 'Racuchy z jabłkami', '1. Wymieszaj mąkę, mleko, jajko, cukier i proszek do pieczenia.
2. Obierz jabłka i pokrój w małą kostkę.
3. Dodaj jabłka do ciasta.
4. Smaż niewielkie racuchy na oleju z obu stron.
5. Posyp cukrem pudrem.', 5),
(49, 'Muffinki bananowe', '1. Rozgnieć banany i wymieszaj z jajkiem oraz roztopionym masłem.
2. Dodaj mąkę, cukier i proszek do pieczenia.
3. Krótko wymieszaj masę.
4. Przełóż do foremek.
5. Piecz około 20 minut w 180°C.', 6),
(50, 'Ciasto jogurtowe z owocami', '1. Wymieszaj jajka z cukrem.
2. Dodaj jogurt i olej.
3. Wsyp mąkę oraz proszek do pieczenia.
4. Przelej ciasto do formy i ułóż na nim owoce.
5. Piecz około 40 minut w 180°C.', 7),
(51, 'Pieczone jabłka z cynamonem', '1. Odetnij wierzchy jabłek i usuń gniazda nasienne.
2. Wymieszaj płatki owsiane z miodem i cynamonem.
3. Napełnij jabłka farszem.
4. Piecz około 25 minut w 180°C.', 3),
(52, 'Koktajl bananowo-truskawkowy', '1. Obierz banana i umyj truskawki.
2. Umieść owoce w blenderze.
3. Dodaj jogurt i mleko.
4. Zblenduj na gładki koktajl.', 4),
(53, 'Pudding ryżowy z cynamonem', '1. Wsyp ryż do garnka i zalej mlekiem.
2. Gotuj na małym ogniu około 25 minut, często mieszając.
3. Dodaj cukier i cynamon.
4. Gotuj jeszcze 2 minuty.
5. Podawaj na ciepło lub po schłodzeniu.', 5);

INSERT INTO public."Recipe" (name, instructions, image_path, added_by, created_at, updated_at, is_checked)
SELECT s.name, s.instructions, NULL, s.added_by, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, TRUE
FROM seed_recipe s
WHERE NOT EXISTS (
    SELECT 1 FROM public."Recipe" r
    WHERE r.name = s.name AND r.added_by = s.added_by
);

CREATE TEMP TABLE seed_recipe_ingredient (
    seed_key integer NOT NULL,
    ingredient_name text NOT NULL,
    quantity text
) ON COMMIT DROP;
INSERT INTO seed_recipe_ingredient (seed_key, ingredient_name, quantity) VALUES
(1, 'Jaja kurze', '3 szt.'),
(1, 'Pomidor', '1 szt.'),
(1, 'Cebula dymka', '1 szt.'),
(1, 'Masło', '1 łyżka'),
(1, 'Sól', 'do smaku'),
(1, 'Pieprz czarny', 'do smaku'),
(2, 'Płatki owsiane', '60 g'),
(2, 'Mleko krowie', '250 ml'),
(2, 'Banan', '1 szt.'),
(2, 'Cynamon', '1/2 łyżeczki'),
(2, 'Miód', '1 łyżeczka'),
(3, 'Chleb razowy', '4 kromki'),
(3, 'Awokado', '1 szt.'),
(3, 'Jaja kurze', '2 szt.'),
(3, 'Cytryna', '1/2 szt.'),
(3, 'Sól', 'do smaku'),
(3, 'Pieprz czarny', 'do smaku'),
(4, 'Jaja kurze', '3 szt.'),
(4, 'Szpinak', '80 g'),
(4, 'Ser feta', '50 g'),
(4, 'Oliwa', '1 łyżeczka'),
(4, 'Sól', 'do smaku'),
(4, 'Pieprz czarny', 'do smaku'),
(5, 'Jogurt naturalny', '200 g'),
(5, 'Banan', '1/2 szt.'),
(5, 'Truskawka', '100 g'),
(5, 'Płatki owsiane', '30 g'),
(5, 'Miód', '1 łyżeczka'),
(6, 'Banan', '1 szt.'),
(6, 'Jaja kurze', '2 szt.'),
(6, 'Mąka pszenna', '60 g'),
(6, 'Proszek do pieczenia', '1/2 łyżeczki'),
(6, 'Olej rzepakowy', '1 łyżka'),
(7, 'Chleb żytni', '4 kromki'),
(7, 'Twaróg', '150 g'),
(7, 'Jogurt naturalny', '2 łyżki'),
(7, 'Rzodkiewka', '4 szt.'),
(7, 'Koper', '1 łyżka'),
(7, 'Sól', 'do smaku'),
(7, 'Pieprz czarny', 'do smaku'),
(8, 'Kasza manna', '50 g'),
(8, 'Mleko krowie', '300 ml'),
(8, 'Jabłko', '1 szt.'),
(8, 'Cukier biały', '1 łyżeczka'),
(8, 'Cynamon', '1/2 łyżeczki'),
(9, 'Makaron pszenny', '250 g'),
(9, 'Pomidory w puszce', '400 g'),
(9, 'Cebula', '1 szt.'),
(9, 'Czosnek', '2 ząbki'),
(9, 'Oliwa', '1 łyżka'),
(9, 'Oregano', '1 łyżeczka'),
(9, 'Sól', 'do smaku'),
(9, 'Pieprz czarny', 'do smaku'),
(10, 'Makaron pszenny', '250 g'),
(10, 'Szpinak', '200 g'),
(10, 'Śmietana', '150 ml'),
(10, 'Czosnek', '2 ząbki'),
(10, 'Masło', '1 łyżka'),
(10, 'Parmezan', '40 g'),
(10, 'Sól', 'do smaku'),
(10, 'Pieprz czarny', 'do smaku'),
(11, 'Makaron pszenny', '250 g'),
(11, 'Tuńczyk', '180 g'),
(11, 'Pomidory w puszce', '400 g'),
(11, 'Cebula', '1 szt.'),
(11, 'Oliwa', '1 łyżka'),
(11, 'Oregano', '1 łyżeczka'),
(11, 'Sól', 'do smaku'),
(12, 'Makaron pszenny', '250 g'),
(12, 'Brokuł', '300 g'),
(12, 'Śmietana', '150 ml'),
(12, 'Ser cheddar', '100 g'),
(12, 'Pieprz czarny', 'do smaku'),
(12, 'Sól', 'do smaku'),
(13, 'Ryż biały', '200 g'),
(13, 'Jaja kurze', '2 szt.'),
(13, 'Marchew', '1 szt.'),
(13, 'Groszek zielony', '100 g'),
(13, 'Cebula', '1 szt.'),
(13, 'Olej rzepakowy', '1 łyżka'),
(13, 'Sos sojowy', '2 łyżki'),
(14, 'Ryż basmati', '200 g'),
(14, 'Pierś kurczaka', '350 g'),
(14, 'Papryka', '1 szt.'),
(14, 'Cebula', '1 szt.'),
(14, 'Olej rzepakowy', '1 łyżka'),
(14, 'Papryka słodka', '1 łyżeczka'),
(14, 'Sól', 'do smaku'),
(14, 'Pieprz czarny', 'do smaku'),
(15, 'Kalafior', '500 g'),
(15, 'Groszek zielony', '150 g'),
(15, 'Cebula', '1 szt.'),
(15, 'Imbir', '1 łyżeczka'),
(15, 'Kurkuma', '1 łyżeczka'),
(15, 'Kmin rzymski (kumin)', '1/2 łyżeczki'),
(15, 'Bulion warzywny', '250 ml'),
(15, 'Olej rzepakowy', '1 łyżka'),
(16, 'Kasza kuskus', '180 g'),
(16, 'Bulion warzywny', '200 ml'),
(16, 'Papryka', '1 szt.'),
(16, 'Ogórek', '1 szt.'),
(16, 'Pomidor', '2 szt.'),
(16, 'Ser feta', '100 g'),
(16, 'Oliwa', '1 łyżka'),
(16, 'Pieprz czarny', 'do smaku'),
(17, 'Kasza gryczana', '200 g'),
(17, 'Cebula', '2 szt.'),
(17, 'Masło', '1 łyżka'),
(17, 'Tymianek', '1/2 łyżeczki'),
(17, 'Sól', 'do smaku'),
(17, 'Pieprz czarny', 'do smaku'),
(18, 'Kasza bulgur', '180 g'),
(18, 'Cukinia', '1 szt.'),
(18, 'Papryka', '1 szt.'),
(18, 'Oliwa', '2 łyżki'),
(18, 'Cytryna', '1/2 szt.'),
(18, 'Oregano', '1 łyżeczka'),
(18, 'Sól', 'do smaku'),
(19, 'Udo kurczaka', '600 g'),
(19, 'Ziemniak', '700 g'),
(19, 'Oliwa', '2 łyżki'),
(19, 'Czosnek', '3 ząbki'),
(19, 'Papryka słodka', '1 łyżeczka'),
(19, 'Tymianek', '1 łyżeczka'),
(19, 'Sól', 'do smaku'),
(19, 'Pieprz czarny', 'do smaku'),
(20, 'Pierś kurczaka', '400 g'),
(20, 'Śmietana', '180 ml'),
(20, 'Musztarda', '2 łyżeczki'),
(20, 'Olej rzepakowy', '1 łyżka'),
(20, 'Czosnek', '1 ząbek'),
(20, 'Sól', 'do smaku'),
(20, 'Pieprz czarny', 'do smaku'),
(21, 'Wołowina gulaszowa', '600 g'),
(21, 'Marchew', '2 szt.'),
(21, 'Cebula', '2 szt.'),
(21, 'Bulion wołowy', '600 ml'),
(21, 'Koncentrat pomidorowy', '2 łyżki'),
(21, 'Olej rzepakowy', '1 łyżka'),
(21, 'Liść laurowy', '2 szt.'),
(21, 'Papryka słodka', '1 łyżeczka'),
(22, 'Mięso mielone wieprzowe', '500 g'),
(22, 'Cebula', '1 szt.'),
(22, 'Jaja kurze', '1 szt.'),
(22, 'Bułka tarta', '5 łyżek'),
(22, 'Olej rzepakowy', '3 łyżki'),
(22, 'Sól', 'do smaku'),
(22, 'Pieprz czarny', 'do smaku'),
(23, 'Mięso mielone drobiowe', '500 g'),
(23, 'Jaja kurze', '1 szt.'),
(23, 'Bułka tarta', '4 łyżki'),
(23, 'Cebula', '1 szt.'),
(23, 'Pomidory w puszce', '400 g'),
(23, 'Oregano', '1 łyżeczka'),
(23, 'Olej rzepakowy', '1 łyżka'),
(24, 'Schab wieprzowy', '500 g'),
(24, 'Cebula', '2 szt.'),
(24, 'Bulion', '150 ml'),
(24, 'Olej rzepakowy', '2 łyżki'),
(24, 'Majeranek', '1 łyżeczka'),
(24, 'Sól', 'do smaku'),
(24, 'Pieprz czarny', 'do smaku'),
(25, 'Łosoś', '400 g'),
(25, 'Cytryna', '1 szt.'),
(25, 'Oliwa', '1 łyżka'),
(25, 'Koper', '1 łyżka'),
(25, 'Sól', 'do smaku'),
(25, 'Pieprz czarny', 'do smaku'),
(26, 'Dorsz', '500 g'),
(26, 'Marchew', '2 szt.'),
(26, 'Por', '1 szt.'),
(26, 'Papryka', '1 szt.'),
(26, 'Oliwa', '2 łyżki'),
(26, 'Cytryna', '1/2 szt.'),
(26, 'Sól', 'do smaku'),
(26, 'Pieprz czarny', 'do smaku'),
(27, 'Makaron pszenny', '220 g'),
(27, 'Krewetki', '300 g'),
(27, 'Czosnek', '3 ząbki'),
(27, 'Oliwa', '2 łyżki'),
(27, 'Chilli', '1/2 łyżeczki'),
(27, 'Cytryna', '1/2 szt.'),
(27, 'Sól', 'do smaku'),
(28, 'Bulion warzywny', '1 l'),
(28, 'Pomidory w puszce', '400 g'),
(28, 'Koncentrat pomidorowy', '2 łyżki'),
(28, 'Ryż biały', '100 g'),
(28, 'Śmietana', '100 ml'),
(28, 'Bazylia', '1 łyżeczka'),
(28, 'Sól', 'do smaku'),
(29, 'Dynia', '700 g'),
(29, 'Ziemniak', '2 szt.'),
(29, 'Cebula', '1 szt.'),
(29, 'Bulion warzywny', '700 ml'),
(29, 'Imbir', '1 łyżeczka'),
(29, 'Olej rzepakowy', '1 łyżka'),
(29, 'Sól', 'do smaku'),
(29, 'Pieprz czarny', 'do smaku'),
(30, 'Brokuł', '500 g'),
(30, 'Ziemniak', '2 szt.'),
(30, 'Bulion warzywny', '700 ml'),
(30, 'Śmietana', '100 ml'),
(30, 'Gałka muszkatołowa', '1 szczypta'),
(30, 'Sól', 'do smaku'),
(30, 'Pieprz czarny', 'do smaku'),
(31, 'Kalafior', '500 g'),
(31, 'Ziemniak', '3 szt.'),
(31, 'Marchew', '2 szt.'),
(31, 'Bulion warzywny', '1 l'),
(31, 'Śmietana', '100 ml'),
(31, 'Koper', '1 łyżka'),
(31, 'Sól', 'do smaku'),
(32, 'Por', '2 szt.'),
(32, 'Ziemniak', '4 szt.'),
(32, 'Cebula', '1 szt.'),
(32, 'Bulion warzywny', '900 ml'),
(32, 'Masło', '1 łyżka'),
(32, 'Śmietana', '100 ml'),
(32, 'Pieprz czarny', 'do smaku'),
(33, 'Kapusta biała', '500 g'),
(33, 'Ziemniak', '4 szt.'),
(33, 'Marchew', '2 szt.'),
(33, 'Cebula', '1 szt.'),
(33, 'Bulion warzywny', '1 l'),
(33, 'Liść laurowy', '2 szt.'),
(33, 'Majeranek', '1 łyżeczka'),
(34, 'Pomidor', '3 szt.'),
(34, 'Ogórek', '1 szt.'),
(34, 'Papryka', '1 szt.'),
(34, 'Cebula', '1/2 szt.'),
(34, 'Ser feta', '150 g'),
(34, 'Oliwa', '2 łyżki'),
(34, 'Oregano', '1 łyżeczka'),
(34, 'Pieprz czarny', 'do smaku'),
(35, 'Pierś kurczaka', '300 g'),
(35, 'Sałata', '1 szt.'),
(35, 'Ogórek', '1 szt.'),
(35, 'Pomidor', '2 szt.'),
(35, 'Jogurt naturalny', '150 g'),
(35, 'Czosnek', '1 ząbek'),
(35, 'Olej rzepakowy', '1 łyżka'),
(35, 'Sól', 'do smaku'),
(36, 'Burak', '3 szt.'),
(36, 'Ser feta', '120 g'),
(36, 'Sałata', '1 szt.'),
(36, 'Oliwa', '2 łyżki'),
(36, 'Ocet balsamiczny', '1 łyżka'),
(36, 'Pieprz czarny', 'do smaku'),
(37, 'Tuńczyk', '180 g'),
(37, 'Jaja kurze', '2 szt.'),
(37, 'Sałata', '1 szt.'),
(37, 'Ogórek', '1 szt.'),
(37, 'Pomidor', '2 szt.'),
(37, 'Oliwa', '1 łyżka'),
(37, 'Cytryna', '1/2 szt.'),
(37, 'Sól', 'do smaku'),
(38, 'Ziemniak', '600 g'),
(38, 'Ogórek', '1 szt.'),
(38, 'Cebula', '1/2 szt.'),
(38, 'Majonez', '3 łyżki'),
(38, 'Musztarda', '1 łyżeczka'),
(38, 'Koper', '1 łyżka'),
(38, 'Sól', 'do smaku'),
(38, 'Pieprz czarny', 'do smaku'),
(39, 'Cukinia', '1 szt.'),
(39, 'Papryka', '2 szt.'),
(39, 'Cebula', '1 szt.'),
(39, 'Batat', '1 szt.'),
(39, 'Ser feta', '120 g'),
(39, 'Oliwa', '2 łyżki'),
(39, 'Oregano', '1 łyżeczka'),
(39, 'Sól', 'do smaku'),
(40, 'Ziemniak', '900 g'),
(40, 'Śmietana', '250 ml'),
(40, 'Ser gouda', '150 g'),
(40, 'Czosnek', '2 ząbki'),
(40, 'Masło', '1 łyżka'),
(40, 'Sól', 'do smaku'),
(40, 'Pieprz czarny', 'do smaku'),
(41, 'Cukinia', '2 szt.'),
(41, 'Mięso mielone wołowe', '350 g'),
(41, 'Cebula', '1 szt.'),
(41, 'Pomidory w puszce', '200 g'),
(41, 'Ser mozzarella', '100 g'),
(41, 'Oliwa', '1 łyżka'),
(41, 'Oregano', '1 łyżeczka'),
(42, 'Tortilla pszenna', '4 szt.'),
(42, 'Pierś kurczaka', '350 g'),
(42, 'Papryka', '1 szt.'),
(42, 'Sałata', '1/2 szt.'),
(42, 'Pomidor', '2 szt.'),
(42, 'Jogurt naturalny', '120 g'),
(42, 'Papryka słodka', '1 łyżeczka'),
(42, 'Olej rzepakowy', '1 łyżka'),
(43, 'Tortilla pszenna', '4 szt.'),
(43, 'Ser cheddar', '180 g'),
(43, 'Papryka', '1 szt.'),
(43, 'Cebula', '1 szt.'),
(43, 'Kukurydza', '100 g'),
(43, 'Olej rzepakowy', '1 łyżeczka'),
(44, 'Bagietka', '1 szt.'),
(44, 'Pomidor', '2 szt.'),
(44, 'Mozzarella', '150 g'),
(44, 'Czosnek', '1 ząbek'),
(44, 'Oliwa', '1 łyżka'),
(44, 'Bazylia', '1 łyżeczka'),
(44, 'Sól', 'do smaku'),
(45, 'Chleb pszenny', '6 kromek'),
(45, 'Jaja kurze', '2 szt.'),
(45, 'Mleko krowie', '80 ml'),
(45, 'Masło', '1 łyżka'),
(45, 'Sól', 'do smaku'),
(45, 'Pieprz czarny', 'do smaku'),
(46, 'Ziemniak', '800 g'),
(46, 'Cebula', '1 szt.'),
(46, 'Jaja kurze', '1 szt.'),
(46, 'Mąka pszenna', '2 łyżki'),
(46, 'Olej rzepakowy', 'do smażenia'),
(46, 'Sól', '1 łyżeczka'),
(47, 'Mąka pszenna', '200 g'),
(47, 'Mleko krowie', '400 ml'),
(47, 'Jaja kurze', '2 szt.'),
(47, 'Olej rzepakowy', '1 łyżka'),
(47, 'Twaróg', '300 g'),
(47, 'Cukier biały', '2 łyżki'),
(47, 'Jogurt naturalny', '2 łyżki'),
(48, 'Mąka pszenna', '200 g'),
(48, 'Mleko krowie', '200 ml'),
(48, 'Jaja kurze', '1 szt.'),
(48, 'Jabłko', '2 szt.'),
(48, 'Cukier biały', '1 łyżka'),
(48, 'Proszek do pieczenia', '1 łyżeczka'),
(48, 'Olej rzepakowy', 'do smażenia'),
(48, 'Cukier puder', '1 łyżka'),
(49, 'Banan', '2 szt.'),
(49, 'Mąka pszenna', '220 g'),
(49, 'Jaja kurze', '1 szt.'),
(49, 'Masło', '80 g'),
(49, 'Cukier brązowy', '70 g'),
(49, 'Proszek do pieczenia', '1 łyżeczka'),
(50, 'Jogurt naturalny', '200 g'),
(50, 'Jaja kurze', '2 szt.'),
(50, 'Cukier biały', '120 g'),
(50, 'Mąka pszenna', '250 g'),
(50, 'Olej rzepakowy', '80 ml'),
(50, 'Proszek do pieczenia', '2 łyżeczki'),
(50, 'Borówka', '150 g'),
(51, 'Jabłko', '4 szt.'),
(51, 'Płatki owsiane', '50 g'),
(51, 'Miód', '2 łyżki'),
(51, 'Cynamon', '1 łyżeczka'),
(51, 'Masło', '20 g'),
(52, 'Banan', '1 szt.'),
(52, 'Truskawka', '150 g'),
(52, 'Jogurt naturalny', '150 g'),
(52, 'Mleko krowie', '150 ml'),
(52, 'Miód', '1 łyżeczka'),
(53, 'Ryż biały', '120 g'),
(53, 'Mleko krowie', '600 ml'),
(53, 'Cukier biały', '2 łyżki'),
(53, 'Cynamon', '1/2 łyżeczki');

DO $$
DECLARE
    missing_names text;
BEGIN
    SELECT string_agg(DISTINCT sri.ingredient_name, ', ' ORDER BY sri.ingredient_name)
    INTO missing_names
    FROM seed_recipe_ingredient sri
    LEFT JOIN public."Ingredient" i ON i.name = sri.ingredient_name
    WHERE i.id_ingredient IS NULL;

    IF missing_names IS NOT NULL THEN
        RAISE EXCEPTION 'Brak składników w tabeli Ingredient: %', missing_names;
    END IF;
END $$;

INSERT INTO public."Ingredient_recipe" (id_recipe, id_ingredient, quantity)
SELECT r.id_recipe, i.id_ingredient, sri.quantity
FROM seed_recipe_ingredient sri
JOIN seed_recipe sr ON sr.seed_key = sri.seed_key
JOIN public."Recipe" r ON r.name = sr.name AND r.added_by = sr.added_by
JOIN public."Ingredient" i ON i.name = sri.ingredient_name
ON CONFLICT (id_recipe, id_ingredient) DO UPDATE
SET quantity = EXCLUDED.quantity;

SELECT COUNT(*) AS seeded_recipes
FROM public."Recipe" r
JOIN seed_recipe s ON s.name = r.name AND s.added_by = r.added_by;

COMMIT;
