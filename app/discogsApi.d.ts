export interface Artist {
  name: string;
  id?: number;
}

interface Stats {
  community: {
    in_collection: number;
    in_wantlist: number;
  };
}

interface Release {
  stats?: Stats;
  thumb?: string;
  title?: string;
  main_release?: number;
  artist: string;
  role?: string;
  year?: number;
  resource_url?: string;
  type?: "master";
  id?: number;
}

export interface Releases {
  releases: Release[];
}

export interface MasterRelease {
  identifiers: Identifier[];
  series: unknown[];
  labels: Company[];
  community: ReleaseCommunity;
  year: number;
  images?: Image[];
  format_quantity: number;
  id: number;
  artists_sort: string;
  genres: string[];
  thumb: string;
  num_for_sale: number;
  title: string;
  artists: EntityArtist[];
  date_changed: string | null;
  lowest_price: number | null;
  status: string;
  released_formatted?: string;
  released?: string;
  date_added: string | null;
  extraartists: EntityArtist[];
  country?: string;
  notes?: string;
  tracklist: ReleaseTrack[];
  companies: Company[];
  uri: string;
  formats: Format[];
  resource_url: string;
  data_quality: string;
  estimated_weight?: number;
  styles?: string[];
  videos?: Video[];
  master_id?: number;
  master_url?: string;
}

interface Video {
  duration: number;
  description: string;
  embed: boolean;
  uri: string;
  title: string;
}

interface EntityArtist {
  join: string;
  name: string;
  anv: string;
  tracks: string;
  role: string;
  resource_url: string;
  id: number;
}

interface ReleaseCommunity {
  status: string;
  rating: Rating;
  want: number;
  contributors: Contributor[];
  have: number;
  submitter: Contributor | null;
  data_quality: string;
}

interface Contributor {
  username: string;
  resource_url: string;
}

interface Rating {
  count: number;
  average: number;
}

interface Company {
  name: string;
  entity_type: string;
  catno: string;
  resource_url: string;
  id: number;
  entity_type_name: string;
}

interface Format {
  qty: string;
  descriptions?: string[];
  name: string;
  text?: string;
}

interface Identifier {
  type: string;
  value: string;
  description?: string;
}

interface ReleaseTrack {
  duration: string;
  position: string;
  type_: string;
  artists?: EntityArtist[];
  title: string;
  extraartists?: EntityArtist[];
}

interface Image {
  uri: string;
  height: number;
  width: number;
  resource_url: string;
  type: "primary" | "secondary";
  uri150: string;
}

interface Format {
  qty: string;
  descriptions?: string[];
  name: string;
  text?: string;
}
