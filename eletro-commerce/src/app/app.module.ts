import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import localePT from '@angular/common/locales/pt';
import { getBrPaginatorIntl } from './br-paginator-intl';
import { LOCALE_ID } from '@angular/core';
import { HttpClientModule } from '@angular/common/http'

import { MatToolbarModule } from '@angular/material/toolbar'
import { MatIconModule } from '@angular/material/icon'
import { MatInputModule } from '@angular/material/input'
import { MatFormFieldModule } from '@angular/material/form-field'
import { MatGridListModule } from '@angular/material/grid-list'
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatMenuModule } from '@angular/material/menu';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatPaginatorIntl } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatTreeModule } from '@angular/material/tree';
import { MatListModule} from '@angular/material/list';


import { Util } from './util';
import { ProdutoService } from './services/produto.service';
import { OfertasComponent } from './home/ofertas/ofertas.component';
import { AuthService } from './services/auth.service';
import { CalculosService } from './services/calculos.service';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { registerLocaleData } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HeaderComponent } from './template/header/header.component';
import { ContentComponent } from './template/content/content.component';
import { HomeComponent } from './home/home.component';
import { AuthComponent } from './pages/auth/auth.component';
import { CadastroComponent } from './pages/cadastro/cadastro.component';
import { ImagensComponent } from './pages/imagens/imagens.component';
import { ControleComponent } from './pages/controle/controle.component';
import { DetalhesComponent } from './pages/detalhes/detalhes.component';
import { ConfirmComponent } from './dialog/confirm/confirm.component';
import { CompraComponent } from './pages/compra/compra.component';
import { FreteDialogComponent } from './dialog/frete-dialog/frete-dialog.component';
import { CarrinhoComponent } from './pages/carrinho/carrinho.component';
import { CategoriaComponent } from './pages/categoria/categoria.component';
import { LancamentosComponent } from './home/lancamentos/lancamentos.component';
import { PedidoComponent } from './pages/pedido/pedido.component';
import { CancelComponent } from './pages/cancel/cancel.component';
import { SuccessComponent } from './pages/success/success.component';
import { ControlePedidosComponent } from './pages/controle-pedidos/controle-pedidos.component';
import { MatNativeDateModule } from '@angular/material/core';
import { PedidoDetalheComponent } from './pages/pedido-detalhe/pedido-detalhe.component';


// Fazer com que o site seja pt-BR
registerLocaleData(localePT, 'pt-BR')


@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    ContentComponent,
    HomeComponent,
    OfertasComponent,
    AuthComponent,
    CadastroComponent,
    ImagensComponent,
    ControleComponent,
    DetalhesComponent,
    ConfirmComponent,
    CompraComponent,
    FreteDialogComponent,
    CarrinhoComponent,
    CategoriaComponent,
    LancamentosComponent,
    PedidoComponent,
    CancelComponent,
    SuccessComponent,
    ControlePedidosComponent,
    PedidoDetalheComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    MatToolbarModule,
    MatInputModule,
    MatIconModule,
    MatGridListModule,
    MatFormFieldModule,
    MatButtonModule,
    MatCardModule,
    MatSnackBarModule,
    MatMenuModule,
    MatSlideToggleModule,
    MatSelectModule,
    MatProgressSpinnerModule,
    MatTableModule, 
    MatPaginatorModule,
    MatSortModule,
    MatDialogModule,
    MatDividerModule,
    MatDatepickerModule,
    MatFormFieldModule, 
    MatNativeDateModule,
    MatTreeModule,
    MatListModule
  ],
  providers: [ Util, ProdutoService, AuthService, CalculosService, 
    { provide: LOCALE_ID, useValue: 'pt-BR'},
    { provide: MatPaginatorIntl, useValue: getBrPaginatorIntl()}],
  bootstrap: [AppComponent]
})
export class AppModule { }
