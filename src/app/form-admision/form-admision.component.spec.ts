import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormAdmisionComponent } from './form-admision.component';

describe('FormAdmisionComponent', () => {
  let component: FormAdmisionComponent;
  let fixture: ComponentFixture<FormAdmisionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormAdmisionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormAdmisionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
