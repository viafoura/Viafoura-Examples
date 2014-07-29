package com.viafoura.webviewexample;

import android.app.Activity;
import android.os.Bundle;
import android.util.Log;
import android.webkit.WebView;
import android.webkit.WebSettings;
import android.webkit.WebViewClient;
import android.content.Intent;
import android.view.Menu;
import android.view.MenuItem;
import com.viafoura.SocialLoginController;


import com.viafoura.R;

public class WebViewExample extends Activity {


    private static final String TEST_SITE = "http://gusmelo.com/envs/envs.html";

    private android.webkit.WebView mWebView;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        setContentView(R.layout.activity_web_view);

        mWebView = (WebView) findViewById(R.id.activity_web_view);

        // Enable Javascript
        WebSettings webSettings = mWebView.getSettings();
        webSettings.setJavaScriptEnabled(true);

        mWebView.setWebViewClient(new WebViewClient() {

            @Override
            public boolean shouldOverrideUrlLoading(WebView view, String url) {


                if (url.contains(com.viafoura.SocialLoginController.VIAFOURA_SOCIAL_LOGIN_URL)) {

                    Log.i("shouldOverrideUrlLoading", "Caught social login request.  Instantiating Social Login Controller with URL: " + url);

                    Intent slcIntent = new Intent(getApplicationContext(), SocialLoginController.class);

                    slcIntent.putExtra(SocialLoginController.VIAFOURA_SOCIAL_LOGIN_INTENT_URL_KEY, url);

                    startActivityForResult(slcIntent, 1);

                    return true;
                }
                else
                {
                    return false;
                }
            }

        });

        mWebView.loadUrl(TEST_SITE);
    }

    // Listen for results.
    @Override
    protected void onActivityResult(int requestCode, int resultCode, Intent data){
        // See which child activity is calling us back.
        switch (requestCode) {

            case 1:

                switch (resultCode ) {

                    case Activity.RESULT_OK:

                        String postCommand = data.getExtras().getString(SocialLoginController.VIAFOURA_SOCIAL_LOGIN_INTENT_RESULT_KEY);

                        Log.i("onActivityResult", "Caught successful Social Login" + postCommand);

                        mWebView.loadUrl("javascript:" + postCommand, null);

                        break;

                    default:

                        Log.i("onActivityResult", "Caught Social Login cancellation");

                        break;

                }

                break;

            default:
                break;
        }
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
