import { Injectable } from "@angular/core";
import {
  HttpInterceptor,
  HttpEvent,
  HttpResponse,
  HttpRequest,
  HttpHandler,
} from "@angular/common/http";
import {
  concat,
  defer,
  EMPTY,
  from,
  lastValueFrom,
  Observable,
  of,
} from "rxjs";
import { map, filter, mergeMap } from "rxjs/operators";
import { SpotifyService } from "../services/spotify.service";
import { PKCEAuth } from "./pkce.service";

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private pkceService: PKCEAuth) {}

  private refreshToken({
    next,
    httpRequest,
  }: {
    next: HttpHandler;
    httpRequest: HttpRequest<any>;
  }): Observable<HttpEvent<any>> {
    return from(this.pkceService.refreshToken()).pipe(
      mergeMap((r) => {
        return this.handle(httpRequest, next);
      })
    );
  }

  private handle(
    httpRequest: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const accessToken = localStorage.getItem("accessToken");

    return next.handle(
      httpRequest.clone({
        setHeaders: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
    );
  }

  intercept(
    httpRequest: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    if (httpRequest.method === "POST") {
      return next.handle(httpRequest);
    }

    const expiresAt = localStorage.getItem("expiresAt") ?? "0";

    if (Date.now() > parseInt(expiresAt)) {
      return this.refreshToken({ next, httpRequest });
    }

    return this.handle(httpRequest, next);
  }
}
