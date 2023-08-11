import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Produto } from 'src/app/interfaces/interface';
import { ProdutoService } from 'src/app/services/produto.service';
import { Util } from 'src/app/util';

@Component({
  selector: 'app-cadastro',
  templateUrl: './cadastro.component.html',
  styleUrls: ['./cadastro.component.css']
})
export class CadastroComponent implements OnInit {

  constructor(
    private util: Util,
    private produtoService: ProdutoService,
    private router: Router
  ) { }

  formsCadastro: FormGroup = new FormGroup({
    nome: new FormControl(null, [Validators.required, Validators.maxLength(35)]),
    descricao: new FormControl(null, [Validators.required, Validators.maxLength(100)]),
    valor: new FormControl(null, [Validators.required]),
    promocao: new FormControl(false, []),
    valorPromocao: new FormControl(null, []),
    off: new FormControl(null, [Validators.maxLength(2)]),
    categoria: new FormControl(null, [Validators.required]),
    estoque: new FormControl(null, [Validators.required]),
  })

  categorias: any[] = this.util.categorias

  ngOnInit(): void {
    this.formsCadastro.get('valorPromocao')?.disable()
    this.formsCadastro.get('off')?.disable()

    this.formsCadastro.get('valor')?.valueChanges.subscribe(() => {
      this.verificarCampos()
    })

    this.formsCadastro.get('off')?.valueChanges.subscribe(() => {
      this.calcPromocao()
    })
  }

  cadastrar() {
    if(this.formsCadastro.valid) {
      let produto: Produto = this.buildObject();
      if (this.formsCadastro.get('promocao')?.value && produto.preco && produto.precoOriginal  && produto.preco > produto.precoOriginal) {
        this.util.snackBar('Valor promocional não pode ser maior que valor original', 3)
        return;
      }
      this.produtoService.insertProduto(produto).subscribe(res => {
        if (res) {
          this.util.snackBar('Produto Cadastrado com sucesso', 1)
          this.router.navigate([`/imagens/${res.id}`])
        }
      })
    }
  }

  buildObject(): Produto {
    return {
      descricao: this.formsCadastro.get('descricao')?.value,
      nome: this.formsCadastro.get('nome')?.value,
      off: parseInt(this.formsCadastro.get('off')?.value),
      preco: parseFloat(this.formsCadastro.get('valorPromocao')?.value),
      precoOriginal: parseFloat(this.formsCadastro.get('valor')?.value),
      categoria: this.formsCadastro.get('categoria')?.value,
      estoque: this.formsCadastro.get('estoque')?.value
    }
  }

  verificarCampos(): void {
    if (this.formsCadastro.get('valor')?.value != null) {
      this.formsCadastro.get('off')?.enable()
    } else {
      this.formsCadastro.get('off')?.disable()
    }
  }

  calcPromocao() :void {
    let off = parseInt(this.formsCadastro.get('off')?.value)
    if (off && off >= 100 && off > 1) {
      this.util.snackBar('O valor de OFF está inválido, selecione entre 1 e 99', 3)
      return;
    }
    if(this.formsCadastro.get('valor')?.value != null && this.formsCadastro.get('off')?.value != null) {
      let preco = this.formsCadastro.get('off')?.value / 100
      let valorFinal: any = this.formsCadastro.get('valor')?.value - (this.formsCadastro.get('valor')?.value * preco)
      this.formsCadastro.controls['valorPromocao'].setValue(valorFinal.toFixed(2))
    }
    
  }

}
