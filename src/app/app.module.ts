import { NgModule } from '@angular/core';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { environment } from 'environments/environment';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MaterialModule } from './modules';

// const firebaseUiAuthConfig: firebaseui.auth.Config = {
//   signInFlow: 'popup',
//   signInOptions: [
//     firebase.auth.GoogleAuthProvider.PROVIDER_ID,
//     {
//       requireDisplayName: false,
//       provider: firebase.auth.EmailAuthProvider.PROVIDER_ID,
//     },
//   ],
//   tosUrl: 'https://no-tos.com',
//   privacyPolicyUrl: 'https://no-tos.com',
//   credentialHelper: firebaseui.auth.CredentialHelper.GOOGLE_YOLO,
// };

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    MaterialModule,
    AppRoutingModule,
    provideFirebaseApp(() => initializeApp(environment.firebaseConfig)),
    provideAuth(() => getAuth()),
  ],
  providers: [
    // {
    //   provide: USE_EMULATOR,
    //   useValue: !environment.production ? ['localhost', 9099] : undefined,
    // },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {
  constructor() {
    //todo remove later
    console.log(environment.firebaseConfig);
  }
}
