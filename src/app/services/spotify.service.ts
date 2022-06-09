import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import * as _ from "lodash";
import { lastValueFrom, map, tap } from "rxjs";
import { PKCEAuth } from "../auth/pkce.service";
import { Track } from "../models/track.model";
import { AppStore } from "../store/app.store";
@Injectable({
  providedIn: "root",
})
export class SpotifyService {
  static readonly CLIENT_ID = "54c5925b30db42f891deae28c5a83734";
  static readonly ACCOUNTS_SERVICE_URL = "https://accounts.spotify.com";
  static readonly API_URL = "https://api.spotify.com/v1";
  static readonly PAGE_SIZE = 20;

  private hasMoreLikedSongs = true;

  constructor(
    private httpClient: HttpClient,
    private pkceService: PKCEAuth,
    private appStore: AppStore
  ) {}

  private async redirectToSpotifyAuthorizeEndpoint() {
    const codeVerifier = this.pkceService.generateRandomString(64);

    const code_challenge = await this.pkceService.generateCodeChallenge(
      codeVerifier
    );

    window.localStorage.setItem("code_verifier", codeVerifier);
    window.location.href = this.pkceService.generateUrlWithSearchParams(
      "https://accounts.spotify.com/authorize",
      {
        response_type: "code",
        client_id: SpotifyService.CLIENT_ID,
        scope: "user-read-private user-read-email user-library-read",
        code_challenge_method: "S256",
        code_challenge,
        redirect_uri: "http://localhost:4200",
      }
    );
  }

  private isAccessTokenExpired(): boolean {
    const expires = localStorage.getItem("expiresAt") ?? "0";
    return Date.now() > parseInt(expires);
  }

  private isLoggedIn(): boolean {
    if (this.isAccessTokenExpired()) return false;
    const accessToken = localStorage.getItem("accessToken");
    return accessToken != null;
  }

  public getAccessToken(): string {
    if (this.isLoggedIn()) {
      return localStorage.getItem("accessToken") as string;
    }
    throw new Error("Not logged in");
  }

  public authorize() {
    if (this.isLoggedIn()) {
      alert("You are already logged in");
      return;
    }

    this.redirectToSpotifyAuthorizeEndpoint();
  }

  public async getLikedTracks(offset: number = 0): Promise<Track[]> {
    if (!this.hasMoreLikedSongs) {
      this.appStore.allGenresLoaded();
      return [];
    }

    const tracks: Track[] = await lastValueFrom(
      this.httpClient
        .get(`${SpotifyService.API_URL}/me/tracks`, {
          params: {
            limit: SpotifyService.PAGE_SIZE,
            offset,
          },
        })
        .pipe(
          tap((data: any) => {
            this.hasMoreLikedSongs = !!data.next;
          }),
          map((data: any) => data.items),
          map((items: any[]) =>
            items.map((item: any) => {
              return {
                id: item.track.id,
                name: item.track.name,
                href: item.track.preview_url,
                art: (_.maxBy(item.track.album.images, "width") as any)["url"],
                artists: item.track.artists,
              };
            })
          )
        )
    );
    return tracks;
  }

  public async getGenre(artistId: string): Promise<string[]> {
    const genres = await lastValueFrom(
      this.httpClient
        .get(`${SpotifyService.API_URL}/artists/${artistId}`)
        .pipe(map((data: any) => data.genres))
    );
    return genres;
  }
}
