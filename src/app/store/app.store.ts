import { Injectable } from "@angular/core";
import { map, Subject } from "rxjs";
import { Store } from "./store";
class AppState {
  loggedIn: boolean = false;
  accessToken: string = "";
  expiresAt: number = 0;
  genres: {
    pop: number;
    rock: number;
    rap: number;
    country: number;
    other: number;
  } = {
    pop: 0,
    rock: 0,
    rap: 0,
    country: 0,
    other: 0,
  };
}
@Injectable({ providedIn: "root" })
export class AppStore extends Store<AppState> {
  readonly isLoggedIn$ = this.state$.pipe(map((state) => state.loggedIn));
  readonly allGenres$ = new Subject();

  constructor() {
    super(new AppState());
    this.loadState();
  }

  private loadState() {
    const accessToken = localStorage.getItem("accessToken");
    const expiresAt = localStorage.getItem("expiresAt");
    if (accessToken && expiresAt) {
      this.setState({
        ...this.getCurrentState(),
        loggedIn: true,
        accessToken,
        expiresAt: parseInt(expiresAt),
      });
    }
  }

  public setAccessTokenAndExpires(
    accessToken: string,
    refreshToken: string,
    expiresAt: string
  ) {
    localStorage.setItem("accessToken", accessToken);
    localStorage.setItem("refreshToken", refreshToken);
    localStorage.setItem("expiresAt", expiresAt);
    localStorage.removeItem("code_verifier");

    this.setState({
      ...this.getCurrentState(),
      loggedIn: true,
      expiresAt: parseInt(expiresAt) ?? 0,
      accessToken,
    });
  }

  public getAccessToken(): string {
    return localStorage.getItem("accessToken") as string;
  }

  public updateGenreMap(genres: string[]) {
    const genreMap = this.getCurrentState().genres;

    genres.forEach((genre) => {
      if (genre.includes("pop")) {
        genreMap.pop++;
      } else if (genre.includes("rock")) {
        genreMap.rock++;
      } else if (genre.includes("rap")) {
        genreMap.rap++;
      } else if (genre.includes("country")) {
        genreMap.country++;
      } else genreMap.other++;
    });

    this.setState({
      ...this.getCurrentState(),
      genres: genreMap,
    });
  }

  public allGenresLoaded() {
    console.log("all genres loaded");
    this.allGenres$.next(this.getCurrentState().genres);
    this.allGenres$.complete();
  }
}
