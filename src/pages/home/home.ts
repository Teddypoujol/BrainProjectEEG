import { Component, ViewChild, ElementRef } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Geolocation } from '@ionic-native/geolocation';
import { Http } from '@angular/http';

declare var google;

@Component({
  selector: 'home-page',
  templateUrl: 'home.html'
})
export class HomePage {

  @ViewChild('map') mapElement: ElementRef;
  map: any;

  constructor(public navCtrl: NavController, public geolocation: Geolocation) {

  }

  ionViewDidLoad(){
    this.loadMap();
  }

  loadMap(){

    this.geolocation.getCurrentPosition().then((position) => {

      let latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);

      let mapOptions = {
        center: latLng,
        zoom: 15,
        mapTypeId: google.maps.MapTypeId.ROADMAP
      }

      this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);

    }, (err) => {
      console.log(err);
    });

    

  }
  addMarker()
 {
  		let marker = new google.maps.Marker(
  		{
    		     map: this.map,
    		     draggable: true,
	             animation: google.maps.Animation.DROP,
                     //icon: 'https://maps.google.com/mapfiles/kml/shapes/parking_lot_maps.png',
    		    position: this.map.getCenter()
  		});
 
  		let content = "<h4>Information!</h4>";         
 
  		this.addInfoWindow(marker, content);
	}

	addInfoWindow(marker, content)
	{
  		let infoWindow = new google.maps.InfoWindow(
  		{
    		content: content
  		});
 
	  	google.maps.event.addListener(marker, 'click', () => 
	  	{
	    	infoWindow.open(this.map, marker);
	  	});

	     google.maps.event.addListener(marker, 'dragend', function()
             {
                 this.markerlatlong = marker.getPosition();

                 console.log("latlong   "+this.markerlatlong);
                 console.log("lat    "+marker.getPosition().lat());
                 console.log("long   "+marker.getPosition().lng());
             });
}


}