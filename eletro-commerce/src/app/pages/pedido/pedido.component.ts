import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Subscriber, Subscription, retry } from 'rxjs';
import { Carrinho, Pedido, Produto } from 'src/app/interfaces/interface';
import { CalculosService } from 'src/app/services/calculos.service';
import { ProdutoService } from 'src/app/services/produto.service';
import { Util } from 'src/app/util';

@Component({
  selector: 'app-pedido',
  templateUrl: './pedido.component.html',
  styleUrls: ['./pedido.component.css']
})
export class PedidoComponent implements OnInit, OnDestroy {

  constructor(
    public calcService: CalculosService,
    public produtoService: ProdutoService,
    public util: Util
  ) { }

  carrinho!: Carrinho[]
  subs: Subscription[] = []
  valorTotal: number = 0
  valorFrete: number = 0

  forms: FormGroup = new FormGroup({
    cep: new FormControl('', [Validators.maxLength(8),Validators.minLength(8), Validators.required ]),
    valorTotal: new FormControl(''),
    logradouro: new FormControl(''),
    localidade: new FormControl(''),
    numero: new FormControl('', [ Validators.required ]),
    prazo: new FormControl(''),
    frete: new FormControl('', [ Validators.required])
  })

  ngOnInit(): void {
    this.carrinho = this.calcService.carrinho

    this.carrinho.map((cart: Carrinho) => {
      if (cart.preco) {
        this.valorTotal += cart.preco * cart.quantidade
      }
    })

    this.forms.get('valorTotal')?.setValue("R$" + this.valorTotal.toFixed(2) + " + Frete") 
  }

  onChangeCep(): void {
    if (this.forms.get('cep')?.valid) {
      this.subs.push(this.calcService.consultarCep(this.forms.get('cep')?.value).subscribe(res => {
        if (res && !res.erro) {
          this.forms.get('logradouro')?.setValue(res.logradouro)
          this.forms.get('localidade')?.setValue(res.localidade)
        
        this.subs.push(this.calcService.calcularFrete(this.forms.get('cep')?.value).subscribe(frete => {
          this.valorFrete = parseFloat(frete.valor.replace(",", "."))
          this.forms.get('frete')?.setValue("R$" + frete.valor)
          this.forms.get('prazo')?.setValue(frete.prazo + " dia(s)")
          this.forms.get('valorTotal')?.setValue("R$" + (this.valorTotal + parseFloat(frete.valor.replace(",", "."))).toFixed(2))
        }))
      }
      }))
    }
  }

  finalizar(): void {
    if (this.forms.valid) {    
      localStorage.setItem("pedido", JSON.stringify(this.buildPedido()))   
      this.produtoService.ajustesEstoque(this.buildProdutoByCarrinho()).subscribe(() => {
        this.calcService.realizarPagamento(parseFloat((this.valorTotal + this.valorFrete).toFixed(2))).subscribe(res => {
          window.location = res.url
        })
      })
      
    } else {
      this.util.snackBar("Os campos não foram preenchidos corretamente", 3)
    }
  }

  buildPedido(): Pedido {
    return {
      cep: this.forms.get('cep')?.value,
      logradouro: this.forms.get('logradouro')?.value,
      numero: this.forms.get('numero')?.value,
      valorTotal: parseFloat((this.valorTotal + this.valorFrete).toFixed(2)),
      produtos: this.buildProdutos()
    }
  }

  buildProdutos(): string {
    let returnValue: string = "";
    this.carrinho.forEach((x, idx) => {
      returnValue += x.id + "-" + x.quantidade
      if ((idx + 1) < this.carrinho.length) {
        returnValue += ";"
      }
    })

    return returnValue;
  }

  buildProdutoByCarrinho(): Produto[] {
    let produtos: Produto[] = []
    this.carrinho.forEach(x => {
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
