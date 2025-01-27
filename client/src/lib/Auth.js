import auth from '@react-native-firebase/auth';

export function signIn({email, password}) {
  // return auth().signInWithEmailAndPassword(email, password);
  return auth().signInWithEmailAndPassword(email, password);
}

export function signUp({email, password}) {
  return auth().createUserWithEmailAndPassword(email, password);
}

export function subscribeAuth(callback) {
  return auth().onAuthStateChanged(callback);
}

export function signOut() {
  return auth().signOut();
}

export function passwordReset(emailAddress) {
  return auth().sendPasswordResetEmail(emailAddress);
}

export function checkUniqueEmail(emailAddress) {
  return auth()
    .fetchSignInMethodsForEmail(emailAddress)
    .then(providers => {
      if (providers.length === 0) {
        return true;
      } else {
        return false;
      }
    });
}
