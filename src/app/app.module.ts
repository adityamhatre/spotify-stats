import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";

import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./components/app-component/app.component";
import { HttpClientModule, HTTP_INTERCEPTORS } from "@angular/common/http";
import { AuthComponentComponent } from "./components/auth-component/auth-component.component";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { MatButtonModule } from "@angular/material/button";
import { SongListComponent } from "./components/track-list/track-list.component";
import { SongListItemComponent } from "./components/track-list-item/track-list-item.component";
import { AuthInterceptor } from "./auth/auth.interceptor";
import { MatCardModule } from "@angular/material/card";

@NgModule({
  declarations: [
    AppComponent,
    AuthComponentComponent,
    SongListComponent,
    SongListItemComponent,
  ],
  imports: [
    HttpClientModule,
    BrowserModule,
    MatButtonModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatCardModule,
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
