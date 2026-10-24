# Next build — footer, human touches, Sell & Swap, requests, customer dashboard

Read every file in `design-reference-v3/` first (mockups, not code — rebuild as typed React components in the v2 navy & gold theme; don't copy `{{ }}`, `<sc-for>`, `<sc-if>`, `<x-dc>` or DCLogic). Keep all existing logic. Work in parts. After each part: `npm run build` + `npm run lint` clean, short summary, then STOP for my "continue".

## Part A — New footer + human touches
1. Footer (match `footer.html` on desktop and `footer-mobile.html` on phones):
   - Gold "Ready for your next car?" CTA card overlapping the top edge (Browse cars / Swap my car / WhatsApp).
   - Big statement "Drive royalty. Imported with care." with logo, short text, round social icons (gold hover).
   - Columns: Cars, Company, Visit or call (address, phone, email, hours from CONTACT in site.ts).
   - Bottom bar: © year, Privacy, Terms, "Made with care in Lagos". Faint oversized "ROYAL SHADES" wordmark at the very bottom (aria-hidden).
   - Mobile: CTA with 2 buttons side by side, 3 big tap targets (Call / WhatsApp / Directions), link groups as an accordion (+/−, one open at a time, aria-expanded), centred socials and copyright.
   - Hide the CTA card on /login, /register, /reserve and /admin.
2. Human touches (match `human-touches.html`), as reusable components with small inline SVG illustrations in navy/gold:
   - EmptyState variants: no search results ("No car matches that, yet" + Request this car), empty garage ("Your garage is waiting"), empty wishlist, empty requests.
   - 404 page: swinging gold "404" road sign, "Oops, wrong turn."
   - SuccessModal (confetti dots, gold check, personalised title using the user's first name) — use after reserve, sign up and offer accepted.
   - ConfirmDialog for destructive actions; admin delete offers "Mark as Sold instead".
   - Check-your-email screen after forgot-password and sign-up: masked email (first 2 chars + asterisks), Open Gmail button, 45s resend countdown.
   - Loader: logo inside a spinning gold ring + rotating friendly lines ("Polishing the chrome…").
   - Friendly, specific error copy everywhere (validators + API errors). Example: "That looks a little short. Nigerian numbers have 11 digits, like 0801 234 5678." Network error: "We couldn't reach the server. Your details are safe in this form. Check your data or Wi-Fi and tap Try again."
   - Toast variants: success (green bar), gentle warning (gold), good news (navy), error (red), as in the mockup.
   - All motion respects prefers-reduced-motion.

## Part B — Sell & Swap page (match `sell-swap.html`)
- Routes /sell and /swap share ONE wizard with a Sell/Swap toggle in the navy hero. LOGIN REQUIRED (redirect to /login and back).
- Steps — Sell: Your car → Condition → Photos & video → Inspection. Swap: Your car → Car you want → Condition → Photos & video → Inspection.
  - Your car: make, model, year, trim, mileage (+ km/mi), colour, optional VIN, usage (Foreign used / Nigerian used / Bought new).
  - Car you want: pick from AVAILABLE cars (photo cards) or "Help me choose" (budget field). Preselect if arriving from "Swap for this car" (?car=slug).
  - Condition: Yes/No questions (accident, flood, AC, warning lights, papers complete, serviced in 6 months) + Excellent/Good/Fair.
  - Photos & video: guided shot list of 8 slots (front, back, left, right, interior, dashboard & mileage, engine, tyres). Each slot is a file input with accept="image/*" and capture="environment". Compress images in the browser (max 1600px, ~0.8 quality) before upload. Show previews, replace/remove, per-file progress. Minimum 4 photos to continue.
  - Video: one walk-around video, accept="video/*", duration must be 45–60 seconds (read it with a <video> element's loadedmetadata), max 150 MB; friendly errors if too short/long/big.
  - Inspection: At our yard / At my location (address field), next 6 days (no Sundays), 4 time slots, documents checklist.
- Right summary panel updates live; for swaps show "Car you want ₦X − your offer (after inspection) = top-up (sent with your offer)".
- Autosave the draft to localStorage (not the files). Submit → success screen with reference (RS-SL-#### / RS-SW-####) and the 5-stage tracker: Submitted → Reviewing → Inspection → Offer sent (within 72 hours) → Accept & get paid.
- Mock mode: store requests via a new requestService (localStorage). Uploads: for now keep files as object URLs in memory; add a TODO for Cloudinary signed direct upload (POST /uploads/signature) — I'll build that endpoint.
- Types: TradeRequest { id, ref, kind: "sell" | "swap", userId, car, condition, media: { photos: {slot, url}[], videoUrl, videoSeconds }, wantedCarId?, budget?, inspection: { place: "yard" | "home", address?, date, time }, stage: "submitted" | "reviewing" | "inspection_booked" | "offer_sent" | "accepted" | "declined" | "completed", offer?: { amount, validUntil, topUp? }, createdAt }.

## Part C — Requests in admin + customer dashboard (Phase 4)
- Admin "Sell & swap" page (Torii style, badge count in sidebar): list + detail. Detail: customer, cars, condition answers, photo grid + video player, inspection slot (reschedule), offer form (amount, valid for 7 days, 72-hour countdown, auto top-up for swaps), "Accepted → add to stock" (creates a car with status "inspection" from the request), Decline, WhatsApp customer.
- Customer /account (Phase 4): profile card on the left; tabs My requests (offer card with Accept / Decline, stage tracker), My reservations, Tracked cars (mini voyage tracker), Wishlist (car grid). Use the human-touch empty states.
- Add every new action to the README as a future API endpoint (method, path, body, response).

## Part D — Phase 6 polish
Lazy-load routes (removes the bundle warning), page titles, favicon, optimise logo.png (create a 512px and a 64px version), delete unused old assets and NewsletterBand, final lint/build, README update.
