<?php
/*
    Viafoura Example PHP Viafoura Defined Cookie Endpoint
    April 22, 2013
*/

// This is what the data you return to Viafoura will look like:
$definedCookie = [
    
    "uid" => "75453", // Users unique ID in your system
    "displayName" => "Ironman", // Name you want displayed beside users comments (users can change this)
    "email" => "tony@starkenterprises.com", // We use emails to notify users of replies and followers if they request it
    "error" => "", // Empty on no error, populated with a string describing the error if there is one.
    "photoURL" => "http://i.imgur.com/mdipQYd.jpg", // Publicly accessible user avatar, will be resized and displayed beside comments, square images work best
    "socialData" => array("data" => "passed", "in" => "from", "any" => "social", "login" => "provider") // pass along any social media data the user has provided your login system.
];

// This is obviously fake, your system would generate and distribute a session id to users
$sessionid = "someKindaSessionID4567";
$cookieName = "loggedinCookie_sid";

// Are we going to process the session and return data? or just show some info?
if ($_REQUEST['sessionVerify']){
    // Viafoura expects properly formated JSON output
    // You can test the syntax of your JSON output here: http://jsonlint.com
    header('Content-Type: application/json');

    // This step would involve a call to your database to make sure that the session exists
    // You might also have to retrieve users detials from your DB in this step
    if ($_REQUEST['sessionVerify'] == $sessionid){
        // We simply convert the PHP object into a JSON array and display it
        echo json_encode($definedCookie);
    }else{
        // Whoops! That's not the right session id!
        echo '{"error": "Bad or expired session id."}';
    }
}else{
    // Set our fake sessionid
    setcookie($cookieName, $sessionid);
?>
<!doctype html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>VF Defined Cookie Login</title>
    <link href="//netdna.bootstrapcdn.com/twitter-bootstrap/2.3.1/css/bootstrap-combined.no-icons.min.css" rel="stylesheet">
   <script>
  (function (v, s) {
    v.type = 'text/javascript';
    v.async = !0;
    v.src = '//cdn.viafoura.net/vf.js';
    s.parentNode.insertBefore(v, s);
  }(document.createElement('script'), document.getElementsByTagName('script')[0]));
</script>
</head>
<body>
    <div id="Holder" style="margin: 20px;">
        <h1>Viafoura Defined Cookie Login</h1>
        The cookie with our fake sid is called "loggedinCookie_sid", it contains: "<?=$sessionid; ?>" <br />
        Set "Viafoura Defined Custom Cookie Endpoint" to:
        <pre>http://<?=$_SERVER['HTTP_HOST'];?>/?sessionVerify=</pre>
        <br />
        Set "Viafoura Defined Custom Cookie Name" to:
        <pre><?=$cookieName; ?></pre>
        <br />
        For this example our user is hardcoded as "logged in".
        Data our end point returns looks like this:
        <pre><?=json_encode($definedCookie); ?></pre>
        <hr />
        <!-- Initalize Viafoura Comments -->
        <div class="viafoura"><div class="vf-comments vf-widget" data-widget="comments" ></div></div>
    </div>
</body>
</html>
<?php
}
