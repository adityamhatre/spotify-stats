import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { PKCEAuth } from "src/app/auth/pkce.service";
import { SpotifyService } from "src/app/services/spotify.service";
import { AppStore } from "src/app/store/app.store";

@Component({
  selector: "app-auth-component",
  templateUrl: "./auth-component.component.html",
  styleUrls: ["./auth-component.component.scss"],
})
export class AuthComponentComponent implements OnInit {
  constructor(
    private spotifyService: SpotifyService,
    private appStore: AppStore,
    private pkceService: PKCEAuth,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      const code = params["code"];
      if (!code) return;

      this.exchangeToken(code);
    });
  }

  private async exchangeToken(code: string) {
    await this.pkceService.exchangeToken(code);
    this.router.navigate(["/"]);
  }
  
  public login() {
    this.spotifyService.authorize();
  }
}
