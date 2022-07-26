import firebaseConfig from "./config";
import { getAuth, createUserWithEmailAndPassword, updateProfile, signOut, signInWithEmailAndPassword   } from "firebase/auth";
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
import {
  getFirestore,
  collection,
  query,
  onSnapshot,
  doc,
  getDoc,
} from "firebase/firestore";

class Firebase {
  constructor() {
    this.app = initializeApp(firebaseConfig);
    this.auth = getAuth(this.app);
    this.db = getFirestore(this.app);
    this.storage = getStorage(this.app);
  }

  // Registra un usuario
  async registrar(nombre, email, password) {
    const nuevoUsuario = await createUserWithEmailAndPassword(
      this.auth,
      email,
      password
    );


    return await updateProfile(this.auth.currentUser, {
      displayName: nombre,
    });
  }

  // Inicia sesión del usuario
  async login(email, password) {
    return await signInWithEmailAndPassword(this.auth, email, password);
  }

  // Cierra la sesión del usuario
  async cerrarSesion() {
    await signOut(this.auth);
  }

  /**
   * Retrives all the objects from the "productos" collection
   * @param {Function} callback A function that runs when the data is retrived
   */
  async getProducts(callback) {
    const q = query(collection(this.db, "productos"));

    // TODO Check unsubscribe() function
    const unsubscribe = onSnapshot(q, (querySnapshot) =>
      callback(querySnapshot)
    );
  }

  async getProduct(id) {
    const docRef = doc(this.db, "productos", id);
    const docSnap = await getDoc(docRef);

    return docSnap;
  }
}

const firebase = new Firebase();
export default firebase;
