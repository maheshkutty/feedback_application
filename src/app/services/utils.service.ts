import { Injectable } from '@angular/core';
import { LoadingController, ToastController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class UtilsService {

  constructor(private toastController: ToastController, private loadCtrl: LoadingController) {

  }

  public async presentToast(msg) {
      let toast = await this.toastController.create({
          message: msg,
          duration: 5000
      })
      await toast.present();
  }

  public async loadingScreen() {
      const loading = await this.loadCtrl.create({
          message: "Please wait",
          duration: 5000
      })
      return loading;
  }
}
