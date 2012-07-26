
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
                    urboItem.Location.Address.set('value', jsonData.results[0].formatted_address.replace(/, /g, "\n"));
                    addressDataView.innerHTML = urboItem.Location.Address;                                    
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
function onPhotoSuccess(photoURI) {
    console.log("Selected photo on uri: " + photoURI);
    
    urboItem.Photo.Selected = true;
    urboItem.Photo.URI = photoURI;
    
    var photoDataView = document.getElementById('photoDataView');
    photoDataView.style.backgroundImage = "url('" + photoURI + "')";
    photoDataView.innerHTML = "";

    switchView('getSomePhotoView', 'newMessageView', -1);
}

/*
 Performs switch between two views. The slide transition effect is used. 
*/
function switchView(fromView, toView, direction) {
    var w = dijit.byId(fromView);
    w.performTransition(toView, direction, "slide", null);                        
}

function onFail(message) {
    switchView('getSomePhotoView', 'newMessageView', -1);
}

function getPhoto(photoSourceType) {
    navigator.camera.getPicture(onPhotoSuccess, onFail, { quality: 50, 
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
    urboItem.Location.Address.set('value', 'Adresu se nepodařilo získat! Vyberte ji prosím ručně kliknutím na toto pole nebo obrázek mapy.');
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
        switchView('newMessageView', 'provideAddressManuallyView', 1);
    }
}

function searchGpsCoordsManually() {
    var addressField = document.getElementById('streetCityField');
    console.log(addressField.value);
    var geocoder = new google.maps.Geocoder();
    geocoder.geocode({'address': addressField.value}, 
                     function(results, status) { 
                     if (status == google.maps.GeocoderStatus.OK) { 
                         var loc = results[0].geometry.location;
                         console.log(loc);
                         document.getElementById('locationSearchResult').innerHTML = loc.lat() + "," + loc.lng();
                         showMapToAdjust('provideAddressManuallyView', loc.lat(), loc.lng())
                     } 
                     else {
                        document.getElementById('locationSearchResult').innerHTML = 'Not found: ' + status;
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
    switchView(viewFrom,'getLocationManuallyView', 1);
    
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
    switchView('getLocationManuallyView','newMessageView', -1);
}

function getSomePhoto() {
    switchView('newMessageView', 'getSomePhotoView', 1);
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
    var sign = "";
    if(urboItem.Author.Anonymized) {
        sign = "Anonymní zadavatel";
    }
    else if(urboItem.Author.Firstname != '' || urboItem.Author.Firstname != '') {
        sign = urboItem.Author.Firstname + ' ' + urboItem.Author.Surname;
    } 
    else if(urboItem.Author.Email != '') {
        sign = urboItem.Author.Email;
    }
    else {
        sign = "Prosím vyplnit.";
    }
    document.getElementById('signature').innerHTML = sign;
    urboItem.Author.Signature = sign;
}

// Profile settings

function changeAnonSwitch(state) {
    if(state == "on") {
        document.getElementById('firstnameField').readOnly = true;
        document.getElementById('surnameField').readOnly = true;
        document.getElementById('emailField').readOnly = true;
        urboItem.Author.Anonymized = true;
    } else {
        document.getElementById('firstnameField').readOnly = false;
        document.getElementById('surnameField').readOnly = false;
        document.getElementById('emailField').readOnly = false;
        urboItem.Author.Anonymized = false;
    }
    document.getElementById('anonSwitch').value = state;
}

function enterRecapView() {

    if(urboItem.Title == '') {
        alert('Prosím vyplňte titulek Vaší zprávy.');
        return false;
    }

    if(urboItem.PhotoSelected == false) {
        alert('Prosím přiložte ke zprávě fotografii.');
        return false;
    }
    
    if(urboItem.Location.Latitude == '') {
        alert('Prosím vyberte polohu místa výskytu ručně (kliknutím na obrázek mapy).');
        return false;
    }
    
    if(urboItem.Photo.Selected == true) {
        document.getElementById('photoAttachedCB').checked = true;
    } else {
        document.getElementById('photoAttachedCB').checked = false;
    }
    
    setSignature();
    
    switchView('newMessageView', 'recapView', 1);
}

function enterProfileView() {

    document.getElementById('firstnameField').value = urboItem.Author.Firstname;
    document.getElementById('surnameField').value = urboItem.Author.Surname;
    document.getElementById('emailField').value = urboItem.Author.Email;
    
    document.getElementById('anonSwitch').value = "off";
    
    changeAnonSwitch();
    
    switchView('recapView', 'profileView', 1);
}

function saveProfileChanges() {
    if(document.getElementById('anonSwitch').value == "on") {
        return true;
    }
    if(document.getElementById('emailField').value == '') {
        alert('Chybějící údaje\n\nProsím vyplňte Váš e-mail.');
        return false;
    }
    
    urboItem.Author.Firstname = document.getElementById('firstnameField').value.trim();
    urboItem.Author.Surname = document.getElementById('surnameField').value.trim();
    urboItem.Author.Email = document.getElementById('emailField').value.trim();

    // Persist all profile values to storage
    var store = new Lawnchair({name:'urboAuthor'}, function(store) {
        store.save({key:'firstname', value: urboItem.Author.Firstname});
        store.save({key:'surname', value: urboItem.Author.Surname});
        store.save({key:'email', value: urboItem.Author.Email});
    });

    setSignature();
                              
    switchView('profileView', 'recapView', -1);
}
