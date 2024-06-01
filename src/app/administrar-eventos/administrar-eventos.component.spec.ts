import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdministrarEventosComponent } from './administrar-eventos.component';

describe('AdministrarEventosComponent', () => {
  let component: AdministrarEventosComponent;
  let fixture: ComponentFixture<AdministrarEventosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdministrarEventosComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AdministrarEventosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
