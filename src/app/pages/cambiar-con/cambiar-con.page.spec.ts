import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CambiarConPage } from './cambiar-con.page';

describe('CambiarConPage', () => {
  let component: CambiarConPage;
  let fixture: ComponentFixture<CambiarConPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(CambiarConPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
