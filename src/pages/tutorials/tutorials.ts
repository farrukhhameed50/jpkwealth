import { Component } from '@angular/core';
import { IonicPage, NavController, AlertController, LoadingController, NavParams } from 'ionic-angular';
import { Http } from '@angular/http';
import { DomSanitizer } from '@angular/platform-browser';
import 'rxjs/add/operator/map';

import { AuthProvider } from  '../../providers/auth/auth';
import { TutorialModel } from '../../models/tutorial-model';



/**
 * Generated class for the TutorialsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-tutorials',
  templateUrl: 'tutorials.html',
})
export class TutorialsPage {
  username: string;
  
  loading = this.loadingCtrl.create({
      content: 'Please wait...',
      dismissOnPageChange: true
  });
  
  tutorials: TutorialModel[] = new Array<TutorialModel>();
  
  
  constructor(public navCtrl: NavController, public navParams: NavParams, private authProvider: AuthProvider, public http: Http, private alertCtrl: AlertController, private loadingCtrl: LoadingController, public sanitizer: DomSanitizer) {
    let info = this.authProvider.getAuth();
    if(info == null){
      this.navCtrl.setRoot('LoginPage');
    }else{
      this.username = info.user;
    }
    
    this.showLoading();
    this.loadData();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad TutorialsPage');
  }

  loadData(){
    this.http.get('http://jpkwealth.net/api/tutorials.php?username='+this.authProvider.getAuth().user+'&token='+this.authProvider.getAuth().token).map(res => res.json()).subscribe(data => {
      if(data.success){
        console.log(data);
        data.data.forEach(function(value){
          let video_url = this.getVideoUrl(this.getVimeoId(value["video_url"]));
          this.tutorials.push(new TutorialModel(value['title'], video_url));
          
          
        }.bind(this));
      }else{
        this.showError("Unable to load tutorials!\nError: " + data.error);
        this.navCtrl.setRoot("HomePage");
      }
    });
  }
  
  showLoading() {
    this.loading.present();
  }
 
  showError(text) {
    this.loading.dismiss();
 
    let alert = this.alertCtrl.create({
      title: 'Fail',
      subTitle: text,
      buttons: ['OK']
    });
    alert.present();
  }
  
  getVimeoId(url){
    var regExp = /https?:\/\/(?:www\.|player\.)?vimeo.com\/(?:channels\/(?:\w+\/)?|groups\/([^\/]*)\/videos\/|album\/(\d+)\/video\/|video\/|)(\d+)(?:$|\/|\?)/;

    var match = url.match(regExp);

    if (match){
        return match[3];
    }
    else{
        return "";
    }
  }
  
  getVideoUrl(tutorial){
    //let temp = '<iframe id="player1" src="https://player.vimeo.com/video/'+tutorial+'?api=1&player_id=player1&background=1" width="100%"  frameborder="0"></iframe>';
    let temp = 'https://player.vimeo.com/video/'+tutorial+'?api=1&player_id=player1';
    return temp;
  }
}
