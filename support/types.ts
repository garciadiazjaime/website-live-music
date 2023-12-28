export interface Social {
  twitter: string;
  facebook: string;
  youtube: string;
  instagram: string;
  tiktok: string;
  soundcloud: string;
  spotify: string;
  appleMusic: string;
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

interface Location {
  pk: number;
  name: string;
  address: string;
  lat: number;
  lng: number;
  place_id: string;
  website: string;
  meta_tries: number;
  metadata: Metadata | null;
}

interface Artist {
  pk: number;
  name: string;
  metadata: Metadata | null;
}

export interface Event {
  name: string;
  description: string;
  image: string;
  url: string;
  start_date: string;
  end_date: string;
  rank: number;
  location: Location;
  artists: Artist[];
  pk: number;
}
