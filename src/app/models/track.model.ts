import { Artist } from "./artist.model";

export interface Track {
  id: string;
  name: string;
  href: string;
  art: string;
  artists: Artist[];
}
