import { Injectable } from "@angular/core";
import {
  HttpInterceptor,
  HttpEvent,
  HttpResponse,
  HttpRequest,
  HttpHandler,
} from "@angular/common/http";
import { EMPTY, lastValueFrom, Observable, of } from "rxjs";
import { map, filter } from "rxjs/operators";
import { SpotifyService } from "./services/spotify.service";

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private spotifyService: SpotifyService) {}

  private async refreshToken() {
    await this.spotifyService.refreshToken();
  }

  intercept(
    httpRequest: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    if (httpRequest.method === "POST") {
      return next.handle(httpRequest);
    }

    const accessToken = localStorage.getItem("accessToken");
    const expiresAt = localStorage.getItem("expiresAt") ?? "0";

    if ( Date.now() > parseInt(expiresAt)) {
      this.refreshToken().then(() => {
        localStorage.setItem('refreshed', 'true')
      });
      return EMPTY;
    }

    return next.handle(
      httpRequest.clone({
        setHeaders: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
    );
  }
}
