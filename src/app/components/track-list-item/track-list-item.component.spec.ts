import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SongListItemComponent } from './track-list-item.component';

describe('SongListItemComponent', () => {
  let component: SongListItemComponent;
  let fixture: ComponentFixture<SongListItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SongListItemComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SongListItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
