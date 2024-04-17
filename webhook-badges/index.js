const express = require('express')
const app = express()
const port = process.env.PORT || 3000

var request = require("request");

const SITE_DOMAIN = "[REPLACE_BY_YOUR_SITE_DOMAIN]";
const SITE_UUID = "[REPLACE_BY_YOUR_SITE_UUID]";

const USERNAME = "[REPLACE_BY_YOUR_CLIENT_ID]";
const PASSWORD = "[REPLACE_BY_YOUR_CLIENT_SECRET]";

app.use(express.json());

let BADGE_NEW = "new";
let BADGE_MODERATE = "moderate";
let BADGE_PROFESSIONAL = "professional";

app.post('/vfWebhook', async (req, res) => {
    if(req.body.events.length > 0){
      let firstEvent = req.body.events[0];
      if(firstEvent.action == "visible"){
        //let user = await fetchVFUser(firstEvent.actor_uuid);
        let comment = await fetchComment(firstEvent.content_container_uuid, firstEvent.content_uuid);
        let commentProfile = await fetchCommentProfile(firstEvent.actor_uuid);
        let authToken = await authorizeToken();

        try {
          await assignBadgeToUser(authToken, getBadgeForUser(commentProfile), firstEvent.actor_uuid);          
        } catch(error) {
          console.log(error);
        }
      }
    }
    return res.send('Processed');
})

function getBadgeForUser(commentProfile){
  if(commentProfile.content_created < 10){
    return BADGE_NEW
  } else if (commentProfile.content_created < 20){
    return BADGE_MODERATE;
  } else {
    return BADGE_PROFESSIONAL;
  }
}

function authorizeToken(){
  return new Promise(function (resolve, reject) {
    request.post({
      headers: {"Authorization": "Basic " + new Buffer(USERNAME + ":" + PASSWORD).toString("base64")},
      url: "https://auth.viafoura.co/authorize_client",
      form:    { grant_type: "client_credentials", scope: SITE_UUID }
    }, function (error, response, body) {
      if(body){
        var jsonObject = JSON.parse(body);
        resolve(jsonObject.access_token);
      } else {
        reject(error);
      }
    });
  });
}

function assignBadgeToUser(authToken, badgeId, userId){
  return new Promise(function (resolve, reject) {
    request.put({
      headers: {'Authorization' : 'Bearer ' + authToken},
      url: "https://auth.viafoura.co/users/profile/badge",
      json: {
        label: badgeId,
        user_uuid: userId,
      }
    }, function (error, response, body) {
      if(response.statusCode > 200 && response.statusCode < 300){
        resolve();
      } else {
        reject(error);
      }
    });
  });
}

function fetchCommentProfile(userUUID){
  return new Promise(function (resolve, reject) {
    request.get("https://livecomments.viafoura.co/v4/livecomments/" + SITE_UUID + "/" + userUUID +  "/profile", function (error, response, body) {
      if(body){
        var jsonObject = JSON.parse(body);
        resolve(jsonObject);
      } else {
        reject(error);
      }
    });
  });
}


function fetchComment(containerUUID, contentUUID){
  return new Promise(function (resolve, reject) {
    request.get("https://livecomments.viafoura.co/v4/livecomments/" + SITE_UUID + "/" + containerUUID +  "/comments/" + contentUUID + "/single", function (error, response, body) {
      if(body){
        var jsonObject = JSON.parse(body);
        resolve(jsonObject);
      } else {
        reject(error);
      }
    });
  });
}

function fetchVFUser(userUUID){
  return new Promise(function (resolve, reject) {
    request('https://api.viafoura.co/v2/' + SITE_DOMAIN + '/users/' + parseInt(userUUID.split("-").slice(-1)[0], 16), function (error, response, body) {
      if(body){
        var jsonObject = JSON.parse(body);
        resolve(jsonObject.result);
      } else {
        reject(error);
      }
    });
  });
}

app.listen(port, () => {
  console.log(`App listening on port ${port}`)
})