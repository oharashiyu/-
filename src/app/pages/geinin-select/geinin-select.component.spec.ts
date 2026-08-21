import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GeininSelectComponent } from './geinin-select.component';

describe('GeininSelectComponent', () => {
  let component: GeininSelectComponent;
  let fixture: ComponentFixture<GeininSelectComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [GeininSelectComponent]
    });
    fixture = TestBed.createComponent(GeininSelectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
