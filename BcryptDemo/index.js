/* 

BCRYPT USAGE:

async (recommended):

const bcrypt = require('bcrypt');
const saltRounds = 10;
const myPlaintextPassword = 's0/\/\P4$$w0rD';
const someOtherPlaintextPassword = 'not_bacon';

To hash a password:

    -   Technique 1 (generate a salt and hash on separate function calls):

bcrypt.genSalt(saltRounds, function(err, salt) {
    bcrypt.hash(myPlaintextPassword, salt, function(err, hash) {
        // Store hash in your password DB.
    });
});

    -   Technique 2 (auto-gen a salt and hash):

bcrypt.hash(myPlaintextPassword, saltRounds, function(err, hash) {
    // Store hash in your password DB.
});

Note that both techniques achieve the same end-result.

To check a password:

// Load hash from your password DB.
bcrypt.compare(myPlaintextPassword, hash, function(err, result) {
    // result == true
});
bcrypt.compare(someOtherPlaintextPassword, hash, function(err, result) {
    // result == false
});

with promises

bcrypt uses whatever Promise implementation is available in global.Promise. NodeJS >= 0.12 has a native Promise 
implementation built in. However, this should work in any Promises/A+ compliant implementation.

Async methods that accept a callback, return a Promise when callback is not specified if Promise support is available.

bcrypt.hash(myPlaintextPassword, saltRounds).then(function(hash) {
    // Store hash in your password DB.
});

// Load hash from your password DB.
bcrypt.compare(myPlaintextPassword, hash).then(function(result) {
    // result == true
});
bcrypt.compare(someOtherPlaintextPassword, hash).then(function(result) {
    // result == false
});

This is also compatible with async/await

async function checkUser(username, password) {
    //... fetch user from a db etc.

    const match = await bcrypt.compare(password, user.passwordHash);

    if(match) {
        //login
    }

    //...
}

ESM import:

import bcrypt from "bcrypt";

// later
await bcrypt.compare(password, hash);

sync:

const bcrypt = require('bcrypt');
const saltRounds = 10;
const myPlaintextPassword = 's0/\/\P4$$w0rD';
const someOtherPlaintextPassword = 'not_bacon';

To hash a password:

    -   Technique 1 (generate a salt and hash on separate function calls):

const salt = bcrypt.genSaltSync(saltRounds);
const hash = bcrypt.hashSync(myPlaintextPassword, salt);
// Store hash in your password DB.

    -   Technique 2 (auto-gen a salt and hash):

const hash = bcrypt.hashSync(myPlaintextPassword, saltRounds);
// Store hash in your password DB.

As with async, both techniques achieve the same end-result.

To check a password:

// Load hash from your password DB.
bcrypt.compareSync(myPlaintextPassword, hash); // true
bcrypt.compareSync(someOtherPlaintextPassword, hash); // false

Why is async mode recommended over sync mode?

If you are using bcrypt on a simple script, using the sync mode is perfectly fine. However, if you are using bcrypt 
on a server, the async mode is recommended. This is because the hashing done by bcrypt is CPU intensive, so the sync 
version will block the event loop and prevent your application from servicing any other inbound requests or events. 
The async version uses a thread pool which does not block the main event loop.

API:

BCrypt.

    genSaltSync(rounds, minor)
        rounds - [OPTIONAL] - the cost of processing the data. (default - 10)
        minor - [OPTIONAL] - minor version of bcrypt to use. (default - b)
    genSalt(rounds, minor, cb)
        rounds - [OPTIONAL] - the cost of processing the data. (default - 10)
        minor - [OPTIONAL] - minor version of bcrypt to use. (default - b)
        cb - [OPTIONAL] - a callback to be fired once the salt has been generated. uses eio making it asynchronous. 
        If cb is not specified, a Promise is returned if Promise support is available.
            err - First parameter to the callback detailing any errors.
            salt - Second parameter to the callback providing the generated salt.
    hashSync(data, salt)
        data - [REQUIRED] - the data to be encrypted.
        salt - [REQUIRED] - the salt to be used to hash the password. if specified as a number then a salt will be 
        generated with the specified number of rounds and used (see example under Usage).
    hash(data, salt, cb)
        data - [REQUIRED] - the data to be encrypted.
        salt - [REQUIRED] - the salt to be used to hash the password. if specified as a number then a salt will be 
        generated with the specified number of rounds and used (see example under Usage).
        cb - [OPTIONAL] - a callback to be fired once the data has been encrypted. uses eio making it asynchronous. 
        If cb is not specified, a Promise is returned if Promise support is available.
            err - First parameter to the callback detailing any errors.
            encrypted - Second parameter to the callback providing the encrypted form.
    compareSync(data, encrypted)
        data - [REQUIRED] - data to compare.
        encrypted - [REQUIRED] - data to be compared to.
    compare(data, encrypted, cb)
        data - [REQUIRED] - data to compare.
        encrypted - [REQUIRED] - data to be compared to.
        cb - [OPTIONAL] - a callback to be fired once the data has been compared. uses eio making it asynchronous. If 
        cb is not specified, a Promise is returned if Promise support is available.
            err - First parameter to the callback detailing any errors.
            same - Second parameter to the callback providing whether the data and encrypted forms match [true | false].
    getRounds(encrypted) - return the number of rounds used to encrypt a given hash
        encrypted - [REQUIRED] - hash from which the number of rounds used should be extracted.

A Note on Rounds:

A note about the cost. When you are hashing your data the module will go through a series of rounds to give you a 
secure hash. The value you submit there is not just the number of rounds that the module will go through to hash your 
data. The module will use the value you enter and go through 2^rounds iterations of processing.

On a 2GHz core you can roughly expect:

rounds=8 : ~40 hashes/sec
rounds=9 : ~20 hashes/sec
rounds=10: ~10 hashes/sec
rounds=11: ~5  hashes/sec
rounds=12: 2-3 hashes/sec
rounds=13: ~1 sec/hash
rounds=14: ~1.5 sec/hash
rounds=15: ~3 sec/hash
rounds=25: ~1 hour/hash
rounds=31: 2-3 days/hash

A Note on Timing Attacks:

Because it's come up multiple times in this project, and other bcrypt projects, it needs to be said. The bcrypt 
comparison function is not susceptible to timing attacks. From bcrypt-ruby/bcrypt-ruby#42:

    One of the desired properties of a cryptographic hash function is preimage attack resistance, which means there 
    is no shortcut for generating a message which, when hashed, produces a specific digest.

A great thread on this, in much more detail can be found @ bcrypt-ruby/bcrypt-ruby#43

If you're unfamiliar with timing attacks and want to learn more you can find a great writeup @ A Lesson In Timing 
Attacks

However, timing attacks are real. And, the comparison function is not time safe. What that means is that it may exit 
the function early in the comparison process. This happens because of the above. We don't need to be careful that an 
attacker is going to learn anything, and our comparison function serves to provide a comparison of hashes, it is a 
utility to the overall purpose of the library. If you end up using it for something else we cannot guarantee the 
security of the comparator. Keep that in mind as you use the library.

Hash Info:

The characters that comprise the resultant hash are ./ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789$.

Resultant hashes will be 60 characters long and they will include the salt among other parameters, as follows:

$[algorithm]$[cost]$[salt][hash]

    2 chars hash algorithm identifier prefix. "$2a$" or "$2b$" indicates BCrypt
    Cost-factor (n). Represents the exponent used to determine how many iterations 2^n
    16-byte (128-bit) salt, base64 encoded to 22 characters
    24-byte (192-bit) hash, base64 encoded to 31 characters

Example:

$2b$10$nOUIs5kJ7naTuTFkBy1veuK0kSxUFXfuaOKdOKf9xYT0KKIGSJwFa
 |  |  |                     |
 |  |  |                     hash-value = K0kSxUFXfuaOKdOKf9xYT0KKIGSJwFa
 |  |  |
 |  |  salt = nOUIs5kJ7naTuTFkBy1veu
 |  |
 |  cost-factor => 10 = 2^10 rounds
 |
 hash-algorithm identifier => 2b = BCrypt


*/


const bcrypt = require('bcrypt');

// const hashPassword = async (pw) => {
//     const salt = await bcrypt.genSalt(10); // Generating a random salt with 10 rounds of salting
//     const hash = await bcrypt.hash(pw, salt); // Generate hash of salted password
//     console.log(salt);
//     console.log(hash);
// }

// Combine salting and hash generation into a single bcrypt.hash() call
const hashPassword = async (pw) => {
    const hash = await bcrypt.hash(pw, 10); // Generate hash of salted password
    console.log(hash);
}

// Compare the given password hash with stored password hash. You can generate the salt using a seperate genSlat()
// method and then pass it to the hash() method, or you can directly provide the number of salt rounds
const login = async (pw, hashedPw) => {
    const result = await bcrypt.compare(pw, hashedPw);
    if (result) {
        console.log('LOGGED YOU IN. SUCCESSFUL MATCH!');
    } else {
        console.log('INCORRECT, TRY AGAIN!');
    }
}

// hashPassword('monkey');
// login('monkey', '$2b$10$HQkIecKcuJg5G33f7VTMheUTjHrrIO1Qj6hKeAC2doVuS/czI3H/i');
// login('monkey!', '$2b$10$HQkIecKcuJg5G33f7VTMheUTjHrrIO1Qj6hKeAC2doVuS/czI3H/i');
login('monkey', '$2b$10$GcCYRgfZj.Imga4lAEIh/OCg97oKJPhcYqQKMB6tbe9RGDS6r0cd.');