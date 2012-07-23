function retrieveMapForLocation(gpsCoord) {
    var url = 'http://maps.google.com/maps/api/staticmap?center=' + gpsCoord + '&zoom=15&size=100x100&maptype=roadmap&markers=color:blue%7C' + gpsCoord + '&sensor=true'
    mapDataView = document.getElementById("mapDataView");
    mapDataView.setAttribute('src', url)
}

function retrieveAddressForLocation(gpsCoord) {
    
    require(["dojo/_base/xhr", "dojo/dom", "dojo/_base/array", "dojo/domReady!"],
            function(xhr, dom, arrayUtil) {
            
            // Using xhr.get, as very little information is being sent
            xhr.get({
                    url: "http://maps.googleapis.com/maps/api/geocode/json?latlng=" + gpsCoord + "&sensor=true",
                    handleAs: "json",
                    // The success callback with result from server
                    load: function(jsonData) {
                    var addressDataView = document.getElementById('addressDataView');
                    addressDataView.value = jsonData.results[0].formatted_address.replace(/, /g, "\n");                                    
                    urboItem.LocationAddress.set('value', jsonData.results[0].formatted_address);
                    urboItem.Location.set('value', gpsCoord);
                    },
                    error: function() {
                    addressDataView.value = 'Adresu se nepodařilo získat'
                    }
                    });
            
            });
    
}

// Photo capture functions
// Called when a photo is successfully retrieved
//
function onPhotoURISuccess(photoURI) {
    //                        if((null != imageURI) && ('null' != imageURI) && (imageURI.indexOf('file:') != -1)) {
    urboItem.PhotoSelected = true;
    urboItem.PhotoURI = photoURI;
    
    var photoDataView = document.getElementById('photoDataView');
    photoDataView.style.backgroundImage="url('" + photoURI + "')"
    photoDataView.innerHTML = ""
    //                        }
    switchView('getSomePhotoView', 'dataView')
}

function switchView(fromView, toView) {
    var w = dijit.byId(fromView);
    w.performTransition(toView,-1,"fade",null);                        
}

function onFail(message) {
    switchView('getSomePhotoView', 'dataView')
}

function getPhoto(photoSourceType) {
    navigator.camera.getPicture(onPhotoURISuccess, onFail, { quality: 50, 
                                destinationType: Camera.DestinationType.FILE_URI,
                                sourceType: photoSourceType 
                                });
}

function setNewGuardReport() {
    var photoDataView = document.getElementById('photoDataView')
    photoDataView.style.backgroundImage="";
    photoDataView.innerHTML = "Vybrat foto";
    
    clearField('titleDataView');
    clearField('mapDataView');
    clearField('addressDataView');
    clearField('descriptionDataView');
    
    getGpsCoordinates();
}

function clearField(id) {
    var element = document.getElementById(id);
    element.value = '';
}

function onGpsCoordsSuccess(position) {
    var gpsCoords = position.coords.latitude + "," + position.coords.longitude;
    
    console.log("Retrieved GPS coordinates " + gpsCoords);
    
    urboItem.Location.set('value', gpsCoords);
    
    retrieveMapForLocation(gpsCoords);
    retrieveAddressForLocation(gpsCoords);
}

// onError Callback receives a PositionError object
//
function onGpsCoordsError(error) {
    // Needed to get the GPS coords manually by selecting in a map
    alert('code: '    + error.code    + '\n' +
          'message: ' + error.message + '\n');
}

function getGpsCoordinates() {
    navigator.geolocation.getCurrentPosition(onGpsCoordsSuccess, onGpsCoordsError);
}

function getSomePhoto() {
    var w = dijit.byId('dataView');
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
               "latitude": urboItem.Location.value.split(',')[0],
               "longitude": urboItem.Location.value.split(',')[1],                       
           }
       }

        var dataToSend = dojo.toJson(jsonObj);
        console.log(dataToSend, typeof dataToSend);

        var xhrArgs = {
            url: "http://localhost:9000/dojo/pokus",
            postData: dataToSend,
            handleAs: "json",
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
