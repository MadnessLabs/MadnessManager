/**
 * @module Services
 */

import { APIService } from './api';
import { AuthService } from './auth';
import { ConfigService } from './config';
import { DatabaseService } from './database';
declare var firebase;

export class UserService {
  collectionName = 'users';
  endpoint = 'user';
  protected auth: AuthService;
  protected config: ConfigService;
  protected db: DatabaseService;
  protected api: APIService;
  public profile: any;
  public session: any;

  constructor(
    config?: ConfigService,
    db?: DatabaseService,
    api?: APIService,
    auth?: AuthService
  ) {
    this.config = config ? config : new ConfigService();
    this.db = db ? db : new DatabaseService();
    this.api = api ? api : new APIService();
    this.auth = auth ? auth : new AuthService();
    this.session =
      localStorage.getItem('enjin:session') === 'undefined'
        ? null
        : JSON.parse(localStorage.getItem('enjin:session'));
    this.profile =
      localStorage.getItem('raf:profile') === 'undefined'
        ? null
        : JSON.parse(localStorage.getItem('raf:profile'));
  }

  emitProfileUpdatedEvent(data) {
    document.body.dispatchEvent(
      new CustomEvent('userProfileUpdated', { detail: { data } })
    );
  }

  getDocument(id: string) {
    return this.db.getDocument('users', id);
  }

  async setFeedRead(id: string) {
    const batch = this.db.service.batch();
    const feedCollection = await this.db
      .document(this.collectionName, id)
      .collection('feed')
      .where('read', '==', false)
      .get();

    for (const feedDoc of feedCollection.docs) {
      batch.update(feedDoc.ref, { read: true });
    }

    return await batch.commit();
  }

  async getFeedUnreadCount(id: string): Promise<number> {
    const feedCollection = await this.db
      .document(this.collectionName, id)
      .collection('feed')
      .where('read', '==', false)
      .get();

    return feedCollection.size;
  }

  async getFeed(
    id: string,
    options?: {
      limit?: number;
      startAfter?: any;
      orderBy?: string;
      orderSort?: 'desc' | 'asc';
    }
  ) {
    const queryOptions: any = {
      limit: 8,
      startAfter: null,
      orderBy: 'createdAt',
      orderSort: 'desc',
      ...options
    };

    const feedCollection = await this.db
      .document(this.collectionName, id)
      .collection('feed');

    const lastDoc = queryOptions.startAfter
      ? await feedCollection.doc(queryOptions.startAfter).get()
      : null;

    return queryOptions.startAfter
      ? feedCollection
          .orderBy(queryOptions.orderBy, queryOptions.orderSort)
          .startAfter(lastDoc)
          .limit(queryOptions.limit)
      : feedCollection
          .orderBy(queryOptions.orderBy, queryOptions.orderSort)
          .limit(queryOptions.limit);
  }

  async getFriends(id: string) {
    const data = [];

    const friendsQuery = await this.db
      .document(this.collectionName, id)
      .collection('friends')
      .orderBy('referralTotal', 'desc')
      .get();

    for (const friend of friendsQuery.docs) {
      data.push(friend.data());
    }

    return data;
  }

  async find(id: string) {
    return this.db.find(this.collectionName, id);
  }

  async update(id: string, data: any) {
    return this.db.update(this.collectionName, id, data);
  }

  jsonToString(v) {
    const cache = new Map();

    return JSON.stringify(v, function(_key, value) {
      if (typeof value === 'object' && value !== null) {
        if (cache.get(value)) {
          return;
        }
        // Store value in our map
        cache.set(value, true);
      }

      return value;
    });
  }

  clearCache() {
    const rep = /.*\?.*/,
      links = document.getElementsByTagName('link'),
      scripts = document.getElementsByTagName('script'),
      process_scripts = false;
    for (let i = 0; i < links.length; i++) {
      const link = links[i],
        href = link.href;
      link.href = rep.test(href)
        ? href + '&' + Date.now()
        : href + '?' + Date.now();
    }
    if (process_scripts) {
      for (let i = 0; i < scripts.length; i++) {
        const script = scripts[i],
          src = script.src;
        script.src = rep.test(src)
          ? src + '&' + Date.now()
          : src + '?' + Date.now();
      }
    }
  }

  async logout() {
    const firebaseConfig = this.config.get('firebase');
    firebase.auth().signOut();
    window.localStorage.clear();
    this.clearCache();
    indexedDB.deleteDatabase('firebaseLocalStorageDb');
    indexedDB.deleteDatabase(
      `firestore/[DEFAULT]/${firebaseConfig.projectId}/main`
    );
    await this.unwatchProfile(this.profile.id);
    this.profile = null;
    if ((window as any).cordova) {
      window.location.href = './index.html';
    } else {
      window.location.reload(true);
    }
  }

  watchProfile(id: string, callback) {
    this.db.watchDocument(this.collectionName, id, snapshot => {
      localStorage.setItem('raf:profile', this.jsonToString(snapshot.data));
      this.profile = { ...snapshot.data, id };
      this.emitProfileUpdatedEvent(this.profile);

      if (callback && typeof callback === 'function') {
        callback(this.profile);
      }
    });
  }

  unwatchProfile(id: string) {
    return this.db.unwatchDocument(this.collectionName, id);
  }

  getBalance(id: string) {
    return this.api.get(`getBalance?id=${id}`);
  }

  cashOut(id: string) {
    return this.api.get(`cashOut?id=${id}`);
  }

  inviteEmployee(id: string, email: string) {
    return this.api.post(`inviteEmployee`, { id, email });
  }

  removeEmployee(id: string, email: string) {
    return this.api.post(`removeEmployee`, { id, email });
  }
}
