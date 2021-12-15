import { Injectable } from '@angular/core';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, authState, Auth } from '@angular/fire/auth';
import { Observable } from 'rxjs';
// import { AngularFirestore } from '@angular/fire/compat/firestore';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  userdata: any;
  constructor(private auth: Auth) {
    authState(this.auth).subscribe(user => {
      if (user) {
        console.log(user);
        this.userdata = user;
        localStorage.setItem('user', JSON.stringify(this.userdata));
        JSON.parse(localStorage.getItem('user'));
      } else {
        localStorage.setItem('user', null);
        JSON.parse(localStorage.getItem('user'));
      }
    })
  }

  createUser(email, password) {
    return createUserWithEmailAndPassword(this.auth, email, password);
  }

  signInUser(email, password) {
    return signInWithEmailAndPassword(this.auth, email, password);
  }

  checkUser() {
    return
  }
}
