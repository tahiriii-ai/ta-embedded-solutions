# Tahir Ali, PCB Design Engineer: portfolio

Static site: HTML, one `styles.css`, one `script.js`. No build step, no dependencies.

## Run locally
Open `index.html` in a browser, or run `python3 -m http.server` in this folder.

## Deploy
Upload the whole folder to any static host (Netlify, Vercel, Cloudflare Pages, GitHub Pages, cPanel). Keep the folder structure.

## Structure
- `index.html`: home (hero, capability strip, featured product, reviews, filterable projects, services, process, skills, evidence, about, FAQ, how to order, inquiry form)
- `projects/`: 12 case studies
- `images/`, `fonts/`, `videos/`, `Tahir_Ali_Resume.pdf`

## Still needs your configuration
1. **Contact form (FormSubmit).** The form posts to `formsubmit.co/ajax/tahiraliaiml@gmail.com`. The first real submission makes FormSubmit email an activation link to that address; click it once. Until then the form shows an honest error with email and WhatsApp alternatives. I could not test the live endpoint from my environment (network restricted), only the success and failure paths with a mocked response.
2. **Domain.** Add `<link rel="canonical">` and absolute `og:image` URLs once the production domain is known (social previews work best with absolute URLs).
3. **Optional content you can add:** starting prices or packages, NDA/IP/revisions policy, photos of fabricated boards, further client reviews.
