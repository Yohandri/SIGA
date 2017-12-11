import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContentColasComponent } from './content-colas.component';

describe('ContentColasComponent', () => {
  let component: ContentColasComponent;
  let fixture: ComponentFixture<ContentColasComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContentColasComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContentColasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
