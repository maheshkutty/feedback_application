import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {

  email = "";
  password = "";
  
  constructor(private authService: AuthService, private route: Router) { }

  ngOnInit() {
  }

  registerUser(){
    this.authService.createUser(this.email, this.password).then(data => {
      console.log(data);
    }).catch(error => {
      console.log(error);
    })
  }

  goToLogin(){
    this.route.navigateByUrl("/login");
  }
}
