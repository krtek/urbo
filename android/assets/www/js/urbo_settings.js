var Urbo = Urbo || {};
Urbo.Settings = Urbo.Settings || {};
Urbo.Settings.Api = Urbo.Settings.Api || {};


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
Urbo.Settings.Api.hostName = "192.168.200.209";
Urbo.Settings.Api.hostPort = "9999";
Urbo.Settings.Api.photoUploadRelativeUrl = "/web/api/v1/uploadPhoto";
Urbo.Settings.Api.urboItemSaveRelativeUrl = "/web/api/v1/case"


Urbo.Settings.Api.getPhotoUploadUrl = function() {
	return this.createFullUrlFor(this.photoUploadRelativeUrl);
};

Urbo.Settings.Api.getUrboItemSaveUrl = function() {
	return this.createFullUrlFor(this.urboItemSaveRelativeUrl);
};


	
	
	