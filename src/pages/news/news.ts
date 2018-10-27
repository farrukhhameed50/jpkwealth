import { Component } from '@angular/core';
import { IonicPage, NavController, AlertController, LoadingController, NavParams } from 'ionic-angular';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

import { AuthProvider } from  '../../providers/auth/auth';
import { NewsModel } from '../../models/news-model';
/**
 * Generated class for the NewsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-news',
  templateUrl: 'news.html',
})
export class NewsPage {
  username: string;
  
  loading = this.loadingCtrl.create({
      content: 'Please wait...',
      dismissOnPageChange: true
  });
  
  news: NewsModel[] = new Array<NewsModel>();

  constructor(public navCtrl: NavController, public navParams: NavParams, private authProvider: AuthProvider, public http: Http, private alertCtrl: AlertController, private loadingCtrl: LoadingController) {
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
    console.log('ionViewDidLoad NewsPage');
  }

  loadData(){
    this.http.get('http://jpkwealth.net/api/news.php?username='+this.authProvider.getAuth().user+'&token='+this.authProvider.getAuth().token).map(res => res.json()).subscribe(data => {
      if(data.success){
        console.log(data);
        data.data.forEach(function(value){
          this.news.push(new NewsModel(value["title"], value["news"], value["news_date"], value["img_url"]));
        }.bind(this));
        console.log(this.news);
      }else{
        this.showError("Unable to load news!\nError: " + data.error);
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
}
