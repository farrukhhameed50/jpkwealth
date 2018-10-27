import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { FCM } from '@ionic-native/fcm';

import { AuthProvider } from  '../providers/auth/auth';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage:any;

  constructor(private fcm: FCM, platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen,public authProvider: AuthProvider) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      if(platform.is("cordova")){
        fcm.subscribeToTopic('all');
        fcm.getToken().then(token=>{
            console.log(token);
        })
        fcm.onNotification().subscribe(data=>{
          if(data.wasTapped){
            console.log("Received in background");
          } else {
            console.log("Received in foreground");
          };
        })
        fcm.onTokenRefresh().subscribe(token=>{
          console.log(token);
        });
      }
      //end notifications.
      
      statusBar.styleDefault();
      splashScreen.hide();
      
      if(authProvider.getAuth() == null)
        this.rootPage = 'LoginPage';
      else
        this.rootPage = 'HomePage';
    });
  }
  
  openPage(p) {
    this.rootPage = p;
  }
  
  logout(){
    this.authProvider.logout().subscribe(succ => {
      this.rootPage = 'HomePage';
    });
  }
}

