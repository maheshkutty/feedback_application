import { Component, ViewChild, ElementRef, OnInit } from '@angular/core';
import { DataService } from '../services/data.service'
import { Validators, FormBuilder } from '@angular/forms'
import { Router, Navigation, ActivatedRoute } from '@angular/router';
import { FileChooser } from '@ionic-native/file-chooser/ngx'
import { ToastController, LoadingController } from '@ionic/angular'

interface Student {
  id?: String,
  name: String,
  age: Number,
  cname: String,
}
@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page implements OnInit {

  accordInput = {
    hscStyle: "panel",
    sscStyle: "panel",
    graduationStyle: "panel"
  }

  filename: string = "";
  fname: string = "";

  regForms = this.fb.group({
    name: [{ value: '', disabled: false }, [Validators.required]],
    email: [{ value: '', disabled: false }, [Validators.required]],
    phoneno: [{ value: '', disabled: false }, [Validators.required]],
    rollno: [{ value: '', disabled: false }, [Validators.required]],
    hclgname: [{ value: '', disabled: false }, [Validators.required]],
    hyearpassing: [{ value: '', disabled: false }, [Validators.required]],
    hmarks: [{ value: '', disabled: false }, [Validators.required, Validators.pattern(/[0-9]+/g)]],
    houtof: [{ value: '', disabled: false }, [Validators.required, Validators.pattern(/[0-9]+/g)]],
    hpercentage: [{ value: '', disabled: true }, [Validators.required]],
    sclgname: [{ value: '', disabled: false }, [Validators.required]],
    syearpassing: [{ value: '', disabled: false }, [Validators.required]],
    smarks: [{ value: '', disabled: false }, [Validators.required, Validators.pattern(/[0-9]+/g)]],
    soutof: [{ value: '', disabled: false }, [Validators.required, Validators.pattern(/[0-9]+/g)]],
    spercentage: [{ value: '', disabled: true }, [Validators.required]],
    gsem1: [{ value: '', disabled: false }, []],
    gsem2: [{ value: '', disabled: false }, []],
    gsem3: [{ value: '', disabled: false }, []],
    gsem4: [{ value: '', disabled: false }, []],
    filename: [{ value: '', disabled: false }, []],
    cgpi: [[], [Validators.required]],
    gper: [{ value: '', disabled: false }, []]
  })

  get errorControl() {
    return this.regForms.controls;
  }

  get email() {
    return this.regForms.get('email')
  }

  @ViewChild("resumefile") resumefile: ElementRef
  fileName;
  constructor(private fireStudent: DataService, private fb: FormBuilder, private router: Router, private route: ActivatedRoute, private fileChooser: FileChooser, private toastController: ToastController, private loadCtrl: LoadingController) {
    console.log(localStorage.getItem('user'));
  }

  ionViewWillEnter(): void {
    let studentData = this.fireStudent.getStudentEditData();
    for (const key in studentData) {
      if (this.regForms.controls[key])
        this.regForms.controls[key].setValue(studentData[key]);
    }
  }

  ionViewWillLeave() {
    this.fireStudent.setStudentEditData({});
    this.regForms.reset();
  }

  ngOnInit(): void {
  }

  showHSCDetails() {
    this.accordInput.hscStyle = this.accordInput.hscStyle == 'panalActive' ? 'panel' : 'panalActive';
  }

  showGradDetails() {
    this.accordInput.graduationStyle = this.accordInput.graduationStyle == 'panalActive' ? 'panel' : 'panalActive';
  }

  showSSCDetails() {
    this.accordInput.sscStyle = this.accordInput.sscStyle == 'panalActive' ? 'panel' : 'panalActive';
  }

  async addStudents() {
    let studentEditData = this.fireStudent.getStudentEditData();
    if (studentEditData?.name != undefined) {
      //update data
      this.fireStudent.updateStudent(studentEditData.docid, this.regForms.value).then(res => {
        console.log("Data sucessfully Updated");
      })
    }
    else {
      //add data
      const load = await this.loadingScreen();
      await load.present();
      let student: Student = this.regForms.value;
      student["id"] = Date.now().toString();
      console.log(student);
      let fileModifiedFileName = this.checkFile(student["id"]);
      console.log(fileModifiedFileName);
      console.log(this.regForms.value);
      let studentData = this.regForms.value;
      if (fileModifiedFileName != null) {
        this.fireStudent.uploadResume(this.resumefile.nativeElement.files[0], fileModifiedFileName).then((data) => {
          studentData["filename"] = fileModifiedFileName;
          console.log(studentData);
          this.fireStudent.addStudents(studentData).then(async res => {
            //console.log("Data sucessfully added");
            this.presentToast("Data sucessfully added");
            this.regForms.reset();
            await load.dismiss();
          }).catch(async (err) => {
            await load.dismiss();
          });
        }).catch(async (err) => {
          await load.dismiss();
        })
      }
      else {
        this.fireStudent.addStudents(studentData).then(async res => {
          //console.log("Data sucessfully added");
          this.presentToast("Data sucessfully added");
          this.regForms.reset();
          await load.dismiss();
        }).catch(async (err) => {
          await load.dismiss();
        });
      }
    }
  }

  async getStudent(id) {
    const data = await this.fireStudent.getStudentById(id);
    console.log(data);
  }

  // async getAllStudents() {
  //   this.fireStudent.getStudent().subscribe(res => {
  //     console.log(res);
  //   })
  // }

  deleteStudent(id) {
    this.fireStudent.deleteStudent(id).then(res => {
      console.log(res);
    })
  }

  checkFile(id) {
    let modifiedFilename = null;
    console.log(this.resumefile.nativeElement.files[0]);
    if (this.resumefile.nativeElement.files[0]?.name) {
      let origFileName = this.resumefile.nativeElement.files[0].name;
      let ext = origFileName.substring(origFileName.lastIndexOf(".") + 1, origFileName.length);
      if (ext == 'pdf') {
        modifiedFilename = origFileName.substring(0, origFileName.lastIndexOf("."));
        modifiedFilename = modifiedFilename + id + "." + ext;
        console.log(modifiedFilename);
        modifiedFilename = modifiedFilename.replace(/\s/g, "_");
        return modifiedFilename;
        //await this.fireStudent.uploadResume(this.resumefile.nativeElement.files[0], modifiedFilename);
      }
    }
    //return modifiedFilename;
  }

  makePercentage(name) {
    console.log('makePercentage');
    if (name == 'hsc') {
      if (this.regForms.value.hmarks != "" && this.regForms.value.houtof != "") {
        let marks = parseInt(this.regForms.value.hmarks);
        let outof = parseInt(this.regForms.value.houtof);

        let per = (marks / outof) * 100;
        console.log(this.regForms.value.hpercentage);
        this.regForms.controls['hpercentage'].setValue(per.toFixed(2));
      }
    }
    if (name == 'ssc') {
      if (this.regForms.value.smarks != "" && this.regForms.value.soutof != "") {
        let marks = parseInt(this.regForms.value.smarks);
        let outof = parseInt(this.regForms.value.soutof);

        let per = (marks / outof) * 100;
        console.log(this.regForms.value.hpercentage);
        this.regForms.controls['spercentage'].setValue(per.toFixed(2));
      }
    }
    if (name == 'grad') {
      if (this.regForms.value.cgpi != "") {
        let cgpi = parseInt(this.regForms.value.cgpi);

        let per = 7.1 * cgpi + 11;
        this.regForms.controls['gper'].setValue(per.toFixed(2));
      }
    }
  }

  chooseFile(event) {
    event.preventDefault();
  }

  async presentToast(msg) {
    let toast = await this.toastController.create({
      message: msg,
      duration: 5000
    })
    await toast.present();
  }

  async loadingScreen() {
    const loading = await this.loadCtrl.create({
      message: "Please wait",
      duration: 5000
    })
    return loading;
  }
}
