import { Component, OnInit } from '@angular/core';
import { Router, Navigation, NavigationExtras } from '@angular/router';
import { DataService } from '../services/data.service';
import { InAppBrowser } from '@awesome-cordova-plugins/in-app-browser/ngx';

@Component({
  selector: 'app-student',
  templateUrl: './student.page.html',
  styleUrls: ['./student.page.scss'],
})
export class StudentPage implements OnInit {


  docid = "";
  userdata1 = {
    "allLabel": [{ "label": "Name", "value": "name" }, { "label": "Email", "value": "email" }, { "label": "Contact No", "value": "phoneno" }, { "label": "Roll no", "value": "rollno" }],
    "hsclabel": [{ "label": "Name", "value": "hclgname" }, { "label": "YOP", "value": "hyearpassing" }, { "label": "Marks", "value": "hmarks" }, { "label": "Out Of", "value": "houtof" }, { "label": "Percentage", "value": "hpercentage" }],
    "ssclabel": [{ "label": "Name", "value": "sclgname" }, { "label": "YOP", "value": "syearpassing" }, { "label": "Marks", "value": "smarks" }, { "label": "Out Of", "value": "soutof" }, { "label": "Percentage", "value": "spercentage" }],
    "gradLabel": [{ "label": "CGPI", "value": "cgpi" }, { "label": "Percentage", "value": "gper" }]
  };
  constructor(private route: Router, private fireStudent: DataService, private inApp: InAppBrowser) {
    let nav: Navigation = route.getCurrentNavigation();
    if (nav.extras && nav.extras.state) {
      let fireBasedata = nav.extras.state;
      this.userdata1 = { ...this.userdata1, ...fireBasedata };
      console.log(nav.extras.state);
    }
  }

  editStudent() {
    //this.route.navigate(["/tabs/tab1"], { state: this.userdata1 })
    // let nav: Navigation = this.route.getCurrentNavigation();
    // let navigationExtras: NavigationExtras = {
    //   queryParams: {
    //     student: JSON.stringify(this.userdata1)
    //   }
    // }
    console.log(this.userdata1);
    let data = this.userdata1;
    delete data["allLabel"];
    delete data["hsclabel"];
    delete data["ssclabel"];
    delete data["gradLabel"];
    this.fireStudent.setStudentEditData(data);
    this.route.navigate(["/tabs/tab1"])
  }

  openDocument() {
    console.log(this.userdata1["filename"]);
    this.fireStudent.showResume(this.userdata1["filename"]).then(url => {
      this.inApp.create(url);
    }).catch((error) => {
      console.log(error);
    })
  }

  ngOnInit() {
  }

}
