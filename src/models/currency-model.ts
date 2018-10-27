export class CurrencyModel{
  name: string;
  rate: string;
  icon: string;
  
  constructor(name: string, rate: string, icon: string){
    this.name = name;
    this.rate = rate;
    this.icon = icon;
  }
}