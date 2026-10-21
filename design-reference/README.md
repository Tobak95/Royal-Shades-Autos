# Design reference — Royal Shades Autos

Approved visual mockups for the rebuild. They are DESIGN REFERENCES, not app code.

- `home.html` — navbar, hero + live voyage card, stats strip, showroom grid with status tabs, Voyage Tracker, how importing works, promise banner, newsletter band, ivory footer
- `login.html` — glass login card over dark car photo
- `signup.html` — glass sign-up card (mirrored layout)
- `garage.html` — "Your Garage" cart with reservation summary and 10% deposit

How to read them:
- Markup is in `<x-dc>`; the `<script type="text/x-dc">` block at the bottom holds sample data and simple state (tabs, remove-from-garage).
- `{{name}}` placeholders, `<sc-for>` (loop) and `<sc-if>` (condition) are the mockup tool's template syntax. Rebuild them as React `.map()` and conditional rendering.
- Inline styles hold the exact colors, sizes, spacing and radii. Convert them to Tailwind classes and theme tokens.
- Car outline SVGs are placeholders for real car photos.
- Image paths point to `src/assets/` (logo.png, carrrrrrrs.avif = hero garage photo, car.avif = street photo).
