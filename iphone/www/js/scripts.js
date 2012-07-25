
function retrieveMapForLocation(latitude, longitude) {
    var url = 'http://maps.google.com/maps/api/staticmap?center=' + latitude + ',' + longitude + '&zoom=15&size=100x100&maptype=roadmap&markers=color:red%7C' + latitude + ',' + longitude + '&sensor=true'
    mapDataView = document.getElementById("mapDataView");
    mapDataView.setAttribute('src', url)
}

function retrieveAddressForLocation(latitude, longitude) {
    
    require(["dojo/_base/xhr", "dojo/dom", "dojo/_base/array", "dojo/domReady!"],
            function(xhr, dom, arrayUtil) {
            
            // Using xhr.get, as very little information is being sent
            xhr.get({
                    url: "http://maps.googleapis.com/maps/api/geocode/json?latlng=" + latitude + ',' + longitude + "&sensor=true",
                    handleAs: "json",
                    // The success callback with result from server
                    load: function(jsonData) {
                    var addressDataView = document.getElementById('addressDataView');
                    addressDataView.innerHTML = jsonData.results[0].formatted_address.replace(/, /g, "\n");                                    
                    urboItem.Location.Address.set('value', jsonData.results[0].formatted_address);
                    },
                    error: function() {
                        addressNotFound();
                    }
                    });
            
            });
    
}

// Photo capture functions
// Called when a photo is successfully retrieved
//
function onPhotoURISuccess(photoURI) {
    urboItem.PhotoSelected = true;
    urboItem.PhotoURI = photoURI;
    
    var photoDataView = document.getElementById('photoDataView');
    photoDataView.style.backgroundImage="url('" + photoURI + "')"
    photoDataView.innerHTML = ""
    
    getGpsCoordinates();

    switchView('getSomePhotoView', 'newMessageView')
}

function switchView(fromView, toView) {
    var w = dijit.byId(fromView);
    w.performTransition(toView,-1,"fade",null);                        
}

function onFail(message) {
    switchView('getSomePhotoView', 'newMessageView')
}

function getPhoto(photoSourceType) {
    navigator.camera.getPicture(onPhotoURISuccess, onFail, { quality: 50, 
                                destinationType: Camera.DestinationType.FILE_URI,
                                sourceType: photoSourceType 
                                });
}

function prepareNewMessage() {
    var photoDataView = document.getElementById('photoDataView')
    photoDataView.style.backgroundImage="";
    photoDataView.innerHTML = "Vybrat foto";
    
    addressNotFound();
    
    clearField('titleDataView');
    clearField('mapDataView');
    mapDataView.src = 'imgs/noMap.jpg'
    
    clearField('descriptionDataView');
    
    getGpsCoordinates();
}

function addressNotFound() {
    urboItem.Location.Address.set('value', 'Adresu se nepodařilo získat! Vyberte ji prosím ručně kliknutím na toto pole nebo obrázek.');
}

function clearField(id) {
    var element = document.getElementById(id);
    element.value = '';
}

function onGpsCoordsSuccess(position) {
    refreshLocation(position.coords.latitude, position.coords.longitude);
}

function refreshLocation(latitude, longitude) {
    urboItem.Location.Latitude.set('value', latitude);
    urboItem.Location.Longitude.set('value', longitude);
    
    console.log("Retrieved GPS coordinates " + urboItem.Location.Latitude + "," + urboItem.Location.Longitude);
    
    retrieveMapForLocation(urboItem.Location.Latitude, urboItem.Location.Longitude);
    retrieveAddressForLocation(urboItem.Location.Latitude, urboItem.Location.Longitude);
}

// onError Callback receives a PositionError object
//
function onGpsCoordsError(error) {
    // Need to get the GPS coords manually by selecting in a map
    urboItem.Location.Latitude.set('value', '');
    urboItem.Location.Longitude.set('value', '');
    urboItem.Location.Address.set('value', '');
    mapDataView.setAttribute('src', '');
    addressNotFound();
}

function getGpsCoordinates() {
    navigator.geolocation.getCurrentPosition(onGpsCoordsSuccess, onGpsCoordsError);
}

function adjustLocation() {
    if(urboItem.Location.Latitude != '') {
        showMapToAdjust('newMessageView', urboItem.Location.Latitude, urboItem.Location.Longitude);
    } else {
        switchView('newMessageView','provideAddressManuallyView');
    }
}

function searchGpsCoordsManually() {
    var addressField = document.getElementById('placeNameForMap');
    console.log(addressField.value);
    var geocoder = new google.maps.Geocoder();
    geocoder.geocode({'address': addressField.value}, 
                     function(results, status) { 
                     if (status == google.maps.GeocoderStatus.OK) { 
                         var loc = results[0].geometry.location;
                         console.log(loc);
                         document.getElementById('googleMapResult').innerHTML = loc.lat() + "," + loc.lng();
                         showMapToAdjust('provideAddressManuallyView', loc.lat(), loc.lng())
                     } 
                     else {
                        document.getElementById('googleMapResult').innerHTML = 'Not found: ' + status;
                     } 
                     });
}

var marker = null;
var map = null;

function createMarker(latlng) {
    var marker = new google.maps.Marker({
                                        position: latlng,
                                        map: map,
                                        zIndex: Math.round(latlng.lat()*-100000)<<5
                                        });
    return marker;
}

function showMapToAdjust(viewFrom, lat, long) {
    switchView(viewFrom,'getLocationManuallyView');
    
    var myOptions = {
    zoom: 15,
    center: new google.maps.LatLng(lat, long),
    mapTypeControl: false,
    zoomControl: true,
    scaleControl: false,
    streetViewControl: false,
    navigationControl: true,
    mapTypeId: google.maps.MapTypeId.ROADMAP
    }
    map = new google.maps.Map(document.getElementById("mapWindow"), myOptions);
    marker = createMarker(map.center)
    
    google.maps.event.addListener(map, 'click', function(event) {
      //call function to create marker
      if (marker) {
        marker.setMap(null);
        marker = null;
      }
      marker = createMarker(event.latLng);
    });
}

function locationManuallySelected() {
    if(marker != null) {
        console.log(marker.position.lat());
        console.log(marker.position.lng());
        refreshLocation(marker.position.lat(), marker.position.lng());
    }
    switchView('getLocationManuallyView','newMessageView');
}

function getSomePhoto() {
    var w = dijit.byId('newMessageView');
    w.performTransition('#getSomePhotoView',1,"fade",null);                        
}

function uploadPhoto() {
    console.log("Uploading photo 1" + urboItem.PhotoURI);
    var options = new FileUploadOptions();
    options.fileKey = "file";
    options.fileName = urboItem.PhotoURI.substr(urboItem.PhotoURI.lastIndexOf('/')+1);
    options.mimeType = "image/jpeg";
    
    var params = new Object();
    params.value1 = "test";
    params.value2 = "param";
    
    options.params = params;
    
    var ft = new FileTransfer();
    ft.upload(urboItem.PhotoURI, "http://localhost:9000", guardInfoUploadSuccess, guardInfoUploadError, options);
    
    console.log("Uploading photo 3" + urboItem.PhotoURI);
}

function uploadData() {
    require(["dojo/_base/xhr", "dojo/dom", "dojo/_base/array", "dojo/domReady!"],
            function(xhr, dom, arrayUtil) {


        var jsonObj = {
            "feedback": {
               "title": urboItem.Title.value,
               "description": urboItem.Description.value,
               "latitude": urboItem.Location.Latitude,
               "longitude": urboItem.Location.Longitude,                       
           }
       }

        var dataToSend = dojo.toJson(jsonObj);
        console.log(dataToSend, typeof dataToSend);

        var xhrArgs = {
            url: "http://localhost:9000/dojo/pokus",
            postData: dataToSend,
            handleAs: "json",
            headers: {"Content-Type": "application/json"},
            load: function(data){
                console.log('Message sent.');              
            },
            error: function(error){        
                console.log('Message sent failed.');                         
            }
        }
        xhr.post(xhrArgs);
    });
}


function guardInfoUploadSuccess(r) {
    console.log("Code = " + r.responseCode);
    console.log("Response = " + r.response);
    console.log("Sent = " + r.bytesSent);
}

function guardInfoUploadError(error) {
    alert("An error has occurred: Code = " + error.code);
}

function setSignature() {
    if(urboItem.Author.Firstname != '' &&  urboItem.Author.Firstname != '') {
        document.getElementById('signature').innerHTML = urboItem.Author.Firstname + ' ' + urboItem.Author.Surname;
    } else {
        document.getElementById('signature').innerHTML = "Prosím vyplnit.";
    }
}

// Profile settings

function setNicknameField() {
    if(document.getElementById('nicknameCB').checked) {
        document.getElementById('nicknameField').value = urboItem.Author.Nickname;
    } else {
        document.getElementById('nicknameField').value = 'Anonymous';       
    }
}

function enteringProfileView() {

    document.getElementById('nicknameField').value = urboItem.Author.Nickname; 
    document.getElementById('firstnameField').value = urboItem.Author.Firstname;
    document.getElementById('surnameField').value = urboItem.Author.Surname;
    document.getElementById('emailField').value = urboItem.Author.Email;
    
    if(urboItem.Author.Nickname != '') {
        document.getElementById('nicknameCB').checked = true;
        document.getElementById('nicknameField').readOnly = false;
    } else {
        document.getElementById('nicknameCB').checked = false;
        document.getElementById('nicknameField').readOnly = true;
    }
    setNicknameField();
    
    switchView('recapView', 'profileView');
}

function saveProfileChanges() {
    if(document.getElementById('nicknameField').value == '' ||
       document.getElementById('firstnameField').value == '' ||
       document.getElementById('surnameField').value == '' ||
       document.getElementById('emailField').value == '') {
        alert('Chybějící údaje\n\nProsím vyplňte všechna pole.');
        return false;
    }
    
    urboItem.Author.Nickname = document.getElementById('nicknameField').value;
    urboItem.Author.Firstname = document.getElementById('firstnameField').value;
    urboItem.Author.Surname = document.getElementById('surnameField').value;
    urboItem.Author.Email = document.getElementById('emailField').value;

    // Persist all profile values to storage
    var store = new Lawnchair({name:'urboProfile'}, function(store) {
        store.save({key:'nickname', value: urboItem.Author.Nickname});
        store.save({key:'firstname', value: urboItem.Author.Firstname});
        store.save({key:'surname', value: urboItem.Author.Surname});
        store.save({key:'email', value: urboItem.Author.Email});
    });

    setSignature();
                              
    switchView('profileView', 'recapView');
}
