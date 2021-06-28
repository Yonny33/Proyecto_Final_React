import React, { Component } from 'react';
import '../node_modules/bootstrap/dist/css/bootstrap.css'
import '../node_modules/font-awesome/css/font-awesome.css'
import Place from './Place';
import Rating from './Rating';
import Horario from './Horario';
import Cercanos from './Cercanos';


class Maps extends Component {
  constructor(props){
    super(props);
    this.state={photo:'',
                muestratodo : false}
  }

  map='';

  

  componentDidMount(){
    const googlePlaceAPILoad = setInterval(() => {
      if (window.google){
        this.google=window.google;
        clearInterval(googlePlaceAPILoad);
        console.log('Load Place API');
        this.directionsService = new this.google.maps.DirectionsService();
        this.directionsRenderer = new this.google.maps.DirectionsRenderer();
        const mapCenter = new this.google.maps.LatLng(4.624335,-74.064644);
        this.map = new this.google.maps.Map(document.getElementById('map'), {
          center: mapCenter,
          zoom: 15
        });
        
        this.showMap(mapCenter)
      };
    },100);
    console.log(this.state.mostrar2)
  }

 

  showMap(mapCenter) {
    
      var map = new window.google.maps.Map(
        document.getElementById('map'), {zoom: 15, center: mapCenter});
        this.directionsRenderer.setMap(map);
      var marker = new window.google.maps.Marker({position: mapCenter, map: map});
  }

  manejoOnClick = (e) => {
    
      var busca =  document.getElementById('origen').value
      const request = {
        query: busca ,
        fields: ['photos', 'formatted_address', 'name','place_id'],
      };
      this.service = new this.google.maps.places.PlacesService(this.map);
      this.service.findPlaceFromQuery(request, this.findPlaceResult);
      document.getElementById('origen').value=''
    
  }

   

  findPlaceResult = (results, status) => {
    var placesTemp=[]
    var placeId = ''
    if (status ===  'OK') {
      results.map((place) => {
        var placePhotos=['']
        const placeTemp = {id:place.place_id, name:place.name,
          address:place.formatted_address,photos:placePhotos}
          placeId = place.place_id;
        placesTemp.push(<Place placeData={placeTemp}/>);
      })
     
    }
    if (placesTemp.length>0)
      this.findPlaceDetail(placeId);
    else{
      const placeTemp = {id:'N/A', name:<div className='mt-5'><strong className='text-center'>
          No hay resultados</strong></div>,
        address:'',photos:['']}
      placesTemp.push(<Place placeData={placeTemp}/>);
      this.setState({places:placesTemp})
    }
  }

  findPlaceDetail = (placeIdFound) => {
    var request = {
      placeId: placeIdFound,
      fields: ['address_component', 'adr_address', 'alt_id', 'formatted_address',
       'icon', 'id', 'name', 'permanently_closed', 'photo', 'place_id', 'plus_code', 'scope', 
       'type', 'url', 'utc_offset', 'vicinity','geometry','rating','reviews','opening_hours']
    };
    this.service.getDetails(request, this.foundPlaceDatail);
  }


  foundPlaceDatail = (place, status) => {
    if (status === 'OK'){
      var placePhotos=['']
      if (place.photos){
        place.photos.map((placePhoto, index) => {
          placePhotos[index]=placePhoto.getUrl({'maxWidth': 160, 'maxHeight': 120})
          if (index === 2) return;
        })
      }
      const placeTemp = {id:place.place_id, name:place.name,
        address:place.formatted_address,photos:placePhotos}
      const placesTemp = <Place placeData={placeTemp}/>;
      const placeHorarios = <Horario horarios={place.opening_hours}/>
      const direccion = <div className='container'>
                          <form class="form-inline mb.2" >
                            <button  class="btn btn-primary mb-2 mr-sm-2" onClick={this.Ruta}  >ir al destino indicado</button>
                            <div></div>
                            <input type="text" class="form-control mb-2 mr-sm-2" value={place.name} id="destino" />
                            <input type="text" class="form-control mb-2 mr-sm-2" placeholder="Lugar de partida" id="origenx" />
                            <select  id="mode" class="form-control mb-2 mr-sm-2" >
                              <option value="DRIVING">Vehiculo</option>
                              <option value="WALKING">Caminar</option>
                              <option value="BICYCLING">Bicicleta</option>
                              <option value="TRANSIT">Transporte publico</option>
                            </select>     
                          </form>
                        </div>  
      var rating=''
      if (place.rating){
        rating = <Rating placeRating={place.rating} placeReviews={place.reviews}/>
      }
      else{
        rating = <div key={1} className='row mt-2 mb-1 pl-3' >
                  <strong>No hay comentarios</strong>
                 </div>;
      }
      console.log('address_component: '+ place.address_component, 
      'adr_address: '+place.adr_address, 'alt_id', 'formatted_address', 'geometry: '+place.geometry,
      'icon: '+place.icon, 'permanently_closed', 'photo',' rating: '+place.rating,
      'type: '+place.type, 'url: '+place.url, 'utc_offset', 'vicinity')
      this.setState({places:placesTemp, 
                     placeRating:rating,
                     placeHorarios:placeHorarios,
                    cercanos: [] ,
                    direccion : direccion,
                    placeLocation : place.geometry.location})                      
      this.showMap(place.geometry.location);
    }
  }

  cambiardestino = (destino) => {
    console.log(destino)
    document.getElementById('origen').value = destino;
    document.getElementById('lugar').click();
  }

  Sitioscercanos = (e) => {
    let request = {
      location: this.state.placeLocation,
      radius: '10000',
    };

    this.service = new this.google.maps.places.PlacesService(this.map);
    this.service.nearbySearch(request, this.callbackSitioscercanos)
  }

  callbackSitioscercanos = (results, status) => {
    if (status == this.google.maps.places.PlacesServiceStatus.OK) {
      console.log("callback received " + results.length + " results");
      window.lugaresCercanos = results
      if (results.length) {
        let SitiosCercanos = results.map((place, index) =>
          <Cercanos key={index} mumero={index} placeData={place}
            Escojerdestino={this.cambiardestino} />)

        this.setState({
          cercanos: SitiosCercanos
        })
      }
    } else console.log("callback.status=" + status);
  }

  Ruta = (e) => {
    e.preventDefault()
    var start = document.getElementById('origenx').value;
    var end = document.getElementById('destino').value;
    var travelMode = document.getElementById('mode').value;
    var request = {
      origin: start,
      destination: end,
      travelMode: travelMode
    };

    var that = this;
    this.directionsService.route(request, function (result, status) {
      console.log(result)
      if (status == 'OK') {
        that.directionsRenderer.setDirections(result);
        document.getElementById('origenx').value =''

        that.setState({
          errorruta :""});

      }
      else if(status== 'NOT_FOUND'){

        that.setState({
          errorruta : "Origen no encontrado escriba lo correctamente"});
        
      }

    });
  }


  render() {
  
      return (
        <div className="Maps" >
          <div className='container border rounded p-3 mt-4' style={{width:'50%'}}>
            <div className='row'>
              <div className='col-4'></div>
              <div className='col-4 text-center'>
                <label><strong>Indica el lugar</strong></label>
              </div>
              <div className='col-4'></div>
            </div>
            <div className='row'>
              <div className='col-4'></div>
              <div className='col-4 py-2'><input id='origen' type='text'/></div>
              <div className='col-4'></div>
            </div>
            <div className='row'>
              <div className='col-4'></div>
              <div className='col-4 text-center'>
                <div className='btn btn-primary text-center' id='lugar' onClick={(e) => this.manejoOnClick(e)}>Buscar Lugar</div>
              </div>
              <div className='col-4'></div>
            </div>
            {this.state.places}
            {this.state.placeHorarios}
            {this.state.placeRating}

            {this.state.places &&
            <div className='row'>
              <div className="col-12">
                <button className="btn btn-primary text-center" onClick={this.Sitioscercanos}>Buscar lugares cercanos</button>
              </div>
            </div>}
            <div className="row row-cols-1 row-cols-md-1 mt-2">
            {this.state.muestratodo ?
              this.state.cercanos :
              this.state.cercanos?.slice(0, 8) }
            </div>

            {this.state.cercanos &&
            <div className="container">
              <div className="mb-3">
                <a href='#' onClick={(e) => {e.preventDefault();this.setState({muestratodo: true });}}>
                  Mostrar más lugares cercanos
                </a>
              </div>
            </div>}          
            
            {this.state.direccion}
            <div className = 'text-center '>{this.state.errorruta}</div>
            <br/>
            <div id="map"></div>
          </div>
        </div>
      );
    }
  
}
export default Maps;
