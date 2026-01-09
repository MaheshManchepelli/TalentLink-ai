import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResumeList } from './resume-list';

describe('ResumeList', () => {
  let component: ResumeList;
  let fixture: ComponentFixture<ResumeList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ResumeList]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ResumeList);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
