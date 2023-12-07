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
  wiki_page_id: number | null;
  wiki_title: string | null;
  wiki_description: string | null;
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
  email: string | null;
  title: string | null;
  description: string | null;
  type: string | null;
}

interface Location {
  pk: number;
  name: string;
  address: string;
  city: string;
  state: string;
  gmaps: {
    lat: number;
    lng: number;
    formatted_address: string;
    name: string;
    place_id: string;
  };
  gmaps_tries: number;
  wiki_tries: number;
  metadata: Metadata | null;
}

interface Artist {
  pk: number;
  name: string;
  wiki_tries: number;
  metadata: Metadata | null;
}

export interface Event {
  rank: number;
  description: string;
  image: string;
  url: string;
  start_date: string;
  end_date: string;
  location: Location;
  artist: Artist;
  pk: number;
}
