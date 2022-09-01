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

export function deleteUserAuth() {
  const user = auth().currentUser;
  user.delete().then(() => {
    console.log('User Deleted');
  });
}

export async function reauthenticate(userProvidedPassword) {
  const user = auth().currentUser;
  const credential = auth.EmailAuthProvider.credential(
    user.email,
    userProvidedPassword,
  );
  try {
    return await user.reauthenticateWithCredential(credential);
  } catch (e) {
    console.log(e);
  }
}

export function setNewPassword(newPw) {
  const user = auth().currentUser;
  user
    .updatePassword(newPw)
    .then(() => {
      console.log('Password changed');
    })
    .catch(e => {
      console.log(e);
    });
}
