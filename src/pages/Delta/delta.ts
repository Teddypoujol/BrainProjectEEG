import { Component, ViewChild } from '@angular/core';
import { NavController } from 'ionic-angular';
import * as papa from 'papaparse';
import { Http } from '@angular/http';
import { Chart } from 'chart.js';
import * as fs from "fs";

@Component({
  selector: 'page-delta',
  templateUrl: 'delta.html'
})
export class DeltaPage {
  @ViewChild('lineCanvas') lineCanvas;


  lineChart: any;

  csvData: any[] = [];
  headerRow: any[] = [];

  constructor(public navCtrl: NavController, private http: Http) {
    this.readCsvData();
  }

  private readCsvData() {
    this.http.get('assets/test1.csv')
      .subscribe(
        data => this.extractData(data),
        err => this.handleError(err)
      );
  }

  private extractData(res) {
    let csvData = res['_body'] || '';
    let parsedData = papa.parse(csvData).data;
    this.csvToJSON(csvData, function (resp) {
      this.doThings(resp, function (resp2) {
        console.log(resp2);
      })
    })
    this.headerRow = parsedData[0];


    parsedData.splice(0, 1);
    this.csvData = parsedData;
    //console.log(csvData);
  }

  private csvToJSON(csv, callback) {
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
    if (callback && (typeof callback === 'function')) {
      return callback(result);
    }
    return result;
  }

  private test(){
    fs.readFile(__dirname+ '/test1.csv', function (err, data) {//lire le fichier
      if (err) {
        throw err;
      }
      let str = data.toString();
      // console.log(str);
      this.csvToJSON(str, (res) => {//convertir le fichier en csv
        // --------- Extract value from your array of object ---------
        let tp9 = [];
        res.map((objet) => {
          const {TimeStamp,Delta_TP9 } = objet;
          tp9.push({ TimeStamp, Delta_TP9});
        });
        // --------- End of Extraction ---------
        console.log(tp9);
      });
    });
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
      labels: ["January", "February", "March", "April", "May", "June", "July"],
      datasets: [
        {
          label: "My First dataset",
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
          data: [65, 59, 80, 81, 56, 55, 40],
          spanGaps: false,
        }
      ]
    }

  });

}
}
