# Uniform Ribbons (Modern)

Modernized front-end port of an older “ribbon checker / rack builder” style project.

## Features

- Catalog of awards (precedence order)
- Toggle selections + device selection (oak leaf / stars, etc.)
- Rack preview (selected awards laid out in rows)
- Preserves legacy ribbon image paths (/image/<name>.png) for compatibility

## Dev

From ./app:

```bash
npm install
npm run dev
```

# Notes

- Ribbon images live in app/public/image/ (non-hashed names).
- Some legacy assets were originally hash-named; this project standardizes them back to the legacy-friendly names.
