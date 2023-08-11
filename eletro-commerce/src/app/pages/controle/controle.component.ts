import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Produto } from 'src/app/interfaces/interface';
import { ProdutoService } from 'src/app/services/produto.service';

@Component({
  selector: 'app-controle',
  templateUrl: './controle.component.html',
  styleUrls: ['./controle.component.css']
})
export class ControleComponent implements OnInit {

  constructor(
    private produtoService: ProdutoService
  ) { }

  produtos!: Produto[]
  dataSource!: MatTableDataSource<Produto>
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  ngOnInit(): void {

    this.produtoService.getAll().subscribe(res => {
      this.produtos = res
      this.dataSource = new MatTableDataSource(this.produtos);

      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    })
   
  }

  displayedColumns: string[] = ['id', 'nome', 'estoque', 'detalhe'];

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
}
