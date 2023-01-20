import firebase from 'firebase/app'
import 'firebase/functions'

export function emulatorSettings() {
  // [START functions_emulator_connect]
  firebase.functions().useEmulator('localhost', 5001)
  // [END functions_emulator_connect]
}
