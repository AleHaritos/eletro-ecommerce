import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Util } from '../util';
import { Observable, catchError, map } from 'rxjs';
import { Pedido } from '../interfaces/interface';

@Injectable({
  providedIn: 'root'
})
export class PedidoService {

  constructor(
    public http: HttpClient,
    public util: Util
  ) { }

  salvarPedido(pedido: any): Observable<any> {
    return this.http.post(`${this.util.backUrl()}/pedido/salvar`, pedido )
      .pipe(
        map(res => res),
        catchError(e => this.util.errorHandler(e.error))
      )
  }

  getPedidos(dtInicio: any, dtFim: any): Observable<Pedido[]>  {
    return this.http.get<Pedido[]>(`${this.util.backUrl()}/pedido`, { params: { dtInicio, dtFim }})
      .pipe(
        map(res => res),
        catchError(e => this.util.errorHandler(e.error))
      )
  }
}
