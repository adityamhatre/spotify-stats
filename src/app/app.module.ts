import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";

import { AppRoutingModule } from "./components/app-component/app-routing.module";
import { AppComponent } from "./components/app-component/app.component";
import { HttpClientModule } from "@angular/common/http";
import { AuthComponentComponent } from "./components/auth-component/auth-component.component";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { MatButtonModule } from "@angular/material/button";

@NgModule({
  declarations: [AppComponent, AuthComponentComponent],
  imports: [
    HttpClientModule,
    BrowserModule,
    MatButtonModule,
    AppRoutingModule,
    BrowserAnimationsModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
