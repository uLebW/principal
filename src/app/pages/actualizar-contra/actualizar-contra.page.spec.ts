import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActualizarContraPage } from './actualizar-contra.page';

describe('ActualizarContraPage', () => {
  let component: ActualizarContraPage;
  let fixture: ComponentFixture<ActualizarContraPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ActualizarContraPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
