import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { StatusEnum } from 'src/app/interfaces/enum';
import { Produto } from 'src/app/interfaces/interface';
import { CalculosService } from 'src/app/services/calculos.service';
import { PedidoService } from 'src/app/services/pedido.service';
import { ProdutoService } from 'src/app/services/produto.service';

@Component({
  selector: 'app-success',
  templateUrl: './success.component.html',
  styleUrls: ['./success.component.css']
})
export class SuccessComponent implements OnInit, OnDestroy{

  constructor(
    public calcService: CalculosService,
    public route: ActivatedRoute,
    public produtoService: ProdutoService,
    public pedidoService: PedidoService
  ) { }
 
  
  enumStatus = StatusEnum
  status: StatusEnum = StatusEnum.CARREGANDO
  pagamento: any
  subs: Subscription[] = []

  ngOnInit(): void {
   const params = new URL(window.location.href).searchParams
   let paymentId: any = params.get('paymentId')
   let payerId: any = params.get('PayerID')

   this.subs.push(this.calcService.executarPagamento(paymentId, payerId).subscribe(res => {
    if (res && res.state) {
     this.pagamento = JSON.parse(res.pagamento)
     this.status = StatusEnum.SUCESSO

     this.pedidoService.salvarPedido(this.calcService.getPedido()).subscribe(pedido => {
      this.calcService.limparPedido()
      this.calcService.limparCarrinho()
     })
    } else {
      this.subs.push(this.produtoService.rollbackEstoque(this.buildProdutoByCarrinho()).subscribe(() => {}))
      this.pagamento = res.pagamento
      this.status = StatusEnum.ERRO
    }
   }))
  }

  buildProdutoByCarrinho(): Produto[] {
    let carrinho =  this.calcService.carrinho
    let produtos: Produto[] = []
    carrinho.forEach(x => {
      produtos.push({
        id: x.id,
        estoque: x.quantidade
      })
    })
    return produtos;
  }

  ngOnDestroy(): void {
    this.subs.forEach(x => x.unsubscribe())
  }


}
