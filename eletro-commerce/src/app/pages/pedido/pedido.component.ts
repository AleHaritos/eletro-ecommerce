import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Subscriber, Subscription } from 'rxjs';
import { Carrinho } from 'src/app/interfaces/interface';
import { CalculosService } from 'src/app/services/calculos.service';

@Component({
  selector: 'app-pedido',
  templateUrl: './pedido.component.html',
  styleUrls: ['./pedido.component.css']
})
export class PedidoComponent implements OnInit, OnDestroy {

  constructor(
    public calcService: CalculosService,
  ) { }

  carrinho!: Carrinho[]
  subs: Subscription[] = []
  valorTotal: number = 0

  forms: FormGroup = new FormGroup({
    cep: new FormControl('', [Validators.maxLength(8),Validators.minLength(8), Validators.required ]),
    valorTotal: new FormControl(''),
    logradouro: new FormControl(''),
    localidade: new FormControl(''),
    numero: new FormControl('', [ Validators.required ]),
    prazo: new FormControl(''),
    frete: new FormControl('')
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
        this.forms.get('logradouro')?.setValue(res.logradouro)
        this.forms.get('localidade')?.setValue(res.localidade)

        this.subs.push(this.calcService.calcularFrete(this.forms.get('cep')?.value).subscribe(frete => {
          this.forms.get('frete')?.setValue("R$" + frete.valor)
          this.forms.get('prazo')?.setValue(frete.prazo + " dia(s)")
          this.forms.get('valorTotal')?.setValue("R$" + (this.valorTotal + parseFloat(frete.valor)).toFixed(2))
        }))
      }))
    }
  }

  confirmar(): void {

  }

  ngOnDestroy(): void {
    this.subs.forEach(x => x.unsubscribe())
  }

}
