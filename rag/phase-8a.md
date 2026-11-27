# 8а — приёмка: инвентаризация и сохранность исходников

Дата: 2026-11-28. Вход: `3d7b25cd3bea2334811258f3592bc71d0571f86b` (docs-revision). Вершины main и docs-revision-backup при проверке: `b0a43ad0439b9a318af687a5ec1f4203fd66c076`. Деревья: backup `85629b72594f8cd57f375ae581def6b2a277b6d3`, рабочее `def98a52fd21ddca8cc3fd7f42657239894bb961`; recursive=true, truncated=false. Проверка на закреплённом снимке; новый отчёт и запись журнала не входят в эти числа.

## 1. Результат проверки всех путей

| Метрика | Число |
|---|---:|
| Blob в исходном дереве | 78 |
| Blob в рабочем дереве | 137 |
| Неизменные по пути и SHA | 41 |
| Изменённые по пути и SHA | 33 |
| Удалённые | 4 |
| Добавленные | 63 |

Main и backup совпадают с исходным коммитом; новых авторских коммитов main на момент проверки нет. Удалены только четыре согласованных пути (см. ниже). Ни одного незарегистрированного корневого Markdown или правила/навыка: 0. Сравнение blob охватывает все пути; это не доказательство смысловой сохранности каждого требования. Предыдущие полные аудиты и карты переноса — основание для независимой содержательной проверки 8б.

## 2. Рукопись и исходные материалы

12 ранее отдельных художественных файлов — главы 2–8, 8.1, 8.3 и три черновика 9 — совпадают с резервом по Git blob SHA. Проверены полные тексты `Книга.md` в backup и `Глава 1.md` в docs-revision программным сравнением: точное равенство первых 348 строк вместе с завершающим переводом строки, следующая строка 349 — заголовок главы 2. 35404 единиц JS length, 63982 UTF-8 байт; SHA главы 1 `95aac907dc177663f713bef75943685da99f1632`. Это согласованное 6б.4, не новая редакция. Различавшиеся копии глав 3/4/6/7 в прежнем сборнике остаются в backup; рабочий источник — отдельные главы. Главы 8.1/8.3 и черновики 9 остаются альтернативами, не канон.

| Удалённый путь | SHA в backup | Основание |
|---|---|---|
| _gemini_raw.txt | `6d792b928d6a3415b74a753ee7aa70782eeb62c2` | 6б.3б.2 — прямое разрешение автора |
| Книга.md | `910e221935b52356a36c6de8a62d222db819c165` | 6б.4 — унификация |
| Отзыв на начало книги о вампирах.docx | `c34535380dd650cbfc05f93c027e9be9292d3c53` | 6б.3б.2 — прямое разрешение автора |
| Спазм.txt | `86baa3b9255ea9833101243b0f70338ebfa24ba1` | 6б.3б.2 — прямое разрешение автора |

Сырьё не проверено исчерпывающе: TXT частично, DOCX не прочитан. Отсутствие уникальных сведений не доказано, оригиналы сохранены в backup. PNG и .gitignore без изменений. Q-001: глава 8 заканчивается засыпанием, гибель пленника пока план главы 9, допрос — план 10; объединение не утверждено.

## 3. Пофайловый реестр изменённой документации

Размеры — Git blob UTF-8 байты, не токены. SHA исходника и результата позволяют открыть точный diff и соответствующий аудит. Ниже все 33 изменённых прежних файлов, без исключений.

| Путь | Байты до → после | Исходный blob → рабочий blob | Аудит |
|---|---:|---|---|
| .cursor/rules/00-read-before-every-scene.mdc | 17048 → 1401 | `439c6d51e34d58711813695d3e4475752467830b` → `528093a6b260f47430b650c8ab230d9c11dae3c3` | 7 |
| .cursor/rules/01-edit-chapter-then-sync.mdc | 2934 → 1373 | `1690e32448bc7978f9e647248c06727792c9ea17` → `34d450e722db91a4972e8cbe25a4172b953b468c` | 7 |
| .cursor/rules/02-chapter-plan-structure.mdc | 6719 → 6829 | `808d8febef668b54ddf443a9ec24dc2b2bfd8ae3` → `0957702d1a3fec462f3b9f03f1ebc965f80f1a23` | 7 |
| .cursor/rules/03-writer-vs-routine.mdc | 2157 → 1163 | `9920db6b0bd83418ee8cc056e5f5f117aa8de809` → `426411d7c93f3c85da21173e4987e5c0320e8847` | 7 |
| .cursor/rules/04-never-lie-to-lore.mdc | 5727 → 1525 | `b42350ef62eb1788b6143f7746ca24160ff30106` → `5a0248f203248d720f7c5978aaa654fa5085eba4` | 7 |
| .cursor/rules/05-talk-like-a-human.mdc | 1370 → 1632 | `30de57a71bbfd9351ecc9a6fe2520eabb435c94c` → `1a6d5f092a33254c25928187a617e61d4dc83159` | 7 |
| .cursor/skills/brainstorm/SKILL.md | 4033 → 2058 | `b913dcceb2a2085261fbcada5c52a95d5d500983` → `29896d898e942c7a89608f3a1077e561d5712a28` | 7 |
| .cursor/skills/close-scene/SKILL.md | 2233 → 2212 | `a1e3cd24594700855b498035b7de873d17b203ae` → `b291d337fe5e3360b8ed51b1884eefb38d85ba1c` | 7 |
| .cursor/skills/plan-chapter/SKILL.md | 3218 → 1508 | `42a32663877a6a4162e0e4d13fecb7cd8c84f4bc` → `d477e8e17430191de72a57fe7f7d86adaa14a76e` | 7 |
| .cursor/skills/ready-scene/SKILL.md | 3300 → 1552 | `869fa6ee54d511de292091b9f89084d3f2a76d6d` → `79d935dbb596c8527ff0ae8e8f6123531f49357e` | 7 |
| .cursor/skills/write-scene/SKILL.md | 5838 → 1919 | `262a4259431e854488be3ac7c48c7d12e03016f2` → `2379cc21d305ffe0445b6673ad78b736694191fe` | 7 |
| AGENTS.md | 8546 → 3363 | `8bc321188338e1b2c5346dd70f017b0e3d32b059` → `9def66e242c2f9dc76ffe741fe143f36a0f3a7f8` | 7 |
| GENERAL.md | 28834 → 30617 | `2c391e54778ae10185b43b944268c4441a176688` → `e822e642ba1a9409a4052928a93db1b638c44e71` | 7 |
| rag/README.md | 706 → 9339 | `444237ff626fe1389107a401e3bd3d28a59ec8ae` → `f9840e36ffb00194a77e0eb4bc87ab0c7ba484f9` | 6–7 |
| rag/build_index.py | 2949 → 2998 | `3a93f49fdd8b27d2687e89b31016ad5b7c0a206a` → `87680ee70f6685a930cfec791c087725d31aafe8` | 6–7 |
| Арки (задумано).md | 43937 → 47768 | `cb3e5f4ab4bddcef5bce0772552785df15043509` → `56b5c40b28d27bb134693d73ef268c99757c3ed4` | 5, 6в.3 |
| Знания Лизы.md | 21494 → 52107 | `79ec45958eb678bffd572b0d998f88bed3a92c20` → `d4c64d50e3462086b7a85c060f27d1a4c4ec1b8e` | 4, 6в.2 |
| Знания Паскаля.md | 17225 → 40553 | `25451bac91591caea4a843cd47382e7889afb2db` → `10adb6dbeab2b60df8e4fb9bf983c127ce3085cd` | 4, 6в.2 |
| Знания Райнора.md | 17702 → 39055 | `454caab0c1474a39013e3a052e5c177cd9baab44` → `10542e47eb1cbd1f6440c483d3bae14bc02e8cd5` | 4, 6в.2 |
| Знания читателя.md | 31850 → 59259 | `00da5491ce96d74d14ebbe921a0b1aeeaed806b8` → `03ded5069d3df52d0bb25194e4ccc8854d661d20` | 4, 6в.2 |
| Мир.md | 63586 → 79085 | `74f3b63efcc39b8927407e6c8146a3012ac4a41a` → `b26a6781da21b98d6b9a866c8dc9b2ea415ed043` | 3, 6в.2 |
| Персонажи.md | 107601 → 112602 | `155b1d24d18d12a82c08b24d0a080213f67789f8` → `0188484c56cee3da2b467195f38603b4b55d5ca9` | 2, 6в.1 |
| План главы 10.md | 20939 → 21609 | `c67c40fa5c5ab6029c6d8c58b206cc2080760066` → `16bf68a04e26c249febe21f3b467616d0844137a` | 5, 6в.3 |
| План главы 8.md | 18507 → 19602 | `ce4ae2e290af752ffba492387ab0f48b00a9f0e3` → `ce1986894b4304a1c74e99d0ce04d8284b88c1c0` | 5, 6в.3 |
| План главы 9.md | 31822 → 32775 | `fc47c7921fce7e05b56062288dec238d00c9e123` → `356f36c692ac147d8ce49c17b437c50efed0d866` | 5, 6в.3 |
| План лора.md | 52405 → 61375 | `8bce999cb7302db6afe9111c9bbf6dc53fc920f3` → `62c48e42e9b99c1cbc2b6d598d448802000c3fe4` | 3, 6в.2 |
| Развитие отношений Лизы и Паскаля.md | 24411 → 29760 | `cb37dcb06d039fceaf423b306bbea35b018aa834` → `66799e5e6097556628f10627dcf97387f4681d9c` | 2, 6в.1 |
| Сейчас.md | 3134 → 8008 | `473a603ac5640ae7f019fb67753b5681e5ed6e19` → `d1ad726c5eb0982651d0f5c198d70054dc0e476b` | 5, 6в.3 |
| События по главам.md | 20850 → 29170 | `ce731fa0b9e5dc4f45547aa8148b4ff384609b6d` → `3a8b14d930a9a1a7df0b14a92102d9464c13a4e2` | 5, 6в.3 |
| Стиль.md | 154064 → 40189 | `5b9c90fd4ca124cf8ef74ea46a3bf068d26ea556` → `baac4db012724441cf44409382dab860a8eb9e36` | 1, 6в.1 |
| Химия и динамика диалогов.md | 22327 → 26022 | `e3357aa260a1d9099dc7eeaafbf6e2481e2c9f28` → `3f4bd4d16fdca8c41f1a334e2fcd539bab547a13` | 2, 6в.1 |
| Хронология.md | 22169 → 25611 | `c90d74cc63014dd8b9e786258409f4cd851af851` → `76c3395a7205734e4cea28f7fc02b56c440abd04` | 5, 6в.3 |
| Шпаргалка долгов.md | 19743 → 27776 | `c317d1c60244e7fa16df51d1af57d76abe25ebf0` → `5fef6eef769865395c6e33e7b4c21e45bb414c2c` | 5, 6в.3 |

Карты: [стиль](<../Карта аудита стиля.md>), [персонажи](<../Карта аудита персонажей.md>), [мир](<../Карта аудита мира и лора.md>), [знания](<../Карта аудита знаний и детективной линии.md>), [события](<../Карта аудита событий, состояний и планов.md>), [междокументная сверка](<../Карта междокументной сверки.md>), [маршруты 7г](phase-7g.md), [интеграция 7д](phase-7d.md).

## 4. Неизменные и добавленные файлы

| Неизменный путь | SHA |
|---|---|
| .gitignore | `5a445a9da1c125d3b0dbddd3d45507855723ffe1` |
| elizabeth-ref-eyes-closeup.png | `9ae46832855e399bce344cfe46c0a2068048781c` |
| elizabeth-ref-face-front-v6.png | `16c05055175752080d49765f93293f5303dfde93` |
| elizabeth-ref-face-profile-v2.png | `40b5a113a5655fc8caa06ba47b97fc561acb6610` |
| elizabeth-ref-face-threequarter-v2.png | `b438d1f7eda192e17f58c9c2dcb712d9aa3386b1` |
| elizabeth-ref-fullbody-back.png | `89ae81f9b577bf1a554d663d81c1c9d896cd74ff` |
| elizabeth-ref-fullbody-front-v3.png | `4033cbb655b30a7557881e1ced333acb4815f839` |
| elizabeth-ref-fullbody-profile.png | `d83c03df7bec86569c3920d00d3a3278d9f375fe` |
| elizabeth-smotriny-portrait-v4.png | `945fea2eefa87604fbee7b81b80a4c815c51987c` |
| pascal-half-face-v8.png | `d548fd868b2bc6321cbb7e3a957cffa76b844baf` |
| pascal-ref-eyes-closeup.png | `b4117ff6ff13d49817d79514263863cee9502239` |
| pascal-ref-face-front-v3.png | `b6b46bcd7795d538e3d7831478661bf3d1e004cd` |
| pascal-ref-face-profile.png | `e07fa4c69c4479f58214af4c98892df51b138abb` |
| pascal-ref-face-threequarter-v2.png | `8f31173bb32d50ff2982e86daf9207e5b1c0df9f` |
| pascal-ref-face-threequarter.png | `9ec5ce8b3e760d6466b8025b4b50171115807f6c` |
| pascal-ref-fullbody-back-v3.png | `4dc9a9b9068f1ed27c74ded06613b5a5fbe1f668` |
| pascal-ref-fullbody-front-anatomy-v3.png | `2213cf3428386633b0db55d165d91b412857c327` |
| pascal-ref-fullbody-front-v3.png | `636e0ad2df058c3052c583e65c66e3a6121e873d` |
| pascal-ref-fullbody-profile-v3.png | `788e2d86ebcee7091c2d67bd6578e6489dba29bb` |
| rag/query.py | `a2528bc6b3120c8be56223c2143f404ff23478f2` |
| rainor-ref-eyes-closeup.png | `4bb1590307539acd671e1e01a51e5ddfb9bf2f78` |
| rainor-ref-face-front-v2.png | `a554f5cbb3cd19b467042846fca37ecc40e89329` |
| rainor-ref-face-profile.png | `77b5c5fda88838546b6d3b85f6eab4d80ffe464e` |
| rainor-ref-face-threequarter-v3.png | `46261b401651601ab52cbb37c38a9e2b7d0c3fd1` |
| rainor-ref-fullbody-back-v3.png | `3f3bd6bfd80ae295dea193f749964ee33263ad2d` |
| rainor-ref-fullbody-front-v6.png | `b61adcec77143a9cc58679d105ae6259eb2a0691` |
| rainor-ref-fullbody-profile-v4.png | `708060879fe5ebecdad1d27eef0cdf93b3d6501e` |
| scene-elizabeth-rainor-smotriny-listen-v5.png | `2370c1213435020b1fda5c12478f4c2dd12d3284` |
| scene-rainor-pascal-smotriny-entrance-v4.png | `400a3153cec51d5d0bd7318f5b6a87e217849f0d` |
| Глава 2.md | `09ca2f58c67351626a882f667dc39ef35bccc227` |
| Глава 3.md | `03d666fbf9ae087045e924eeb8a92a168a0ec420` |
| Глава 4.md | `60891df10c5b02523922a23ec8d0047fbde5a894` |
| Глава 5.md | `69c41892a920b88a07784a035c1e41c664bf6cd1` |
| Глава 6.md | `025ac1275aa00995356f8a0efbdb59d11f82414b` |
| Глава 7.md | `b46618f183c0902691b39a48b140ab326298e8fb` |
| Глава 8.1.md | `225d2d187f1c38a53f5ccd25c26782f3a8ddf3e7` |
| Глава 8.3.md | `b548f13f750b37288e0f8851f013269c97063dd6` |
| Глава 8.md | `768e42e5a418341480a18f1e370e5a5e7391d49a` |
| Черновик главы 9.2.md | `ec2ba060c6197f53d4ef55f4aecffdab59b27def` |
| Черновик главы 9.3.md | `72203dd00cf8ea28ab5007cb34a1fd4915d01bbd` |
| Черновик главы 9.md | `93124d71775bc6a4a46e6754976b6578c17fe292` |

| Добавленный путь | SHA | Байты |
|---|---|---:|
| .github/workflows/rag-navigation.yml | `159c7e7f689b3e78a37d4fe6d3def8134d55d943` | 1968 |
| rag/build_navigation.mjs | `108cb5532b3fb02c6870b91f76db357a71dba0ba` | 2875 |
| rag/navigation/agents.json | `b493bd2f3154ff13aab308c1ad3607ace57d4c21` | 366 |
| rag/navigation/arcs.json | `fbbf86b67186fa1631f24799cc9275f74bfab532` | 8939 |
| rag/navigation/chapter-1.json | `298acf75ff495ebd742ad97fa9979d91a454a0cf` | 388 |
| rag/navigation/chapter-2.json | `f2dfe96073e404a8fc8b883e650389908c7fe599` | 427 |
| rag/navigation/chapter-3.json | `10500e92174190cc7652d6c9cd5265ae492a386d` | 403 |
| rag/navigation/chapter-4.json | `dbc85d51d3c329d6477b1fe4379fefb583385e55` | 423 |
| rag/navigation/chapter-5.json | `3d29c53d22c077e16a1e624d89d34a3622e17de3` | 414 |
| rag/navigation/chapter-6.json | `bd6d0f6f6bb5ac3913da96e9efdb1b4cf2a94fba` | 406 |
| rag/navigation/chapter-7.json | `99b695988779984646fe88e2191bb28afb271122` | 390 |
| rag/navigation/chapter-8.json | `92cabae8c43efb705e792c2c701e0274f10a542a` | 391 |
| rag/navigation/characters.json | `a0be05e43066f11475047c1e2a9cef7d8d1c782e` | 12721 |
| rag/navigation/chronology.json | `3eb0b8a6224f85d38e5f33d5cec85c6991d0379a` | 6418 |
| rag/navigation/debts.json | `ce48fddec6d7c8791f5fcc6f061d24fc639ef48f` | 9472 |
| rag/navigation/dialogue.json | `fd41e75cb0bbe3c0497d7d749361897304180174` | 1889 |
| rag/navigation/events.json | `c2112fe9d388b9276c1be331af65459d751fd6e6` | 3537 |
| rag/navigation/general.json | `796fc4e02485bdc85a2f55faec980d6c1500d5be` | 2849 |
| rag/navigation/knowledge-liz.json | `f84c81ce5c3d9ecf3d04adfebff397c4e9ade892` | 22940 |
| rag/navigation/knowledge-pascal.json | `3ca917253262ccdcd0f2411090c1ddf903c5edfc` | 16860 |
| rag/navigation/knowledge-rainor.json | `450a81be31eba2d9d82489c04507b1f1e77b5bb7` | 16154 |
| rag/navigation/knowledge-reader.json | `ab1aa4e1e3a3d37033b686f6de4cf7e1a2a3b330` | 23658 |
| rag/navigation/lore-plan.json | `62b2965e9619ba852362abf48aeb873a95c0b0fb` | 19165 |
| rag/navigation/manifest.json | `c3ec281978be9949c63523017382f5ff5a3b1838` | 12446 |
| rag/navigation/plan-10.json | `a47f1f570fc663776fd997930829b97fb21b6a2e` | 2673 |
| rag/navigation/plan-8.json | `f55e67e507c37a2e9e770fb1e0c3a28b3954544b` | 1941 |
| rag/navigation/plan-9.json | `4d977bcf7ed9b2fecd5b9ddbf3ab4d3abca063be` | 4513 |
| rag/navigation/relations.json | `6965239fe234c0606de7cb890e928a8a30c1612b` | 7523 |
| rag/navigation/rule-00-read-before-every-scene.json | `0438842314feca9deb880a47f42dea640914394d` | 288 |
| rag/navigation/rule-01-edit-chapter-then-sync.json | `36077f9c90b7e1d24447b4e6d712f111bf4222d7` | 286 |
| rag/navigation/rule-02-chapter-plan-structure.json | `56c2b330872726c6f29cfce50f04911e4b806bc5` | 820 |
| rag/navigation/rule-03-writer-vs-routine.json | `b482567c99c2c1d4dec6178e1706d7a0d4b2276d` | 276 |
| rag/navigation/rule-04-never-lie-to-lore.json | `ae142598ac8ce5e24f2720a1baf2703670e1b2e0` | 276 |
| rag/navigation/rule-05-talk-like-a-human.json | `9e28a0b6ff179f9b64d0808b6e3cd0fce2bc9107` | 762 |
| rag/navigation/skill-brainstorm.json | `0006f0886a90f389d9fbf617cff217e6f29dfc9b` | 408 |
| rag/navigation/skill-close-scene.json | `b3665da312286ea9646e7a2ad2c1806d399d476e` | 430 |
| rag/navigation/skill-plan-chapter.json | `583e0c9f841f37fafc575ec7696934d4681026d1` | 392 |
| rag/navigation/skill-ready-scene.json | `1133657c52ec4af7417af0d17983bc77e2b61dfb` | 395 |
| rag/navigation/skill-write-scene.json | `ead4db4997845a3860720845f18c8fc826006d51` | 400 |
| rag/navigation/state.json | `c0cec8886468ecb55f3ceb3ce55df1381e013625` | 1528 |
| rag/navigation/style-examples.json | `94e2c3445c8530fffb1617f0c7bca130f2d676f0` | 39239 |
| rag/navigation/style.json | `711917997c0819274ac3cc23e20ffe45671ddd2a` | 2333 |
| rag/navigation/world.json | `87c264c41e9824a212b4597519b49aab43ab708e` | 9938 |
| rag/navigation_core.mjs | `b2497ac5fa6e08f3339723898c6378610038cc83` | 5971 |
| rag/phase-7a.md | `8a3f7e3b3ca43360dd6aa0f275aa42036156d513` | 5597 |
| rag/phase-7d.md | `24197079efbfa57cea2aba698815dca6df9bd04a` | 10734 |
| rag/phase-7g.md | `d8a82b8d419a4603f5d640d40f772446e526d777` | 6432 |
| rag/search_navigation.mjs | `1b770890d168cbe2831b4111309d5a2bc3268c38` | 3359 |
| rag/source_registry.json | `3556b7d812fd20c20a16d063eef2b5a329a88f44` | 7423 |
| rag/test_corpus.mjs | `ef966cf625d831c93277c767f5292294ffb8d4a8` | 4740 |
| rag/test_navigation.mjs | `27fc0f5199a69e4e857127f9fc666f6aeedf9599` | 4627 |
| Архитектура RAG.md | `9b92856218dc03de1b58733e0519becacde1d2ea` | 61868 |
| Глава 1.md | `95aac907dc177663f713bef75943685da99f1632` | 63982 |
| Журнал ревизии.md | `35c74f5e8a5290423f97881a151923b70f855f3a` | 171732 |
| Карта аудита знаний и детективной линии.md | `fe308a78d4dcc0e542c9741ae3c66d4ecc135c99` | 88668 |
| Карта аудита мира и лора.md | `ea4c84107df64fb97208713ea98388db3df00e32` | 55861 |
| Карта аудита персонажей.md | `ab22ab5b157c0b1fe5d552bee03754895fb09471` | 51996 |
| Карта аудита событий, состояний и планов.md | `9a49352975e063c9a9f72ee901a240bdfef2e3c8` | 98212 |
| Карта аудита стиля.md | `ef2864f6273b14fe37b009aa8625bac755e935e1` | 37802 |
| Карта междокументной сверки.md | `c5db3e88f49c2b3e79b3e84dc3f678ed59fe6f42` | 129218 |
| План ревизии.md | `b22182a4af350e29ce2e69cd5f7700554fcccbc4` | 32933 |
| Спорные вопросы.md | `602624c121dc3ab2221e26dc92c4469cb8bab114` | 6472 |
| Стиль — примеры и разборы.md | `902e85fa19a2ce5cab77d3f4f9bc93314abb309e` | 160190 |

## 5. Свежесть навигации

Манифест `rag/navigation/manifest.json`, source_commit=`a7ec005f44ba2002faabcc7c09fa9bd9784ed155`. Все 40 исходных путей совпадают по SHA и размеру с текущим деревом; все указатели существуют. Ноль устаревших/отсутствующих источников. Все 15 исключений существуют в текущем дереве, альтернативы/черновики не зарегистрированы как источники. selection_ready=false. Проверка свежести — по входным blob, не равенству вершины ветки source_commit. Поисковые прогоны этапа 7 подтверждены предыдущим журналом; в 8а заново CLI не запускался. Не считать навигацию готовым POV-пакетом.

## 6. Продолжение этапа 8 (рабочее деление)

- 8б — независимая содержательная приёмка: пройти все изменённые документы по реестру и картам переноса; сверять утверждения и статусы по backup/первичному тексту. Контрольные вопросы и физика ранних сцен, отдельные знания, будущие раскрытия, текущие версии; поиск с заранее заданными целями, точность/полнота/ссылки, честная фиксация нагрузки и проверка маршрута с телефона. Не заменять полное чтение карт очередью ID. При необходимости разбить на профильные порции.
- 8в — сопоставимый художественный эксперимент. До запуска выбрать одинаковую точку сцены и нейтральное задание, зафиксировать SHA, модель/режим и допустимые источники; два действительно независимых свежих контекста (backup и docs-revision), одинаковые условия, без этой карты и ожидаемых ошибок в заданиях. Отдельный оценщик сверяет первичный текст, лор, знания, ранние действия, физику, психологию, отношения, химию, стиль, рефлексию, повторы, полноту чтения. Сохранить обе версии как явно неканонические вне рукописи; если независимые контексты недоступны, отметить блокер, не выдавать имитацию за A/B.
- 8г — исправления только подтверждённых дефектов документации, повторная проверка, итоговый diff и решение автора. Main не сливать самостоятельно.

8а завершён как техническая инвентаризация и проверка сохранности рукописи. 8б–8г не выполнены; этап 8 в работе. Текущая проверка не доказывает отсутствие смысловых потерь, полную выборку POV или улучшение художественного качества. План и спорные вопросы прочитаны; журнал получен целиком, изучены статусы, структура и записи 6б.3а/6б.4/6г/7д, не повторялось полное чтение всей исторической части. Никаких изменений рукописи, канона, инструкций, индекса или авторских решений на 8а.
