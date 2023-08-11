import { Component, OnInit, OnDestroy } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { FreteDialogComponent } from 'src/app/dialog/frete-dialog/frete-dialog.component';
import { Carrinho, DadosFrete, Produto } from 'src/app/interfaces/interface';
import { CalculosService } from 'src/app/services/calculos.service';
import { ProdutoService } from 'src/app/services/produto.service';
import { Util } from 'src/app/util';

@Component({
  selector: 'app-compra',
  templateUrl: './compra.component.html',
  styleUrls: ['./compra.component.css']
})
export class CompraComponent implements OnInit, OnDestroy {

  produto!: Produto
  idxImagem: number = 0;
  imagens: any[] = []
  isOff: string = 'semDesconto'
  cep: string = ''

  subs: Subscription[] = []

  constructor(
    private route: ActivatedRoute,
    private produtoService: ProdutoService,
    private calculoService: CalculosService,
    private util: Util,
    private dialog: MatDialog

  ) { }

  ngOnInit(): void {
    this.route.params.subscribe((res: any) => {
      this.subs.push(this.produtoService.getById(res.id)
        .subscribe((prod: Produto) => {
          this.produto = prod;
          this.imagens = this.produto.imagens ? this.produto.imagens : [];
          this.imagens[0].active = 'active'
          if (prod.off && prod.preco) {
            this.isOff = 'desconto'
          }
          
        }))
    })

  }

  // Avanca a foto ao clicar na seta
  avancar() {
    this.imagens[this.idxImagem].active = ''
    if (this.imagens.length == (this.idxImagem + 1)) {
      this.idxImagem = 0
    } else {
      this.idxImagem += 1;
    }
    this.imagens[this.idxImagem].active = 'active'
  }

  // Volta a foto ao clicar na seta
  voltar() {
    this.imagens[this.idxImagem].active = ''
    if (this.idxImagem == 0) {
      this.idxImagem = this.imagens.length - 1
    } else {
      this.idxImagem -= 1;
    }
    this.imagens[this.idxImagem].active = 'active'
  }

  //Muda a imagem ao clicar na foto
  changeImage(i: any): void {
    this.imagens[this.idxImagem].active = '';
    let idx = this.imagens.findIndex(x => x.id == i.id);
    this.idxImagem = idx;
    this.imagens[idx].active = 'active'
  }

  consultarFrete() {
    if (this.cep.length < 8) {
      this.util.snackBar("CEP inválido, caractéres insuficientes", 2)
    } else {
      this.subs.push(this.calculoService.calcularFrete(this.cep)
        .subscribe((res: DadosFrete) => {
            if (res) {
              this.dialog.open(FreteDialogComponent, { data: res })
            } else {
              this.util.snackBar("Erro ao consultar Frete, tente novamente mais tarde", 3)
            }
        }))
    }
  }

  adicionarCarrinho(): void {
    let desc;
    if(this.produto.descricao && this.produto.descricao.length > 26) {
       desc = this.produto.descricao.slice(0, 24) + "..."
     }

    let carrinho: Carrinho = {
      id: this.produto.id,
      nome: this.produto.nome,
      descricao: desc ? desc : this.produto.descricao,
      imagem: this.produto.imagens ? this.produto.imagens[0].url : '',
      preco: this.isOff == "desconto" ? this.produto.preco : this.produto.precoOriginal,
      promocao: this.isOff == "desconto" ? true : false,
      quantidade: 1
    }

    this.calculoService.adicionarCarrinho(carrinho)
  }

  ngOnDestroy(): void {
   this.subs.forEach(x => x.unsubscribe())
  }

}
