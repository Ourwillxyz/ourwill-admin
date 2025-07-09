const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const africastalking = require('africastalking');

// Step 1: Paste your Africa's Talking sandbox credentials here:
const username = 'sandbox'; // Use 'sandbox' for sandbox, or your app username for production
const apiKey = 'atsk_10b02077f73cd946a2361ca612707c26b54679d4734f9e8630e9939bec3685898a9bd639'; // <--- Paste your API key between the quotes

const at = africastalking({ username, apiKey });
const sms = at.SMS;

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Step 2: This endpoint will send SMS when called from your frontend:
app.post('/send-sms', async (req, res) => {
  const { to, message } = req.body;
  try {
    const response = await sms.send({ to: [`+${to}`], message });
    res.json({ success: true, response });
  } catch (err) {
    res.json({ success: false, error: err.message });
  }
});

app.listen(5000, () => {
  console.log("Africa's Talking SMS backend running on http://localhost:5000");
});
