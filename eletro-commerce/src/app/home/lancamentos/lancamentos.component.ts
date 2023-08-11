import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Produto } from 'src/app/interfaces/interface';
import { ProdutoService } from 'src/app/services/produto.service';

@Component({
  selector: 'app-lancamentos',
  templateUrl: './lancamentos.component.html',
  styleUrls: ['./lancamentos.component.css']
})
export class LancamentosComponent implements OnInit, OnDestroy {

  constructor(
    private produtoService: ProdutoService
  ) { }

  private subs: Subscription[] = []
  public produtos!: Produto[]
  frontArrow: boolean = false
  backArrow: boolean = false
  numberControl: number = 5
  showEver: boolean = false
  fim: number = this.numberControl
  inicio: number = 0

  ngOnInit(): void {
    this.subs.push(this.produtoService.getAllSemDesconto().subscribe(res => {
      this.produtos = res
      this.produtos.map(x => x.isExpand = false)
    }))
  }

  expandCard(produto: Produto): void {
    let obj = this.produtos.find(x => x.id == produto.id)
    obj != undefined ? obj.isExpand = true : null
  }

  resetExpand(produto: Produto): void {
    let obj = this.produtos.find(x => x.id == produto.id)
    obj != undefined ? obj.isExpand = false : null
  }

  // Arrows function

  showArrows(show: boolean) {
    if (this.showEver == false) {
      this.frontArrow = show && this.fim <= this.produtos.length
      this.backArrow = show && this.inicio > 0
    } else {
      this.frontArrow = this.fim < this.produtos.length
      this.backArrow = this.inicio > 0
    }
  }

  arrowClick(value: boolean) {
    if (value) {
      this.inicio += this.numberControl
      this.fim += this.numberControl
      this.fim - this.produtos.length >= 0 ? this.frontArrow = false : null;
      this.backArrow = this.inicio > 0
    } else {
      this.inicio -= this.numberControl
      this.fim -= this.numberControl
      this.inicio <= 0  ? this.backArrow = false : null;
    }
  }


  monitorarTela(): void {
    this.logicaMonitoracao()
    const body = document.querySelector("body")
  
    const observer = new ResizeObserver(entries => {
      this.logicaMonitoracao()
    })
    
  if(body) {
    observer.observe(body)
  }
  }

  logicaMonitoracao(): void {
    if (window.matchMedia("(min-width: 0px) and ( max-width: 749px )").matches) {
      if (this.numberControl != 2) {
        this.numberControl = 2
        this.fim = 2
        this.inicio = 0
        this.showEver = true
        this.showArrows(true)
      }
    }
  
    if (window.matchMedia("(min-width: 750px) and (max-width: 1099px)").matches) {
      if (this.numberControl != 3) {
        this.numberControl = 3
        this.fim = 3
        this.inicio = 0
        this.showEver = true
        this.showArrows(true)
      }
      
    }
  
    if (window.matchMedia("(min-width: 1100px)").matches) {
      if (this.numberControl != 5) {
        this.numberControl = 5
        this.fim = 5
        this.inicio = 0
        this.showEver = false
        this.showArrows(true)
      }
    }
  }


  ngOnDestroy(): void {
    this.subs.forEach(x => x.unsubscribe())
  }

}
