export class NewsModel{
  title: string;
  news: string;
  news_date: string;
  img_url: string;
  
  constructor(title: string, news: string, news_date: string, img_url: string){
    this.title = title;
    this.news = news;
    this.news_date = news_date;
    this.img_url = img_url;
  }
}