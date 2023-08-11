import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FreteDialogComponent } from './frete-dialog.component';

describe('FreteDialogComponent', () => {
  let component: FreteDialogComponent;
  let fixture: ComponentFixture<FreteDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FreteDialogComponent]
    });
    fixture = TestBed.createComponent(FreteDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
