import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { SpotifyService } from "src/app/services/spotify.service";

@Component({
  selector: "app-auth-component",
  templateUrl: "./auth-component.component.html",
  styleUrls: ["./auth-component.component.scss"],
})
export class AuthComponentComponent implements OnInit {
  constructor(
    private spotifyService: SpotifyService,
    private route: ActivatedRoute,
  ) {}

 
  ngOnInit(): void {
    this.route.fragment.subscribe((fragment: any) => {
      const urlSearchParams = new URLSearchParams(fragment);
      const accessToken = urlSearchParams.get("access_token");
      const expires = urlSearchParams.get("expires_in");

      if(accessToken && expires) {
        this.spotifyService.setAccessToken(accessToken);
      }
    });
  }

  public login() {
    this.spotifyService.authorize();
  }
}
