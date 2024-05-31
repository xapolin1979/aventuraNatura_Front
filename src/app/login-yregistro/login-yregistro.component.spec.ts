import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginYregistroComponent } from './login-yregistro.component';

describe('LoginYregistroComponent', () => {
  let component: LoginYregistroComponent;
  let fixture: ComponentFixture<LoginYregistroComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoginYregistroComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(LoginYregistroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
