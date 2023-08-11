import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { Util } from 'src/app/util';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  constructor(
    private authService: AuthService,
    public util: Util
  ) { }

  admin!: boolean

  formSearch: FormGroup = new FormGroup({
    search: new FormControl('')
  })

  ngOnInit(): void {

    this.authService.verificarAdmin()
      .then((res: any) => {
        this.admin = res
        localStorage.setItem('canActivate', res)
      })

  }


  signOut(): void {
    this.authService.signOut()
  }

  onSubmitSearch(): void {
    
  }
}
