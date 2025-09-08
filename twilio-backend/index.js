const express = require('express');
const twilio = require('twilio');
const cors = require('cors');
const bodyParser = express.json();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser);

app.post('/make-call', async (req, res) => {
  try {
    console.log('Received call request:', req.body);
    const { phone, message } = req.body;
   
    const twilioSid = process.env.TWILIO_SID || req.body.twilioSid;
    const twilioToken = process.env.TWILIO_TOKEN || req.body.twilioToken;
    const twilioPhone = process.env.TWILIO_PHONE || req.body.twilioPhone;
    
    if (!phone || !message || !twilioSid || !twilioToken || !twilioPhone) {
      console.log('Missing parameters:', { phone, message, hasSid: !!twilioSid, hasToken: !!twilioToken, hasPhone: !!twilioPhone });
      return res.status(400).json({ error: 'Missing required parameters' });
    }
  
    let formattedPhone = phone;
    if (!phone.startsWith('+')) {
      formattedPhone = `+${phone}`;
    }
    
    console.log(`Attempting to make call to ${formattedPhone} from ${twilioPhone}`);
    
    const client = twilio(twilioSid, twilioToken);
    
    const twiml = new twilio.twiml.VoiceResponse();
    twiml.say({ voice: 'alice' }, message);
    
    console.log('TwiML generated:', twiml.toString());
    
    const call = await client.calls.create({
      twiml: twiml.toString(),
      to: formattedPhone,
      from: twilioPhone
    });
    
    console.log('Call successfully initiated with SID:', call.sid);
    res.json({ success: true, callSid: call.sid });
  } catch (error) {
    console.error('Error making Twilio call:', error);
    if (error.code) {
      console.error(`Twilio Error Code: ${error.code}`);
    }
    if (error.message) {
      console.error(`Error Message: ${error.message}`);
    }
    if (error.moreInfo) {
      console.error(`More Info: ${error.moreInfo}`);
    }
    
    res.status(500).json({ 
      error: 'Failed to make call', 
      code: error.code || 'unknown',
      message: error.message || 'Unknown error occurred',
      details: error.toString() 
    });
  }
});

app.get('/', (req, res) => {
  res.send('Twilio calling service is running');
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
}); 