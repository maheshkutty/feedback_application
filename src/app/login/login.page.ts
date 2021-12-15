import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { UtilsService } from '../services/utils.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  email = "";
  passsword = "";
  constructor(private authService: AuthService, private route: Router, private util: UtilsService) { }

  ngOnInit() {
  }

  async signInUser() {
    const load = await this.util.loadingScreen();
    await load.present();
    this.authService.signInUser(this.email, this.passsword).then(async data => {
      console.log(data);
      this.route.navigateByUrl("/tabs/tab1");
      await load.dismiss();
    }).catch(async error => {
      console.log(error);
      await load.dismiss();
      await this.util.presentToast(error.message);
    })
  }

  goToRegister() {
    this.route.navigateByUrl("/register");
  }
}
