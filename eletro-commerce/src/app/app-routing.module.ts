import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { AuthComponent } from './pages/auth/auth.component';
import { CadastroComponent } from './pages/cadastro/cadastro.component';
import { AuthService } from './services/auth.service';
import { ImagensComponent } from './pages/imagens/imagens.component';
import { ControleComponent } from './pages/controle/controle.component';
import { DetalhesComponent } from './pages/detalhes/detalhes.component';
import { CompraComponent } from './pages/compra/compra.component';
import { CarrinhoComponent } from './pages/carrinho/carrinho.component';
import { CategoriaComponent } from './pages/categoria/categoria.component';
import { PedidoComponent } from './pages/pedido/pedido.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'auth/:type', component: AuthComponent },
  { path: 'cadastro', component: CadastroComponent, canActivate: [AuthService] },
  { path: 'imagens/:id', component: ImagensComponent, canActivate: [AuthService] },
  { path: 'controle', component: ControleComponent, canActivate: [AuthService] },
  { path: 'detalhes/:id', component: DetalhesComponent, canActivate: [AuthService] },
  { path: 'item/:id', component: CompraComponent },
  { path: 'carrinho', component: CarrinhoComponent },
  { path: 'categoria/:link', component: CategoriaComponent },
  { path: 'pedido', component: PedidoComponent },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
