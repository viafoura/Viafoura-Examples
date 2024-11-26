const express = require('express')
const router = express.Router();

var request = require("request");

import { Request, Response } from 'express'

const SITE_DOMAIN = "demo.viafoura.com";
const SITE_UUID = "00000000-0000-4000-8000-d47205fca416";

var comments = [];

router.post('/vf-content-webhook', async (req: Request, res: Response) => {
    if(req.body.events){
        let comment = req.body.events[0];
        try {
            let commentObject = await fetchComment(comment.content_container_uuid, comment.content_uuid);
            comments.push(commentObject);
        } catch(e) {
            console.error(e);
        }
    }

    return res.send("Success");
});

router.get('/vf-featured-content', (req: Request, res: Response) => {
    var htmlString = "";
    for(var i = 0; i < comments.length; i++){
        htmlString = htmlString + "<h1>Featured: " + comments[i].content + "</h1></br>";
    }
    return res.send(htmlString);
});

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

export default router;