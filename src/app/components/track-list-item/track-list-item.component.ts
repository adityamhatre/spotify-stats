import { Component, Input, OnDestroy, OnInit } from "@angular/core";
import { lastValueFrom, Subject, takeUntil } from "rxjs";
import { Track } from "src/app/models/track.model";
import { SpotifyService } from "src/app/services/spotify.service";
import { AppStore } from "src/app/store/app.store";

@Component({
  selector: "track-list-item",
  templateUrl: "./track-list-item.component.html",
  styleUrls: ["./track-list-item.component.scss"],
})
export class SongListItemComponent implements OnInit, OnDestroy {
  @Input() public track: Track = {} as Track;

  private destroyed$ = new Subject();

  constructor(
    private spotifyService: SpotifyService,
    private appStore: AppStore
  ) {}

  ngOnInit(): void {
    this.getGenre();
  }

  ngOnDestroy(): void {
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }

  public open() {
    window.open(this.track.href, "_blank");
  }

  public async getGenre() {
    const genreRequests = this.track.artists.map(async (artist) => {
      return await this.spotifyService.getGenre(artist.id);
    });
    const genres = (await Promise.all(genreRequests)).flat();
    this.appStore.updateGenreMap(genres);
  }
}
