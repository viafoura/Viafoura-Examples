const express = require('express')
const app = express()
const port = process.env.PORT || 3000

app.use(express.json());

app.post('/vfWebhook', async (req, res) => {
    if(req.body.events.length > 0){
      let firstEvent = req.body.events[0];
      if(firstEvent.action == "visible"){

      }
    }
    return res.send('Processed');
});

app.listen(port, () => {
  console.log(`App listening on port ${port}`)
})