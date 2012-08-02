function onFail(message) {
    alert ("Photo fail!");
}

function onPhotoSuccess(photoURI) {
    console.log("Selected photo on uri: " + photoURI);
    $('.ui-dialog').dialog('close')
    $("#photoThumbnail").attr("src", photoURI)

}

function getPhoto(photoSourceType) {
    navigator.camera.getPicture(onPhotoSuccess, onFail, { quality: 50,
        destinationType: Camera.DestinationType.FILE_URI,
        sourceType: photoSourceType
    });
}

function retrieveMapForLocation(latitude, longitude) {
    var url = 'http://maps.google.com/maps/api/staticmap?center=' + latitude + ',' + longitude + '&zoom=15&size=100x100&maptype=roadmap&markers=color:red%7C' + latitude + ',' + longitude + '&sensor=true'
    mapDataView = document.getElementById("mapThumbnail");
    $("#mapThumbnail").attr("src", url)
}

function refreshLocation(latitude, longitude) {
    console.log("Retrieved GPS coordinates " + latitude + "," + longitude);
    $('body').data("latitude", latitude);
    $('body').data("longitude", longitude);
    retrieveMapForLocation(latitude, longitude);
}

function onGpsCoordsSuccess(position) {
    refreshLocation(position.coords.latitude, position.coords.longitude);
}

function onGpsCoordsError(error) {
    $("#mapThumbnail").attr("src", "")
}
function getGpsCoordinates() {
    navigator.geolocation.getCurrentPosition(onGpsCoordsSuccess, onGpsCoordsError);
}

var map, marker;

function createMarker(latlng) {
    var marker = new google.maps.Marker({
        position: latlng,
        map: map,
        zIndex: Math.round(latlng.lat()*-100000)<<5
    });
    return marker;
}

function showMapToAdjust(latitude, longitude) {
    var myOptions = {
        zoom: 15,
        center: new google.maps.LatLng(latitude, longitude),
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
    $('.ui-dialog').dialog('close')
}

function photoUploadSuccessHandler(response) {
    console.debug("Photo was successfully uploaded" + response);
    var photoId = JSON.parse(response.response).photoId;
    uploadData(photoId);
}

function photoUploadErrorHandler(error) {

    var errorInfo = error.code + " - "

    /*
     * founded in apache cordova for android - FileTransfer.java
     *
     *  public static int FILE_NOT_FOUND_ERR = 1;
     *	public static int INVALID_URL_ERR = 2;
     *	public static int CONNECTION_ERR = 3;
     */

    switch (error.code) {

        case 1 :  errorInfo += "file not found"; break;
        case 2 :  errorInfo += "invalid url"; break;
        case 3 :  errorInfo += "connection error"; break;

    }

    console.error("Error occured during photo uploading. Error info: " + errorInfo, error);
    alert("Photo uploading failed. An error has occurred: Error: " + errorInfo);

}


function uploadPhoto(photoUploadSuccessHandler, photoUploadErrorHandler) {
    var photoUri = $('#photoThumbnail').attr('src');
    console.log("Uploading photo: " + photoUri);
    var options = new FileUploadOptions();
    options.fileKey = "file";
    options.fileName = photoUri.substr(photoUri.lastIndexOf('/')+1);
    options.mimeType = "image/jpeg";

    var params = new Object();
    params.value1 = "test";
    params.value2 = "param";

    options.params = params;

    var ft = new FileTransfer();
    ft.upload(photoUri, Urbo.Settings.Api.getPhotoUploadUrl(), photoUploadSuccessHandler, photoUploadErrorHandler, options);

}

function uploadData(photoId) {
    var jsonObj = {
        "feedback": {
            "title": $("#title").val(),
            "description": $("#description").val(),
            "latitude": $('body').data('latitude'),
            "longitude": $('body').data('longitude'),
            "photo_id": photoId
        }
    }
    var dataAsString = JSON.stringify(jsonObj);
    $.ajax({
        headers: {"Content-Type": "application/json"},
        type: "POST",
        url: Urbo.Settings.Api.getUrboItemSaveUrl(),
        data: dataAsString,
        context: document.body
    }).done(function() {
            console.log('Message sent.');
    }).fail(function () {
            console.log('Message failed.');
        });
}

function sendUrboItemToServer() { /* save the world */
    uploadPhoto(photoUploadSuccessHandler, photoUploadErrorHandler) /* inside photoUploadSuccessHandler it calls uploadData */
}
