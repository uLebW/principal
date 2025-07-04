import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PaginaPrincipalPage } from './pagina-principal.page';

describe('PaginaPrincipalPage', () => {
  let component: PaginaPrincipalPage;
  let fixture: ComponentFixture<PaginaPrincipalPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(PaginaPrincipalPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
