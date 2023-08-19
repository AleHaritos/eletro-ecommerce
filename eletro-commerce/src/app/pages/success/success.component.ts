import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { StatusEnum } from 'src/app/interfaces/enum';
import { CalculosService } from 'src/app/services/calculos.service';

@Component({
  selector: 'app-success',
  templateUrl: './success.component.html',
  styleUrls: ['./success.component.css']
})
export class SuccessComponent implements OnInit{

  constructor(
    public calcService: CalculosService,
    public route: ActivatedRoute
  ) { }

  
  enumStatus = StatusEnum
  status: StatusEnum = StatusEnum.CARREGANDO
  pagamento: any

  ngOnInit(): void {
   const params = new URL(window.location.href).searchParams
   let paymentId: any = params.get('paymentId')
   let payerId: any = params.get('PayerID')

   this.calcService.executarPagamento(paymentId, payerId).subscribe(res => {
    if (res && res.state) {
     this.pagamento = JSON.parse(res.pagamento)
     this.status = StatusEnum.SUCESSO
     this.calcService.salvarPedido().subscribe(pedido => {
      console.log(pedido)
     })
     console.log(this.pagamento)
    } else {
      this.pagamento = res.pagamento
      this.status = StatusEnum.ERRO
      console.log(this.pagamento)
    }

   })
  }



}
