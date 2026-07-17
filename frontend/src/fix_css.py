import re

css_with_line_numbers = """1: @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&family=Outfit:wght@400;600;800&family=Cinzel:wght@400;700;900&family=Playfair+Display:wght@400;700;900&family=Press+Start+2P&display=swap');
2: 
3: * { box-sizing: border-box; margin: 0; padding: 0; }
4: 
5: body {
6:   font-family: 'Inter', sans-serif;
7:   height: 100vh;
8:   overflow: hidden;
9:   -webkit-font-smoothing: antialiased;
10:   background-color: #000;
11: }
12: 
13: /* ==========================================================================
14:    APP CONTAINER & DYNAMIC BACKGROUNDS
15:    ========================================================================== */
16: .app-container {
17:   display: flex;
18:   height: 100vh;
19:   width: 100vw;
20:   position: relative;
21:   transition: all 1s ease;
22: }
23: 
24: /* Base background layer */
25: .app-container::before {
26:   content: '';
27:   position: absolute;
28:   top: 0; left: 0; width: 100%; height: 100%;
29:   background-size: cover;
30:   background-position: center;
31:   background-repeat: no-repeat;
32:   z-index: 0;
33:   transition: background-image 1s ease;
34: }
35: 
36: .theme-batrieu::before { background-image: url('/bg_batrieu.png'); }
37: .theme-leloi::before { background-image: url('/bg_leloi.png'); }
38: 
39: /* Overlay to darken background slightly for readability */
40: .app-container::after {
41:   content: '';
42:   position: absolute;
43:   top: 0; left: 0; width: 100%; height: 100%;
44:   background: rgba(0,0,0,0.5);
45:   z-index: 1;
46: }
47: 
48: /* Bring all interactive content above the backgrounds */
49: .app-container > *:not(.background-overlay) {
50:   position: relative;
51:   z-index: 5;
52:   flex: 1;
53:   width: 100%;
54:   height: 100%;
55: }
56: 
57: /* ==========================================================================
58:    MENU & CHARACTER SELECT (Shared)
59:    ========================================================================== */
60: .menu-container {
61:   display: flex;
62:   flex-direction: column;
63:   align-items: center;
64:   justify-content: center;
65:   height: 100vh;
66:   width: 100vw;
67:   position: relative;
68:   z-index: 10;
69:   animation: fadeIn 1s ease-out;
70: }
71: 
72: /* ==========================================================================
73:    SPLIT SCREEN CHARACTER SELECT
74:    ========================================================================== */
75: .split-screen-container {
76:   display: flex;
77:   width: 100vw;
78:   height: 100vh;
79:   overflow: hidden;
80:   position: relative;
81:   background: #000;
82:   animation: fadeIn 1s ease-out;
83: }
84: 
85: .split-pane {
86:   flex: 1;
87:   position: relative;
88:   overflow: hidden;
89:   cursor: pointer;
90:   transition: flex 0.6s cubic-bezier(0.25, 1, 0.5, 1);
91:   display: flex;
92:   justify-content: center;
93:   align-items: center;
94: }
95: 
96: .split-pane:hover {
97:   flex: 1.6;
98: }
99: 
100: .split-bg {
101:   position: absolute;
102:   top: 0; left: 0; right: 0; bottom: 0;
103:   background-size: cover;
104:   background-position: center;
105:   transition: transform 0.6s ease, filter 0.6s ease;
106:   z-index: 1;
107: }
108: 
109: .split-batrieu .split-bg { background-image: url('/bg_batrieu.png'); }
110: .split-leloi .split-bg { background-image: url('/bg_leloi.png'); }
111: 
112: .split-screen-container:hover .split-pane:not(:hover) .split-bg {
113:   filter: grayscale(80%) brightness(0.3);
114: }
115: 
116: .split-pane:hover .split-bg {
117:   transform: scale(1.08);
118:   filter: brightness(1.15);
119: }
120: 
121: .split-overlay {
122:   position: absolute;
123:   top: 0; left: 0; right: 0; bottom: 0;
124:   background: linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.2) 50%, rgba(0,0,0,0.4) 100%);
125:   z-index: 2;
126:   transition: opacity 0.6s ease;
127: }
128: 
129: .split-pane:hover .split-overlay {
130:   background: linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.1) 50%, rgba(0,0,0,0.3) 100%);
131: }
132: 
133: .split-content {
134:   position: relative;
135:   z-index: 5;
136:   width: 100%;
137:   height: 100%;
138:   display: flex;
139:   flex-direction: column;
140:   justify-content: flex-end;
141:   padding: 80px;
142: }
143: 
144: .split-title-vertical {
145:   position: absolute;
146:   top: 50%; left: 50%;
147:   transform: translate(-50%, -50%) rotate(-90deg);
148:   font-size: 5rem;
149:   color: rgba(255,255,255,0.4);
150:   white-space: nowrap;
151:   letter-spacing: 15px;
152:   transition: opacity 0.4s ease;
153:   pointer-events: none;
154: }
155: 
156: .split-batrieu .split-title-vertical { font-family: 'Playfair Display', serif; }
157: .split-leloi .split-title-vertical { font-family: 'Playfair Display', serif; }
158: 
159: .split-pane:hover .split-title-vertical { opacity: 0; }
160: 
161: .split-details {
162:   opacity: 0;
163:   transform: translateY(40px);
164:   transition: all 0.5s ease;
165:   transition-delay: 0.1s;
166:   max-width: 600px;
167:   margin: 0 auto;
168:   text-align: center;
169: }
170: 
171: .split-pane:hover .split-details {
172:   opacity: 1;
173:   transform: translateY(0);
174: }
175: 
176: .split-name {
177:   font-size: 4.5rem;
178:   margin-bottom: 8px;
179:   text-shadow: 0 10px 20px rgba(0,0,0,0.8), 0 0 30px rgba(255,255,255,0.2);
180: }
181: .split-batrieu .split-name { 
182:   font-family: 'Playfair Display', serif; 
183:   background: linear-gradient(to right, #fde68a, #d97706);
184:   -webkit-background-clip: text;
185:   -webkit-text-fill-color: transparent;
186:   filter: drop-shadow(0 5px 15px rgba(217, 119, 6, 0.4));
187: }
188: .split-leloi .split-name { 
189:   font-family: 'Playfair Display', serif; 
190:   background: linear-gradient(to right, #fef08a, #eab308);
191:   -webkit-background-clip: text;
192:   -webkit-text-fill-color: transparent;
193:   filter: drop-shadow(0 5px 15px rgba(234, 179, 8, 0.4));
194: }
195: 
196: .split-title {
197:   font-size: 1.5rem;
198:   color: white;
199:   margin-bottom: 20px;
200:   letter-spacing: 2px;
201:   text-transform: uppercase;
202: }
203: .split-batrieu .split-title { font-family: 'Inter', sans-serif; }
204: .split-leloi .split-title { font-family: 'Playfair Display', serif; }
205: 
206: .split-desc {
207:   font-size: 1.2rem;
208:   color: rgba(255,255,255,0.9);
209:   line-height: 1.6;
210:   margin-bottom: 30px;
211: }
212: 
213: .split-btn {
214:   font-size: 1.2rem;
215:   padding: 15px 40px;
216:   border-radius: 50px;
217: }
218: 
219: .menu-content {
220:   position: relative;
221:   z-index: 20;
222:   display: flex;
223:   flex-direction: column;
224:   align-items: center;
225: }
226: 
227: /* Title Styling */
228: .title {
229:   font-size: 5rem;
230:   font-weight: 800;
231:   margin-bottom: 0.1em;
232:   text-shadow: 0 10px 30px rgba(0,0,0,0.8);
233:   letter-spacing: 2px;
234: }
235: .subtitle {
236:   font-size: 1.2rem;
237:   color: rgba(255,255,255,0.8);
238:   margin-bottom: 50px;
239: }
240: 
241: .theme-batrieu .title {
242:   font-family: 'Playfair Display', serif;
243:   background: linear-gradient(to right, #fde68a, #d97706);
244:   -webkit-background-clip: text;
245:   -webkit-text-fill-color: transparent;
246:   filter: drop-shadow(0 10px 20px rgba(0,0,0,0.8));
247: }
248: .theme-leloi .title {
249:   font-family: 'Playfair Display', serif;
250:   background: linear-gradient(to right, #fef08a, #eab308);
251:   -webkit-background-clip: text;
252:   -webkit-text-fill-color: transparent;
253:   filter: drop-shadow(0 0 20px rgba(234,179,8,0.5)) drop-shadow(0 10px 30px rgba(0,0,0,0.8));
254: }
255: 
256: /* Cards */
257: .menu-cards {
258:   display: flex;
259:   gap: 40px;
260:   flex-wrap: wrap;
261:   justify-content: center;
262: }
263: 
264: .menu-card {
265:   width: 380px;
266:   padding: 40px 30px;
267:   text-align: center;
268:   cursor: pointer;
269:   transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
270:   display: flex;
271:   flex-direction: column;
272:   align-items: center;
273:   gap: 20px;
274:   backdrop-filter: blur(12px);
275:   color: white;
276: }
277: 
278: .menu-card h2 {
279:   font-size: 1.8rem;
280:   letter-spacing: 1px;
281:   transition: color 0.4s ease;
282:   margin: 0;
283: }
284: 
285: .menu-card p {
286:   color: rgba(255, 255, 255, 0.8);
287:   line-height: 1.6;
288:   font-size: 1.1rem;
289: }
290: 
291: .card-icon {
292:   font-size: 3.5rem;
293:   margin-bottom: 5px;
294:   transition: transform 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
295: }
296: 
297: .menu-card:hover .card-icon {
298:   transform: scale(1.2) translateY(-15px) rotate(5deg);
299: }
300: 
301: /* Global Buttons */
302: .btn-primary {
303:   background: rgba(0,0,0,0.5);
304:   backdrop-filter: blur(5px);
305:   color: white;
306:   border: 1px solid rgba(255,255,255,0.3);
307:   padding: 10px 24px;
308:   border-radius: 30px;
309:   font-family: 'Inter', sans-serif;
310:   cursor: pointer;
311:   transition: all 0.2s ease;
312:   z-index: 100;
313: }
314: .btn-primary:hover {
315:   background: rgba(255,255,255,0.1);
316:   border-color: white;
317: }
318: 
319: /* ==========================================================================
320:    THEME: BÀ TRIỆU (Jungle, Ancient Bronze, Raw)
321:    ========================================================================== */
322: .theme-batrieu {
323:   /* Menu Cards */
324:   .menu-card {
325:     background: rgba(6, 20, 15, 0.6);
326:     border: 1px solid rgba(146, 64, 14, 0.5);
327:     border-radius: 4px;
328:   }
329:   .menu-card:hover {
330:     transform: translateY(-10px);
331:     background: rgba(6, 20, 15, 0.9);
332:     border-color: #fbbf24;
333:     box-shadow: 0 10px 30px rgba(0,0,0,0.7), 0 0 20px rgba(217, 119, 6, 0.3);
334:   }
335:   .menu-card h2 { font-family: 'Playfair Display', serif; color: #fbbf24; }
336: 
337:   /* Visual Novel Mode */
338:   .vn-content {
339:     flex: 1; display: flex; flex-direction: column; justify-content: space-between;
340:     padding: 160px 10vw 80px 10vw;
341:   }
342:   
343:   .dialog-box {
344:     position: relative;
345:     background: rgba(6, 20, 15, 0.85); /* Deep jungle green */
346:     backdrop-filter: blur(10px);
347:     border: 2px solid #92400e; /* Raw bronze */
348:     border-radius: 4px; /* Sharp corners */
349:     padding: 30px 40px;
350:     width: 100%; max-width: 1200px; margin: 0 auto;
351:     box-shadow: 0 10px 30px rgba(0,0,0,0.7), inset 0 0 20px rgba(146, 64, 14, 0.3);
352:     border-top: 4px solid #d97706;
353:   }
354:   
355:   .dialog-speaker {
356:     position: absolute;
357:     top: -45px; left: -2px;
358:     background: #92400e;
359:     padding: 8px 25px;
360:     border-radius: 4px 4px 0 0;
361:     border: 2px solid #d97706;
362:     border-bottom: none;
363:     font-family: 'Playfair Display', serif;
364:     font-size: 1.6rem; font-weight: 900; color: #fde68a;
365:     text-transform: uppercase; letter-spacing: 2px;
366:     margin-bottom: 0;
367:     box-shadow: 0 -5px 15px rgba(0,0,0,0.5);
368:   }
369:   
370:   .dialog-text {
371:     font-family: 'Playfair Display', serif;
372:     font-size: 1.5rem; line-height: 1.8; color: #fefce8;
373:   }
374:   
375:   .vn-choices {
376:     display: flex; flex-direction: column; align-items: center; gap: 15px; margin-bottom: 40px;
377:   }
378:   
379:   .choice-btn {
380:     background: rgba(6, 20, 15, 0.9);
381:     border: 1px solid #92400e;
382:     border-radius: 0px; /* Sharp */
383:     color: #fcd34d;
384:     padding: 18px 40px; width: 80%; max-width: 800px;
385:     font-family: 'Playfair Display', serif; font-size: 1.2rem;
386:     text-transform: uppercase; letter-spacing: 1px;
387:     cursor: pointer; transition: all 0.3s ease;
388:   }
389:   .choice-btn:hover {
390:     background: #92400e; color: white; box-shadow: 0 0 20px rgba(217,119,6,0.4);
391:   }
392:   
393: 
394:   /* Chat Mode */
395:   .chat-section { flex: 1; display: flex; flex-direction: column; min-height: 0; }
396:   .chat-header { padding: 20px; border-bottom: 1px solid #92400e; display: flex; justify-content: space-between; }
397:   .chat-title { font-family: 'Playfair Display', serif; color: #fbbf24; font-size: 1.5rem; text-transform: uppercase; }
398:   .chat-history { flex: 1; overflow-y: auto; padding: 40px 10%; display: flex; flex-direction: column; gap: 24px; min-height: 0; }
399:   
400:   .message-container { display: flex; align-items: flex-end; gap: 16px; max-width: 85%; }
401:   .message-container.user { align-self: flex-end; flex-direction: row-reverse; }
402:   .message-container.bot { align-self: flex-start; }
403:   
404:   .message-bubble { padding: 18px 24px; font-size: 1.15rem; line-height: 1.6; }
405:   .user-bubble {
406:     background: linear-gradient(135deg, #92400e, #d97706); color: white; border-radius: 18px 18px 0 18px;
407:     box-shadow: 0 4px 15px rgba(217, 119, 6, 0.3);
408:   }
409:   .bot .message-bubble {
410:     background: rgba(6, 20, 15, 0.95); backdrop-filter: blur(12px);
411:     border: 1px solid #d97706; border-radius: 18px 18px 18px 0;
412:     color: #fefce8; font-family: 'Playfair Display', serif;
413:     box-shadow: 0 4px 15px rgba(0,0,0,0.5);
414:   }
415:   
416:   .bot-avatar {
417:     width: 44px; height: 44px;
418:     background: linear-gradient(to bottom, #d97706, #78350f);
419:     clip-path: polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%); /* Shield/Hexagon shape */
420:     display: flex; justify-content: center; align-items: center;
421:     color: white; font-family: 'Playfair Display'; font-weight: 900; font-size: 1.2rem;
422:   }
423:   
424:   .chat-input-area {
425:     padding: 20px; display: flex; gap: 15px; border-top: 1px solid #92400e; background: rgba(6,20,15,0.9);
426:   }
427:   .chat-input {
428:     flex: 1; background: transparent; border: 1px solid #92400e; padding: 15px;
429:     color: #fefce8; font-family: 'Inter', sans-serif; font-size: 1.1rem; border-radius: 4px;
430:   }
431:   .chat-input:focus { outline: none; border-color: #fbbf24; }
432:   
433:   .vn-timer-bar { background: linear-gradient(90deg, #78350f, #d97706); }
434: }
435: 
436: /* ==========================================================================
437:    THEME: LÊ LỢI (Imperial, Gold, Crimson, Symmetrical)
438:    ========================================================================== */
439: .theme-leloi {
440:   /* Menu Cards */
441:   .menu-card {
442:     background: linear-gradient(180deg, rgba(69, 10, 10, 0.6) 0%, rgba(30, 0, 0, 0.8) 100%);
443:     border: 1px solid rgba(250, 204, 21, 0.3);
444:     border-radius: 24px;
445:   }
446:   .menu-card:hover {
447:     transform: translateY(-10px);
448:     background: linear-gradient(180deg, rgba(69, 10, 10, 0.8) 0%, rgba(30, 0, 0, 0.9) 100%);
449:     border-color: #facc15;
450:     box-shadow: 0 10px 30px rgba(0,0,0,0.7), 0 0 20px rgba(250, 204, 21, 0.3);
451:   }
452:   .menu-card h2 { font-family: 'Playfair Display', serif; color: #fef08a; }
453: 
454:   /* Visual Novel Mode */
455:   .vn-content {
456:     flex: 1; display: flex; flex-direction: column; justify-content: space-between;
457:     padding: 160px 10vw 60px 10vw;
458:   }
459:   
460:   .dialog-box {
461:     position: relative;
462:     background: linear-gradient(180deg, rgba(69, 10, 10, 0.85) 0%, rgba(30, 0, 0, 0.95) 100%);
463:     backdrop-filter: blur(20px);
464:     border: 2px solid #facc15; /* Royal Gold */
465:     border-radius: 24px; /* Elegant curves */
466:     padding: 40px 50px;
467:     width: 100%; max-width: 1000px; margin: 0 auto;
468:     box-shadow: 0 0 40px rgba(234, 179, 8, 0.2), inset 0 0 20px rgba(250, 204, 21, 0.1);
469:   }
470:   
471:   .dialog-speaker {
472:     position: absolute;
473:     top: -30px; left: 50%; transform: translateX(-50%);
474:     background: linear-gradient(90deg, rgba(69,10,10,1) 0%, rgba(127,29,29,1) 50%, rgba(69,10,10,1) 100%);
475:     padding: 10px 40px;
476:     border: 2px solid #facc15;
477:     border-radius: 30px;
478:     font-family: 'Playfair Display', serif;
479:     font-size: 1.8rem; font-weight: 900; color: #fef08a;
480:     text-transform: uppercase; letter-spacing: 3px;
481:     margin-bottom: 0; text-align: center;
482:     text-shadow: 0 0 15px rgba(250,204,21,0.5);
483:     box-shadow: 0 0 20px rgba(250,204,21,0.3);
484:   }
485:   
486:   .dialog-text {
487:     font-family: 'Inter', sans-serif; font-weight: 300;
488:     font-size: 1.3rem; line-height: 1.9; color: #fff;
489:     text-align: justify;
490:   }
491:   
492:   .vn-choices {
493:     display: flex; flex-direction: column; align-items: center; gap: 20px; margin-bottom: 50px;
494:   }
495:   
496:   .choice-btn {
497:     background: linear-gradient(90deg, rgba(69,10,10,0.9) 0%, rgba(127,29,29,0.9) 50%, rgba(69,10,10,0.9) 100%);
498:     border: 1px solid #facc15;
499:     border-radius: 40px; /* Pill shape */
500:     color: #fef08a;
501:     padding: 16px 50px; width: 70%; max-width: 700px;
502:     font-family: 'Playfair Display', serif; font-size: 1.2rem; font-weight: 700;
503:     text-transform: uppercase; letter-spacing: 2px;
504:     cursor: pointer; transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
505:   }
506:   .choice-btn:hover {
507:     background: linear-gradient(90deg, #ca8a04, #facc15, #ca8a04);
508:     color: #450a0a; border-color: #fff;
509:     box-shadow: 0 0 30px rgba(250, 204, 21, 0.6); transform: scale(1.05);
510:   }
511:   
512:   /* Chat Mode */
513:   .chat-section { flex: 1; display: flex; flex-direction: column; min-height: 0; }
514:   .chat-header { 
515:     padding: 20px; border-bottom: 1px solid rgba(250,204,21,0.3); 
516:     display: flex; justify-content: space-between; background: rgba(69,10,10,0.5); backdrop-filter: blur(10px);
517:   }
518:   .chat-title { font-family: 'Playfair Display', serif; color: #fef08a; font-size: 1.6rem; text-transform: uppercase; letter-spacing: 2px; }
519:   .chat-history { flex: 1; overflow-y: auto; padding: 40px 15%; display: flex; flex-direction: column; gap: 24px; min-height: 0; }
520:   
521:   .message-container { display: flex; align-items: flex-end; gap: 16px; max-width: 80%; }
522:   .message-container.user { align-self: flex-end; flex-direction: row-reverse; }
523:   .message-container.bot { align-self: flex-start; }
524:   
525:   .message-bubble { padding: 18px 24px; font-size: 1.15rem; line-height: 1.7; font-family: 'Inter', sans-serif;}
526:   .user-bubble {
527:     background: linear-gradient(135deg, #eab308, #ca8a04); color: #450a0a; font-weight: 600;
528:     border-radius: 20px 20px 0 20px; box-shadow: 0 5px 15px rgba(234, 179, 8, 0.4);
529:   }
530:   .bot .message-bubble {
531:     background: rgba(69, 10, 10, 0.9); backdrop-filter: blur(12px);
532:     border: 1px solid rgba(250, 204, 21, 0.6);
533:     border-radius: 20px 20px 20px 0;
534:     color: #fff; box-shadow: 0 5px 20px rgba(0,0,0,0.6);
535:   }
536:   
537:   .bot-avatar {
538:     width: 48px; height: 48px; border-radius: 50%;
539:     background: #7f1d1d; border: 2px solid #facc15;
540:     box-shadow: 0 0 15px rgba(250,204,21,0.6);
541:     display: flex; justify-content: center; align-items: center;
542:     color: #facc15; font-family: 'Playfair Display'; font-weight: 900; font-size: 1.4rem;
543:   }
544:   
545:   .chat-input-area {
546:     padding: 20px; display: flex; gap: 15px; border-top: 1px solid rgba(250,204,21,0.3); background: rgba(69,10,10,0.7); backdrop-filter: blur(10px);
547:   }
548:   .chat-input {
549:     flex: 1; background: rgba(0,0,0,0.5); border: 1px solid rgba(250,204,21,0.5); padding: 15px 20px;
550:     color: #fff; font-family: 'Inter', sans-serif; font-size: 1.1rem; border-radius: 30px;
551:   }
552:   .chat-input:focus { outline: none; border-color: #facc15; box-shadow: 0 0 15px rgba(250,204,21,0.3); }
553:   
554:   .vn-timer-bar { background: linear-gradient(90deg, #991b1b, #facc15); }
555: }
556: 
557: /* Common/Shared Animations & Utils */
558: .slide-up { animation: slideUpFade 0.4s cubic-bezier(0.16, 1, 0.3, 1); }
559: @keyframes slideUpFade { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
560: @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
561: 
562: .vn-timer-container { width: 80%; max-width: 800px; height: 6px; background: rgba(255,255,255,0.2); border-radius: 4px; overflow: hidden; margin-bottom: 20px; }
563: .vn-timer-bar { height: 100%; transition: width 1s linear; }
564: 
565: /* Letterbox Top & Bottom for VN */
566: .letterbox-top, .letterbox-bottom { position: absolute; width: 100%; height: 80px; background: black; z-index: 20; }
567: .letterbox-top { top: 0; } .letterbox-bottom { bottom: 0; }
568: 
569: .ending-overlay { animation: fadeIn 3s ease-in-out; color: white; display: flex; flex-direction: column; justify-content: center; alignItems: center; text-align: center; }
570: .ending-victory { background: radial-gradient(circle, rgba(234,179,8,0.9) 0%, rgba(69,10,10,1) 100%); }
571: .ending-historical { background: radial-gradient(circle, rgba(15,23,42,0.95) 0%, rgba(2,6,23,1) 100%); }
572: .ending-bad { background: radial-gradient(circle, rgba(69,10,10,0.95) 0%, rgba(20,0,0,1) 100%); }
573: 
574: .vn-typing-indicator { display: inline-block; animation: blink 1s infinite; margin-left: 5px; color: rgba(255,255,255,0.7); font-size: 1.2em; }
575: @keyframes blink { 0%, 100% { opacity: 1; transform: translateY(0); } 50% { opacity: 0.3; transform: translateY(2px); } }
576: .typing-dot { animation: blink 1.4s infinite; font-size: 1.5rem; letter-spacing: 2px; }
577: .typing-dot:nth-child(2) { animation-delay: 0.2s; }
578: .typing-dot:nth-child(3) { animation-delay: 0.4s; }
579: 
580: ::-webkit-scrollbar { width: 8px; }
581: ::-webkit-scrollbar-track { background: rgba(0,0,0,0.2); }
582: ::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.2); border-radius: 4px; }
583: 
584: /* Split Choices for Hand Gesture */
585: .vn-choices-split {
586:   display: flex; flex-direction: column; align-items: center; width: 100%; margin-bottom: 40px;
587: }
588: 
589: .split-choices-row {
590:   display: flex; justify-content: space-between; width: 100%; max-width: 1400px; padding: 0 40px; pointer-events: none;
591: }
592: 
593: .choice-side { flex: 1; display: flex; pointer-events: auto; }
594: .choice-side.left { justify-content: flex-start; }
595: .choice-side.right { justify-content: flex-end; }
596: 
597: .split-choice-btn {
598:   width: 100%; max-width: 450px;
599:   background: rgba(6, 20, 15, 0.95);
600:   border: 2px solid #92400e;
601:   backdrop-filter: blur(10px);
602:   transition: all 0.3s ease;
603: }
604: .theme-leloi .split-choice-btn {
605:   background: linear-gradient(90deg, rgba(69,10,10,0.9) 0%, rgba(127,29,29,0.9) 50%, rgba(69,10,10,0.9) 100%);
606:   border: 2px solid #facc15;
607: }
608: 
609: .choice-side.left .split-choice-btn { border-left: 5px solid #10b981; }
610: .choice-side.right .split-choice-btn { border-right: 5px solid #10b981; }
611: 
612: .split-timer { width: 50%; margin-bottom: 30px; }
613: 
614: .wave-hint {
615:   font-size: 0.9rem; color: #10b981; text-transform: uppercase; letter-spacing: 2px;
616:   margin-bottom: 10px; font-family: 'Inter', sans-serif; font-weight: bold;
617:   animation: wavePulse 2s infinite;
618: }
619: 
620: @keyframes wavePulse {
621:   0% { opacity: 0.5; transform: scale(0.95); }
622:   50% { opacity: 1; transform: scale(1.05); text-shadow: 0 0 10px #10b981; }
623:   100% { opacity: 0.5; transform: scale(0.95); }
624: }
"""

# Strip the leading numbers
lines = css_with_line_numbers.strip().split('\n')
cleaned_lines = []
for line in lines:
    cleaned = re.sub(r'^\d+:\s?', '', line)
    cleaned_lines.append(cleaned)

clean_css = '\n'.join(cleaned_lines)

with open('d:/Project/historical-chatbot/frontend/src/index.css', 'w', encoding='utf-8') as f:
    f.write(clean_css)

print("Restored CSS successfully.")
