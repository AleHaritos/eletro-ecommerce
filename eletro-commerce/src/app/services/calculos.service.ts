import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map, catchError, EMPTY } from 'rxjs';
import { Util } from '../util';
import { Carrinho, Cep, DadosFrete, Produto } from '../interfaces/interface';

@Injectable({
  providedIn: 'root'
})
export class CalculosService {

  carrinho: Carrinho[] = []

  constructor(
    private http: HttpClient,
    private util: Util
  ) {
    let cart = localStorage.getItem('cart')

    if (cart) {
      this.carrinho = JSON.parse(cart)
    }
  }

  calcularFrete(cep: string): Observable<DadosFrete> {
    return this.http.get<DadosFrete>(`${this.util.backUrl()}/calculo/frete`, { params: { cep } })
      .pipe(
        map(res => res),
        catchError(e => {
          if (e.status) {
            this.util.snackBar("CEP inválido, por favor conferir", 3)
            return EMPTY
          } else {
            return this.util.errorHandler(e);
          }
        })
      )
  }

  consultarCep(cep: string): Observable<Cep> {
    return this.http.get<Cep>(`${this.util.backUrl()}/calculo/cep`, { params: { cep }})
      .pipe(
        map(res => res),
        catchError(e => {
          if (e.status) {
            this.util.snackBar("CEP inválido, por favor conferir", 3)
            return EMPTY
          } else {
            return this.util.errorHandler(e);
          }
        })
      )
  }

  limparCarrinho(): void {
    this.carrinho = []
    localStorage.removeItem('cart')
  }

  adicionarCarrinho(produto: Carrinho): void {
    let found: any

    this.carrinho.forEach((item: any) => {

      if (produto.id === item.id) {
        found = item
      }
    })

    if (found) {
      found.quantidade += 1

      let jsonCart = JSON.stringify(this.carrinho)
      localStorage.setItem('cart', jsonCart)

      this.util.snackBar("Produto adicionado com sucesso!", 1)
    }
    else {
      produto.quantidade = 1
      this.carrinho.push(produto)

      let jsonCart = JSON.stringify(this.carrinho)
      localStorage.setItem('cart', jsonCart)

      this.util.snackBar("Produto adicionado com sucesso!", 1)
    }

  }

  reduzirQuantidade(produto: Carrinho): void {
    const found = this.carrinho.find(cart => cart.id === produto.id)

    if (found) {
      found.quantidade = found.quantidade - 1
      let jsonCart = JSON.stringify(this.carrinho)
      localStorage.setItem('cart', jsonCart)

      if (found.quantidade === 0) {

        const index = this.carrinho.findIndex(cart => found.id === cart.id)

        this.carrinho.splice(index, 1)

        let jsonCart = JSON.stringify(this.carrinho)
        localStorage.setItem('cart', jsonCart)
      }
    }
  }

  removerItem(produto: any): void {
    const foundIndex = this.carrinho.findIndex(cart => produto.id === cart.id)

    this.carrinho.splice(foundIndex, 1)

    let jsonCart = JSON.stringify(this.carrinho)
    localStorage.setItem('cart', jsonCart)
  }


}
