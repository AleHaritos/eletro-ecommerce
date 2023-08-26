import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map, catchError, EMPTY, retry } from 'rxjs';
import { Util } from '../util';
import { Carrinho, Cep, DadosFrete, Pedido, Produto } from '../interfaces/interface';

@Injectable({
  providedIn: 'root'
})
export class CalculosService {

  carrinho: Carrinho[] = []
  pedido!: Pedido

  constructor(
    private http: HttpClient,
    private util: Util
  ) {
    //Resgatar dados em localStorage
    let cart = localStorage.getItem('cart')
    let pedido = localStorage.getItem('pedido')

    if (cart) {
      this.carrinho = JSON.parse(cart)
    }

    if (pedido) {
      this.pedido = JSON.parse(pedido)
    }
  }

  calcularFrete(cep: string): Observable<DadosFrete> {
    return this.http.get<DadosFrete>(`${this.util.backUrl()}/calculo/frete`, { params: { cep } })
      .pipe(
        retry({ count: 10, delay: 1000}),
        map(res => res)
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

  limparPedido(): void {
    this.pedido = null as any
    localStorage.removeItem('pedido')
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

  finalizarPedido(): Observable<any> {
    return this.http.get<any>(`${this.util.backUrl()}/pedido`)
      .pipe(
        map((res: any) => res),
        catchError(e => this.util.errorHandler(e.error))
      );
  }

  realizarPagamento(valorTotal: number): Observable<any> {
    return this.http.post(`${this.util.backUrl()}/pedido/pagamento`, {
      preco: valorTotal,
      descricao: "Eletro E-commerce",
    }).pipe(
      map(res => res),
      catchError(e => this.util.errorHandler(e.error))
    )
  }

  executarPagamento(paymentId: string, payerId: string): Observable<any> {
    return this.http.get(`${this.util.backUrl()}/pedido/execute`, { params: { payerId, paymentId}})
  }

  public getPedido(): any {
    return this.pedido;
  }
}
