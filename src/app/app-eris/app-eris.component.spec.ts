import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AppErisComponent } from './app-eris.component';

describe('AppErisComponent', () => {
  let component: AppErisComponent;
  let fixture: ComponentFixture<AppErisComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AppErisComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AppErisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
