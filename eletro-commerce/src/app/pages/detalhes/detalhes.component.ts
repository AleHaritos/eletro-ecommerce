import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmComponent } from 'src/app/dialog/confirm/confirm.component';
import { Produto } from 'src/app/interfaces/interface';
import { ProdutoService } from 'src/app/services/produto.service';
import { Util } from 'src/app/util';

@Component({
  selector: 'app-detalhes',
  templateUrl: './detalhes.component.html',
  styleUrls: ['./detalhes.component.css']
})
export class DetalhesComponent implements OnInit {

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private produtoService: ProdutoService,
    public dialog: MatDialog,
    private util: Util
  ) { }

  produto!: Produto  
  categorias: any = this.util.categorias
  form: FormGroup = new FormGroup({
    nome: new FormControl(null, [Validators.required, Validators.maxLength(35)]),
    descricao: new FormControl(null, [Validators.required, Validators.maxLength(100)]),
    preco: new FormControl(null, [Validators.required]),
    promocao: new FormControl(false, []),
    precoPromocao: new FormControl(null, []),
    off: new FormControl(null, [Validators.maxLength(2)]),
    categoria: new FormControl(null, [Validators.required]),
    estoque: new FormControl(null, [Validators.required]),
  })

  ngOnInit(): void {
    this.route.params.subscribe((param: any) => {
      this.produtoService.getById(parseInt(param.id)).subscribe(res => {
        this.produto = res
        this.setValues()
        this.form.controls['off'].disable()
        this.form.controls['precoPromocao'].disable()
      })
    })
  }

  changePromocao() {
    if(!this.form.get("promocao")?.value) {
      this.form.patchValue({ precoPromocao: null, off: null })
      this.form.controls['off'].disable()
      this.form.controls['precoPromocao'].disable()
    } else {
      this.form.controls['off'].enable()
      this.form.controls['precoPromocao'].enable()
    }
  }

  autoCompletePromocao() {
    if(this.form.get('preco')?.value != null && this.form.get('off')?.value != null) {
      let preco = this.form.get('off')?.value / 100
      let valorFinal: any = this.form.get('preco')?.value - (this.form.get('preco')?.value * preco)
      this.form.controls['precoPromocao'].setValue(valorFinal.toFixed(2))
    }
  }

  private setValues(): void {
    this.form.setValue({ 
      nome: this.produto.nome, 
      descricao: this.produto.descricao,
      estoque: this.produto.estoque,
      off: this.produto.off,
      precoPromocao: this.produto.precoOriginal,
      preco: this.produto.preco,
      categoria: this.produto.categoria ? this.produto.categoria : "",
      promocao: this.produto.off != null ? true : false
    })
  }

  salvar() {
    const dialog = this.dialog.open(ConfirmComponent, {width:" 400px"});
    dialog.afterClosed().subscribe(res => {
      if(res) {
        if(this.form.valid) {
          let prod: Produto = this.buildProduto()
          if(prod.off != null && prod.precoOriginal && prod.preco && prod.precoOriginal <= prod.preco) {
            this.util.snackBar("Desconto não pode ser maior que o preço do produto", 3)
            return ;
          }
          this.produtoService.insertProduto(prod).subscribe(res => {
            this.util.snackBar("Produto alterado com sucesso", 1)
          })
        } else {
          this.util.snackBar("Atenção, possui campos inválidos", 3)
          return ;
        }
      }
    })
  }

  excluir() {
    const dialog = this.dialog.open(ConfirmComponent, {width:" 400px"});
    dialog.afterClosed().subscribe(res => {
      if (res && this.produto.id) {
        this.produtoService.excluir(this.produto.id).subscribe(() => {
          this.util.snackBar("Produto excluído com sucesso", 1)
          this.router.navigate(["/controle"])
        })
      }
    })
  }


  private buildProduto(): Produto {
    return {
      id: this.produto.id,
      nome: this.form.controls['nome'].value,
      descricao: this.form.controls['descricao'].value,
      preco: this.form.controls['precoPromocao'].value,
      estoque: this.form.controls['estoque'].value,
      off: this.form.controls['off'].value,
      precoOriginal: this.form.controls['preco'].value,
      categoria: this.form.controls['categoria'].value
    }
  }

}
