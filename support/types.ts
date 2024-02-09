export interface Genre {
  name: string;
}

export interface Spotify {
  pk: number;
  followers: number;
  genres: Genre[];
  popularity: number;
  url: string;
}

export interface SocialMedia {
  twitter: string;
  facebook: string;
  youtube: string;
  instagram: string;
  tiktok: string;
  soundcloud: string;
  spotify: string;
  appleMusic: string;
}

export interface Social {
  website: string;
  image: string;
  twitter: string;
  facebook: string;
  youtube: string;
  instagram: string;
  tiktok: string;
  soundcloud: string;
  spotify: string;
  appleMusic: string;
  slug: string;
  type: string;
}

interface Metadata {
  slug: string;
  type: string | null;
  website: string | null;
  image: string | null;
  twitter: string | null;
  facebook: string | null;
  youtube: string | null;
  instagram: string | null;
  tiktok: string | null;
  soundcloud: string | null;
  spotify: string | null;
  appleMusic: string | null;
}

interface SlugVenue {
  name: string;
}

interface Location {
  name: string;
  address: string;
  lat: number;
  lng: number;
  place_id: string;
  slug: string;
  slug_venue: SlugVenue[];
  pk: number;
  website: string;
  metadata: Metadata | null;
  url: string;
}

export interface Artist {
  pk: number;
  name: string;
  metadata: Metadata | null;
  spotify: Spotify | null;
}

export interface Event {
  rank: number;
  name: string;
  description: string;
  image: string;
  url: string;
  start_date: string;
  end_date: string | null;
  provider: string;
  venue: string;
  address: string;
  city: string;
  slug: string;
  location: Location;
  artists: Artist[];
  pk: number;
}
