var sys = require('sys');

var Verb = function(kwargs)
{
    this.body = false;
    this.nestables = [];
    this.verbs = [];
    this.attrs = {};

    for(var key in kwargs)
    {
        if(kwargs.hasOwnProperty(key))
        {
            if(key == 'sender')
            {
                key = 'from';
            }
            if(kwargs[key])
            {
                this.attrs[key] = kwargs[key];
            }
        }
    }
};
Verb.prototype = {
    toString: function()
    {
        return this.toxml(true);
    },

    toxml: function(xml_declaration)
    {
        var xml = this.xml();

        if(xml_declaration)
        {
            return '<?xml version="1.0" encoding="utf-8"?>\n' + xml;
        }
        return xml;
    },

    xml: function()
    {
        var el = [];
        el.push('<'+this.name);

        var keys = Object.keys(this.attrs);
        keys.sort();

        for(var i=0, j=keys.length; i<j; i++)
        {
            var key = keys[i];
            el.push(' '+key+'="'+this.attrs[key]+'"');
        }

        el.push('>');

        if(this.body)
        {
            el.push(this.body);
        }

        for(var i=0, j=this.verbs.length; i<j; i++)
        {
            el.push(this.verbs[i].xml());
        }

        el.push('</'+this.name+'>');
        return el.join('');
    },

    append: function(verb)
    {
        if(!this.nestables || this.nestables.indexOf(verb.name) < 0)
        {
            throw new Error(verb.name+ 'is not nestable inside '+self.name);
        }

        this.verbs.push(verb);
        return verb;
    }
};

var Response = function(kwargs)
{
    Verb.call(this, kwargs);
    this.name = 'Reponse';
    this.nestables = [
        'Say',
        'Play',
        'Gather',
        'Record',
        'Dial',
        'Redirect',
        'Pause',
        'Hangup',
        'Reject',
        'Sms',
    ];
};
sys.inherits(Response, Verb);
Response.prototype.say = function(text, kwargs)
{
    return this.append(new Say(text, kwargs));
};
Response.prototype.play = function(url, kwargs)
{
    return this.append(new Play(url, kwargs));
};
Response.prototype.pause = function(length, kwargs)
{
    return this.append(new Pause(length, kwargs));
};
Response.prototype.redirect = function(url, kwargs)
{
    return this.append(new Redirect(url, kwargs));
};
Response.prototype.hangup = function(kwargs)
{
    return this.append(new Hangup(kwargs));
};
Response.prototype.reject = function(reason, kwargs)
{
    return this.append(new Reject(reason, kwargs));
};
Response.prototype.gather = function(method, kwargs)
{
    return this.append(new Gather(method, kwargs));
};
Response.prototype.dial = function(number, kwargs)
{
    return this.append(new Dial(number, kwargs));
};
Response.prototype.record = function(action, method, kwargs)
{
    return this.append(new Record(action, method, kwargs));
};
Response.prototype.sms = function(msg, to, kwargs)
{
    return this.append(new Sms(msg, to, kwargs));
};

var Say = function(text, kwargs)
{
    kwargs = kwargs || {};
    if(kwargs.voice && [Say.MAN, Say.WOMAN].indexOf(kwargs.voice) < 0)
    {
        throw new Error('Invalid Say voice parameter, must be "man" or "woman"');
    }
    if(kwargs.language &&
        [Say.ENGLISH, Say.SPANISH, Say.FRENCH, Say.GERMAN].indexOf(kwargs.language) < 0)
    {
        throw new Error('Invalid Say language parameter, must be "en", "es", "fr", or "de"');
    }
    Verb.call(this, kwargs);
    this.name = 'Say';
    this.body = text;

};
Say.MAN = 'man';
Say.WOMAN = 'woman';
Say.ENGLISH = 'en';
Say.SPANISH = 'es';
Say.FRENCH = 'fr';
Say.GERMAN = 'de';

sys.inherits(Say, Verb);

var Play = function(url, kwargs)
{
    Verb.call(this, kwargs);
    this.name = 'Play';
    this.body = url;
};
sys.inherits(Play, Verb);

var Pause = function(length, kwargs)
{
    kwargs = kwargs || {};
    kwargs['length'] = length;
    Verb.call(this, kwargs);
    this.name = 'Pause';
};
sys.inherits(Pause, Verb);

var Redirect = function(url, method, kwargs)
{
    kwargs = kwargs || {};
    if(method && [Redirect.GET, Redirect.POST].indexOf(method) < 0)
    {
        throw new Error('Invalid method parameter, must be "GET", or "POST"');
    }
    kwargs.method = method;
    Verb.call(this, kwargs);
    this.name = 'Redirect';
};
Redirect.GET = 'GET';
Redirect.POST = 'POST';
sys.inherits(Redirect, Verb);

var Hangup = function(kwargs)
{
    Verb.call(this, {});
    this.name = 'Hangup';
};
sys.inherits(Hangup, Verb);

var Reject = function(reason, kwargs)
{
    kwargs = kwargs || {};
    if(reason)
    {
        kwargs.reason = reason;
    }
    Verb.call(this, kwargs);
    this.name = 'Reject';
};
sys.inherits(Reject, Verb);

var Gather = function(method, kwargs)
{
    kwargs = kwargs || {};
    if(method && [Gather.GET, Gather.POST].indexOf(method) < 0)
    {
        throw new Error('Invalid method parameter, must be "GET", or "POST"');
    }
    if(method)
    {
        kwargs.method = method;
    }
    Verb.call(this, kwargs);
    this.name='Gather';
    this.nestables = ['Say', 'Play', 'Pause'];
};
Gather.GET = 'GET';
Gather.POST = 'POST';
sys.inherits(Gather, Verb);
Gather.prototype.say = function(text, kwargs)
{
    return this.append(new Say(text, kwargs));
};
Gather.prototype.play = function(url, kwargs)
{
    return this.append(new Play(url, kwargs));
};
Gather.prototype.pause = function(length, kwargs)
{
    return this.append(new Pause(length, kwargs));
};

var Number = function(number, kwargs)
{
    kwargs = kwargs || {};
    Verb.call(this, kwargs);
    this.name = 'Number';
    this.body = number;
};
sys.inherits(Number, Verb);

var Sms = function(msg, to, method, kwargs)
{
    kwargs = kwargs || {};
    if(method && [Sms.GET, Sms.POST].indexOf(method) < 0)
    {
        throw new Error('Invalid method parameter, must be "GET", or "POST"');
    }
    kwargs.to = to;
    kwargs.method = method;
    Verb.call(this, kwargs);
    this.name = 'Sms';
    this.body = msg;
};
Sms.GET = 'GET';
Sms.POST = 'POST';
sys.inherits(Sms, Verb);

var Conference = function(name, kwargs)
{
    kwargs = kwargs || {};
    if(kwargs.waitMethod && [Conference.GET, Conference.POST].indexOf(kwargs.waitMethod) < 0)
    {
        throw new Error('Invalid waitMethod parameter, must be "GET", or "POST"');
    }
    Verb.call(this, kwargs);
    this.name = 'Conference';
    this.body = name;
};
Conference.GET = 'GET';
Conference.POST = 'POST';
sys.inherits(Conference, Verb);

var Dial = function(number, kwargs)
{
    kwargs = kwargs || {};
    Verb.call(this, kwargs);
    this.name = 'Dial';
    this.nestables = ['Number', 'Conference'];

    if(number && number.split(',').length > 1)
    {
        var numbers = number.split(',');
        for(var i=0, j=numbers.length; i<j; i++)
        {
            this.append(new Number(numbers[i].replace(/^\s+|\s+$/g, '')));
        }
    }
    else
    {
        this.body = number;
    }
};
sys.inherits(Dial, Verb);
Dial.prototype.number = function(number, kwargs)
{
    return this.append(new Number(number, kwargs));
};
Dial.prototype.conference = function(name, kwargs)
{
    return this.append(new Conference(name, kwargs));
};

var Record = function(action, method, kwargs)
{
    kwargs = kwargs || {};
    if(method && [Record.GET, Record.POST].indexOf(method) < 0)
    {
        throw new Error('Invalid waitMethod parameter, must be "GET", or "POST"');
    }
    kwargs.method = method;
    Verb.call(this, kwargs);
    this.name = 'Record';
};
Record.GET = 'GET';
Record.POST = 'POST';
sys.inherits(Record, Verb);


exports.Response = Response;
exports.Say = Say;
exports.Play = Play;
exports.Pause = Pause;
exports.Redirect = Redirect;
exports.Reject = Reject;
exports.Gather = Gather;
exports.Number = Number;
exports.Sms = Sms;
exports.Conference = Conference;
exports.Dial = Dial;
exports.Record = Record;