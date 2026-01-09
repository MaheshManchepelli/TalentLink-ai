import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewJobDialogComponent } from './new-job-dialog-component';

describe('NewJobDialogComponent', () => {
  let component: NewJobDialogComponent;
  let fixture: ComponentFixture<NewJobDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NewJobDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NewJobDialogComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
