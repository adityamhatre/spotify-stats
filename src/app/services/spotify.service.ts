import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { lastValueFrom } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class SpotifyService {
  private static readonly CLIENT_ID = "54c5925b30db42f891deae28c5a83734";
  private static readonly BASE_URL = "https://accounts.spotify.com";

  constructor(private httpClient: HttpClient) {}

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

    const params = {
      response_type: "token",
      client_id: SpotifyService.CLIENT_ID,
      redirect_uri: "http://localhost:4200",
    };
    window.location.href = `${
      SpotifyService.BASE_URL
    }/authorize?${new URLSearchParams(params)}`;
  }

  public setAccessToken(accessToken: string) {
    if (!this.isAccessTokenExpired()) return;
    localStorage.setItem("accessToken", accessToken);
    localStorage.setItem("expires", (Date.now() + 3600 * 1000).toString());
  }
}
