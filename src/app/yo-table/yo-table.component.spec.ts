import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { YoTableComponent } from './yo-table.component';

describe('YoTableComponent', () => {
  let component: YoTableComponent;
  let fixture: ComponentFixture<YoTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ YoTableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(YoTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
