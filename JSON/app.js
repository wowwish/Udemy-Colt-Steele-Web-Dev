
// THIS IS A STRING OF JSON
const data = `{"ticker":{"base":"BTC","target":"USD","price":"45185.19700329","volume":"14143.45055266","change":"-72.94534633"},"timestamp":1644518828,"success":true,"error":""}`;

// parse the API output JSON string as JS object
console.log(JSON.parse(data));

const parsedData = JSON.parse(data);
console.log("PRICE: ", parsedData.ticker.price);

// We can also convert JS object to JSON to send to an API as input
// elements with undefined value from JS is omitted by JSON.stringify
// In most cases, it doesn’t really matter, because if we parse that string back, 
// and try to access that attribute - it will be undefined by design
// In certain cases we want server to be aware that some data has been explicitly removed
// JSON.stringify accepts a replacer function as second argument. 
// This replacer function can be used to replace undefined with null in JSON

// Without replacer function, owner is lost in the created JSON
const dog = { breed: 'lab', color: 'black', isAlive: true, owner: undefined }
console.log(JSON.stringify(dog));

// With replacer to replace undefined element values with null in JSON
const replacer = (key, value) =>
    typeof value === 'undefined' ? null : value;

console.log(JSON.stringify(dog, replacer))

// Another option using regex
// will fail to work on JSON already containing '__undefined'
console.log(JSON.stringify(dog, (k, v) => (v === undefined) ? '__undefined' : v)
    .replace(/"__undefined"/g, 'undefined'))