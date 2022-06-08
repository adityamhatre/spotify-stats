import { Component, OnInit } from "@angular/core";
import { Track } from "src/app/models/track.model";
import { SpotifyService } from "src/app/services/spotify.service";

@Component({
  selector: "song-list",
  templateUrl: "./track-list.component.html",
  styleUrls: ["./track-list.component.scss"],
})
export class SongListComponent implements OnInit {
  constructor(private spotifyService: SpotifyService) {}
  private currentOffset = 0;

  public tracks: Track[] = [];

  ngOnInit(): void {
    this.loadTracks();
  }

  async loadTracks() {
    const tracks = await this.spotifyService.getLikedTracks(this.currentOffset);
    this.tracks = this.tracks.concat(tracks);
  }

  public loadMore() {
    this.currentOffset += SpotifyService.PAGE_SIZE;
    this.loadTracks();
  }
}
