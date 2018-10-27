import { Component } from '@angular/core';
import { IonicPage, NavController, AlertController, LoadingController, NavParams } from 'ionic-angular';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

import { AuthProvider } from  '../../providers/auth/auth';
import { CurrencyModel } from '../../models/currency-model';

/**
 * Generated class for the HomePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
})
export class HomePage {
  loading = this.loadingCtrl.create({
      content: 'Please wait...',
      dismissOnPageChange: false
  });
  username = '';
  
  toHold: CurrencyModel = null;//new CurrencyModel("Loading", "Loading", "");
  others: CurrencyModel[] = new Array<CurrencyModel>();
  shouldHold: string;
  bDate: string;

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
  
  loadData(){
    
    this.http.get('https://script.google.com/macros/s/AKfycbye5Sx-e1tgRhpQAAZpGGwtxCwG_7T48GGc9dHQuCp_wQdktuo/exec?action=get').map(res => res.json()).subscribe(data => {
      this.bDate = data.signals[0].date.split("T")[0];
      this.shouldHold = data.signals[0].hold;
      if(this.shouldHold == "None")
        this.shouldHold = data.signals[0].buy;
      this.http.get('https://min-api.cryptocompare.com/data/price?fsym=ETH&tsyms=USD').map(res => res.json()).subscribe(data => {
        if(this.shouldHold == "ETH")
          this.toHold = new CurrencyModel("Ethereum", data.USD, "assets/imgs/ether.png");
        else
          this.others.push(new CurrencyModel("Ethereum", data.USD, "assets/imgs/ether.png"));
      });
      this.http.get('https://min-api.cryptocompare.com/data/price?fsym=BTC&tsyms=USD').map(res => res.json()).subscribe(data => {
        if(this.shouldHold == "BTC")
          this.toHold = new CurrencyModel("Bitcoin", data.USD, "assets/imgs/btc.png");
        else
          this.others.push(new CurrencyModel("Bitcoin", data.USD, "assets/imgs/btc.png"));
      });
      this.http.get('https://min-api.cryptocompare.com/data/price?fsym=XRP&tsyms=USD').map(res => res.json()).subscribe(data => {
        if(this.shouldHold == "XRP")
          this.toHold = new CurrencyModel("Ripple", data.USD, "assets/imgs/ripple.png");
        else
          this.others.push(new CurrencyModel("Ripple", data.USD, "assets/imgs/ripple.png"));
      });
      this.http.get('https://min-api.cryptocompare.com/data/price?fsym=LTC&tsyms=USD').map(res => res.json()).subscribe(data => {
        if(this.shouldHold == "LTC")
          this.toHold = new CurrencyModel("Litecoin", data.USD, "assets/imgs/litecoin.png");
        else
          this.others.push(new CurrencyModel("Litecoin", data.USD, "assets/imgs/litecoin.png"));
      });
      this.http.get('https://min-api.cryptocompare.com/data/price?fsym=USDT&tsyms=USD').map(res => res.json()).subscribe(data => {
        if(this.shouldHold == "USDT" || this.shouldHold == "COIN X")
          this.toHold = new CurrencyModel("Tether", data.USD, "assets/imgs/tether.png");
        else
          this.others.push(new CurrencyModel("Tether", data.USD, "assets/imgs/tether.png"));
          
        this.loading.dismiss();
      });
      
    });
  }
  
  loadDummyData(){
    this.toHold = new CurrencyModel("Ethereum", "$383.21", "assets/imgs/ether.png");
    this.others = new Array<CurrencyModel>(4);
    this.others[0] = new CurrencyModel("Bitcoin", "$8253.33", "assets/imgs/btc.png");
    this.others[1] = new CurrencyModel("Ripple", "$123.33", "assets/imgs/ripple.png");
    this.others[2] = new CurrencyModel("Litecoin", "$12.33", "assets/imgs/litecoin.png");
    this.others[3] = new CurrencyModel("Tether", "$1", "assets/imgs/tether.png");
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad HomePage');
  }

  public logout() {
    this.authProvider.logout().subscribe(succ => {
      this.navCtrl.setRoot('LoginPage')
    });
  }
  
  showLoading() {
    this.loading.present();
  }
 
  showError(text) {
    this.loading.dismiss();
 
    let alert = this.alertCtrl.create({
      title: 'Error',
      subTitle: text,
      buttons: ['OK']
    });
    alert.present();
  }
}
