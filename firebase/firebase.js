import firebaseConfig from "./config";
import { initializeApp } from "firebase/app";
import {
  getAuth,
  createUserWithEmailAndPassword,
  updateProfile,
  signOut,
  signInWithEmailAndPassword,
} from "firebase/auth";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
import {
  getFirestore,
  collection,
  query,
  onSnapshot,
  doc,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  orderBy
} from "firebase/firestore";

class Firebase {
  constructor() {
    this.app = initializeApp(firebaseConfig);
    this.auth = getAuth(this.app);
    this.db = getFirestore(this.app);
    this.storage = getStorage(this.app);
  }

  /**
   * Creates a new user in the app
   * @param {string} name The name of the user
   * @param {string} email The email of the user
   * @param {string} password The password of the user
   * @returns {object} Object containing the user information
   */
  async createUser(name, email, password) {
    try {
      await createUserWithEmailAndPassword(this.auth, email, password);

      return await updateProfile(this.auth.currentUser, {
        displayName: name,
      });
    } catch (error) {
      console.error(
        "there was an error while trying to create the user",
        error
      );
    }
  }

  /**
   * User login function
   * @param {string} email The email of the user
   * @param {string} password The password of the user
   * @returns {object} Object containing the user information
   */
  async login(email, password) {
    try {
      return await signInWithEmailAndPassword(this.auth, email, password);
    } catch (error) {
      console.error("there was an error while trying to log in", error);
    }
  }

  /**
   * User logout function
   */
  async logOut() {
    try {
      await signOut(this.auth);
    } catch (error) {
      console.error("there was an error while trying to log out", error);
    }
  }

  /**
   * Retrives all the objects from the "productos" collection
   * @param {Function} callback A function that runs when the data is retrived
   * @param {string} order The attribute in wich the elements will be order
   */
  getProducts(callback, order = "created") {
    try {
      const q = query(collection(this.db, "productos"), orderBy(order, "desc"));

      onSnapshot(q, (querySnapshot) => callback(querySnapshot));

    } catch (error) {
      console.error(
        "there was an error while trying to get all products",
        error
      );
    }
  }

  /**
   * Retrives one product from the "productos" collection
   * @param {string} id The id of the product to retrieve
   * @returns {object} The product
   */
  async getProduct(id) {
    try {
      const docRef = doc(this.db, "productos", id);
      const docSnap = await getDoc(docRef);

      return docSnap;
    } catch (error) {
      console.error("there was an error while trying to get a product", error);
    }
  }

  /**
   * Creates a new product
   * @param {object} product The product that will be stored
   */
  async createProduct(product) {
    try {
      await addDoc(collection(this.db, "productos"), product);
    } catch (error) {
      console.error(
        "there was an error while trying to create a product",
        error
      );
    }
  }

  /**
   * Register a new vote in a product
   * @param {string} productId The id of the voted product
   * @param {number} votes The new quantity of votes
   * @param {Array} votedBy The new array of user that voted the product
   */
  async voteProduct(productId, votes, votedBy) {
    try {
      const productRef = doc(this.db, "productos", productId);
      await updateDoc(productRef, { votes, votedBy });
    } catch (error) {
      console.error("there was an error while trying to vote a product", error);
    }
  }

  /**
   * Register a new comment in a product
   * @param {string} productId The id of the commented product
   * @param {Array} comments An array of the product comments
   */
  async commentProduct(productId, comments) {
    try {
      const productRef = doc(this.db, "productos", productId);
      await updateDoc(productRef, { comments });
    } catch (error) {
      console.error(
        "there was an error while trying to comment a product",
        error
      );
    }
  }

  /**
   * Deletes a product from the DB
   * @param {string} productId The id of the deleted product
   */
  async deleteProduct(productId) {
    try {
      await deleteDoc(doc(this.db, "productos", productId));
    } catch (error) {
      console.error(
        "there was an error while trying to delete a product",
        error
      );
    }
  }

  /**
   * It creates a storage ref due incompatibilities
   * between firebase v9 and react-firebase-file-uploader
   * @returns {Object} The reference used to upload the product img
   */
  createStorageRef() {
    try {
      const refForUploader = ref(this.storage, "productos");

      refForUploader["child"] = function (filename) {
        const newRef = ref(this, filename);
        newRef["put"] = function (file, metadata) {
          return uploadBytesResumable(newRef, file, metadata);
        };
        return newRef;
      };

      return refForUploader;
    } catch (error) {
      console.error(
        "there was an error while trying to create a storage ref",
        error
      );
    }
  }

  /**
   * Get a img url from firebase storage
   * @param {string} imageName The name of the image from which you want to get the url
   * @returns {string} The url corresponding to the image
   */
  async getImageURL(imageName) {
    try {
      const imageRef = ref(this.storage, `productos/${imageName}`);
      const url = await getDownloadURL(imageRef);
      return url;
    } catch (error) {
      console.error(
        "there was an error while trying to get an image url",
        error
      );
    }
  }
}

const firebase = new Firebase();
export default firebase;
