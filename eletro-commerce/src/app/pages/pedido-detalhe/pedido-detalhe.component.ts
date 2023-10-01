import { NestedTreeControl } from '@angular/cdk/tree';
import { CurrencyPipe } from '@angular/common';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatTreeNestedDataSource } from '@angular/material/tree';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { Pedido, Produto } from 'src/app/interfaces/interface';
import { PedidoService } from 'src/app/services/pedido.service';
import { ProdutoService } from 'src/app/services/produto.service';
import { Util } from 'src/app/util';

interface ProdutoNode {
  name: string;
  children?: Produto[];
}

@Component({
  selector: 'app-pedido-detalhe',
  templateUrl: './pedido-detalhe.component.html',
  styleUrls: ['./pedido-detalhe.component.css'],
  providers: [ CurrencyPipe ]
})
export class PedidoDetalheComponent implements OnInit, OnDestroy {
  treeControl = new NestedTreeControl<ProdutoNode>(node => node.children as any[]);
  dataSource = new MatTreeNestedDataSource<ProdutoNode>();
  
  constructor(
    private route: ActivatedRoute,
    private pedidoService: PedidoService,
    private produtosService: ProdutoService,
    public currencyPipe: CurrencyPipe,
    public util: Util
  ) { }

  hasChild = (_: number, node: ProdutoNode) => !!node.children && node.children.length > 0;

  subs: Subscription[] = []
  pedido!: Pedido
  produtos: ProdutoNode[] = []
  produtoDTO : { id: number, qtd: number}[] = [];

  forms: FormGroup = new FormGroup({
    cep: new FormControl(null),
    logradouro: new FormControl(null),
    numero: new FormControl(null),
    valorTotal: new FormControl(null)
  })

  ngOnInit(): void {
   this.route.params.subscribe(res => {
    this.subs.push(this.pedidoService.getPedidoById(res['id']).subscribe(pedido => {
      this.pedido = pedido
       let produtosDTO = this.pedido.produtos?.split(";")
 
       produtosDTO?.forEach(x => {
        let id = x.split("-")[0]
        this.produtoDTO.push({ id: parseInt(id), qtd: parseInt(x.split("-")[1]) })
        
        this.subs.push(this.produtosService.getById(parseInt(id)).subscribe(prods => {
          prods.categoria = this.util.categorias.find(c => c.value == prods.categoria).nome
          let obj : ProdutoNode = {
            name: prods.nome as string,
            children: [prods]
          }
          this.produtos.push(obj)
          this.dataSource.data = this.produtos;
          console.log(this.produtoDTO)
        }))
      })

      //Ajuste de dados

      this.forms.get('cep')?.setValue(this.pedido.cep)
      this.forms.get('logradouro')?.setValue(this.pedido.logradouro)
      this.forms.get('numero')?.setValue(this.pedido.numero)
      this.forms.get('valorTotal')?.setValue(this.pedido.valorTotal)

      this.forms.patchValue({
        valorTotal: this.currencyPipe.transform(this.forms.get('valorTotal')?.value, 'BRL')
      })

      this.pedido.data = new Date(Date.parse(this.pedido.data?.toString() as string)).toLocaleDateString()
      console.log(this.pedido)
     
    }))
   })
  }

  checkPedido(pedido: Pedido) {
    this.pedidoService.checkPedido(pedido.id as number, !this.pedido.checked).subscribe(res => {
      this.pedido.checked = res.checked
      res.checked ? this.util.snackBar("Pedido marcado com sucesso!", 1) : this.util.snackBar("Pedido desmarcado com sucesso!", 2)
    })
  }

  findQuantidade(id: number): number {
    let value =  this.produtoDTO.find(x => x.id == id)
    return value ? value.qtd : 0
  }

  ngOnDestroy(): void {
    this.subs.forEach(x => x.unsubscribe())
  }

}
