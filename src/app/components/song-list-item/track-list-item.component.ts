import { Component, Input, OnInit } from "@angular/core";
import { Track } from "src/app/models/track.model";

@Component({
  selector: "track-list-item",
  templateUrl: "./track-list-item.component.html",
  styleUrls: ["./track-list-item.component.scss"],
})
export class SongListItemComponent implements OnInit {
  @Input() public track: Track = {} as Track;
  constructor() {}

  ngOnInit(): void {}
}
