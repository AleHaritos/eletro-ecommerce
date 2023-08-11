import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Carrinho } from 'src/app/interfaces/interface';
import { CalculosService } from 'src/app/services/calculos.service';
import { Util } from 'src/app/util';

@Component({
  selector: 'app-carrinho',
  templateUrl: './carrinho.component.html',
  styleUrls: ['./carrinho.component.css']
})
export class CarrinhoComponent implements OnInit, OnDestroy {

  carrinho: Carrinho[] = []
  valorTotal: number = 0

  constructor(
    public calcService: CalculosService,
    private router: Router,
    private util: Util
  ) {

  }

  ngOnInit(): void {
    this.carrinho = this.calcService.carrinho

    this.calcTotal()
  }
  ngOnDestroy(): void {

  }

  removerItem(item: any): void {
    this.calcService.removerItem(item)

    this.calcTotal()
  }

  adicionar(item: any): void {
    this.calcService.adicionarCarrinho(item)

    this.calcTotal()
  }

  diminuir(item: any): void {
    this.calcService.reduzirQuantidade(item)

    this.calcTotal()
  }

  formatNome(carrinho: Carrinho): string {
    return `${carrinho.nome} (${carrinho.quantidade})`
  }

  calcTotal() {
    this.valorTotal = 0

    this.carrinho.map((cart: Carrinho) => {
      if (cart.preco) {
        this.valorTotal += cart.preco * cart.quantidade
      }
    })
  }

  finalizar(): void {
    if (this.carrinho.length > 0) {
      this.router.navigate(['/pedido'])
    } else {
      this.util.snackBar('Carrinho Vazio!', 2)
    }
  }

}
