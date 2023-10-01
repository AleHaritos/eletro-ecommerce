import { Component, OnInit, OnDestroy, ViewChild, AfterViewInit } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Subscription } from 'rxjs';
import { StatusEnum } from 'src/app/interfaces/enum';
import { Pedido } from 'src/app/interfaces/interface';
import { PedidoService } from 'src/app/services/pedido.service';
import { Util } from 'src/app/util';

@Component({
  selector: 'app-controle-pedidos',
  templateUrl: './controle-pedidos.component.html',
  styleUrls: ['./controle-pedidos.component.css'],
})
export class ControlePedidosComponent implements OnInit, OnDestroy {

  constructor(
    private pedidoService: PedidoService,
    private util: Util
  ) { }

  formGroup = new FormGroup({
    dataInicio: new FormControl(null, [Validators.required]),
    dataFim: new FormControl(null, [Validators.required]),
  })

  private paginator!: MatPaginator;
  private sort!: MatSort;

  subs: Subscription[] = []
  pedidos: Pedido[] = []

  enum =  StatusEnum
  status: StatusEnum = this.enum.EMPTY

  @ViewChild(MatPaginator) set matPaginator(mp: MatPaginator) {
    this.paginator = mp;
    this.dataSource.paginator = this.paginator;
  }

  @ViewChild(MatSort) set matSort(ms: MatSort) {
    this.sort = ms;
    this.dataSource.sort = this.sort;
  }

  dataSource: MatTableDataSource<any> = new MatTableDataSource();;

  displayedColumns: string[] = ['id', 'cep', 'numero', 'data', 'detalhe', 'checked'];

  ngOnInit(): void {

  }


  search(): void {
    if (this.formGroup.valid) {
      this.status = StatusEnum.CARREGANDO
      this.subs.push(this.pedidoService.getPedidos(this.formGroup.get("dataInicio")?.value, this.formGroup.get("dataFim")?.value)
        .subscribe(res => {
          this.dataSource = new MatTableDataSource(res);
          res.forEach(x => {
          let date = new Date(Date.parse(x.data?.toString() as string))
          x.data = date.toLocaleDateString()
          })
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
          this.status = StatusEnum.SUCESSO
        }))
    }
  }

  checkPedido(pedido: Pedido): void {
      this.subs.push(this.pedidoService.checkPedido(pedido.id as number, !pedido.checked).subscribe(res => {
        this.dataSource.data.forEach((y: Pedido) => y.id == pedido.id ? y.checked = res.checked : null)
        if (res.checked) {
          this.util.snackBar("Item Checado com sucesso!", 1)
        } else {
          this.util.snackBar("Item Desmarcado com sucesso!")
        }
      }))
  }

  ngOnDestroy(): void {
    this.subs.forEach(x => x.unsubscribe())
  }



}
