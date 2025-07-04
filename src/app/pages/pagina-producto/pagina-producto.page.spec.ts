import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PaginaProductoPage } from './pagina-producto.page';

describe('PaginaProductoPage', () => {
  let component: PaginaProductoPage;
  let fixture: ComponentFixture<PaginaProductoPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(PaginaProductoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
