import { Component, OnInit, OnDestroy } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { Produto } from 'src/app/interfaces/interface';
import { ProdutoService } from 'src/app/services/produto.service';
import { Util } from 'src/app/util';

@Component({
  selector: 'app-categoria',
  templateUrl: './categoria.component.html',
  styleUrls: ['./categoria.component.css']
})
export class CategoriaComponent implements OnInit, OnDestroy {

  constructor(
    public util: Util,
    private route: ActivatedRoute,
    private produtoService: ProdutoService,
  ) { }

  categoriaSelected: any
  subs: Subscription[] = []
  produtos: Produto[] = []
  page: number = 0
  pageLength!: number;

  ngOnInit(): void {
    this.route.params.subscribe(param => {
      this.categoriaSelected = this.util.categorias.find(x => x.link == param['link']);
      this.subs.push(this.produtoService.getCount(this.categoriaSelected.value).subscribe(count => {
        this.pageLength = count;
        this.subs.push(this.produtoService.getProdutoCategoria(this.categoriaSelected.value, 0).subscribe(res => {
          this.produtos = res
          this.produtos.map(x => x.isExpand = false)
        }))
      }))
    })
  }

  expandCard(produto: Produto): void {
    let obj = this.produtos.find(x => x.id == produto.id)
    obj != undefined ? obj.isExpand = true : null
  }

  resetExpand(produto: Produto): void {
    let obj = this.produtos.find(x => x.id == produto.id)
    obj != undefined ? obj.isExpand = false : null
  }

  handlePageEvent(e: PageEvent) {
    this.page = e.pageIndex;
    this.subs.push(this.produtoService.getProdutoCategoria(this.categoriaSelected.value, this.page).subscribe(res => {
      this.produtos = res
      this.produtos.map(x => x.isExpand = false)
    }))
  }


  ngOnDestroy(): void {
    this.subs.forEach(x => x.unsubscribe())
  }

}
