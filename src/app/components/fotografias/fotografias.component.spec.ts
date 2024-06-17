import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FotografiasComponent } from './fotografias.component';

describe('FotografiasComponent', () => {
  let component: FotografiasComponent;
  let fixture: ComponentFixture<FotografiasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FotografiasComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FotografiasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
