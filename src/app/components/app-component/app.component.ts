import { Component, OnDestroy, OnInit } from "@angular/core";
import { Subject, takeUntil } from "rxjs";
import { AppStore } from "src/app/store/app.store";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"],
})
export class AppComponent implements OnInit, OnDestroy {
  private destroyed$ = new Subject();

  public isLoggedIn = false;
  
  constructor(private appStore: AppStore) {}

  ngOnInit(): void {
    this.appStore.isLoggedIn$
      .pipe(takeUntil(this.destroyed$))
      .subscribe((isLoggedIn) => {
        this.isLoggedIn = isLoggedIn;
      });
  }

  ngOnDestroy(): void {
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }
}
