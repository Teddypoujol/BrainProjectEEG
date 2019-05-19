import { Component, ViewChild} from '@angular/core';
import { NavController } from 'ionic-angular';
import * as papa from 'papaparse';
import { Http } from '@angular/http';
import { Chart } from 'chart.js';
import { timestamp } from 'rxjs/operators';
import { D } from '@angular/core/src/render3';
import { Timestamp } from 'rxjs';

/*
  
*/

@Component({
  selector: 'page-delta',
  templateUrl: 'delta.html'
})
export class DeltaPage  {
 
  @ViewChild('lineCanvas') lineCanvas;
  Delta = [];
  moyenneDelta: any[] = [];
  frequenceDelta: any[] = [];
  DeltaTest: any[] = [];
  lineChart: any;
  lineChart2: any;
  moyenneData: any[] = [];
  csvData: any[] = [];
  headerRow: any[] = [];
  DeltaTP9: any;

  constructor(public navCtrl: NavController, private http: Http) {
    this.readCsvData();
  }

  public csvToJSON(csv,moyenneDelta,frequenceDelta, callback) {
    var lines = csv.split("\n");
    var result = [];
    var headers = lines[0].split(",");
    for (var i = 1; i < lines.length - 1; i++) {
      var obj = {};
      var currentline = lines[i].split(",");
      for (var j = 0; j < headers.length; j++) {
        obj[headers[j]] = currentline[j];
      }
      result.push(obj);
    }

    
    

    for (let h=0;h < result.length;h++) {
      moyenneDelta[h] = ((parseFloat(result[h].Delta_TP9) + parseFloat(result[h].Delta_AF7))/2);
    }
    
    for ( var k =0; k< moyenneDelta.length;k++){
      frequenceDelta[k] = ((parseFloat(moyenneDelta[k]) - (-1))/(1-(-1)))*(4-0.5)+0.5;
    }

    console.log(frequenceDelta);
    console.log(moyenneDelta);
    moyenneDelta = moyenneDelta.join();
    frequenceDelta = frequenceDelta.join();
    console.log(result);
    return result;
  }

  public moyenne(Delta, callback) {
    let moyenneDelta = [];
    
    for (var i in Delta) {

      moyenneDelta[i] = (parseFloat(Delta[i].Delta_TP9) + parseFloat(Delta[i].Delta_AF7)/2,10);
      
    }
    if (callback && (typeof callback === 'function')) {
      return callback(moyenneDelta);
    }
    console.log(moyenneDelta);
    return moyenneDelta;
  }

  
  public frequence(moyenneDelta, callback) {
    let frequenceDelta = [];
    
    for (var i in moyenneDelta) {

      frequenceDelta[i] = (((parseFloat(moyenneDelta[i]) - (-1))/(1-(-1)))*(4-0.5)+0.5)
      
    }
    if (callback && (typeof callback === 'function')) {
      return callback(frequenceDelta);
    }
    console.log(frequenceDelta);
    return frequenceDelta;
  }
   
  public readCsvData() {
    this.http.get('assets/test1.csv')
      .subscribe(
        data => this.extractData(data,this.Delta),
        err => this.handleError(err)
      );
  }

  public extractData(res,Delta) {
    let csvData = res['_body'] || '';
    let parsedData = papa.parse(csvData).data;
    this.csvToJSON(csvData,this.moyenneDelta,this.frequenceDelta, function (resp) {
      let tp9 = [];
      resp.map((objet) => {
        const {Delta_TP9, Delta_AF7} = objet;
        tp9.push({Delta_TP9, Delta_AF7});

      });
      // --------- End of Extraction ---------
      this.moyenne(tp9, function(resp){
        this.frequence(resp, function(resp2){
          this.Delta = resp2;
          console.log(resp2);
          console.log(this.Delta);
        })
      })
      Delta.push(tp9);
      console.log(tp9);
      return tp9;
      
    })
   
    this.headerRow = parsedData[0];
    parsedData.splice(0, 1);
    this.csvData = parsedData;
  }

private handleError(err) {
  console.log('something went wrong: ', err);
}

trackByFn(index: any, item: any) {
  return index;
}

ionViewDidLoad() {



  this.lineChart = new Chart(this.lineCanvas.nativeElement, {

    type: 'line',
    data: {
      labels: [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28],
      datasets: [
        {
          label: "Fréquence Delta",
          fill: false,
          lineTension: 0.1,
          backgroundColor: "rgba(75,192,192,0.4)",
          borderColor: "rgba(75,192,192,1)",
          borderCapStyle: 'butt',
          borderDash: [],
          borderDashOffset: 0.0,
          borderJoinStyle: 'miter',
          pointBorderColor: "rgba(75,192,192,1)",
          pointBackgroundColor: "#fff",
          pointBorderWidth: 1,
          pointHoverRadius: 5,
          pointHoverBackgroundColor: "rgba(75,192,192,1)",
          pointHoverBorderColor: "rgba(220,220,220,1)",
          pointHoverBorderWidth: 2,
          pointRadius: 1,
          pointHitRadius: 10,
          data: this.frequenceDelta,
          spanGaps: false,
          
        }
      ]
    }

  });

  this.lineChart2 = new Chart(this.lineCanvas.nativeElement, {

    type: 'line',
    data: {
      labels: [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28],
      datasets: [
        {
          label: "Moyenne Delta",
          fill: false,
          lineTension: 0.1,
          backgroundColor: "rgba(75,192,192,0.4)",
          borderColor: "rgba(75,192,192,1)",
          borderCapStyle: 'butt',
          borderDash: [],
          borderDashOffset: 0.0,
          borderJoinStyle: 'miter',
          pointBorderColor: "rgba(75,192,192,1)",
          pointBackgroundColor: "#fff",
          pointBorderWidth: 1,
          pointHoverRadius: 5,
          pointHoverBackgroundColor: "rgba(75,192,192,1)",
          pointHoverBorderColor: "rgba(220,220,220,1)",
          pointHoverBorderWidth: 2,
          pointRadius: 1,
          pointHitRadius: 10,
          data: this.moyenneDelta,
          spanGaps: false,
          
        }
      ]
    }

  });

}
}
