# Redesign prompt — Royal Shades Autos v2 (light navy & gold)

We are restyling the existing TypeScript frontend to a new approved design. Keep all existing logic (auth, garage, wishlist, services, routing, validation, URL filters). Change the look, the home page structure and the car status model.

Work in steps. After each step run `npm run build` and `npm run lint`, fix all errors, summarise briefly, then STOP and wait for me to type "continue".

## The approved design
Read every file in `design-reference-v2/` first:
- `home-v2.html` — new home page
- `car-details-v2.html` — new car details page
- `garage-v2.html` — new garage page

Match their colours, spacing, radii, shadows, layout and animations as closely as possible. They are mockups: rebuild them as typed React components. Do not copy the mockup template syntax (`{{ }}`, `<sc-for>`, `<sc-if>`, `<x-dc>`, DCLogic).

## Step 1: New theme tokens (replace "Obsidian & Champagne")
Light theme, navy + gold. Update the @theme tokens in src/index.css and remove the old dark tokens and the Cormorant accent font:
- navy #0B1B2E, navy-2 #132A45, navy-3 #1B3556
- gold #D4AF5A (buttons/accents on navy and white), gold-light #E5C27A (gold text on navy), gold-text #8A6620 (gold text on white; passes contrast), gold-tint #FBF3E1, gold-border #EBD9AE
- page bg #F5F6F8, surface #FFFFFF, line #E3E6EB, line-soft #EEF0F3
- ink #0B1B2E, muted #5A6474, faint #8E99A9, on-navy-muted #AEB8C6 / #C9D2DE
- status: available #1F9D61 (text #1F7A4D, tint #E8F6EE); arriving/arrived #2F6FDB (text #1F4FA8, tint #EAF1FD); inspection/coming soon #D4AF5A (text #8A6620, tint #FBF3E1); sold #B23B35 (tint #FDF2F1)
- font: Plus Jakarta Sans only (400–800). Headings 800 with tight letter-spacing. Accent word = same font in gold-text (on white) or gold-light (on navy). Eyebrows: 13px, 700, uppercase, letter-spacing .16em, gold.
- radius: cards 18px, panels 20–28px, inputs/buttons 12px, pills full. Navy hero has 40px bottom radius, navy footer 40px top radius.
Update the shared UI kit (Button variants: gold, navy, outline, ghost; Badge/StatusBadge; Input; Tabs as pill tabs; Card) to the new tokens. Navbar: navy, logo on navy, links light grey with gold hover, Garage icon and Sign in / account menu.

## Step 2: New car status model
Replace CarStatus with five statuses controlled later from the admin dashboard:
`"arriving" | "arrived" | "inspection" | "available" | "sold"`
- arriving: on the way (has shipment, shows in tracking + ETA bar), CTA "Reserve"
- arrived: at the port/yard, CTA "Reserve", badge "Arrived · At port"
- inspection: shown to customers as "Coming soon", CTA "Notify me" (no Add to Garage)
- available: in hero rotation, Fresh arrivals, can be added to Garage, CTA "Add to Garage" / "In Garage ✓"
- sold: only in "Recently sold", greyed photo + red SOLD ribbon, CTA "Find similar"
Update types, mock data, carService filters/counts, StatusBadge, showroom tabs (All / Available / Arriving / Coming soon / Sold), garage rules (only available/arriving/arrived can be reserved) and the details page "This car's journey" bar (Arriving → Arrived → Inspection → Available → Sold).

## Step 3: Photos
- Real dealership photos are in `public/cars/` (avalon-front, avalon-rear, lexus-rx, sonata-grey, sonata-blue, venza-black, gle-front, gle-rear, gle-dash, sienna-front). Reference them as `/cars/<name>.jpg`.
- KEEP the existing Unsplash photos in src/data/carImages.ts as well. Use the real photos for these mock cars (add them if missing): Toyota Avalon XLE (front + rear), Lexus RX 350, Hyundai Sonata Sport (grey), Hyundai Sonata (blue), Toyota Venza (black), Mercedes-Benz GLE 450 (front, rear, interior), Toyota Sienna. Keep the other mock cars on their Unsplash photos.
- Give a realistic status mix: most available, some arriving/arrived, one or two inspection, a few sold (e.g. blue Sonata and Sienna as sold).
- All photos are portrait phone shots: use object-fit: cover with object-position around "center 60%" so the car stays in frame.

## Step 4: Home page (match home-v2.html, in this order)
1. Navy hero: top info bar, navbar, eyebrow pill, headline "Your next car, the royal way.", subtext, Browse cars (gold) + Swap my car (outline), 3 trust items.
   Right side: ARCH-framed hero carousel (border-radius 240px 240px 26px 26px, thin gold outline ring) that auto-rotates through AVAILABLE cars every 4.5s with a 1.1s crossfade and slow Ken Burns zoom; pauses on hover and when the tab is hidden; dots + prev/next buttons; caption shows name, "In our garage · 2 of 5", price; clicking opens the car. Two floating white chips ("Swap accepted", "Inspected") with a gentle bob animation.
2. Finder card overlapping the hero bottom: tabs Buy a car / Swap my car / Sell my car; fields change per tab; Buy submits to /cars with filters; Swap and Sell go to /swap and /sell (placeholder pages for now).
3. Track import section (signature feature): white card with route line, ship that sails to its position on load, stage chips, input to /track.
4. Fresh arrivals: pill tabs All / SUV / Sedan / Minivan / Pickup, cards as in the mockup (status badge, heart, name, body · year · mileage, price, status CTA). Show available, arrived, arriving and inspection cars.
5. Recently sold: sold cars (greyed + SOLD ribbon) + navy "Missed one? We'll source it for you" card.
6. Swap section (navy panel, photo left, 3 steps, Get a swap quote + WhatsApp).
7. Sell band (gold tint): "Want to sell your car? We'll buy it."
8. Why Royal Shades (4 feature cards), then navy footer.

## Step 5: Car details (match car-details-v2.html)
Gallery with crossfade, prev/next, "1 / 3" counter and thumbnails (lightbox stays). Summary: badges, name, year · trim · colour, price, Fuel/Gearbox/Mileage tiles, Add to Garage (gold), Swap for this car (navy), Enquire on WhatsApp, wishlist. "This car's journey" status bar. Full specification table, About this car, features chips, "Have a car to swap?" navy card.
"You might also like": eyebrow "Keep exploring" above the title, horizontal carousel with prev/next arrows (disabled at the ends) and an "x / n" counter, rich cards with ETA bar for arriving cars and working Add to Garage / In Garage ✓ / Reserve / Notify me buttons.

## Step 6: Garage + other pages
- Garage: match garage-v2.html (photo cards, status badge, location note, remove, swap add-on card, summary with Swap credit line and navy "Due today" box). Keep all existing logic and POLICY values.
- Restyle every other page to the new light theme: Showroom, Track, Reserve, Thank you, About, Contact, FAQs, Privacy, Terms, 404, Login, Sign up, Forgot/Reset password, Verify email, account menu, toast, modals. Auth pages: navy panel with car photo on one side, white form card on the other.
- Respect prefers-reduced-motion everywhere. Keep accessibility (labels, focus rings in gold, 44px targets, aria on carousels).
