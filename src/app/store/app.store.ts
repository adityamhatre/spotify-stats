import { Injectable } from "@angular/core";
import { Store } from "./store";
import { map, pipe } from "rxjs";
class AppState {
  loggedIn: boolean = false;
  accessToken: string = "";
  expiresAt: number = 0;
}
@Injectable({ providedIn: "root" })
export class AppStore extends Store<AppState> {
  readonly isLoggedIn$ = this.state$.pipe(map((state) => state.loggedIn));

  constructor() {
    super(new AppState());
    this.loadState();
  }

  private loadState() {
    const accessToken = localStorage.getItem("accessToken");
    const expiresAt = localStorage.getItem("expiresAt");
    if (accessToken && expiresAt) {
      this.setState({
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
}
