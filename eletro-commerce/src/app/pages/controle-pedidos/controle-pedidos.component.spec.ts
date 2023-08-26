import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ControlePedidosComponent } from './controle-pedidos.component';

describe('ControlePedidosComponent', () => {
  let component: ControlePedidosComponent;
  let fixture: ComponentFixture<ControlePedidosComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ControlePedidosComponent]
    });
    fixture = TestBed.createComponent(ControlePedidosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
