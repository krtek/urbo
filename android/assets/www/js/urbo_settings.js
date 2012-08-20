var Urbo = Urbo || {};
Urbo.Settings = Urbo.Settings || {};
Urbo.Settings.Api = Urbo.Settings.Api || {};
Urbo.Settings.Oauth = Urbo.Settings.Oauth || {};
Urbo.Settings.Oauth.Google = Urbo.Settings.Oauth.Google || {};


/* 
 * @param relativeApiUrl - relative to context of app for example when full address should be 
 * 						   "http://192.168.200.209:8080/web/api/v1/uploadPhoto", relative part is 
 * 						   "/web/api/v1/uploadPhoto"  
 * 
 */
Urbo.Settings.Api.createFullUrlFor = function(relativeApiUrl) {
	
	return this.protocol + "://" + this.hostName + ":" + this.hostPort + relativeApiUrl;
	
};

Urbo.Settings.Api.protocol = "http";
Urbo.Settings.Api.hostName = "urbo.herokuapp.com";
Urbo.Settings.Api.hostPort = "80";
Urbo.Settings.Api.photoUploadRelativeUrl = "/api/v1/uploadPhoto";
Urbo.Settings.Api.urboItemSaveRelativeUrl = "/api/v1/case";

Urbo.Settings.Oauth.Google.CallbackURL = "http://urbo.herokuapp.com/oauth2callback";
Urbo.Settings.Oauth.Google.ClientSecret = "NMaJccwi-j_kHLFYRDTFiUZv";
Urbo.Settings.Oauth.Google.ClientId = "445034773821-iv2qgdkf4a50paekcaq0kkrseolgc00m.apps.googleusercontent.com";


Urbo.Settings.Api.getPhotoUploadUrl = function() {
	return this.createFullUrlFor(this.photoUploadRelativeUrl);
};

Urbo.Settings.Api.getUrboItemSaveUrl = function() {
	return this.createFullUrlFor(this.urboItemSaveRelativeUrl);
};


	
	
	