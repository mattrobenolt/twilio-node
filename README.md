# twlio-node
  
  A port of [twilio-python](https://github.com/twilio/twilio-python).

  A module for generating valid TwiML.

  * Full TwiML support
  * _Rest API coming soon_

## Installation
  
  _Coming soon_

## Getting Started
  

### Making a Call
  
  _Coming soon_

### Generating TwiML

```javascript
var twilio = require('twilio'),
    Response = twilio.twiml.Response;

var r = new Response();
r.play('monkey.mp3', {loop: 5});
console.log(r.toString());
```

```xml
<?xml version="1.0" encoding="utf-8"?>
<Reponse><Play loop="5">monkey.mp3</Play></Reponse>
```

### Generating Twilio Client Token

```javascript
var twilio = require('twilio'),
    TwilioCapability = twilio.util.TwilioCapability;

var capability = new TwilioCapability('account_sid', 'auth_token');
capability.allow_client_incoming('matt');
capability.allow_client_outgoing('app_sid', 'matt');
console.log(capability.generate());
```

## Known Issues
  
  * Needs REST API

## License 

(The MIT License)

Copyright (c) 2011 Matt Robenolt &lt;root@drund.com&gt;

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
'Software'), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
