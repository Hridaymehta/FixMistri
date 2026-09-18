# FixMistri — Doorstep Repair Website

A static, interactive marketing site for a fictional multi-service doorstep
repair business, localized for the Indian market (INR pricing, WhatsApp
booking, pincode serviceability check).

This is a **demonstration project** — not a real business, and not a copy of
any commercial template.

## Structure

```
.
├── index.html        # Page markup
├── css/
│   └── style.css      # All styling (light + dark theme via CSS variables)
├── js/
│   └── script.js       # All interactivity (see below)
└── README.md
```

## Features / interactivity

- Live price calculator (category + issue → estimated ₹ range)
- Pincode serviceability checker (sample prefixes for 10 major cities)
- Filterable service grid (tabs: All / Appliances / Electronics / Home & Furniture / Electrical)
- Testimonial carousel (prev/next + dot navigation)
- FAQ accordion
- Animated stat counters (count up on scroll into view, respects `prefers-reduced-motion`)
- Booking form with an in-page confirmation, plus a "Send on WhatsApp" button
  that opens a prefilled WhatsApp chat (`wa.me` link) built from the form's contents
- Floating WhatsApp button
- Responsive layout; light/dark mode via `prefers-color-scheme` and `[data-theme]`

## Running locally

No build step needed — it's plain HTML/CSS/JS.

```bash
# Option 1: just open the file
open index.html

# Option 2: serve it (recommended, avoids any file:// quirks)
python3 -m http.server 8000
# then visit http://localhost:8000
```

## Deploying

Upload the three files/folders (`index.html`, `css/`, `js/`) to any static host
(Netlify, Vercel, GitHub Pages, S3, or a plain Apache/Nginx server). No server-side
code is required — the file works as `index.html` as-is; rename to `index.php`
if your host expects a PHP entry point, no code changes needed.

## Known limitation

The booking form does not submit anywhere — there's no backend attached to this
project. It shows a client-side confirmation only. The **"Send on WhatsApp"**
button is the one path in this demo that actually sends a real message, since
it opens WhatsApp with a prefilled text. Wire the form to a real endpoint
(email service, CRM, serverless function) before using this in production.

## Customizing

- **Prices / categories**: edit the `REPAIR_DATA` object at the top of `js/script.js`.
- **Serviceable areas**: edit the `SERVICEABLE_PREFIXES` array in `js/script.js`.
- **WhatsApp number**: replace `919812345678` in both `index.html` and `js/script.js`.
- **Colors / fonts**: edit the CSS custom properties (`:root`) at the top of `css/style.css`.

## License

Demonstration content — replace business name, copy, and images before any real-world use.
