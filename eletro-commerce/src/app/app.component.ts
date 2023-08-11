import { Component, OnInit } from '@angular/core';
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'eletro-commerce';

  ngOnInit(): void {
    const firebaseConfig = {
      apiKey: "AIzaSyCTokoiBLMr535TzYjM_aXwTvlEuaRIEJI",
      authDomain: "eletro-commerce-bc08d.firebaseapp.com",
      projectId: "eletro-commerce-bc08d",
      storageBucket: "eletro-commerce-bc08d.appspot.com",
      messagingSenderId: "399801367540",
      appId: "1:399801367540:web:b0bfe78eb4c977866f57a1",
      measurementId: "G-H46X7L12NH"
    };

    const app = initializeApp(firebaseConfig);
    const analytics = getAnalytics(app);

  }

}
