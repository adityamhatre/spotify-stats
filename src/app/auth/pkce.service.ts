import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { lastValueFrom } from "rxjs";
import { SpotifyService } from "../services/spotify.service";
import { AppStore } from "../store/app.store";

@Injectable({
  providedIn: "root",
})
export class PKCEAuth {
  constructor(private httpClient: HttpClient, private appStore: AppStore) {}
  generateRandomString(length: number): string {
    let text = "";
    const possible =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for (let i = 0; i < length; i++) {
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
  }

  async generateCodeChallenge(codeVerifier: string): Promise<string> {
    const digest = await crypto.subtle.digest(
      "SHA-256",
      new TextEncoder().encode(codeVerifier)
    );

    return window
      .btoa(String.fromCharCode(...new Uint8Array(digest)))
      .replace(/=/g, "")
      .replace(/\+/g, "-")
      .replace(/\//g, "_");
  }

  generateUrlWithSearchParams(url: string, params: any): string {
    const urlObject = new URL(url);
    urlObject.search = new URLSearchParams(params).toString();

    return urlObject.toString();
  }

  async exchangeToken(code: string): Promise<any> {
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
}
