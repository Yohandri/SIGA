import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormTriajeComponent } from './form-triaje.component';

describe('FormTriajeComponent', () => {
  let component: FormTriajeComponent;
  let fixture: ComponentFixture<FormTriajeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormTriajeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormTriajeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
