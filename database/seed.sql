insert into public.lessons (slug, title, description, target_keys, exercise_text, order_index, required_accuracy, required_wpm)
values
(
  'rreshti-baze',
  'Rreshti baze: A S D F J K L',
  'Nderto kujtese muskulore me tastet e qendres.',
  array['a','s','d','f','j','k','l'],
  'a s d f j k l a s d f j k l fa la sa da ka ja al as ad af la ja ka fa',
  1,
  90,
  12
),
(
  'dora-e-majte',
  'Ushtrim me doren e majte',
  'Forco levizjet e dores se majte pa humbur saktesi.',
  array['q','w','e','r','t','a','s','d','f','g','z','x','c','v','b'],
  'as de fr gt sa fa da re te ve be ne me re sa da fa ga ta va ba',
  2,
  90,
  14
),
(
  'dora-e-djathte',
  'Ushtrim me doren e djathte',
  'Balanco ritmin me doren e djathte.',
  array['y','u','i','o','p','h','j','k','l','n','m'],
  'ju ki lo po jo ku li mi ni mu nu hi ji ko lu po jo ki li mu',
  3,
  90,
  14
),
(
  'rreshti-i-siperm',
  'Rreshti i siperm',
  'Praktiko levizje te shpejta drejt tastave te siperm.',
  array['q','w','e','r','t','y','u','i','o','p'],
  'te ne me re po jo ku ti py ro we qi ui op te re ty ui po ne me',
  4,
  91,
  16
),
(
  'rreshti-i-poshtem',
  'Rreshti i poshtem',
  'Ushtrim per kthim te qarte nga rreshti i poshtem.',
  array['z','x','c','v','b','n','m'],
  'za xa ca va ba na ma me ne be ve ca xa za ma na ba va ca',
  5,
  91,
  16
),
(
  'numrat',
  'Numrat',
  'Shkruaj numra me rithem te qendrueshem.',
  array['1','2','3','4','5','6','7','8','9','0'],
  '12 34 56 78 90 2026 15 30 45 60 120 300 5173 8080 12345',
  6,
  92,
  15
),
(
  'simbolet',
  'Simbolet',
  'Meso simbole qe perdoren shpesh ne pune dhe kodim.',
  array['.',',',';','/','-','_','@','#','!','?'],
  'email@test.com api/v1 lista-item vlera_1 #tag !ok ?po fund. test, provim; kod',
  7,
  92,
  15
),
(
  'fjale-te-shkurtra',
  'Fjale te shkurtra',
  'Rrit shpejtesine me fjale te perdorura shpesh.',
  array['t','e','n','m','p','r','s','h'],
  'une ti ne me pa po se sa te ke la ra rruga puna libri kodi testi ora',
  8,
  93,
  20
),
(
  'fjali-te-plota',
  'Fjali te lehta',
  'Kalimi nga fjale te vecanta ne fjali te plota.',
  array['a','e','i','o','u','n','r','t','s','h'],
  'une jam duke mesuar te shkruaj me shpejt dhe me sakte per pune shkolle dhe ide te reja',
  9,
  94,
  22
),
(
  'shpejtesi-saktesi',
  'Praktike per saktesi',
  'Mbyll ciklin me tekst me te gjate dhe fokus te larte.',
  array['a','s','d','f','j','k','l','e','r','t','n','m'],
  'programimi kerkon fokus logjike dhe praktike te vazhdueshme kompjuteri eshte mjet i rendesishem per pune dhe mesim',
  10,
  95,
  25
)
on conflict (slug) do update set
  title = excluded.title,
  description = excluded.description,
  target_keys = excluded.target_keys,
  exercise_text = excluded.exercise_text,
  order_index = excluded.order_index,
  required_accuracy = excluded.required_accuracy,
  required_wpm = excluded.required_wpm;
