import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { DataService } from '../services/data.service';
import { UtilsService } from '../services/utils.service';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page {

  rating;
  emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
  isSubmitted = false;
  feedbackForm = this.fb.group({
    name: ['', [Validators.required]],
    email: ['', [Validators.required, Validators.pattern(this.emailRegex)]],
    ename: ['', [Validators.required]],
    rate: ['', []],
    comments: ['', [Validators.required]]
  })

  constructor(private fb: FormBuilder, private fireFeedback: DataService, private utils: UtilsService ) { }

  get errorControl() {
    return this.feedbackForm.controls;
  }

  get email() {
    return this.feedbackForm.get('email')
  }

  async postFeedback() {
    const load = await this.utils.loadingScreen();
    await load.present();
    this.feedbackForm.value["rate"] = this.rating;
    this.fireFeedback.addFeedBack(this.feedbackForm.value).then(async data => {
      console.log(data);
      this.feedbackForm.reset();
      await load.dismiss();
      await this.utils.presentToast("Data successfully added");
    }).catch(async err => {
      await load.dismiss();
      await this.utils.presentToast("Error while saving data");
    })
  }
}
