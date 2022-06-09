import { Component, OnInit } from "@angular/core";
import { lastValueFrom } from "rxjs";
import { Track } from "src/app/models/track.model";
import { SpotifyService } from "src/app/services/spotify.service";
import { AppStore } from "src/app/store/app.store";

@Component({
  selector: "song-list",
  templateUrl: "./track-list.component.html",
  styleUrls: ["./track-list.component.scss"],
})
export class SongListComponent implements OnInit {
  constructor(
    private spotifyService: SpotifyService,
    private appStore: AppStore
  ) {}
  private currentOffset = 0;

  public tracks: Track[] = [];

  ngOnInit(): void {
    this.loadTracks();
    this.loadSummary();
  }

  public async loadSummary() {
    const genres = await lastValueFrom(this.appStore.allGenres$);
    console.log(genres);
  }

  async loadTracks() {
    const tracks = await this.spotifyService.getLikedTracks(this.currentOffset);
    if (tracks.length === 0) return;

    this.tracks = this.tracks.concat(tracks);
    this.loadMore();
  }

  public loadMore() {
    this.currentOffset += SpotifyService.PAGE_SIZE;
    this.loadTracks();
  }
}
