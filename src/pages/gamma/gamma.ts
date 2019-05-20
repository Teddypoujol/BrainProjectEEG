import { Component, ViewChild} from '@angular/core';
import { NavController } from 'ionic-angular';
import * as papa from 'papaparse';
import { Http } from '@angular/http';
import { Chart } from 'chart.js';

@Component({
  selector: 'page-gamma',
  templateUrl: 'gamma.html'
})
export class GammaPage {


    @ViewChild('freqDelta') freqDelta;
    @ViewChild('freqAlpha') freqAlpha;
    @ViewChild('freqBeta') freqBeta;
    @ViewChild('freqGamma') freqGamma;
    @ViewChild('freqTheta') freqTheta;
  
    Delta = [];
    moyenneDelta: any[] = [];
    frequenceDelta: any[] = [];
  
    moyenneAlpha: any[] = [];
    frequenceAlpha: any[] = [];
  
    moyenneGamma: any[] = [];
    frequenceGamma: any[] = [];
  
    moyenneBeta: any[] = [];
    frequenceBeta: any[] = [];
  
    moyenneTheta: any[] = [];
    frequenceTheta: any[] = [];
  
    timeStamp: any[] = [];
    delta: any;
    alpha: any;
    gamma: any;
    beta: any;
    theta: any;
    csvData: any[] = [];
    headerRow: any[] = [];
  
  
    constructor(public navCtrl: NavController, private http: Http) {
      this.readCsvData();
    }
  
    public csvToJSON(csv,moyenneDelta,frequenceDelta, timeStamp, moyenneGamma,frequenceGamma, 
      moyenneAlpha,frequenceAlpha, moyenneBeta,frequenceBeta, moyenneTheta,frequenceTheta,callback) {
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
  
      
     
      //DELTA
      for (let h=0;h < result.length;h++) {
        moyenneDelta[h] = ((parseFloat(result[h].Delta_TP10) + parseFloat(result[h].Delta_AF8))/2);
      }
      
      for ( var k =0; k< moyenneDelta.length;k++){
        frequenceDelta[k] = ((parseFloat(moyenneDelta[k]) - (-1))/(1-(-1)))*(4-0.5)+0.5;
      }
  
      //GAMMA
      for (let l=0;l < result.length;l++) {
        moyenneGamma[l] = ((parseFloat(result[l].Gamma_TP10) + parseFloat(result[l].Gamma_AF8))/2);
      }
      
      for ( var m =0; m< moyenneGamma.length;m++){
        frequenceGamma[m] = ((parseFloat(moyenneGamma[m]) - (-1))/(1-(-1)))*(100-40)+40;
      }
  
      //BETA
      for (let n=0;n < result.length;n++) {
        moyenneBeta[n] = ((parseFloat(result[n].Beta_TP10) + parseFloat(result[n].Beta_AF8))/2);
      }
      
      for ( var o =0; o< moyenneBeta.length;o++){
        frequenceBeta[o] = ((parseFloat(moyenneBeta[o]) - (-1))/(1-(-1)))*(39-13)+13;
      }
  
      //ALPHA
      for (let p=0;p < result.length;p++) {
        moyenneAlpha[p] = ((parseFloat(result[p].Alpha_TP10) + parseFloat(result[p].Alpha_AF8))/2);
      }
      
      for ( var q =0; q< moyenneAlpha.length;q++){
        frequenceAlpha[q] = ((parseFloat(moyenneAlpha[q]) - (-1))/(1-(-1)))*(13-7)+7;
      }
  
      //THETA
      for (let r=0;r < result.length;r++) {
        moyenneTheta[r] = ((parseFloat(result[r].Theta_TP10) + parseFloat(result[r].Theta_AF8))/2);
      }
      
      for ( var s =0; s< moyenneTheta.length;s++){
        frequenceTheta[s] = ((parseFloat(moyenneTheta[s]) - (-1))/(1-(-1)))*(7-4)+4;
      }
  
      //TIMESTAMP
      for (let t=0;t < result.length;t++) {
        let ndate = new Date(result[t].TimeStamp);
        //console.log(ndate);
        timeStamp[t] = (ndate.getSeconds());
      }
      console.log(timeStamp);
      console.log(frequenceDelta);
      console.log(moyenneDelta);
      moyenneDelta = moyenneDelta.join();
      frequenceDelta = frequenceDelta.join();
  
      moyenneTheta = moyenneTheta.join();
      frequenceTheta = frequenceTheta.join();
  
      console.log(result);
      return result;
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
      this.csvToJSON(csvData,this.moyenneDelta,this.frequenceDelta, this.timeStamp, 
        this.moyenneGamma,this.frequenceGamma, this.moyenneAlpha,this.frequenceAlpha,
        this.moyenneBeta,this.frequenceBeta,this.moyenneTheta,this.frequenceTheta,function (resp) {
        let TP10 = [];
        resp.map((objet) => {
          const {Delta_TP10, Delta_AF8} = objet;
          TP10.push({Delta_TP10, Delta_AF8});
  
        });
        // --------- End of Extraction ---------
        
        Delta.push(TP10);
        console.log(TP10);
        return TP10;
        
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
  
  
  
    this.delta = new Chart(this.freqDelta.nativeElement, {
  
      type: 'line',
      data: {
        labels: this.timeStamp,
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
            spanGaps: true,
            
          },
          {
            label: "Manque de sommeil",
            fill: true,
            lineTension: 0.1,
            backgroundColor: "rgba(50,20,192,0.5)",
            borderColor: "rgba(50,20,192,1)",
            borderCapStyle: 'butt',
            borderDash: [],
            borderDashOffset: 0.0,
            borderJoinStyle: 'miter',
            pointBorderColor: "rgba(0,192,192,1)",
            pointBackgroundColor: "#fff",
            pointBorderWidth: 0,
            pointHoverRadius: 0,
            pointHoverBackgroundColor: "rgba(0,192,192,0)",
            pointHoverBorderColor: "rgba(220,220,220,0)",
            pointHoverBorderWidth: 0,
            pointRadius: 0,
            pointHitRadius: 0,
            data: [2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2],
            spanGaps: false,
          },
          {
            label: "État réparateur",
            fill: true,
            lineTension: 0.1,
            backgroundColor: "rgba(245,245,34,0.4)",
            borderColor: "rgba(245,200,34,1)",
            borderCapStyle: 'butt',
            borderDash: [],
            borderDashOffset: 0.0,
            borderJoinStyle: 'miter',
            pointBorderColor: "rgba(0,192,192,1)",
            pointBackgroundColor: "#fff",
            pointBorderWidth: 0,
            pointHoverRadius: 0,
            pointHoverBackgroundColor: "rgba(0,192,192,0)",
            pointHoverBorderColor: "rgba(220,220,220,0)",
            pointHoverBorderWidth: 0,
            pointRadius: 0,
            pointHitRadius: 0,
            data: [3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3],
            spanGaps: false,
          },
          {
            label: "Problèmes d'apprentissage",
            fill: true,
            lineTension: 0.1,
            backgroundColor: "rgba(245,20,34,0.3)",
            borderColor: "rgba(245,20,34,1)",
            borderCapStyle: 'butt',
            borderDash: [],
            borderDashOffset: 0.0,
            borderJoinStyle: 'miter',
            pointBorderColor: "rgba(0,192,192,1)",
            pointBackgroundColor: "#fff",
            pointBorderWidth: 0,
            pointHoverRadius: 0,
            pointHoverBackgroundColor: "rgba(0,192,192,0)",
            pointHoverBorderColor: "rgba(220,220,220,0)",
            pointHoverBorderWidth: 0,
            pointRadius: 0,
            pointHitRadius: 0,
            data: [4.5,4.5,4.5,4.5,4.5,4.5,4.5,4.5,4.5,4.5,4.5,4.5,4.5,4.5,4.5,4.5,4.5,4.5,4.5,4.5,4.5,4.5,4.5,4.5,4.5,4.5,4.5,4.5,4.5],
            spanGaps: false,
          }
        ]
      }
  
    });
  
    this.gamma = new Chart(this.freqGamma.nativeElement, {
  
      type: 'line',
      data: {
        labels: this.timeStamp,
        datasets: [
          {
            label: "Fréquence Gamma",
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
            data: this.frequenceGamma,
            spanGaps: true,
            
          },
  
          {
            label: "Dépression",
            fill: true,
            lineTension: 0.1,
            backgroundColor: "rgba(50,20,192,0.5)",
            borderColor: "rgba(50,20,192,1)",
            borderCapStyle: 'butt',
            borderDash: [],
            borderDashOffset: 0.0,
            borderJoinStyle: 'miter',
            pointBorderColor: "rgba(0,192,192,1)",
            pointBackgroundColor: "#fff",
            pointBorderWidth: 0,
            pointHoverRadius: 0,
            pointHoverBackgroundColor: "rgba(0,192,192,0)",
            pointHoverBorderColor: "rgba(220,220,220,0)",
            pointHoverBorderWidth: 0,
            pointRadius: 0,
            pointHitRadius: 0,
            data: [60,60,60,60,60,60,60,60,60,60,60,60,60,60,60,60,60,60,60,60,60,60,60,60,60,60,60,60,60],
            spanGaps: false,
          },
          {
            label: "Cognition, apprentissage",
            fill: true,
            lineTension: 0.1,
            backgroundColor: "rgba(245,245,34,0.4)",
            borderColor: "rgba(245,200,34,1)",
            borderCapStyle: 'butt',
            borderDash: [],
            borderDashOffset: 0.0,
            borderJoinStyle: 'miter',
            pointBorderColor: "rgba(0,192,192,1)",
            pointBackgroundColor: "#fff",
            pointBorderWidth: 0,
            pointHoverRadius: 0,
            pointHoverBackgroundColor: "rgba(0,192,192,0)",
            pointHoverBorderColor: "rgba(220,220,220,0)",
            pointHoverBorderWidth: 0,
            pointRadius: 0,
            pointHitRadius: 0,
            data: [80,80,80,80,80,80,80,80,80,80,80,80,80,80,80,80,80,80,80,80,80,80,80,80,80,80,80,80,80],
            spanGaps: true,
          },
          {
            label: "Anxieté, éveil, stress",
            fill: true,
            lineTension: 0.1,
            backgroundColor: "rgba(245,20,34,0.3)",
            borderColor: "rgba(245,20,34,1)",
            borderCapStyle: 'butt',
            borderDash: [],
            borderDashOffset: 0.0,
            borderJoinStyle: 'miter',
            pointBorderColor: "rgba(0,192,192,1)",
            pointBackgroundColor: "#fff",
            pointBorderWidth: 0,
            pointHoverRadius: 0,
            pointHoverBackgroundColor: "rgba(0,192,192,0)",
            pointHoverBorderColor: "rgba(220,220,220,0)",
            pointHoverBorderWidth: 0,
            pointRadius: 0,
            pointHitRadius: 0,
            data: [100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100],
            spanGaps: false,
          }
        ]
      }
  
    });
  
    this.beta = new Chart(this.freqBeta.nativeElement, {
  
      type: 'line',
      data: {
        labels: this.timeStamp,
        datasets: [
          {
            label: "Fréquence Beta",
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
            data: this.frequenceBeta,
            spanGaps: true,
            
          },
          {
            label: "Rêverie, dépression",
            fill: true,
            lineTension: 0.1,
            backgroundColor: "rgba(50,20,192,0.5)",
            borderColor: "rgba(50,20,192,1)",
            borderCapStyle: 'butt',
            borderDash: [],
            borderDashOffset: 0.0,
            borderJoinStyle: 'miter',
            pointBorderColor: "rgba(0,192,192,1)",
            pointBackgroundColor: "#fff",
            pointBorderWidth: 0,
            pointHoverRadius: 0,
            pointHoverBackgroundColor: "rgba(0,192,192,0)",
            pointHoverBorderColor: "rgba(220,220,220,0)",
            pointHoverBorderWidth: 0,
            pointRadius: 0,
            pointHitRadius: 0,
            data: [15,15,15,15,15,15,15,15,15,15,15,15,15,15,15,15,15,15,15,15,15,15,15,15,15,15,15,15,15],
            spanGaps: false,
          },
          {
            label: "Concentration, mémoire",
            fill: true,
            lineTension: 0.1,
            backgroundColor: "rgba(245,245,34,0.4)",
            borderColor: "rgba(245,200,34,1)",
            borderCapStyle: 'butt',
            borderDash: [],
            borderDashOffset: 0.0,
            borderJoinStyle: 'miter',
            pointBorderColor: "rgba(0,192,192,1)",
            pointBackgroundColor: "#fff",
            pointBorderWidth: 0,
            pointHoverRadius: 0,
            pointHoverBackgroundColor: "rgba(0,192,192,0)",
            pointHoverBorderColor: "rgba(220,220,220,0)",
            pointHoverBorderWidth: 0,
            pointRadius: 0,
            pointHitRadius: 0,
            data: [30,30,30,30,30,30,30,30,30,30,30,30,30,30,30,30,30,30,30,30,30,30,30,30,30,30,30,30,30],
            spanGaps: true,
          },
          {
            label: "Adrénaline, forte excitation, stress",
            fill: true,
            lineTension: 0.1,
            backgroundColor: "rgba(245,20,34,0.3)",
            borderColor: "rgba(245,20,34,1)",
            borderCapStyle: 'butt',
            borderDash: [],
            borderDashOffset: 0.0,
            borderJoinStyle: 'miter',
            pointBorderColor: "rgba(0,192,192,1)",
            pointBackgroundColor: "#fff",
            pointBorderWidth: 0,
            pointHoverRadius: 0,
            pointHoverBackgroundColor: "rgba(0,192,192,0)",
            pointHoverBorderColor: "rgba(220,220,220,0)",
            pointHoverBorderWidth: 0,
            pointRadius: 0,
            pointHitRadius: 0,
            data: [40,40,40,40,40,40,40,40,40,40,40,40,40,40,40,40,40,40,40,40,40,40,40,40,40,40,40,40,40],
            spanGaps: false,
          }
        ]
      }
  
    });
  
    this.theta = new Chart(this.freqTheta.nativeElement, {
  
      type: 'line',
      data: {
        labels: this.timeStamp,
        datasets: [
          {
            label: "Fréquence Theta",
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
            data: this.frequenceTheta,
            spanGaps: true,
            
          }, {
            label: "Anxiété",
            fill: true,
            lineTension: 0.1,
            backgroundColor: "rgba(50,20,192,0.5)",
            borderColor: "rgba(50,20,192,1)",
            borderCapStyle: 'butt',
            borderDash: [],
            borderDashOffset: 0.0,
            borderJoinStyle: 'miter',
            pointBorderColor: "rgba(0,192,192,1)",
            pointBackgroundColor: "#fff",
            pointBorderWidth: 0,
            pointHoverRadius: 0,
            pointHoverBackgroundColor: "rgba(0,192,192,0)",
            pointHoverBorderColor: "rgba(220,220,220,0)",
            pointHoverBorderWidth: 0,
            pointRadius: 0,
            pointHitRadius: 0,
            data: [5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5],
            spanGaps: false,
          },
          {
            label: "Créativité",
            fill: true,
            lineTension: 0.1,
            backgroundColor: "rgba(245,245,34,0.4)",
            borderColor: "rgba(245,200,34,1)",
            borderCapStyle: 'butt',
            borderDash: [],
            borderDashOffset: 0.0,
            borderJoinStyle: 'miter',
            pointBorderColor: "rgba(0,192,192,1)",
            pointBackgroundColor: "#fff",
            pointBorderWidth: 0,
            pointHoverRadius: 0,
            pointHoverBackgroundColor: "rgba(0,192,192,0)",
            pointHoverBorderColor: "rgba(220,220,220,0)",
            pointHoverBorderWidth: 0,
            pointRadius: 0,
            pointHitRadius: 0,
            data: [7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7],
            spanGaps: false,
          },
          {
            label: "Hyperactivité",
            fill: true,
            lineTension: 0.1,
            backgroundColor: "rgba(245,20,34,0.3)",
            borderColor: "rgba(245,20,34,1)",
            borderCapStyle: 'butt',
            borderDash: [],
            borderDashOffset: 0.0,
            borderJoinStyle: 'miter',
            pointBorderColor: "rgba(0,192,192,1)",
            pointBackgroundColor: "#fff",
            pointBorderWidth: 0,
            pointHoverRadius: 0,
            pointHoverBackgroundColor: "rgba(0,192,192,0)",
            pointHoverBorderColor: "rgba(220,220,220,0)",
            pointHoverBorderWidth: 0,
            pointRadius: 0,
            pointHitRadius: 0,
            data: [8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8],
            spanGaps: false,
          }
        ]
      }
  
    });
  
    this.alpha = new Chart(this.freqAlpha.nativeElement, {
  
      type: 'line',
      data: {
        labels: this.timeStamp,
        datasets: [
          {
            label: "Fréquence Alpha",
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
            data: this.frequenceAlpha,
            spanGaps: true,
            
          },
          {
            label: "Anxieté, stress élevé, insomnie",
            fill: true,
            lineTension: 0.1,
            backgroundColor: "rgba(245,20,34,0.5)",
            borderColor: "rgba(245,20,34,1)",
            borderCapStyle: 'butt',
            borderDash: [],
            borderDashOffset: 0.0,
            borderJoinStyle: 'miter',
            pointBorderColor: "rgba(0,192,192,1)",
            pointBackgroundColor: "#fff",
            pointBorderWidth: 0,
            pointHoverRadius: 0,
            pointHoverBackgroundColor: "rgba(0,192,192,0)",
            pointHoverBorderColor: "rgba(220,220,220,0)",
            pointHoverBorderWidth: 0,
            pointRadius: 0,
            pointHitRadius: 0,
            data: [9.5,9.5,9.5,9.5,9.5,9.5,9.5,9.5,9.5,9.5,9.5,9.5,9.5,9.5,9.5,9.5,9.5,9.5,9.5,9.5,9.5,9.5,9.5,9.5,9.5,9.5,9.5,9.5,9.5],
            spanGaps: true,
          },
          {
            label: "Relaxation",
            fill: true,
            lineTension: 0.1,
            backgroundColor: "rgba(32,227,52,0.4)",
            borderColor: "rgba(32,227,52,1)",
            borderCapStyle: 'butt',
            borderDash: [],
            borderDashOffset: 0.0,
            borderJoinStyle: 'miter',
            pointBorderColor: "rgba(0,192,192,1)",
            pointBackgroundColor: "#fff",
            pointBorderWidth: 0,
            pointHoverRadius: 0,
            pointHoverBackgroundColor: "rgba(0,192,192,0)",
            pointHoverBorderColor: "rgba(220,220,220,0)",
            pointHoverBorderWidth: 0,
            pointRadius: 0,
            pointHitRadius: 0,
            data: [11,11,11,11,11,11,11,11,11,11,11,11,11,11,11,11,11,11,11,11,11,11,11,11,11,11,11,11,11],
            spanGaps: true,
          },
          {
            label: "Trop relaxé",
            fill: true,
            lineTension: 0.1,
            backgroundColor: "rgba(255,159,15,0.3)",
            borderColor: "rgba(255,159,15,1)",
            borderCapStyle: 'butt',
            borderDash: [],
            borderDashOffset: 0.0,
            borderJoinStyle: 'miter',
            pointBorderColor: "rgba(0,192,192,1)",
            pointBackgroundColor: "#fff",
            pointBorderWidth: 0,
            pointHoverRadius: 0,
            pointHoverBackgroundColor: "rgba(0,192,192,0)",
            pointHoverBorderColor: "rgba(220,220,220,0)",
            pointHoverBorderWidth: 0,
            pointRadius: 0,
            pointHitRadius: 0,
            data:  [13,13,13,13,13,13,13,13,13,13,13,13,13,13,13,13,13,13,13,13,13,13,13,13,13,13,13,13,13],
            spanGaps: false,
          }
        ]
      }
  
    });
  
  
  
  }
  }