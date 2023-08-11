import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { DadosFrete } from 'src/app/interfaces/interface';

@Component({
  selector: 'app-frete-dialog',
  templateUrl: './frete-dialog.component.html',
  styleUrls: ['./frete-dialog.component.css']
})
export class FreteDialogComponent {

  dataFrete!: DadosFrete

  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {
    this.dataFrete = data
  }

}
