import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Produto } from 'src/app/interfaces/interface';
import { ProdutoService } from 'src/app/services/produto.service';

@Component({
  selector: 'app-imagens',
  templateUrl: './imagens.component.html',
  styleUrls: ['./imagens.component.css']
})
export class ImagensComponent implements OnInit {

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private produtoService: ProdutoService
  ) { }

  continuar: boolean = false
  produto!: Produto 
  image: any

  ngOnInit(): void {
    this.route.params.subscribe((res: any) => {
      this.produtoService.getById(parseInt(res.id)).subscribe(response => {
        this.produto = response
      })
    })
  }

  imagem1(event: any): void {
    if (this.produto.id) {
      this.image = event.target.files[0]
       this.produtoService.uploadImagem(this.produto.id, this.image)
        .subscribe((res: any) => {
          let imagem: any = ''
             
            setTimeout(() => {
              imagem =  localStorage.getItem('url')
              localStorage.removeItem('url') 
              this.continuar = true
              }, 5000)      
        })
    }
           
  }

  imagem(event: any): void {
    this.image = event.target.files[0]
    if (this.produto.id) {
      this.produtoService.uploadImagem(this.produto.id, this.image)
    }
  }

  salvar(): void {
    if(this.continuar === true) {
      this.router.navigate([`/cadastro`])
    }
  }

}
