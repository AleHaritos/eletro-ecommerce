import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, map, of, retry } from 'rxjs';
import { Produto } from '../interfaces/interface';
import { Util } from '../util';
import * as firebaseStorage from 'firebase/storage'

@Injectable({
  providedIn: 'root'
})
export class ProdutoService {

  constructor(
    public http: HttpClient,
    private util: Util
  ) { }

  imagem!: string

  getById(id: number): Observable<Produto> {
    return this.http.get(`${this.util.backUrl()}/produto/${id}`)
      .pipe(
        retry(3),
        map((res: any) => res),
        catchError((e: any) => this.util.errorHandler(e.error))
      )
  }

  getAll(): Observable<Produto[]> {
    return this.http.get(`${this.util.backUrl()}/produto`)
      .pipe(
        retry(3),
        map((res: any) => res),
        catchError((e: any) => this.util.errorHandler(e.error))
      )
  }

  getAllDesconto(): Observable<Produto[]> {
    return this.http.get(`${this.util.backUrl()}/produto/oferta`)
      .pipe(
        retry(3),
        map((res: any) => res),
        catchError((e: any) => this.util.errorHandler(e.error))
      )
  }

  getAllSemDesconto(): Observable<Produto[]> {
    return this.http.get(`${this.util.backUrl()}/produto/semOferta`)
      .pipe(
        retry(3),
        map((res: any) => res),
        catchError((e: any) => this.util.errorHandler(e.error))
      )
  }

  getProdutoCategoria(categoria: string, page: number): Observable<Produto[]> {
    return this.http.get(`${this.util.backUrl()}/produto/categoria/${categoria}`, { params: {page}})
      .pipe(
        retry(2),
        map((res: any) => res),
        catchError(e => this.util.errorHandler(e.error))
      )
  }

  getCount(categoria: string): Observable<number> {
    return this.http.get(`${this.util.backUrl()}/produto/count/${categoria}`)
      .pipe(
        retry(2),
        map((res: any) => res),
        catchError(e => this.util.errorHandler(e.error))
      )
  }

  excluir(id: number): Observable<Produto> {
    return this.http.delete(`${this.util.backUrl()}/produto`, { params: { id }})
      .pipe(
        map(res => res),
        catchError((e: any) => this.util.errorHandler(e.error))
      )
  }

  getAllProdutoImagem(id: number): Observable<Produto[]> {
    return this.http.get(`${this.util.backUrl()}/produto/getAll/${id}`)
    .pipe(
      retry(3),
      map((res: any) => res),
      catchError((e: any) => this.util.errorHandler(e.error))
    )
  }

  insertProduto(produto: Produto): Observable<Produto> {
    return this.http.post(`${this.util.backUrl()}/produto`, produto)
      .pipe(
        retry(3),
        map((res: any) => res),
        catchError((e: any) => this.util.errorHandler(e.error))
      )
  }

  // Imagens

  uploadImagem(id: number, file: any): any {
    const date = Date.now()

    const storage = firebaseStorage.getStorage()
    const ref = firebaseStorage.ref(storage, `imagens/${id}/${date}`)

    firebaseStorage.uploadBytesResumable(ref, file)
      .on('state_changed', 
         (snapshot: any) => {
          
      },
        (error: any) => {

        },

        () => {
          firebaseStorage.getDownloadURL(ref)
              .then((url: any) => {
                const objImagem = {
                  imagem: url,
                  idProduto: id
                }
                this.imagem = url
                localStorage.setItem('url', url)
                this.addImagemProduto(objImagem.idProduto, objImagem.imagem)
                  .subscribe((res:any) => res)
                  this.util.snackBar('Upload realizado com sucesso!', 1)
                  
              })
        })
        
          return of(this.imagem).pipe(
            map((res: string) => res)
          )            
    }

    addImagemProduto(id: number, imagem: string): Observable<Produto> {
      return this.http.put(`${this.util.backUrl()}/imagem/${id}`, imagem )
        .pipe(
          retry(3),
          map((res: any) => res)
        )
    }

    getImagemUnica(id: number): Observable<any> {
      return  this.http.get(`${this.util.backUrl()}/imagem/${id}`)
      .pipe(
        retry(8),
        map((res:any) => res)
      )
    }
}
