import { Injectable } from '@angular/core';
import { Firestore, collection, collectionData, addDoc, deleteDoc, doc, updateDoc, setDoc, getDoc, } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { getDocs, query, where } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import Student from '../student/StudentTemplate';
import { FeedBackTemplate } from './FeedBackTemplate';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  studentEditData: Student;
  constructor(private fireStore: Firestore) { }

  // getStudent(): Observable<Student[]> {
    
  //   const studentRef = collection(this.fireStore, 'student');
  //   return collectionData(studentRef, { idField: 'docid' }) as Observable<Student[]>;
  // }

  getStudent1(){
    let user = JSON.parse(localStorage.getItem('user'));
    let uid = user.uid;
    const studentRef = collection(this.fireStore, 'student');
    return getDoc(doc(studentRef, uid));
  }

  addStudents(student: Student) {
    //DocumentReference()
    const studentRef = collection(this.fireStore, 'student');
    //setDoc()
    let user = JSON.parse(localStorage.getItem('user'));
    let uid = user.uid;
    return setDoc(doc(studentRef, uid), student);
  }

  async getStudentById(id: String) {
    const q = query(collection(this.fireStore, "student"), where("id", "==", id));
    const querySnapshot = await getDocs(q);
    let students = [];
    querySnapshot.forEach((doc) => {
      console.log(doc.id);
      let tempData = { docid: doc.id, ...doc.data() };
      students.push(tempData);
    })
    return students;
  }

  deleteStudent(id: String) {
    let user = JSON.parse(localStorage.getItem('user'));
    let uid = user.uid;
    const studentRef = doc(this.fireStore, `student/${uid}`);
    return deleteDoc(studentRef);
  }

  updateStudent(id: String, student: Student) {
    const studentRef = doc(this.fireStore, `student/${id}`);
    return updateDoc(studentRef, { ...student });
  }

  uploadResume(fileName, in2) {
    const storage = getStorage();
    const resumeRef = ref(storage, 'resumes/' + in2);
    console.log(fileName)
    return uploadBytes(resumeRef, fileName)
  }

  setStudentEditData(data) {
    this.studentEditData = data;
  }

  getStudentEditData() {
    return this.studentEditData;
  }

  showResume(fileResume) {
    const storage = getStorage();
    const resumeRef = ref(storage, 'resumes/' + fileResume);
    return getDownloadURL(resumeRef);
  }

  addFeedBack(feedBack: FeedBackTemplate) {
    let user = JSON.parse(localStorage.getItem('user'));
    let uid = user.uid;
    let fuid = doc(this.fireStore, "feedback/"+uid);
    const feedbackRef = collection(fuid, 'fid');
    return addDoc(feedbackRef, feedBack);
  }

  getFeedback() {
    let user = JSON.parse(localStorage.getItem('user'));
    let uid = user.uid;
    const feedbackRef = collection(this.fireStore, `feedback/${uid}/fid`);
    return collectionData(feedbackRef, { idField: 'docid' }) as Observable<FeedBackTemplate[]>;
  }

  deleteFeedback(docid) {
    let user = JSON.parse(localStorage.getItem('user'));
    let uid = user.uid;
    const feedRef = doc(this.fireStore, `feedback/${uid}/fid/${docid}`);
    return deleteDoc(feedRef);
  }
}
