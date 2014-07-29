package com.viafoura;

/**
 * Created by demetree on 2014-07-07.
 */

import android.app.Activity;
import android.os.Bundle;
import android.util.Log;
import android.webkit.WebView;
import android.webkit.WebSettings;
import android.webkit.WebViewClient;
import android.view.Menu;
import android.view.MenuItem;
import android.widget.Button;
import android.view.View;
import android.view.View.OnClickListener;
import android.content.Intent;
import java.net.URL;
import java.net.URLDecoder;
import java.util.Map;
import java.util.LinkedHashMap;


public class SocialLoginController extends Activity {

    public final static String VIAFOURA_SOCIAL_LOGIN_URL = "viafoura-login.hub.loginradius.com/RequestHandlor.aspx";
    public final static String VIAFOURA_SOCIAL_LOGIN_INTENT_URL_KEY = "com.viafoura.SocialLoginController.url";
    public final static String VIAFOURA_SOCIAL_LOGIN_INTENT_RESULT_KEY = "com.viafoura.SocialLoginController.result";
    private final static String VIAFOURA_SOCIAL_LOGIN_SUCCEEDED_URL = "viafoura-login.hub.loginradius.com/success.aspx";

    private android.webkit.WebView mWebView;
    private Button mCloseButton;

    private String callbackURL;
    private String postMessageCommand;
    private boolean successfulSocialLogin;
    private boolean closing;


    @Override
    protected void onCreate(Bundle savedInstanceState) {

        super.onCreate(savedInstanceState);
        setContentView(R.layout.social_login_controller);

        successfulSocialLogin = false;
        callbackURL = "";
        postMessageCommand = "";
        closing = false;


        mWebView = (WebView) findViewById(R.id.activity_web_view);

        // Enable Javascript
        WebSettings webSettings = mWebView.getSettings();
        webSettings.setJavaScriptEnabled(true);

        //
        // Get the URL to go to from the Intent
        //
        Bundle extras = getIntent().getExtras();
        String urlString = extras.getString(SocialLoginController.VIAFOURA_SOCIAL_LOGIN_INTENT_URL_KEY);

        mWebView.setWebViewClient(new WebViewClient() {


            @Override
            public void onPageFinished(WebView view, String urlString) {

                Log.i("SocialLoginController.onPageFinished", urlString);

                if (successfulSocialLogin == true &&
                        urlString.startsWith(callbackURL) &&
                        closing == false) {

                    closing = true;

                    Intent resultIntent = new Intent();

                    resultIntent.putExtra(VIAFOURA_SOCIAL_LOGIN_INTENT_RESULT_KEY, postMessageCommand);

                    setResult(Activity.RESULT_OK, resultIntent);

                    Log.i("SocialLoginController.onPageFinished", "Closing Social Login Controller");

                    finish();
                }

                return;
            }


            @Override
            public boolean shouldOverrideUrlLoading(WebView view, String urlString) {

                Log.i("SocialLoginController.shouldOverrideUrlLoading", urlString);

                //
                // Check if this requests indicates that the social login proess has succeeded.  If it has succeeded,
                // then pull out the token parameter, and use it to build a JavaScript command to later inject into the parent UIWebView.
                //
                if (urlString.contains(SocialLoginController.VIAFOURA_SOCIAL_LOGIN_SUCCEEDED_URL)) {

                    Log.i("SocialLoginController.shouldOverrideUrlLoading", "Caught successful social login.");


                    //
                    // Watch for a successful login, and then flip the logged in flag to true
                    //

                    //
                    // grab the token from the query string.
                    //
                    try {

                        URL url = new URL(urlString);

                        Map<String, String> query_pairs = new LinkedHashMap<String, String>();
                        String query = url.getQuery();
                        String[] pairs = query.split("&");
                        for (String pair : pairs) {
                            int idx = pair.indexOf("=");
                            query_pairs.put(URLDecoder.decode(pair.substring(0, idx), "UTF-8"), URLDecoder.decode(pair.substring(idx + 1), "UTF-8"));
                        }

                        // build the JavaScript post message containing the token.
                        postMessageCommand = "window.postMessage('" + query_pairs.get("token") + "', '*')";

                        Log.i("SocialLoginController.shouldOverrideUrlLoading", "postMessageCommand is: " + postMessageCommand);

                    } catch (Exception ex) {
                        callbackURL = "";
                    }

                    successfulSocialLogin = true;


                }

                // default result
                return false;
            }

        });


        //
        // Look for the callback parameter when loading the social login URL.  Keep it for later.
        //
        if (urlString.contains(com.viafoura.SocialLoginController.VIAFOURA_SOCIAL_LOGIN_URL)) {

            //
            // Read the call back url from the query string.
            //
            try {

                URL url = new URL(urlString);

                Map<String, String> query_pairs = new LinkedHashMap<String, String>();
                String query = url.getQuery();
                String[] pairs = query.split("&");
                for (String pair : pairs) {
                    int idx = pair.indexOf("=");
                    query_pairs.put(URLDecoder.decode(pair.substring(0, idx), "UTF-8"), URLDecoder.decode(pair.substring(idx + 1), "UTF-8"));
                }

                callbackURL = query_pairs.get("callback");

                Log.i("SocialLoginController.shouldOverrideUrlLoading", "Callback URL is: " + callbackURL);
            } catch (Exception ex) {
                callbackURL = "";
            }
        }


        mCloseButton = (Button) findViewById(R.id.close_button);

        mCloseButton.setOnClickListener(new OnClickListener() {

            @Override
            public void onClick(View arg0) {

                Intent resultIntent = new Intent();

                setResult(Activity.RESULT_CANCELED, resultIntent);

                finish();
            }
        });

        // load the social login page.
        mWebView.loadUrl(urlString);
    }


    @Override
    public boolean onCreateOptionsMenu(Menu menu) {
        // Inflate the menu; this adds items to the action bar if it is present.
        getMenuInflater().inflate(R.menu.web_view, menu);
        return true;
    }

    @Override
    public boolean onOptionsItemSelected(MenuItem item) {
        // Handle action bar item clicks here. The action bar will
        // automatically handle clicks on the Home/Up button, so long
        // as you specify a parent activity in AndroidManifest.xml.
        int id = item.getItemId();
        if (id == R.id.action_settings) {
            return true;
        }
        return super.onOptionsItemSelected(item);
    }
}
