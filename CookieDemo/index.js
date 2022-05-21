// Cookies are data stored in browsers as key:value pairs that allow websites to change preferences or states, or track
// users and teir behaviour in the website.


/* 


req.cookies:

When using cookie-parser middleware, this property is an object that contains cookies sent by the request. 
If the request contains no cookies, it defaults to {}.

// Cookie: name=tj
console.dir(req.cookies.name)
// => "tj"

If the cookie has been signed, you have to use req.signedCookies.

For more information, issues, or concerns, see cookie-parser.




req.signedCookies:

When using cookie-parser middleware, this property contains signed cookies sent by the request, unsigned and ready 
for use. Signed cookies reside in a different object to show developer intent; otherwise, a malicious attack could 
be placed on req.cookie values (which are easy to spoof). Note that signing a cookie does not make it “hidden” or 
encrypted; but simply prevents tampering (because the secret used to sign is private).

If no signed cookies are sent, the property defaults to {}.

// Cookie: user=tobi.CP7AWaXDfAKIRfH49dQzKJx7sKzzSoPq7/AcBBRVwlI3
console.dir(req.signedCookies.user)
// => "tobi"





res.cookie(name, value [, options]):

Sets cookie name to value. The value parameter may be a string or object converted to JSON.

The options parameter is an object that can have the following properties:

    - domain[String]: 	Domain name for the cookie. Defaults to the domain name of the app.
    - encode[Function]: 	A synchronous function used for cookie value encoding. Defaults to encodeURIComponent.
    - expires[Date]: 	Expiry date of the cookie in GMT. If not specified or set to 0, creates a session cookie.
    - httpOnly[Boolean]: 	Flags the cookie to be accessible only by the web server.
    - maxAge[Number]: 	Convenient option for setting the expiry time relative to the current time in milliseconds.
    - path[String]: 	Path for the cookie. Defaults to “/”.
    - secure[Boolean]: 	Marks the cookie to be used with HTTPS only.
    - signed[Boolean]: 	Indicates if the cookie should be signed.
    - sameSite[Boolean or String]: 	Value of the “SameSite” Set-Cookie attribute. More information at 
                                    https://tools.ietf.org/html/draft-ietf-httpbis-cookie-same-site-00#section-4.1.1.

All res.cookie() does is set the HTTP Set-Cookie header with the options provided. Any option not specified defaults 
to the value stated in RFC 6265.

For example:

res.cookie('name', 'tobi', { domain: '.example.com', path: '/admin', secure: true })
res.cookie('rememberme', '1', { expires: new Date(Date.now() + 900000), httpOnly: true })

The encode option allows you to choose the function used for cookie value encoding. Does not support asynchronous 
functions.

Example use case: You need to set a domain-wide cookie for another site in your organization. This other site 
(not under your administrative control) does not use URI-encoded cookie values.

// Default encoding
res.cookie('some_cross_domain_cookie', 'http://mysubdomain.example.com', { domain: 'example.com' })
// Result: 'some_cross_domain_cookie=http%3A%2F%2Fmysubdomain.example.com; Domain=example.com; Path=/'

// Custom encoding
res.cookie('some_cross_domain_cookie', 'http://mysubdomain.example.com', { domain: 'example.com', encode: String })
// Result: 'some_cross_domain_cookie=http://mysubdomain.example.com; Domain=example.com; Path=/;'

The maxAge option is a convenience option for setting “expires” relative to the current time in milliseconds. 
The following is equivalent to the second example above.

res.cookie('rememberme', '1', { maxAge: 900000, httpOnly: true })

You can pass an object as the value parameter; it is then serialized as JSON and parsed by bodyParser() middleware.

res.cookie('cart', { items: [1, 2, 3] })
res.cookie('cart', { items: [1, 2, 3] }, { maxAge: 900000 })

When using cookie-parser middleware, this method also supports signed cookies. Simply include the signed option set 
to true. Then res.cookie() will use the secret passed to cookieParser(secret) to sign the value.

res.cookie('name', 'tobi', { signed: true })

Later you may access this value through the req.signedCookies object.




res.clearCookie(name [, options]):

Clears the cookie specified by name. For details about the options object, see res.cookie().

Web browsers and other compliant clients will only clear the cookie if the given options is identical to those given 
to res.cookie(), excluding expires and maxAge.

res.cookie('name', 'tobi', { path: '/admin' })
res.clearCookie('name', { path: '/admin' })



*/



const express = require('express');
const app = express();
const cookieParser = require('cookie-parser'); // To parse and decode cookies in requests and expose it as 'req.cookies'
// app.use(cookieParser()); // Mp secret string is given here for signing the cookies
app.use(cookieParser('thisismysecret')); // using secret string to sign and verify cookies

app.get('/greet', (req, res) => {
    // console.log(req.cookies);
    // cookie values persist across different tabs, even if you close and reopen the same browser. However,
    // the cookies are lost when you open the route in another Browser
    // Cookies can also be signed using a secret string that can be used to verify their integrity when they are recieved.
    const { name = 'Anonymous' } = req.cookies; // destructuring cookies with a default when the key is not present
    res.send(`Hey there ${name}`);
});

app.get('/setName', (req, res) => {
    res.cookie('name', 'Batman'); // creating and sending a cookie with the key - value pair {name: stevie}.
    // If you change the value of the cookie and send a request again to the path, the cookie value will be updated
    // in the Browser. Infact, every request sent to this path update the cookie value.
    res.cookie('animal', 'cat'); // sending second cookie that will also be sent to every request to 'localhost:3000/setName'
    res.send('OKAY, SENT YOU A COOKIE');
});

app.get('/getsignedcookie', (req, res) => {
    res.cookie('fruit', 'mango', { signed: true }); // Creating a signed cookie {fruit: mango}
    res.send('OKAY, SIGNED YOUR FRUIT COOKIE!');
})

app.get('/verifyfruit', (req, res) => {
    console.log(req.cookies); // does not contain the signed cookies
    console.log(req.signedCookies); // containes the signed cookies. 

    // The value of signed cookies look like this: {fruit:"s%3Amango.GiZZzau4JaJQJWO1pFSYV7d3u69T5F9IdvtEI7Ez59U"}

    // If the value of the signed cookie is tampered with
    // or changed, it will not show up in 'req.signedCookies' anymore. In case the actual value embedded in the
    // signature is alone modified or tampered with, the value of the key in 'req.signedCookies' will be 'false' because
    // cookie-parser cannot match the unsigned value to the actual value.
    res.send(req.signedCookies);
})

app.listen(3000, () => {
    console.log('Serving app on localhost:3000');
});


// HMAC - Hash-based Message Authentication Code is generated using the secret string and a Hash function such as SHA256
// to sign and unsign the cookie.
// signed cookies are used to verify integrity (the unmodified raw data) and authenticity (same source of data)
// KEEP IN MIND THAT THERE IS A LIMIT TO THE NUMBER OF COOKIES PER DOMAIN AND THE SIZE OF EACH COOKIE AND THEY ARE
// NOT VERY SECURE. THIS IS A REASON WHY SESSIONS ARE USED TO STORE STATE/USER INFORMATION ON THE SERVER-SIDE AND
// AND AN ID/KEY TO UNLOCK THE SESSION IS STROED IN THE FORM OF A COOKIE. SESSION DATA IS STORED IN A SEPERATE
// DATA STORE AND NOT IN THE DATABASE USED BY THE APP.