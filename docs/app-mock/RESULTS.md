# App mock click-through

Run with Chromium (Playwright) against `http://localhost:4190`.

| | Check | Detail |
|---|---|---|
| PASS | [desktop] phone frame is ~390px | width 390 |
| PASS | [desktop] runs-today places listed first | order TTTTTTTTTTTn |
| PASS | [desktop] filter spa + Yorkville | 1 place · 1 runs today |
| PASS | [desktop] Enter opens a place | /app/place/lantern-house |
| PASS | [desktop] Esc goes back to Explore |  |
| PASS | [desktop] place has its own URL |  |
| PASS | [desktop] uses left starts 2 of 2 |  |
| PASS | [desktop] redeem shows a 6-digit code | 207 725 |
| PASS | [desktop] countdown is running | 9:59 |
| PASS | [desktop] refresh keeps the same code | 207 725 -> 207 725 |
| PASS | [desktop] Back returns to the place |  |
| PASS | [desktop] place offers "Show my code" while live |  |
| PASS | [desktop] partner view shows the same code | 207 725 |
| PASS | [desktop] code moves to Confirmed at the door |  |
| PASS | [desktop] member sees Confirmed and the saving | Confirmed. You saved about $32. |
| PASS | [desktop] uses left dropped to 1 of 2 |  |
| PASS | [desktop] My pass: saved $32, 1 visit, in history |  |
| PASS | [desktop] alcohol in an offer is refused |  |
| PASS | [desktop] place shows the new offer | Dessert for the table, on us. |
| PASS | [desktop] place shows the new days | Runs Monday, Tuesday, Wednesday, Thursday. Today is Tuesday. |
| PASS | [desktop] place shows the new uses (2 of 3 left) |  |
| PASS | [desktop] blackout today blocks Redeem |  |
| PASS | [desktop] removing the blackout brings Redeem back |  |
| PASS | [desktop] not-today place is blocked with a reason |  |
| PASS | [desktop] typing the redeem URL for a blocked place is blocked too |  |
| PASS | [desktop] uses per year can go down to 1 |  |
| PASS | [desktop] zero uses left blocks Redeem |  |
| PASS | [desktop] expired code says so and offers a new one |  |
| PASS | [desktop] confirming in a second window updates the first |  |
| PASS | [desktop] Reset demo clears savings |  |
| PASS | [desktop] /demo goes to /app | /app |
| PASS | [desktop] service worker registered | http://localhost:4190/app |
| PASS | [desktop] no horizontal scroll |  |
| PASS | [desktop] no console errors |  |
| PASS | [phone] phone frame fills the screen | width 390 |
| PASS | [phone] runs-today places listed first | order TTTTTTTTTTTn |
| PASS | [phone] filter spa + Yorkville | 1 place · 1 runs today |
| PASS | [phone] place has its own URL |  |
| PASS | [phone] uses left starts 2 of 2 |  |
| PASS | [phone] redeem shows a 6-digit code | 196 803 |
| PASS | [phone] countdown is running | 9:59 |
| PASS | [phone] refresh keeps the same code | 196 803 -> 196 803 |
| PASS | [phone] Back returns to the place |  |
| PASS | [phone] place offers "Show my code" while live |  |
| PASS | [phone] partner view shows the same code | 196 803 |
| PASS | [phone] code moves to Confirmed at the door |  |
| PASS | [phone] member sees Confirmed and the saving | Confirmed. You saved about $32. |
| PASS | [phone] uses left dropped to 1 of 2 |  |
| PASS | [phone] My pass: saved $32, 1 visit, in history |  |
| PASS | [phone] alcohol in an offer is refused |  |
| PASS | [phone] place shows the new offer | Dessert for the table, on us. |
| PASS | [phone] place shows the new days | Runs Monday, Tuesday, Wednesday, Thursday. Today is Tuesday. |
| PASS | [phone] place shows the new uses (2 of 3 left) |  |
| PASS | [phone] blackout today blocks Redeem |  |
| PASS | [phone] removing the blackout brings Redeem back |  |
| PASS | [phone] not-today place is blocked with a reason |  |
| PASS | [phone] typing the redeem URL for a blocked place is blocked too |  |
| PASS | [phone] uses per year can go down to 1 |  |
| PASS | [phone] zero uses left blocks Redeem |  |
| PASS | [phone] expired code says so and offers a new one |  |
| PASS | [phone] confirming in a second window updates the first |  |
| PASS | [phone] Reset demo clears savings |  |
| PASS | [phone] /demo goes to /app | /app |
| PASS | [phone] service worker registered | http://localhost:4190/app |
| PASS | [phone] no horizontal scroll |  |
| PASS | [phone] no console errors |  |
| PASS | [chrome] manifest found and parsed | http://localhost:4190/app/manifest.webmanifest errors=[] |
| PASS | [chrome] no installability errors | [] |
