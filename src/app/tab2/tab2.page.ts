import { Component } from '@angular/core';
import { DataService } from '../services/data.service';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular'


@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page {

  segmentChooser = "sdata"
  sList = []
  fList = []

  constructor(private studentService: DataService, private route: Router, private toastController: ToastController) {
    
    studentService.getFeedback().subscribe(data => {
      this.fList = data;
    });
  }

  ionViewWillEnter(){
    this.studentService.getStudent1().then(res => {
      if (res.exists()) {
        console.log(res.data());
        this.sList = [];
        this.sList.push(res.data());
      }
    });
  } 

  async presentToast(msg) {
    let toast = await this.toastController.create({
      message: msg,
      duration: 5000
    })
    await toast.present();
  }

  segmentChanged(e) {
    this.segmentChooser = this.segmentChooser == 'sdata' ? 'fdata' : 'sdata';
  }

  showStudentInfo(item) {
    console.log(item);
    this.route.navigate(["./student"], { state: item })
  }

  deleteStudentInfo(docid) {
    this.studentService.deleteStudent(docid).then(async (data) => {
      console.log("data deleted");
      await this.presentToast("Student Data deleted");
    });
  }

  deleteFeedback(docid) {
    this.studentService.deleteFeedback(docid).then(async data => {
      await this.presentToast("Feedback deleted");
    });
  }
}
