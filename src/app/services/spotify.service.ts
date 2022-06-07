import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { last, lastValueFrom, map, Observable } from "rxjs";
import { Track } from "../models/track.model";
import { AppStore } from "../store/app.store";

@Injectable({
  providedIn: "root",
})
export class SpotifyService {
  private static readonly CLIENT_ID = "54c5925b30db42f891deae28c5a83734";
  private static readonly ACCOUNTS_SERVICE_URL = "https://accounts.spotify.com";
  private static readonly API_URL = "https://api.spotify.com/v1";
  constructor(private httpClient: HttpClient, private appStore: AppStore) {}

  private generateRandomString(length: number): string {
    let text = "";
    const possible =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for (let i = 0; i < length; i++) {
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
  }

  private async generateCodeChallenge(codeVerifier: string): Promise<string> {
    const digest = await crypto.subtle.digest(
      "SHA-256",
      new TextEncoder().encode(codeVerifier)
    );

    return btoa(String.fromCharCode(...new Uint8Array(digest)))
      .replace(/=/g, "")
      .replace(/\+/g, "-")
      .replace(/\//g, "_");
  }

  private generateUrlWithSearchParams(url: string, params: any): string {
    const urlObject = new URL(url);
    urlObject.search = new URLSearchParams(params).toString();

    return urlObject.toString();
  }

  private redirectToSpotifyAuthorizeEndpoint() {
    const codeVerifier = this.generateRandomString(64);

    this.generateCodeChallenge(codeVerifier).then((code_challenge) => {
      window.localStorage.setItem("code_verifier", codeVerifier);

      window.location.href = this.generateUrlWithSearchParams(
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
    });
  }

  public async exchangeToken(code: string): Promise<any> {
    const code_verifier = localStorage.getItem("code_verifier") as string;

    const response = await lastValueFrom(
      this.httpClient.post(
        "https://accounts.spotify.com/api/token",
        new URLSearchParams({
          client_id: SpotifyService.CLIENT_ID,
          grant_type: "authorization_code",
          redirect_uri: "http://localhost:4200",
          code,
          code_verifier,
        }),
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
          },
        }
      )
    );
    this.processTokenResponse(response);
  }

  public async refreshToken() {
    const response = await lastValueFrom(
      this.httpClient.post(
        "https://accounts.spotify.com/api/token",
        new URLSearchParams({
          client_id: SpotifyService.CLIENT_ID,
          grant_type: "refresh_token",
          refresh_token: localStorage.getItem("refreshToken") as string,
        }),
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
          },
        }
      )
    );
    this.processTokenResponse(response);
  }

  private processTokenResponse(data: any) {
    const access_token = data.access_token;
    const refresh_token = data.refresh_token;

    const t = new Date();
    const expires_at = t.setSeconds(t.getSeconds() + data.expires_in);

    this.appStore.setAccessTokenAndExpires(
      access_token,
      refresh_token,
      expires_at.toString()
    );
  }

  private isAccessTokenExpired(): boolean {
    const expires = localStorage.getItem("expires") ?? "0";
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
    const tracks: Track[] = await lastValueFrom(
      this.httpClient
        .get(`${SpotifyService.API_URL}/me/tracks`, {
          params: {
            offset,
          },
        })
        .pipe(
          map((data: any) => data.items),
          map((items: any[]) =>
            items.map((item: any) => {
              return {
                id: item.track.id,
                name: item.track.name,
                href: item.track.preview_url,
              };
            })
          )
        )
    );
    return tracks;
  }
}
