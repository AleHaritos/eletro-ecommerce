import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CalculosService } from 'src/app/services/calculos.service';

@Component({
  selector: 'app-success',
  templateUrl: './success.component.html',
  styleUrls: ['./success.component.css']
})
export class SuccessComponent implements OnInit{

  constructor(
    public calcService: CalculosService,
    public route: ActivatedRoute
  ) { }


  ngOnInit(): void {
   const params = new URL(window.location.href).searchParams
   let paymentId: any = params.get('paymentId')
   let payerId: any = params.get('PayerID')
   this.calcService.executarPagamento(paymentId, payerId).subscribe(res => console.log(res))
  }



}
