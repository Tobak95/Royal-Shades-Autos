# Build prompt — Royal Shades Autos (TypeScript rebuild)

You are rebuilding the frontend of "The Royal Shades Autos Limited" FROM SCRATCH in TypeScript. It is a premium car dealership in Lagos, Nigeria, that imports cars from abroad. Customers browse available cars, see incoming cars still being shipped, see sold cars, save cars to a Garage (cart), reserve them with a deposit, and track their car's shipment. Build FRONTEND ONLY with typed mock data; there are no car API endpoints yet.

Work in phases. At the end of each phase: run `npm run build`, fix all errors, give me a short summary of what you built and why, then STOP and wait for me to type "continue".

## The design is already approved: match it
Open and study every file in `design-reference/` (read its README.md first). These are the approved mockups for Home, Login, Sign up and Garage. Match their colors, typography, spacing, radii, borders, hover states and layout as closely as possible, converting inline styles to Tailwind classes and theme tokens. Pages without a mockup (Showroom, Car details, Track, Reserve, Account, Admin, etc.) must use the same visual language. Do NOT copy the mockup template syntax (`{{ }}`, `<sc-for>`, `<sc-if>`, `<x-dc>`, DCLogic); rebuild everything as typed React components.

## Phase 0: Fresh start
1. First READ the old code to reuse its auth logic: src/pages/LoginPage.jsx, RegisterPage.jsx, VerifyEmail.jsx, ForgotPasswordPage.jsx, context/AppContext.jsx, utils/axiosInstance.js, utils/formValidator.js.
2. Then delete all old source and config files EXCEPT: .git, .gitignore, src/assets/, design-reference/, BUILD_PROMPT.md.
3. Scaffold a fresh Vite + React 19 + TypeScript project in this folder (react-ts template structure), with "strict": true in tsconfig and the "@/" path alias pointing to src/.
4. Install: tailwindcss @tailwindcss/vite, react-router-dom, react-hook-form, zod, @hookform/resolvers, axios, framer-motion, lucide-react, clsx, tailwind-merge.

## Brand: "Obsidian & Champagne"
Logo: src/assets/logo.png (champagne-gold, transparent background; looks best on dark backgrounds; on light backgrounds put it on a small obsidian tile as the footer mockup does). Use it in the navbar, footer, auth pages, loader and favicon.
Photos in src/assets: carrrrrrrs.avif (dark garage hero), car.avif (street photo, used on sign up and the promise banner).

Tailwind v4 @theme tokens in src/index.css:
- obsidian #0A0A0B (page background), graphite #141417 (cards), graphite-2 #1C1C21 (inputs, raised surfaces), line #2A2A30 (borders), section-alt #111113
- gold #DEBB6E (primary, from the logo), gold-deep #B8913F, gold-light #F0D9A4
- ivory #F4EFE6, ivory-line #DDD3C2, ink #1A1714 (footer text), footer-heading #8A6A2C
- text: white; muted #A1A1AA; soft #B4B4BC
- status: available #34C77B (text #7FE0AA), incoming #5BA4E6 (text #8EC5F0), sold #D9534F (text #F2A3A0); badge backgrounds are the status color at ~16% opacity
- radius: cards 16px, big panels 20px, inputs/buttons 10px, pills full

Typography (Google Fonts):
- Headings and body: "Plus Jakarta Sans" (400–800), tight letter-spacing on headings
- Accent word: "Cormorant Garamond" italic 600 in gold at ~1.15em. Use it for ONE key word per heading: "Drive *Royalty*", "Explore the *Showroom*", "Track your *Voyage*", "Your *Garage*", "Create your *account*", "Get in *Touch*"
- Eyebrow labels: 12px uppercase, letter-spacing .22em, gold, preceded by a short gold line where the mockup shows it

Signature details:
- The logo's speedometer arc is a recurring motif: arc SVG section divider, an arc-shaped loader, and the circular progress ring on the tracker.
- Car images sit on a radial graphite gradient. Cards lift 4px with a gold border and glow on hover.
- Glassmorphism cards (backdrop-blur, gold 30% border) over dark photos on the hero and auth pages.
- framer-motion: fade-up on scroll, smooth tab indicator, page transitions. Subtle; respect prefers-reduced-motion.
- Fully responsive, mobile-first (375px, 768px, 1280px). Touch targets ≥ 44px. Real labels on inputs, aria-labels on icon buttons, visible focus rings in gold.
- Currency: Naira via Intl.NumberFormat("en-NG"). Short form on cards (₦68.5M), full amount on details, garage and reserve pages.
- Brand name everywhere: "The Royal Shades Autos Limited" (short form: "Royal Shades Autos"). No lorem ipsum. Use placeholders like [Phone number] for business details I haven't given yet.

## Types (src/types/)
- car.ts: CarStatus = "available" | "incoming" | "sold"; Condition = "Foreign used" | "Brand new" | "Nigerian used"; BodyType = "SUV" | "Sedan" | "Coupe" | "Hatchback" | "Pickup" | "Bus"; Car { id, slug, make, model, year, trim, price, mileage, mileageUnit: "mi" | "km", transmission, fuelType, engine, color, bodyType, seats, vin, condition, origin, status, images: string[], description, features: string[], createdAt, shipment?: Shipment }
- shipment.ts: StageKey = "purchased" | "to_origin_port" | "departed_origin" | "at_sea" | "arrived_lagos" | "customs" | "ready"; TrackingStage { key, label, location, date?: string, completed: boolean, current?: boolean }; Shipment { trackingNumber, vesselName, originPort, destinationPort: "Tin Can Island" | "Apapa", eta, progress: number, stages: TrackingStage[] }
- user.ts: User { id, fullName, email, phoneNumber, role: "customer" | "admin", isVerified, avatar?, createdAt }
- reservation.ts: Reservation { id, carIds: string[], fullName, email, phone, address, city, inspectionDate, paymentMethod: "bank_transfer" | "pay_on_inspection", deposit, message?, status: "pending" | "confirmed" | "completed", createdAt }

## Data layer
- src/data/mockCars.ts: ~16 realistic cars sold in Nigeria (Toyota Camry, Lexus RX 350, Toyota Highlander, Mercedes GLE, Honda Accord, Lexus GX 460, Toyota Land Cruiser, Range Rover Sport, Kia Sorento, Hyundai Tucson, BMW X5, Ford Edge, etc.). Mix: 7 available, 5 incoming at different shipment stages (origins USA, Canada, UAE, Germany), 4 sold. Reuse the sample cars and the 7 tracking stages from design-reference/home.html. Put high-quality Unsplash car image URLs in ONE constants file so they're easy to replace.
- src/services/carService.ts: the ONLY place pages get data from. Typed async functions with a ~400ms fake delay: getCars(filters), getCarBySlug, getRelatedCars, trackShipment(vinOrTrackingNumber), getStats(), createReservation(). Later these get swapped for real API calls.
- src/lib/api.ts: axios instance with baseURL import.meta.env.VITE_API_URL, falling back to https://royal-shades-autos-backend.onrender.com/api, plus a request interceptor that attaches the Bearer token.
- Contexts persisted to localStorage (always wrapped in try/catch): AuthContext, GarageContext (cart), WishlistContext.

## PHASE 1: Design system and layout
- UI components in src/components/ui: Button (gold / outline / ghost), Input, PasswordInput (show/hide), Textarea, Select, Checkbox, Badge, StatusBadge, Card, Tabs, Accordion, Modal, Skeleton, EmptyState, Breadcrumb, Pagination, PriceRangeSlider, ArcDivider, ArcLoader, SectionHeading (eyebrow + title with accent word).
- Navbar exactly like the home mockup: logo, links (Showroom, Track, How it works, About, Contact), search pill, Garage icon with a gold count badge, account icon. Solid obsidian with a subtle border; animated mobile menu.
- Newsletter band ("Be first to know when *new arrivals* land") overlapping the ivory footer, exactly like the mockup.
- Footer on ivory with columns Showroom / Help / Company / Visit, as in the mockup.
- PageHero component (dark car image, title with accent word, breadcrumb) for inner pages.

## PHASE 2: Public pages
- Home: match design-reference/home.html section by section (hero + live voyage glass card, stats strip, showroom with working tabs, arc divider, Voyage Tracker, how importing works, promise banner, newsletter, footer).
- Showroom (/cars): filter sidebar (body type, condition, make, price range, year, origin) that becomes a slide-in drawer on mobile; status tabs All / Available / Incoming / Sold with counts, synced to ?status=; "Showing 1–9 of N cars"; sort; search; 3-column grid; pagination; skeletons; empty state.
- CarCard as in the mockup: status badge, wishlist heart, name + year, body type · origin in gold, specs row (fuel, transmission, mileage), ETA progress bar for incoming cars, SOLD ribbon + muted image for sold cars, price, CTA ("Add to Garage" for available, "Reserve" for incoming, "Similar" for sold). A car already in the garage shows "In Garage ✓".
- Car details (/cars/:slug): gallery (main + thumbnails + lightbox); title, year, condition, status; "Add to Garage" (gold), "Enquire on WhatsApp" (prefilled with car name + VIN), heart; 2-column spec table; features; mini Voyage Tracker if incoming; "You might also *like*" carousel.
- Track (/track): VIN or tracking number input with 2 demo numbers. The result is the full Voyage Tracker: horizontal route origin → Lagos with an animated ship at the current position, the arc progress ring, vessel, ETA, the vertical 7-stage timeline (done = gold, current = pulsing, upcoming = muted), and a car summary card. Friendly not-found state.
- Garage (/garage): match design-reference/garage.html. One of each car, no quantity; status badge; note (yard location or ETA); remove; summary with car total, free Lagos delivery, customs included, balance on pickup, and "Due today · 10% deposit"; "Continue to reservation"; empty state.
- Reserve (/reserve, login required): contact details + inspection details (date, message) on the left; payment method (Bank transfer with [Account details] placeholder, or Pay on inspection) and a summary of the garage cars + deposit on the right. Submit → clear garage → /thank-you.
- Thank you (/thank-you): dark hero "Thank you for choosing *Royal Shades*", next steps, back to showroom.
- About (vision: "To provide the best customer experience, becoming a preferred partner."; mission: "To give new life to vehicles by providing responsible automotive solutions."), Contact (PageHero, "Get in *Touch*" info card, message form with zod validation), FAQs (accordion about importing, duty/customs, payment, inspection, delivery), and 404.

## PHASE 3: Auth (reuse the old logic, typed and restyled)
- Match design-reference/login.html and signup.html (glass card over a dark car photo; login card on the right, sign up on the left; password show/hide; strength bar; terms checkbox).
- Pages: Login, Sign up (with success and error modals), Forgot password, Verify email (/verify-email/:token) with resend.
- Endpoints (keep): POST /auth/login, /auth/register, /auth/verify-email/:token, /auth/resend-verification-email, /auth/forgot-password.
- zod schemas in src/lib/validators.ts (convert the old yup rules).
- Fix the old bugs: auth state comes ONLY from context; no hooks after an early return; check response.status (not response.data.status); readable input colors.
- ProtectedRoute waits for isLoading; AdminRoute also checks user.role === "admin".
- No social login buttons for now.

## PHASE 4: Customer dashboard (/account)
Left profile card (avatar, name, member since, email and phone verification checks, Edit profile, Logout). Right side: "Hello, *{firstName}*", then tabs My Reservations (status pills), My Tracked Cars (each with a mini Voyage Tracker) and Wishlist (CarCard grid).

## PHASE 5: Admin dashboard (/admin, mock data in memory)
Sidebar (Overview, Cars, Shipments, Reservations, Customers) that collapses on mobile. Overview: stat cards and recent activity. Cars: searchable table, status filter, Add/Edit form, change status, delete with confirm. Shipments: update the current stage, vessel and ETA. Reservations: list and change status. Everything goes through the service layer.

## PHASE 6: Polish
Lazy routes with the ArcLoader, per-page document titles, favicon from the logo, lazy-loaded images, `npm run lint` and `npm run build` clean with zero TypeScript errors, README (what it is, how to run it, folder structure, how to swap mock data for the real API).

Rules: small components (no file over ~250 lines), no `any`, short comments only where logic isn't obvious, and ask me before adding features not listed here.
