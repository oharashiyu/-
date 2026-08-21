import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StampRallyComponent } from './stamp-rally.component';

describe('StampRallyComponent', () => {
  let component: StampRallyComponent;
  let fixture: ComponentFixture<StampRallyComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [StampRallyComponent]
    });
    fixture = TestBed.createComponent(StampRallyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
