function onFail(message) {
    alert ("Photo fail!");
}

function onPhotoSuccess(photoURI) {
    console.log("Selected photo on uri: " + photoURI);
    $("#photoThumbnail").attr("src", photoURI)

}

function getPhoto(photoSourceType) {
    $('.ui-dialog').dialog('close');
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
    navigator.geolocation.getCurrentPosition(onGpsCoordsSuccess, onGpsCoordsError, { enableHighAccuracy: true });
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
    console.log("Photo was successfully uploaded" + response);
    console.log(response.response);
    var photoId = JSON.parse(unescape(response.response)).photoId;
    console.log("Photo id: " + photoId);
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
    $('.ui-dialog').dialog('close')

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
    $('#send_message').text("Odesílám data...");
    var jsonObj = {
        "feedback": {
            "title": $("#title").val(),
            "description": $("#description").val(),
            "latitude": $('body').data('latitude'),
            "longitude": $('body').data('longitude'),
            "photo_id": photoId,
            "identification": $('body').data('identification'),
            "provider": $('body').data('provider')

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
            $('#send_message').text("Hotovo.");
            $('.ui-dialog').dialog('close')
            $.mobile.changePage('#menu','flip',false,true)

    }).fail(function () {
            console.log('Message failed.');
            $('.ui-dialog').dialog('close')
        });
}

function validateData() {
    if (!$('body').data("identification")) {
        $('#error_message').text("Prosím, přihlaš se!")
        $.mobile.changePage('#error_dialog','pop',false,true)
        return false;
    }

    if (!$("#title").val()) {
        $('#error_message').text("Prosím, přidej titulek!")
        $.mobile.changePage('#error_dialog','pop',false,true)
        return false;
    }

    if (!$('body').data('latitude')) {
        $('#error_message').text("Prosím, oprav místo!")
        $.mobile.changePage('#error_dialog','pop',false,true)
        return false;
    }

    if (!$('#photoThumbnail').attr('src')) {
        $('#error_message').text("Prosím, přidej fotku!")
        $.mobile.changePage('#error_dialog','pop',false,true)
        return false;
    }
    return true;
}

function sendUrboItemToServer() { /* save the world */
    if (validateData()) {
        console.log("Sending with user: " + $('body').data("e-mail"));
        $.mobile.changePage('#send_dialog','pop',false,true)
        uploadPhoto(photoUploadSuccessHandler, photoUploadErrorHandler) /* inside photoUploadSuccessHandler it calls uploadData */
    }
}

function dismissDialog() {
    $('.ui-dialog').dialog('close');
}

function googleOAuth() {
    var my_client_id = Urbo.Settings.Oauth.Google.ClientId,
        my_redirect_uri = Urbo.Settings.Oauth.Google.CallbackURL,
        client_secret =  Urbo.Settings.Oauth.Google.ClientSecret;

    var authorize_url = "https://accounts.google.com/o/oauth2/auth";
    authorize_url +=  "?response_type=token";
    authorize_url += "&scope=https://www.googleapis.com/auth/userinfo.email+https://www.googleapis.com/auth/userinfo.profile";
    authorize_url += "&client_id=" + my_client_id;
    authorize_url += "&redirect_uri=" + my_redirect_uri;

    client_browser = window.plugins.childBrowser;

    console.log('Opening authorize URL: ' + authorize_url);
    client_browser.onLocationChange = function(loc){
        if (loc.indexOf(Urbo.Settings.Oauth.Google.CallbackURL) > -1) {
            var access_token = loc.match(/access_token=(.*)$/)[1]
            console.log('Access token is: ' + access_token);
            client_browser.close();
            console.log('encoded token: ' + encodeURIComponent(access_token));
            console.log('encoded uri: ' + encodeURIComponent(my_redirect_uri));

            $.ajax({
                headers: {"Content-Type": "application/json"},
                type: "GET",
                url: "https://www.googleapis.com/oauth2/v2/userinfo?access_token=" + access_token,
                context: document.body,
                dataType: "json"
            }).done(function(data) {
                    console.log('Obtained profile: ' + JSON.stringify(data));

                    console.log('email: ' + data.email);
                    $('body').data("identification", data.email);
                    $('body').data("provider", "GOOGLE");
                    //this is not in the response :/
                    //$('body').data("first_name", data.given_name);
                    //$('body').data("family_name", data.family_name);
                    $('#login_button .ui-btn-text').text(data.email)

                }).fail(function (data) {
                    console.log('Profile request failed: ' + JSON.stringify(data));
                }
            );
        }
    };

    if (client_browser != null) {
        client_browser.showWebPage(authorize_url);
    }
}

function facebookOAuth() {
    var my_client_id = Urbo.Settings.Oauth.Facebook.ClientId,
        my_redirect_uri = Urbo.Settings.Oauth.Facebook.CallbackURL,
        client_secret =  Urbo.Settings.Oauth.Facebook.ClientSecret;

    var authorize_url = "https://m.facebook.com/dialog/oauth";
    authorize_url +=  "?response_type=token";
    authorize_url += "&scope=user_about_me+email";
    //authorize_url += "&scope=https://www.googleapis.com/auth/userinfo.profile"; returns name etc.
    authorize_url += "&client_id=" + my_client_id;
    authorize_url += "&redirect_uri=" + my_redirect_uri;

    client_browser = window.plugins.childBrowser;

    console.log('Opening authorize URL: ' + authorize_url);
    client_browser.onLocationChange = function(loc){
        if (loc.indexOf(Urbo.Settings.Oauth.Facebook.CallbackURL) > -1) {
            var access_token = loc.match(/access_token=(.*)$/)[1]
            console.log('Access token is: ' + access_token);
            client_browser.close();
            console.log('encoded token: ' + encodeURIComponent(access_token));
            console.log('encoded uri: ' + encodeURIComponent(my_redirect_uri));

            $.ajax({
                headers: {"Content-Type": "application/json"},
                type: "GET",
                url: "https://graph.facebook.com/me?access_token=" + access_token,
                context: document.body,
                dataType: "json"
            }).done(function(data) {
                    console.log('Obtained profile: ' + JSON.stringify(data));

                    console.log('email: ' + data.email);
                    $('body').data("identification", data.email);
                    $('body').data("provider", "FACEBOOK");
                    //this is not in the response :/
                    //$('body').data("first_name", data.given_name);
                    //$('body').data("family_name", data.family_name);
                    $('#login_button .ui-btn-text').text(data.email)

                }).fail(function (data) {
                    console.log('Profile request failed: ' + JSON.stringify(data));
                }
            );
        }
    };


    if (client_browser != null) {
        client_browser.showWebPage(authorize_url);
    }
}



/**
 * Allows anonymous case submission.
 */
function anonAuth() {
    $('body').data("identification", "Anonymní zbabělec");
    $('body').data("provider", "NONE");
    $('#login_button .ui-btn-text').text($('body').data("identification"));
    return true;
}

function newCase() {
    getGpsCoordinates();
    $("#title").val(null);
    $("#description").val(null);
    $('#photoThumbnail').attr('src', null);
    //$.mobile.changePage('#create','flip',false,true);
}
