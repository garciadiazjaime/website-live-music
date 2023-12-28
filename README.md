# Chicago Live Music

[livemusic.mintitmedia.com](https://livemusic.mintitmedia.com/)

## Getting Started

First, run the development server:

```bash
npm run dev
```

[http://localhost:3000](http://localhost:3000)

## Scripts

The [BE](https://github.com/garciadiazjaime/django-models) needs to be running.

### Events

```bash
npm run events
```

This script scrapes Chicago Events websites and sends them to the BE.

### GPS

```bash
npm run gps
```

This script asks `google maps` the coordinates of the events locations.

## How to update Events

- Make sure the [BE](https://github.com/garciadiazjaime/django-models) is running.

- Set both `environment variables`.

```bash
# .env

NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=
NEXT_PUBLIC_EVENTS_API=
```

- Get the events.

```bash
npm run events
```

- Get coordinates for new locations.

```bash
npm run gps
```

- Reset [events.json](./public/events.json).

```bash
npm run reset
```

- Open PR.

Once merged, the [site](https://livemusic.mintitmedia.com/) should reflect new events in a matter of minutes.
