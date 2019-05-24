import { Component, ViewChild} from '@angular/core';
import { NavController } from 'ionic-angular';
import * as papa from 'papaparse';
import { Http } from '@angular/http';
import { Chart } from 'chart.js';
import 'rxjs/add/operator/toPromise';


@Component({
  selector: 'page-cluster',
  templateUrl: 'cluster.html'
})
export class ClusterPage  {
 
  @ViewChild('clusterG') clusterG;
  @ViewChild('clusterD') clusterD;



  chartD: any[] = [];
  chartG: any[] = [];
  gauche1 = [];
  droite1 = [];
  gauche2 = [];
  droite2 = [];
  gauche3 = [];
  droite3 = [];
  csvData: any[] = [];
  headerRow: any[] = [];



  constructor(public navCtrl: NavController, private http: Http) {
    this.getGauche();
    this.getDroite();
    this.readCsvData();
  }



 public getGauche(){
  this.http.get('http://localhost:8000/clusterG', {})
  .subscribe(data => {
    for(let i=0;i< 222; i++){
      if(data.json()[i][2] == 1)  this.gauche1.push({x: data.json()[i][0], y: data.json()[i][1]});
      if(data.json()[i][2] == 2)  this.gauche2.push({x: data.json()[i][0], y: data.json()[i][1]});
      if(data.json()[i][2] == 3)  this.gauche3.push({x: data.json()[i][0], y: data.json()[i][1]});
    }
  });
 }

 public getDroite(){
  this.http.get('http://localhost:8000/clusterD', {})
  .subscribe(data => {
    for(let i=0;i< 222; i++){
      if(data.json()[i][2] == 1)  this.droite1.push({x: data.json()[i][0], y: data.json()[i][1]});
      if(data.json()[i][2] == 2)  this.droite2.push({x: data.json()[i][0], y: data.json()[i][1]});
      if(data.json()[i][2] == 3)  this.droite3.push({x: data.json()[i][0], y: data.json()[i][1]});
    }
  });
 }

 public readCsvData() {
  this.http.get('assets/test1.csv')
    .subscribe(
      data => this.extractData(data),
      err => this.handleError(err)
    );
}

public extractData(res) {
  let csvData = res['_body'] || '';
  let parsedData = papa.parse(csvData).data;
  this.headerRow = parsedData[0];
  parsedData.splice(0, 1);
  this.csvData = parsedData;
}


private handleError(err) {
  console.log('something went wrong: ', err);
}

ionViewDidLoad() {


    this.chartG = new Chart(this.clusterG.nativeElement, {
      type: 'scatter',
      data: {
          datasets: [{
              label: 'Classe 1',
              backgroundColor: "rgba(0,255,0,1)",
              pointBorderColor: "rgba(0,255,0,1)",
              pointBackgroundColor: "rgba(0,255,0,1)",
              data: this.gauche1
          },{
            label: 'Classe 2',
            backgroundColor: "rgba(255,0,0,1)",
            pointBorderColor: "rgba(255,0,0,1)",
            pointBackgroundColor: "rgba(255,0,0,1)",
            data: this.gauche2
        },{
          label: 'Classe 3',
          backgroundColor: "rgba(0,0,255,1)",
          pointBorderColor: "rgba(0,0,255,1)",
          pointBackgroundColor: "rgba(0,0,255,1)",
          data: this.gauche3
      }],
          
      },
      options: {
          scales: {
              xAxes: [{
                  type: 'linear',
                  position: 'bottom'
              }]
          }
      }
  });


  this.chartD = new Chart(this.clusterD.nativeElement, {
    type: 'scatter',
    data: {
        datasets: [{
            label: 'Classe 1',
            backgroundColor: "rgba(0,255,0,1)",
            pointBorderColor: "rgba(0,255,0,1)",
            pointBackgroundColor: "rgba(0,255,0,1)",
            data: this.droite1
        },{
          label: 'Classe 2',
          backgroundColor: "rgba(255,0,0,1)",
          pointBorderColor: "rgba(255,0,0,1)",
          pointBackgroundColor: "rgba(255,0,0,1)",
          data: this.droite2
      },{
        label: 'Classe 3',
        backgroundColor: "rgba(0,0,255,1)",
        pointBorderColor: "rgba(0,0,255,1)",
        pointBackgroundColor: "rgba(0,0,255,1)",
        data: this.droite3
    }],
        
    },
    options: {
        scales: {
            xAxes: [{
                type: 'linear',
                position: 'bottom'
            }]
        }
    }
});
  }
}
