# Chicago Live Music

[livemusic.mintitmedia.com](https://livemusic.mintitmedia.com/)

## Getting Started

First, run the development server:

```bash
npm run dev
```

[http://localhost:3000](http://localhost:3000)

## ETLs

The API needs to be running.

### Events

```bash
npm run events
```

This script scrapes Chicago Events websites and sends them to the API.

### GPS

```bash
npm run gps
```

This script asks google maps the coordinates of the saved events locations.
