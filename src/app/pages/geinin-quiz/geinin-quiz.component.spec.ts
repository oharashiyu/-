import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GeininQuizComponent } from './geinin-quiz.component';

describe('GeininQuizComponent', () => {
  let component: GeininQuizComponent;
  let fixture: ComponentFixture<GeininQuizComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [GeininQuizComponent]
    });
    fixture = TestBed.createComponent(GeininQuizComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
