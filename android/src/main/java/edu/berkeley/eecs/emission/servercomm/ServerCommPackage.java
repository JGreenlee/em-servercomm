package edu.berkeley.eecs.emission.cordova.comm;

import org.apache.cordova.*;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import android.content.Context;
import edu.berkeley.eecs.emission.cordova.comm.CommunicationHelper;
import edu.berkeley.eecs.emission.cordova.connectionsettings.ConnectionSettings;

public class CommunicationHelperPlugin extends CordovaPlugin {
    @Override
    public boolean execute(String action, JSONArray data, final CallbackContext callbackContext) throws JSONException {
        if (action.equals("pushGetJSON")) {
            try {
                final Context ctxt = cordova.getActivity();
                String relativeURL = data.getString(0);
                final JSONObject filledMessage = data.getJSONObject(1);

                String commuteTrackerHost = ConnectionSettings.getConnectURL(ctxt);
                final String fullURL = commuteTrackerHost + relativeURL;

                cordova.getThreadPool().execute(new Runnable() {
                    public void run() {
                        try {
                String resultString = CommunicationHelper.pushGetJSON(ctxt, fullURL, filledMessage);
                callbackContext.success(new JSONObject(resultString));
            } catch (Exception e) {
                callbackContext.error("While pushing/getting from server "+e.getMessage());
            }
                    }
                });
            } catch (Exception e) {
                callbackContext.error("While pushing/getting from server "+e.getMessage());
            }
            return true;
        } else {
            return false;
        }
    }
}

