import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { Produto } from 'src/app/interfaces/interface';
import { CalculosService } from 'src/app/services/calculos.service';
import { ProdutoService } from 'src/app/services/produto.service';

@Component({
  selector: 'app-cancel',
  templateUrl: './cancel.component.html',
  styleUrls: ['./cancel.component.css']
})
export class CancelComponent implements OnInit, OnDestroy {

  constructor(
    private produtoService: ProdutoService,
    private calcService: CalculosService
  ) {}

  subs: Subscription[] = []

  ngOnInit(): void {
    this.subs.push(this.produtoService.rollbackEstoque(this.buildProdutoByCarrinho()).subscribe(() => {}))
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
