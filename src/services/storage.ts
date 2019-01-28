/**
 * @module Services
 */
// import firebase from 'firebase/app';
// import 'firebase/storage';

declare const firebase: any;

export class StorageService {
  //service: firebase.storage.Storage;
  service: any;
  
  constructor() {
    this.service = this.service ? this.service : firebase.storage();
  }

  async getPhotoUrl(ref) {
    return ref.getDownloadURL();
  }

  async getRef(path) {
    return this.service.ref().child(path);
  }

  async upload(ref, file) {
    return ref.put(file);
  }
}
