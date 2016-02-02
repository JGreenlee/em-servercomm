/*global cordova, module*/

var exec = require("cordova/exec")

/*
 * While this is the javascript implementation, it does not actually call any
 * native code! That is because it is basically a wrapper around HTTP get and
 * post, just like the corresponding native implementations are. Since the
 * javascript has perfectly good support for HTTP, we don't really need the
 * overhead of going to native. In fact, you could even argue that we don't
 * really need a wrapper here since the default implementation is easy enough
 * to use, but abstracting out the implementation makes it consistent with
 * native code, and simultaneously makes it easier for us to change the library
 * if we switch to a newer and cooler library (websockets? pub/sub? capnproto?).
 */

var ServerCommunication = {
    /*
     * This is only used for communication with our own server. For
     * communication with other services, we can use the standard HTTP
     * libraries from our javascript framework.
     */
    pushGetJson: function(relativeURL, messageFiller, successCallback, errorCallback) {
        var request = new XMLHttpRequest();
        request.setRequestHeader("Content-Type", "application/json");

        request.onreadystatechange = function() {
            if(request.readyState == request.DONE) {
                if (request.status == 200) {
                    var resultObj = JSON.parse(response.responseText);
                    successCallback(resultObj);
                } else {
                    errorCallback(request.statusText);
                }
            } else {
                console.log("during HTTP post, state "+request.readyState);
            }
        };
        window.cordova.plugins.BEMConnectionSettings.getSettings(function(settings) {
            var fullURL = settings.connectUrl + relativeURL;
            window.cordova.plugins.BEMJWTAuth.getJWT(function(token) {
                message = {};
                message.user = token;
                messageFiller(message);
                request.open("POST", fullURL, true);
                request.send(message);
            }, function(error) {
                errorCallback(error);
            })
        }, function(error) {
            errorCallback(error);
        });
    },
    pushJSON: function(relativeUrl, objectLabel, objectJSON, successCallback, errorCallback) {
        var msgFiller = function(message) {
            message[objectLabel] = objectJSON;
        };
        pushGetJSON(relativeUrl, msgFiller, successCallback, errorCallback);
    },
    getUserPersonalData: function(relativeUrl, successCallback, errorCallback) {
        var msgFiller = function(message) {
            // nop. we don't really send any data for what are effectively get calls
        };
        pushGetJSON(relativeUrl, msgFiller, successCallback, errorCallback);
    }
}

module.exports = ServerCommunication;
