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

  public tracks: Track[] = [];

  ngOnInit(): void {
    this.loadTracks();
  }

  async loadTracks() {
    const tracks = await this.spotifyService.getLikedTracks();
    this.tracks = this.tracks.concat(tracks);
  }
}
