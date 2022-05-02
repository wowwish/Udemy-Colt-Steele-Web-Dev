/* Operation Buffering

Mongoose lets you start using your models immediately, without waiting for mongoose to establish a connection
to MongoDB.

mongoose.connect('mongodb://localhost:27017/myapp');
const MyModel = mongoose.model('Test', new Schema({ name: String }));
// Works
MyModel.findOne(function(error, result) {  ...  });

That's because mongoose buffers model function calls internally. This buffering is convenient, but also a common
source of confusion.Mongoose will not throw any errors by default if you use a model without connecting.

const MyModel = mongoose.model('Test', new Schema({ name: String }));
// Will just hang until mongoose successfully connects
MyModel.findOne(function (error, result) {  ...  });

setTimeout(function () {
    mongoose.connect('mongodb://localhost:27017/myapp');
}, 60000);

To disable buffering, turn off the bufferCommands option on your schema.If you have bufferCommands on and your
connection is hanging, try turning bufferCommands off to see if you haven't opened a connection properly. You can
also disable bufferCommands globally:

mongoose.set('bufferCommands', false);

Note that buffering is also responsible for waiting until Mongoose creates collections if you use the autoCreate
option.If you disable buffering, you should also disable the autoCreate option and use createCollection() to
create capped collections or collections with collations.

const schema = new Schema({
    name: String
}, {
    capped: { size: 1024 },
    bufferCommands: false,
    autoCreate: false // disable `autoCreate` since `bufferCommands` is false
});

const Model = mongoose.model('Test', schema);
// Explicitly create the collection before using it
// so the collection is capped.
await Model.createCollection();

Error Handling

There are two classes of errors that can occur with a Mongoose connection.

   - Error on initial connection.If initial connection fails, Mongoose will emit an 'error' event and the promise
mongoose.connect() returns will reject.However, Mongoose will not automatically try to reconnect.

   - Error after initial connection was established.Mongoose will attempt to reconnect, and it will emit an
'error' event.

To handle initial connection errors, you should use.catch() or try/catch with async/await.

    mongoose.connect('mongodb://localhost:27017/test').
    catch(error => handleError(error));

// Or:
try {
    await mongoose.connect('mongodb://localhost:27017/test');
} catch (error) {
    handleError(error);
}

To handle errors after initial connection was established, you should listen for error events on the connection.
    However, you still need to handle initial connection errors as shown above.

        mongoose.connection.on('error', err => {
            logError(err);
        });

Note that Mongoose does not necessarily emit an 'error' event if it loses connectivity to MongoDB.You should listen
to the disconnected event to report when Mongoose is disconnected from MongoDB.


    Options

The connect method also accepts an options object which will be passed on to the underlying MongoDB driver.

    mongoose.connect(uri, options);

A full list of options can be found on the MongoDB Node.js driver docs for MongoClientOptions.Mongoose passes options to the driver without modification, modulo a few exceptions that are explained below.

    bufferCommands - This is a mongoose - specific option(not passed to the MongoDB driver) that disables Mongoose's buffering mechanism
user / pass - The username and password for authentication.These options are Mongoose - specific, they are equivalent to the MongoDB driver's auth.username and auth.password options.
autoIndex - By default, mongoose will automatically build indexes defined in your schema when it connects.This is great for development, but not ideal for large production deployments, because index builds can cause performance degradation.If you set autoIndex to false, mongoose will not automatically build indexes for any model associated with this connection.
    dbName - Specifies which database to connect to and overrides any database specified in the connection string.This is useful if you are unable to specify a default database in the connection string like with some mongodb + srv syntax connections.

Below are some of the options that are important for tuning Mongoose.

    promiseLibrary - Sets the underlying driver's promise library.

maxPoolSize - The maximum number of sockets the MongoDB driver will keep open for this connection.
    By default, maxPoolSize is 100. Keep in mind that MongoDB only allows one operation per socket at a time,
    so you may want to increase this if you find you have a few slow queries that are blocking faster queries from
proceeding.See Slow Trains in MongoDB and Node.js.You may want to decrease maxPoolSize if you are running into
    connection limits.

    minPoolSize - The minimum number of sockets the MongoDB driver will keep open for this connection.The MongoDB
    driver may close sockets that have been inactive for some time.You may want to increase minPoolSize if you expect
    your app to go through long idle times and want to make sure your sockets stay open to avoid slow trains when
    activity picks up.

    socketTimeoutMS - How long the MongoDB driver will wait before killing a socket due to inactivity after initial
connection.A socket may be inactive because of either no activity or a long - running operation.This is set to
30000 by default, you should set this to 2 - 3x your longest running operation if you expect some of your database
    operations to run longer than 20 seconds.This option is passed to Node.js socket#setTimeout() function after the
    MongoDB driver successfully completes.

    family - Whether to connect using IPv4 or IPv6.This option passed to Node.js' dns.lookup() function. If you don't
    specify this option, the MongoDB driver will try IPv6 first and then IPv4 if IPv6 fails.If your
mongoose.connect(uri) call takes a long time, try mongoose.connect(uri, { family: 4 })

authSource - The database to use when authenticating with user and pass.In MongoDB, users are scoped to a database.
    If you are getting an unexpected login failure, you may need to set this option.

    serverSelectionTimeoutMS - The MongoDB driver will try to find a server to send any given operation to, and keep
    retrying for serverSelectionTimeoutMS milliseconds.If not set, the MongoDB driver defaults to using
30000(30 seconds).

    heartbeatFrequencyMS - The MongoDB driver sends a heartbeat every heartbeatFrequencyMS to check on the status of
    the connection.A heartbeat is subject to serverSelectionTimeoutMS, so the MongoDB driver will retry failed
    heartbeats for up to 30 seconds by default. Mongoose only emits a 'disconnected' event after a heartbeat has
failed, so you may want to decrease this setting to reduce the time between when your server goes down and when
    Mongoose emits 'disconnected'.We recommend you do not set this setting below 1000, too many heartbeats can lead
    to performance degradation.

The serverSelectionTimeoutMS option also handles how long mongoose.connect() will retry initial connection before
erroring out.mongoose.connect() will retry for 30 seconds by default (default serverSelectionTimeoutMS) before
erroring out.To get faster feedback on failed operations, you can reduce serverSelectionTimeoutMS to 5000 as shown
below.

    Example:

const options = {
    autoIndex: false, // Don't build indexes
    maxPoolSize: 10, // Maintain up to 10 socket connections
    serverSelectionTimeoutMS: 5000, // Keep trying to send operations for 5 seconds
    socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
    family: 4 // Use IPv4, skip trying IPv6
};
mongoose.connect(uri, options);

See this page for more information about connectTimeoutMS and socketTimeoutMS
Callback

The connect() function also accepts a callback parameter and returns a promise.

    mongoose.connect(uri, options, function (error) {
        // Check error in initial connection. There is no 2nd param to the callback.
    });

// Or using promises
mongoose.connect(uri, options).then(
    () => {  // ready to use. The `mongoose.connect()` promise resolves to mongoose instance. },
    err => {  // handle initial connection error  }
);

Connection String Options

You can also specify driver options in your connection string as parameters in the query string portion of the URI.
This only applies to options passed to the MongoDB driver.You can't set Mongoose-specific options like bufferCommands
    in the query string.

        mongoose.connect('mongodb://localhost:27017/test?connectTimeoutMS=1000&bufferCommands=false&authSource=otherdb');
// The above is equivalent to:
mongoose.connect('mongodb://localhost:27017/test', {
    connectTimeoutMS: 1000
    // Note that mongoose will **not** pull `bufferCommands` from the query string
});

The disadvantage of putting options in the query string is that query string options are harder to read.The advantage
is that you only need a single configuration option, the URI, rather than separate options for socketTimeoutMS,
    connectTimeoutMS, etc.Best practice is to put options that likely differ between development and production, like
replicaSet or ssl, in the connection string, and options that should remain constant, like connectTimeoutMS or
maxPoolSize, in the options object.

The MongoDB docs have a full list of supported connection string options.Below are some options that are often useful
to set in the connection string because they are closely associated with the hostname and authentication information.

    authSource - The database to use when authenticating with user and pass.In MongoDB, users are scoped to a database.
    If you are getting an unexpected login failure, you may need to set this option.

    family - Whether to connect using IPv4 or IPv6.This option passed to Node.js' dns.lookup() function. If you don't
    specify this option, the MongoDB driver will try IPv6 first and then IPv4 if IPv6 fails.If your
mongoose.connect(uri) call takes a long time, try mongoose.connect(uri, { family: 4 })

Connection Events

Connections inherit from Node.js' EventEmitter class, and emit events when something happens to the connection,
like losing connectivity to the MongoDB server.Below is a list of events that a connection may emit.

    connecting: Emitted when Mongoose starts making its initial connection to the MongoDB server

connected: Emitted when Mongoose successfully makes its initial connection to the MongoDB server, or when
    Mongoose reconnects after losing connectivity.May be emitted multiple times if Mongoose loses connectivity.

    open: Emitted after 'connected' and onOpen is executed on all of this connection's models.

disconnecting: Your app called Connection#close() to disconnect from MongoDB

disconnected: Emitted when Mongoose lost connection to the MongoDB server.This event may be due to your code
    explicitly closing the connection, the database server crashing, or network connectivity issues.

    close: Emitted after Connection#close() successfully closes the connection.If you call conn.close(), you'll
    get both a 'disconnected' event and a 'close' event.

    reconnected: Emitted if Mongoose lost connectivity to MongoDB and successfully reconnected.Mongoose
    attempts to automatically reconnect when it loses connection to the database.

    error: Emitted if an error occurs on a connection, like a parseError due to malformed data or a payload larger
    than 16MB.

    fullsetup: Emitted when you're connecting to a replica set and Mongoose has successfully connected to the
    primary and at least one secondary.

    all: Emitted when you're connecting to a replica set and Mongoose has successfully connected to all servers
specified in your connection string.

    reconnectFailed: Emitted when you're connected to a standalone server and Mongoose has run out of reconnectTries.
    The MongoDB driver will no longer attempt to reconnect after this event is emitted.This event will never be
    emitted if you're connected to a replica set.

When you're connecting to a single MongoDB server (a "standalone"), Mongoose will emit 'disconnected' if it gets
disconnected from the standalone server, and 'connected' if it successfully connects to the standalone.In a replica
set, Mongoose will emit 'disconnected' if it loses connectivity to the replica set primary, and 'connected' if it
 manages to reconnect to the replica set primary.


A note about keepAlive

For long running applications, it is often prudent to enable keepAlive with a number of milliseconds.Without it,
    after some period of time you may start to see "connection closed" errors for what seems like no reason.If so,
        after reading this, you may decide to enable keepAlive:

mongoose.connect(uri, { keepAlive: true, keepAliveInitialDelay: 300000 });

keepAliveInitialDelay is the number of milliseconds to wait before initiating keepAlive on the socket.
keepAlive is true by default since mongoose 5.2.0.

Replica Set Connections

To connect to a replica set you pass a comma delimited list of hosts to connect to rather than a single host.

    mongoose.connect('mongodb://[username:password@]host1[:port1][,host2[:port2],...[,hostN[:portN]]][/[database][?options]]'[, options]);

For example:

mongoose.connect('mongodb://user:pw@host1.com:27017,host2.com:27017,host3.com:27017/testdb');

To connect to a single node replica set, specify the replicaSet option.

    mongoose.connect('mongodb://host1:port1/?replicaSet=rsName');

Server Selection

The underlying MongoDB driver uses a process known as server selection to connect to MongoDB and send operations to
MongoDB.If the MongoDB driver can't find a server to send an operation to after serverSelectionTimeoutMS, you'll get
the below error:

MongoTimeoutError: Server selection timed out after 30000 ms

You can configure the timeout using the serverSelectionTimeoutMS option to mongoose.connect():

mongoose.connect(uri, {
    serverSelectionTimeoutMS: 5000 // Timeout after 5s instead of 30s
});

A MongoTimeoutError has a reason property that explains why server selection timed out.For example, if you're
connecting to a standalone server with an incorrect password, reason will contain an "Authentication failed" error.

const mongoose = require('mongoose');

const uri = 'mongodb+srv://username:badpw@cluster0-OMITTED.mongodb.net/' +
    'test?retryWrites=true&w=majority';
// Prints "MongoServerError: bad auth Authentication failed."
mongoose.connect(uri, {
    serverSelectionTimeoutMS: 5000
}).catch(err => console.log(err.reason));

Replica Set Host Names

MongoDB replica sets rely on being able to reliably figure out the domain name for each member.On Linux and OSX,
    the MongoDB server uses the output of the hostname command to figure out the domain name to report to the replica set.
This can cause confusing errors if you're connecting to a remote MongoDB replica set running on a machine that
reports its hostname as localhost:

// Can get this error even if your connection string doesn't include
// `localhost` if `rs.conf()` reports that one replica set member has
// `localhost` as its host name.
MongooseServerSelectionError: connect ECONNREFUSED localhost: 27017

If you're experiencing a similar error, connect to the replica set using the mongo shell and run the rs.conf()
command to check the host names of each replica set member.Follow this page's instructions to change a replica set
member's host name.

You can also check the reason.servers property of MongooseServerSelectionError to see what the MongoDB Node driver
thinks the state of your replica set is.The reason.servers property contains a map of server descriptions.

    if(err.name === 'MongooseServerSelectionError') {
    // Contains a Map describing the state of your replica set. For example:
    // Map(1) {
    //   'localhost:27017' => ServerDescription {
    //     address: 'localhost:27017',
    //     type: 'Unknown',
    //     ...
    //   }
    // }
    console.log(err.reason.servers);
}

Multi - mongos support

You can also connect to multiple mongos instances for high availability in a sharded cluster.You do not need to pass
any special options to connect to multiple mongos in mongoose 5.x.

    // Connect to 2 mongos servers
    mongoose.connect('mongodb://mongosA:27501,mongosB:27501', cb);

Multiple connections

So far we've seen how to connect to MongoDB using Mongoose's default connection.Mongoose creates a default connection
when you call mongoose.connect().You can access the default connection using mongoose.connection.

You may need multiple connections to MongoDB for several reasons.One reason is if you have multiple databases or
multiple MongoDB clusters.Another reason is to work around slow trains.The mongoose.createConnection() function
    takes the same arguments as mongoose.connect() and returns a new connection.

const conn = mongoose.createConnection('mongodb://[username:password@]host1[:port1][,host2[:port2],...[,hostN[:portN]]][/[database][?options]]', options);

This connection object is then used to create and retrieve models.Models are always scoped to a single connection.

const UserModel = conn.model('User', userSchema);

If you use multiple connections, you should make sure you export schemas, not models.Exporting a model from a file
is called the export model pattern.The export model pattern is limited because you can only use one connection.

const userSchema = new Schema({ name: String, email: String });

// The alternative to the export model pattern is the export schema pattern.
module.exports = userSchema;

// Because if you export a model as shown below, the model will be scoped
// to Mongoose's default connection.
// module.exports = mongoose.model('User', userSchema);

If you use the export schema pattern, you still need to create models somewhere.There are two common patterns.
First is to export a connection and register the models on the connection in the file:

// connections/fast.js
const mongoose = require('mongoose');

const conn = mongoose.createConnection(process.env.MONGODB_URI);
conn.model('User', require('../schemas/user'));

module.exports = conn;

// connections/slow.js
const mongoose = require('mongoose');

const conn = mongoose.createConnection(process.env.MONGODB_URI);
conn.model('User', require('../schemas/user'));
conn.model('PageView', require('../schemas/pageView'));

module.exports = conn;

Another alternative is to register connections with a dependency injector or another inversion of control(IOC) pattern.

const mongoose = require('mongoose');

module.exports = function connectionFactory() {
    const conn = mongoose.createConnection(process.env.MONGODB_URI);

    conn.model('User', require('../schemas/user'));
    conn.model('PageView', require('../schemas/pageView'));

    return conn;
};

Connection Pools

Each connection, whether created with mongoose.connect or mongoose.createConnection are all backed by an
internal configurable connection pool defaulting to a maximum size of 100. Adjust the pool size using your
connection options:

// With object options
mongoose.createConnection(uri, { maxPoolSize: 10 });

// With connection string options
const uri = 'mongodb://localhost:27017/test?maxPoolSize=10';
mongoose.createConnection(uri);
 */



const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/shopApp')
  .then(() => {
    console.log('CONNECTION OPEN!!!');
  })
  .catch(err => {
    console.log('OH NO ERROR!!!');
    console.log(err);
  })

// This SchemaType based syntax allows us to add additional information in our Schema such as built-in Validations 
// of Mongoose
const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true, // To invoke the built-in validation in Mongoose
    // This validation will make sure to throw an error when you attempt to save an object without the 'name' 
    // property as a Model instance in the database collection. The validation process also checks for 
    // property value types. It will try to cast the value type to the specified datatype in the Schema and will
    // error out if it fails
    maxlength: 20 // Set the maximum length of the bike property value as 20. The validator will check for this 
    // condition and will throw an error if the value has length > 20
  },
  price: {
    type: Number,
    required: true,
    // min: 0 // Validate that the price value is 0 or above
    min: [0, 'Price must be Positive ya dodo']
    // We can also provide custom ValidationError messages by passing an array [value, error message] 
  },
  onSale: {
    type: Boolean,
    default: false // using the default option available with Schema Types to set the default value for onSale
  },
  categories: {
    type: [String], // Tell the validator that the categories property should have an array of only Strings.
    // It will also cast non-string elements such as numbers to strings.
    default: ['Cycling']
  },
  qty: {
    // Sub-properties
    online: {
      type: Number,
      default: 0
    },
    inStore: {
      type: Number,
      default: 0
    }
  },
  size: {
    type: String,
    enum: ['S', 'M', 'L'] // enum creates a validator that checks if the value is in the given array.
  }
});



/* 

Instance methods:

Instances of Models are documents. Documents have many of their own built-in instance methods. We may also define 
our own custom document instance methods.

// define a schema
const animalSchema = new Schema({ name: String, type: String });

// assign a function to the "methods" object of our animalSchema
animalSchema.methods.findSimilarTypes = function(cb) {
  return mongoose.model('Animal').find({ type: this.type }, cb);
};

Now all of our animal instances have a findSimilarTypes method available to them.

const Animal = mongoose.model('Animal', animalSchema);
const dog = new Animal({ type: 'dog' });

dog.findSimilarTypes((err, dogs) => {
  console.log(dogs); // woof
});

    Overwriting a default mongoose document method may lead to unpredictable results. See this for more details.
    The example above uses the Schema.methods object directly to save an instance method. You can also use the 
    Schema.method() helper as described here.
    Do not declare methods using ES6 arrow functions (=>). Arrow functions explicitly prevent binding this, so your 
    method will not have access to the document and the above examples will not work.

Statics:

You can also add static functions to your model. There are two equivalent ways to add a static:

    Add a function property to schema.statics
    Call the Schema#static() function

// Assign a function to the "statics" object of our animalSchema
animalSchema.statics.findByName = function(name) {
  return this.find({ name: new RegExp(name, 'i') });
};
// Or, equivalently, you can call `animalSchema.static()`.
animalSchema.static('findByBreed', function(breed) { return this.find({ breed }); });

const Animal = mongoose.model('Animal', animalSchema);
let animals = await Animal.findByName('fido');
animals = animals.concat(await Animal.findByBreed('Poodle'));

Do not declare statics using ES6 arrow functions (=>). Arrow functions explicitly prevent binding this, so the above 
examples will not work because of the value of this.

Query Helpers:

You can also add query helper functions, which are like instance methods but for mongoose queries. Query helper 
methods let you extend mongoose's chainable query builder API.

animalSchema.query.byName = function(name) {
  return this.where({ name: new RegExp(name, 'i') })
};

const Animal = mongoose.model('Animal', animalSchema);

Animal.find().byName('fido').exec((err, animals) => {
  console.log(animals);
});

Animal.findOne().byName('fido').exec((err, animal) => {
  console.log(animal);
});

Indexes:

MongoDB supports secondary indexes. With mongoose, we define these indexes within our Schema at the path level or 
the schema level. Defining indexes at the schema level is necessary when creating compound indexes.

const animalSchema = new Schema({
  name: String,
  type: String,
  tags: { type: [String], index: true } // field level
});

animalSchema.index({ name: 1, type: -1 }); // schema level

When your application starts up, Mongoose automatically calls createIndex for each defined index in your schema. 
Mongoose will call createIndex for each index sequentially, and emit an 'index' event on the model when all the 
createIndex calls succeeded or when there was an error. While nice for development, it is recommended this behavior 
be disabled in production since index creation can cause a significant performance impact. Disable the behavior by 
setting the autoIndex option of your schema to false, or globally on the connection by setting the option autoIndex 
to false.

mongoose.connect('mongodb://user:pass@localhost:port/database', { autoIndex: false });
// or
mongoose.createConnection('mongodb://user:pass@localhost:port/database', { autoIndex: false });
// or
mongoose.set('autoIndex', false);
// or
animalSchema.set('autoIndex', false);
// or
new Schema({..}, { autoIndex: false });

Mongoose will emit an index event on the model when indexes are done building or an error occurred.

// Will cause an error because mongodb has an _id index by default that
// is not sparse
animalSchema.index({ _id: 1 }, { sparse: true });
const Animal = mongoose.model('Animal', animalSchema);

Animal.on('index', error => {
  // "_id index cannot be sparse"
  console.log(error.message);
});

See also the Model#ensureIndexes method.

Virtuals:

Virtuals are document properties that you can get and set but that do not get persisted to MongoDB. The getters are useful for formatting or combining fields, while setters are useful for de-composing a single value into multiple values for storage.

// define a schema
const personSchema = new Schema({
  name: {
    first: String,
    last: String
  }
});

// compile our model
const Person = mongoose.model('Person', personSchema);

// create a document
const axl = new Person({
  name: { first: 'Axl', last: 'Rose' }
});

Suppose you want to print out the person's full name. You could do it yourself:

console.log(axl.name.first + ' ' + axl.name.last); // Axl Rose

But concatenating the first and last name every time can get cumbersome. And what if you want to do some extra 
processing on the name, like removing diacritics? A virtual property getter lets you define a fullName property 
that won't get persisted to MongoDB.

personSchema.virtual('fullName').get(function() {
  return this.name.first + ' ' + this.name.last;
});

Now, mongoose will call your getter function every time you access the fullName property:

console.log(axl.fullName); // Axl Rose

If you use toJSON() or toObject() mongoose will not include virtuals by default. This includes the output of calling JSON.stringify() on a Mongoose document, because JSON.stringify() calls toJSON(). Pass { virtuals: true } to either toObject() or toJSON().

You can also add a custom setter to your virtual that will let you set both first name and last name via the fullName virtual.

personSchema.virtual('fullName').
  get(function() {
    return this.name.first + ' ' + this.name.last;
    }).
  set(function(v) {
    this.name.first = v.substr(0, v.indexOf(' '));
    this.name.last = v.substr(v.indexOf(' ') + 1);
  });

axl.fullName = 'William Rose'; // Now `axl.name.first` is "William"

Virtual property setters are applied before other validation. So the example above would still work even if the 
first and last name fields were required.

Only non-virtual properties work as part of queries and for field selection. Since virtuals are not stored in 
MongoDB, you can't query with them.


Aliases:

Aliases are a particular type of virtual where the getter and setter seamlessly get and set another property. 
This is handy for saving network bandwidth, so you can convert a short property name stored in the database into a 
longer name for code readability.

const personSchema = new Schema({
  n: {
    type: String,
    // Now accessing `name` will get you the value of `n`, and setting `name` will set the value of `n`
    alias: 'name'
  }
});

// Setting `name` will propagate to `n`
const person = new Person({ name: 'Val' });
console.log(person); // { n: 'Val' }
console.log(person.toObject({ virtuals: true })); // { n: 'Val', name: 'Val' }
console.log(person.name); // "Val"

person.name = 'Not Val';
console.log(person); // { n: 'Not Val' }

You can also declare aliases on nested paths. It is easier to use nested schemas and subdocuments, but you can also 
declare nested path aliases inline as long as you use the full nested path nested.myProp as the alias.

const childSchema = new Schema({
  n: {
    type: String,
    alias: 'name'
  }
}, { _id: false });

const parentSchema = new Schema({
  // If in a child schema, alias doesn't need to include the full nested path
  c: childSchema,
  name: {
    f: {
      type: String,
      // Alias needs to include the full nested path if declared inline
      alias: 'name.first'
    }
  }
});

Options:

Schemas have a few configurable options which can be passed to the constructor or to the set method:

new Schema({..}, options);

// or

const schema = new Schema({..});
schema.set(option, value);

Valid options:

    autoIndex
    autoCreate
    bufferCommands
    bufferTimeoutMS
    capped
    collection
    discriminatorKey
    id
    _id
    minimize
    read
    writeConcern
    shardKey
    strict
    strictQuery
    toJSON
    toObject
    typeKey
    validateBeforeSave
    versionKey
    optimisticConcurrency
    collation
    timeseries
    selectPopulatedPaths
    skipVersioning
    timestamps
    storeSubdocValidationError

 - option: autoIndex

By default, Mongoose's init() function creates all the indexes defined in your model's schema by calling 
Model.createIndexes() after you successfully connect to MongoDB. Creating indexes automatically is great for 
development and test environments. But index builds can also create significant load on your production database. 
If you want to manage indexes carefully in production, you can set autoIndex to false.

const schema = new Schema({..}, { autoIndex: false });
const Clock = mongoose.model('Clock', schema);
Clock.ensureIndexes(callback);

The autoIndex option is set to true by default. You can change this default by setting 
mongoose.set('autoIndex', false);

 - option: autoCreate

Before Mongoose builds indexes, it calls Model.createCollection() to create the underlying collection in MongoDB by 
default. Calling createCollection() sets the collection's default collation based on the collation option and 
establishes the collection as a capped collection if you set the capped schema option.

You can disable this behavior by setting autoCreate to false using mongoose.set('autoCreate', false). 
Like autoIndex, autoCreate is helpful for development and test environments, but you may want to disable it for 
production to avoid unnecessary database calls.

Unfortunately, createCollection() cannot change an existing collection. For example, if you add capped: { size: 1024 } 
to your schema and the existing collection is not capped, createCollection() will not overwrite the existing 
collection. That is because the MongoDB server does not allow changing a collection's options without dropping the 
collection first.

const schema = new Schema({ name: String }, {
  autoCreate: false,
  capped: { size: 1024 }
});
const Test = mongoose.model('Test', schema);

// No-op if collection already exists, even if the collection is not capped.
// This means that `capped` won't be applied if the 'tests' collection already exists.
await Test.createCollection();

 - option: bufferCommands

By default, mongoose buffers commands when the connection goes down until the driver manages to reconnect. 
To disable buffering, set bufferCommands to false.

const schema = new Schema({..}, { bufferCommands: false });

The schema bufferCommands option overrides the global bufferCommands option.

mongoose.set('bufferCommands', true);
// Schema option below overrides the above, if the schema option is set.
const schema = new Schema({..}, { bufferCommands: false });

 - option: bufferTimeoutMS

If bufferCommands is on, this option sets the maximum amount of time Mongoose buffering will wait before throwing an error. If not specified, Mongoose will use 10000 (10 seconds).

// If an operation is buffered for more than 1 second, throw an error.
const schema = new Schema({..}, { bufferTimeoutMS: 1000 });

 - option: capped

Mongoose supports MongoDBs capped collections. To specify the underlying MongoDB collection be capped, set the 
capped option to the maximum size of the collection in bytes.

new Schema({..}, { capped: 1024 });

The capped option may also be set to an object if you want to pass additional options like max or autoIndexId. 
In this case you must explicitly pass the size option, which is required.

new Schema({..}, { capped: { size: 1024, max: 1000, autoIndexId: true } });

 - option: collection

Mongoose by default produces a collection name by passing the model name to the utils.toCollectionName method. 
This method pluralizes the name. Set this option if you need a different name for your collection.

const dataSchema = new Schema({..}, { collection: 'data' });

 - option: discriminatorKey

When you define a discriminator, Mongoose adds a path to your schema that stores which discriminator a document is 
an instance of. By default, Mongoose adds an __t path, but you can set discriminatorKey to overwrite this default.

const baseSchema = new Schema({}, { discriminatorKey: 'type' });
const BaseModel = mongoose.model('Test', baseSchema);

const personSchema = new Schema({ name: String });
const PersonModel = BaseModel.discriminator('Person', personSchema);

const doc = new PersonModel({ name: 'James T. Kirk' });
// Without `discriminatorKey`, Mongoose would store the discriminator
// key in `__t` instead of `type`
doc.type; // 'Person'

 - option: id

Mongoose assigns each of your schemas an id virtual getter by default which returns the document's _id field cast to 
a string, or in the case of ObjectIds, its hexString. If you don't want an id getter added to your schema, you may 
disable it by passing this option at schema construction time.

// default behavior
const schema = new Schema({ name: String });
const Page = mongoose.model('Page', schema);
const p = new Page({ name: 'mongodb.org' });
console.log(p.id); // '50341373e894ad16347efe01'

// disabled id
const schema = new Schema({ name: String }, { id: false });
const Page = mongoose.model('Page', schema);
const p = new Page({ name: 'mongodb.org' });
console.log(p.id); // undefined

 - option: _id

Mongoose assigns each of your schemas an _id field by default if one is not passed into the Schema constructor. 
The type assigned is an ObjectId to coincide with MongoDB's default behavior. If you don't want an _id added to your 
schema at all, you may disable it using this option.

You can only use this option on subdocuments. Mongoose can't save a document without knowing its id, so you will get 
an error if you try to save a document without an _id.

// default behavior
const schema = new Schema({ name: String });
const Page = mongoose.model('Page', schema);
const p = new Page({ name: 'mongodb.org' });
console.log(p); // { _id: '50341373e894ad16347efe01', name: 'mongodb.org' }

// disabled _id
const childSchema = new Schema({ name: String }, { _id: false });
const parentSchema = new Schema({ children: [childSchema] });

const Model = mongoose.model('Model', parentSchema);

Model.create({ children: [{ name: 'Luke' }] }, (error, doc) => {
  // doc.children[0]._id will be undefined
});

 - option: minimize

Mongoose will, by default, "minimize" schemas by removing empty objects.

const schema = new Schema({ name: String, inventory: {} });
const Character = mongoose.model('Character', schema);

// will store `inventory` field if it is not empty
const frodo = new Character({ name: 'Frodo', inventory: { ringOfPower: 1 }});
await frodo.save();
let doc = await Character.findOne({ name: 'Frodo' }).lean();
doc.inventory; // { ringOfPower: 1 }

// will not store `inventory` field if it is empty
const sam = new Character({ name: 'Sam', inventory: {}});
await sam.save();
doc = await Character.findOne({ name: 'Sam' }).lean();
doc.inventory; // undefined

This behavior can be overridden by setting minimize option to false. It will then store empty objects.

const schema = new Schema({ name: String, inventory: {} }, { minimize: false });
const Character = mongoose.model('Character', schema);

// will store `inventory` if empty
const sam = new Character({ name: 'Sam', inventory: {} });
await sam.save();
doc = await Character.findOne({ name: 'Sam' }).lean();
doc.inventory; // {}

To check whether an object is empty, you can use the $isEmpty() helper:

const sam = new Character({ name: 'Sam', inventory: {} });
sam.$isEmpty('inventory'); // true

sam.inventory.barrowBlade = 1;
sam.$isEmpty('inventory'); // false

 - option: read

Allows setting query#read options at the schema level, providing us a way to apply default ReadPreferences to all 
queries derived from a model.

const schema = new Schema({..}, { read: 'primary' });            // also aliased as 'p'
const schema = new Schema({..}, { read: 'primaryPreferred' });   // aliased as 'pp'
const schema = new Schema({..}, { read: 'secondary' });          // aliased as 's'
const schema = new Schema({..}, { read: 'secondaryPreferred' }); // aliased as 'sp'
const schema = new Schema({..}, { read: 'nearest' });            // aliased as 'n'

The alias of each pref is also permitted so instead of having to type out 'secondaryPreferred' and getting the 
spelling wrong, we can simply pass 'sp'.

The read option also allows us to specify tag sets. These tell the driver from which members of the replica-set it 
should attempt to read. Read more about tag sets here and here.

NOTE: you may also specify the driver read pref strategy option when connecting:

// pings the replset members periodically to track network latency
const options = { replset: { strategy: 'ping' }};
mongoose.connect(uri, options);

const schema = new Schema({..}, { read: ['nearest', { disk: 'ssd' }] });
mongoose.model('JellyBean', schema);

 - option: writeConcern

Allows setting write concern at the schema level.

const schema = new Schema({ name: String }, {
  writeConcern: {
    w: 'majority',
    j: true,
    wtimeout: 1000
  }
});

 - option: shardKey

The shardKey option is used when we have a sharded MongoDB architecture. Each sharded collection is given a shard 
key which must be present in all insert/update operations. We just need to set this schema option to the same shard 
key and we’ll be all set.

new Schema({ .. }, { shardKey: { tag: 1, name: 1 }})

Note that Mongoose does not send the shardcollection command for you. You must configure your shards yourself.
option: strict

The strict option, (enabled by default), ensures that values passed to our model constructor that were not specified 
in our schema do not get saved to the db.

const thingSchema = new Schema({..})
const Thing = mongoose.model('Thing', thingSchema);
const thing = new Thing({ iAmNotInTheSchema: true });
thing.save(); // iAmNotInTheSchema is not saved to the db

// set to false..
const thingSchema = new Schema({..}, { strict: false });
const thing = new Thing({ iAmNotInTheSchema: true });
thing.save(); // iAmNotInTheSchema is now saved to the db!!

This also affects the use of doc.set() to set a property value.

const thingSchema = new Schema({..})
const Thing = mongoose.model('Thing', thingSchema);
const thing = new Thing;
thing.set('iAmNotInTheSchema', true);
thing.save(); // iAmNotInTheSchema is not saved to the db

This value can be overridden at the model instance level by passing a second boolean argument:

const Thing = mongoose.model('Thing');
const thing = new Thing(doc, true);  // enables strict mode
const thing = new Thing(doc, false); // disables strict mode

The strict option may also be set to "throw" which will cause errors to be produced instead of dropping the bad data.

NOTE: Any key/val set on the instance that does not exist in your schema is always ignored, regardless of schema option.

const thingSchema = new Schema({..})
const Thing = mongoose.model('Thing', thingSchema);
const thing = new Thing;
thing.iAmNotInTheSchema = true;
thing.save(); // iAmNotInTheSchema is never saved to the db

 - option: strictQuery

Mongoose supports a separate strictQuery option to avoid strict mode for query filters. This is because empty query 
filters cause Mongoose to return all documents in the model, which can cause issues.

const mySchema = new Schema({ field: Number }, { strict: true });
const MyModel = mongoose.model('Test', mySchema);
// Mongoose will filter out `notInSchema: 1` because `strict: true`, meaning this query will return
// _all_ documents in the 'tests' collection
MyModel.find({ notInSchema: 1 });

The strict option does apply to updates. The strictQuery option is just for query filters.

// Mongoose will strip out `notInSchema` from the update if `strict` is
// not `false`
MyModel.updateMany({}, { $set: { notInSchema: 1 } });

Mongoose has a separate strictQuery option to toggle strict mode for the filter parameter to queries.

const mySchema = new Schema({ field: Number }, {
  strict: true,
  strictQuery: false // Turn off strict mode for query filters
});
const MyModel = mongoose.model('Test', mySchema);
// Mongoose will not strip out `notInSchema: 1` because `strictQuery` is false
MyModel.find({ notInSchema: 1 });

In general, we do not recommend passing user-defined objects as query filters:

// Don't do this!
const docs = await MyModel.find(req.query);

// Do this instead:
const docs = await MyModel.find({ name: req.query.name, age: req.query.age }).setOptions({ sanitizeFilter: true });

In Mongoose 6, strictQuery is equal to strict by default. However, you can override this behavior globally:

// Set `strictQuery` to `false`, so Mongoose doesn't strip out non-schema
// query filter properties by default.
// This does **not** affect `strict`.
mongoose.set('strictQuery', false);

 - option: toJSON

Exactly the same as the toObject option but only applies when the document's toJSON method is called.

const schema = new Schema({ name: String });
schema.path('name').get(function (v) {
  return v + ' is my name';
});
schema.set('toJSON', { getters: true, virtuals: false });
const M = mongoose.model('Person', schema);
const m = new M({ name: 'Max Headroom' });
console.log(m.toObject()); // { _id: 504e0cd7dd992d9be2f20b6f, name: 'Max Headroom' }
console.log(m.toJSON()); // { _id: 504e0cd7dd992d9be2f20b6f, name: 'Max Headroom is my name' }
// since we know toJSON is called whenever a js object is stringified:
console.log(JSON.stringify(m)); // { "_id": "504e0cd7dd992d9be2f20b6f", "name": "Max Headroom is my name" }

To see all available toJSON/toObject options, read this.
option: toObject

Documents have a toObject method which converts the mongoose document into a plain JavaScript object. This method 
accepts a few options. Instead of applying these options on a per-document basis, we may declare the options at the 
schema level and have them applied to all of the schema's documents by default.

To have all virtuals show up in your console.log output, set the toObject option to { getters: true }:

const schema = new Schema({ name: String });
schema.path('name').get(function(v) {
  return v + ' is my name';
});
schema.set('toObject', { getters: true });
const M = mongoose.model('Person', schema);
const m = new M({ name: 'Max Headroom' });
console.log(m); // { _id: 504e0cd7dd992d9be2f20b6f, name: 'Max Headroom is my name' }

To see all available toObject options, read this.
option: typeKey

By default, if you have an object with key 'type' in your schema, mongoose will interpret it as a type declaration.

// Mongoose interprets this as 'loc is a String'
const schema = new Schema({ loc: { type: String, coordinates: [Number] } });

However, for applications like geoJSON, the 'type' property is important. If you want to control which key mongoose 
uses to find type declarations, set the 'typeKey' schema option.

const schema = new Schema({
  // Mongoose interprets this as 'loc is an object with 2 keys, type and coordinates'
  loc: { type: String, coordinates: [Number] },
  // Mongoose interprets this as 'name is a String'
  name: { $type: String }
}, { typeKey: '$type' }); // A '$type' key means this object is a type declaration

 - option: validateBeforeSave

By default, documents are automatically validated before they are saved to the database. This is to prevent saving 
an invalid document. If you want to handle validation manually, and be able to save objects which don't pass 
validation, you can set validateBeforeSave to false.

const schema = new Schema({ name: String });
schema.set('validateBeforeSave', false);
schema.path('name').validate(function (value) {
    return value != null;
});
const M = mongoose.model('Person', schema);
const m = new M({ name: null });
m.validate(function(err) {
    console.log(err); // Will tell you that null is not allowed.
});
m.save(); // Succeeds despite being invalid

 - option: versionKey

The versionKey is a property set on each document when first created by Mongoose. This keys value contains the 
internal revision of the document. The versionKey option is a string that represents the path to use for versioning. 
The default is __v. If this conflicts with your application you can configure as such:

const schema = new Schema({ name: 'string' });
const Thing = mongoose.model('Thing', schema);
const thing = new Thing({ name: 'mongoose v3' });
await thing.save(); // { __v: 0, name: 'mongoose v3' }

// customized versionKey
new Schema({..}, { versionKey: '_somethingElse' })
const Thing = mongoose.model('Thing', schema);
const thing = new Thing({ name: 'mongoose v3' });
thing.save(); // { _somethingElse: 0, name: 'mongoose v3' }

Note that Mongoose's default versioning is not a full optimistic concurrency solution. Mongoose's default versioning only operates on arrays as shown below.

// 2 copies of the same document
const doc1 = await Model.findOne({ _id });
const doc2 = await Model.findOne({ _id });

// Delete first 3 comments from `doc1`
doc1.comments.splice(0, 3);
await doc1.save();

// The below `save()` will throw a VersionError, because you're trying to
// modify the comment at index 1, and the above `splice()` removed that
// comment.
doc2.set('comments.1.body', 'new comment');
await doc2.save();

If you need optimistic concurrency support for save(), you can set the optimisticConcurrency option

Document versioning can also be disabled by setting the versionKey to false. DO NOT disable versioning unless you 
know what you are doing.

new Schema({..}, { versionKey: false });
const Thing = mongoose.model('Thing', schema);
const thing = new Thing({ name: 'no versioning please' });
thing.save(); // { name: 'no versioning please' }

Mongoose only updates the version key when you use save(). If you use update(), findOneAndUpdate(), etc. Mongoose 
will not update the version key. As a workaround, you can use the below middleware.

schema.pre('findOneAndUpdate', function() {
  const update = this.getUpdate();
  if (update.__v != null) {
    delete update.__v;
  }
  const keys = ['$set', '$setOnInsert'];
  for (const key of keys) {
    if (update[key] != null && update[key].__v != null) {
      delete update[key].__v;
      if (Object.keys(update[key]).length === 0) {
        delete update[key];
      }
    }
  }
  update.$inc = update.$inc || {};
  update.$inc.__v = 1;
});

 - option: optimisticConcurrency

Optimistic concurrency is a strategy to ensure the document you're updating didn't change between when you loaded it 
using find() or findOne(), and when you update it using save().

For example, suppose you have a House model that contains a list of photos, and a status that represents whether 
this house shows up in searches. Suppose that a house that has status 'APPROVED' must have at least two photos. You 
might implement the logic of approving a house document as shown below:

async function markApproved(id) {
  const house = await House.findOne({ _id });
  if (house.photos.length < 2) {
    throw new Error('House must have at least two photos!');
  }
  
  house.status = 'APPROVED';
  await house.save();
}

The markApproved() function looks right in isolation, but there might be a potential issue: what if another function 
removes the house's photos between the findOne() call and the save() call? For example, the below code will succeed:

const house = await House.findOne({ _id });
if (house.photos.length < 2) {
  throw new Error('House must have at least two photos!');
}

const house2 = await House.findOne({ _id });
house2.photos = [];
await house2.save();

// Marks the house as 'APPROVED' even though it has 0 photos!
house.status = 'APPROVED';
await house.save();

If you set the optimisticConcurrency option on the House model's schema, the above script will throw an error.

const House = mongoose.model('House', Schema({
  status: String,
  photos: [String]
}, { optimisticConcurrency: true }));

const house = await House.findOne({ _id });
if (house.photos.length < 2) {
  throw new Error('House must have at least two photos!');
}

const house2 = await House.findOne({ _id });
house2.photos = [];
await house2.save();

// Throws 'VersionError: No matching document found for id "..." version 0'
house.status = 'APPROVED';
await house.save();

 - option: collation

Sets a default collation for every query and aggregation. Here's a beginner-friendly overview of collations.

const schema = new Schema({
  name: String
}, { collation: { locale: 'en_US', strength: 1 } });

const MyModel = db.model('MyModel', schema);

MyModel.create([{ name: 'val' }, { name: 'Val' }]).
  then(() => {
    return MyModel.find({ name: 'val' });
  }).
  then((docs) => {
    // `docs` will contain both docs, because `strength: 1` means
    // MongoDB will ignore case when matching.
  });

 - option: timeseries

If you set the timeseries option on a schema, Mongoose will create a timeseries collection for any model that you 
create from that schema.

const schema = Schema({ name: String, timestamp: Date, metadata: Object }, {
  timeseries: {
    timeField: 'timestamp',
    metaField: 'metadata',
    granularity: 'hours'
  },
  autoCreate: false,
  expireAfterSeconds: 86400
});

// `Test` collection will be a timeseries collection
const Test = db.model('Test', schema);

 - option: skipVersioning

skipVersioning allows excluding paths from versioning (i.e., the internal revision will not be incremented even if 
    these paths are updated). DO NOT do this unless you know what you're doing. For subdocuments, include this on 
    the parent document using the fully qualified path.

new Schema({..}, { skipVersioning: { dontVersionMe: true } });
thing.dontVersionMe.push('hey');
thing.save(); // version is not incremented

 - option: timestamps

The timestamps option tells Mongoose to assign createdAt and updatedAt fields to your schema. The type assigned is 
Date.

By default, the names of the fields are createdAt and updatedAt. Customize the field names by setting 
timestamps.createdAt and timestamps.updatedAt.

The way timestamps works under the hood is:

    If you create a new document, mongoose simply sets createdAt, and updatedAt to the time of creation.
    If you update a document, mongoose will add updatedAt to the $set object.
    If you set upsert: true on an update operation, mongoose will use $setOnInsert operator to add createdAt to the 
    document in case the upsert operation resulted into a new inserted document.

const thingSchema = new Schema({..}, { timestamps: { createdAt: 'created_at' } });
const Thing = mongoose.model('Thing', thingSchema);
const thing = new Thing();
await thing.save(); // `created_at` & `updatedAt` will be included

// With updates, Mongoose will add `updatedAt` to `$set`
await Thing.updateOne({}, { $set: { name: 'Test' } });

// If you set upsert: true, Mongoose will add `created_at` to `$setOnInsert` as well
await Thing.findOneAndUpdate({}, { $set: { name: 'Test2' } });

// Mongoose also adds timestamps to bulkWrite() operations
// See https://mongoosejs.com/docs/api.html#model_Model.bulkWrite
await Thing.bulkWrite([
  insertOne: {
    document: {
      name: 'Jean-Luc Picard',
      ship: 'USS Stargazer'
      // Mongoose will add `created_at` and `updatedAt`
    }
  },
  updateOne: {
    filter: { name: 'Jean-Luc Picard' },
    update: {
      $set: {
        ship: 'USS Enterprise'
        // Mongoose will add `updatedAt`
      }
    }
  }
]);

By default, Mongoose uses new Date() to get the current time. If you want to overwrite the function Mongoose uses to 
get the current time, you can set the timestamps.currentTime option. Mongoose will call the timestamps.currentTime 
function whenever it needs to get the current time.

const schema = Schema({
  createdAt: Number,
  updatedAt: Number,
  name: String
}, {
  // Make Mongoose use Unix time (seconds since Jan 1, 1970)
  timestamps: { currentTime: () => Math.floor(Date.now() / 1000) }
});

 - option: pluginTags

Mongoose supports defining global plugins, plugins that apply to all schemas.

// Add a `meta` property to all schemas
mongoose.plugin(function myPlugin(schema) {
  schema.add({ meta: {} });
});

Sometimes, you may only want to apply a given plugin to some schemas. In that case, you can add pluginTags to a schema:

const schema1 = new Schema({
  name: String
}, { pluginTags: ['useMetaPlugin'] });

const schema2 = new Schema({
  name: String
});

If you call plugin() with a tags option, Mongoose will only apply that plugin to schemas that have a matching entry 
in pluginTags.

// Add a `meta` property to all schemas
mongoose.plugin(function myPlugin(schema) {
  schema.add({ meta: {} });
}, { tags: ['useMetaPlugin'] });

 - option: selectPopulatedPaths

By default, Mongoose will automatically select() any populated paths for you, unless you explicitly exclude them.

const bookSchema = new Schema({
  title: 'String',
  author: { type: 'ObjectId', ref: 'Person' }
});
const Book = mongoose.model('Book', bookSchema);

// By default, Mongoose will add `author` to the below `select()`.
await Book.find().select('title').populate('author');

// In other words, the below query is equivalent to the above
await Book.find().select('title author').populate('author');

To opt out of selecting populated fields by default, set selectPopulatedPaths to false in your schema.

const bookSchema = new Schema({
  title: 'String',
  author: { type: 'ObjectId', ref: 'Person' }
}, { selectPopulatedPaths: false });
const Book = mongoose.model('Book', bookSchema);

// Because `selectPopulatedPaths` is false, the below doc will **not**
// contain an `author` property.
const doc = await Book.findOne().select('title').populate('author');

 - option: storeSubdocValidationError

For legacy reasons, when there is a validation error in subpath of a single nested schema, Mongoose will record that 
there was a validation error in the single nested schema path as well. For example:

const childSchema = new Schema({ name: { type: String, required: true } });
const parentSchema = new Schema({ child: childSchema });

const Parent = mongoose.model('Parent', parentSchema);

// Will contain an error for both 'child.name' _and_ 'child'
new Parent({ child: {} }).validateSync().errors;

Set the storeSubdocValidationError to false on the child schema to make Mongoose only reports the parent error.

const childSchema = new Schema({
  name: { type: String, required: true }
}, { storeSubdocValidationError: false }); // <-- set on the child schema
const parentSchema = new Schema({ child: childSchema });

const Parent = mongoose.model('Parent', parentSchema);

// Will only contain an error for 'child.name'
new Parent({ child: {} }).validateSync().errors;

With ES6 Classes:

Schemas have a loadClass() method that you can use to create a Mongoose schema from an ES6 class:

    ES6 class methods become Mongoose methods
    ES6 class statics become Mongoose statics
    ES6 getters and setters become Mongoose virtuals

Here's an example of using loadClass() to create a schema from an ES6 class:

class MyClass {
  myMethod() { return 42; }
  static myStatic() { return 42; }
  get myVirtual() { return 42; }
}

const schema = new mongoose.Schema();
schema.loadClass(MyClass);

console.log(schema.methods); // { myMethod: [Function: myMethod] }
console.log(schema.statics); // { myStatic: [Function: myStatic] }
console.log(schema.virtuals); // { myVirtual: VirtualType { ... } }

Pluggable:

Schemas are also pluggable which allows us to package up reusable features into plugins that can be shared with the community or just between your projects.
Further Reading

Here's an alternative introduction to Mongoose schemas.

To get the most out of MongoDB, you need to learn the basics of MongoDB schema design. SQL schema design 
(third normal form) was designed to minimize storage costs, whereas MongoDB schema design is about making common 
queries as fast as possible. The 6 Rules of Thumb for MongoDB Schema Design blog series is an excellent resource for 
learning the basic rules for making your queries fast.

Users looking to master MongoDB schema design in Node.js should look into The Little MongoDB Schema Design Book by 
Christian Kvalheim, the original author of the MongoDB Node.js driver. This book shows you how to implement 
performant schemas for a laundry list of use cases, including e-commerce, wikis, and appointment bookings.

*/

// INSTANCE METHODS 

// Declare methods for schema objects using traditional function declaration syntax. This will allow the 'this' keyword to point
// to the current object correctly.
// Demo function to test Schema Method
productSchema.methods.greet = function () {
  console.log('HELLO!! HI!! HOWDY!!');
  console.log(`- from ${this.name}`);
}

// Function to toggle the Boolean 'onSale' property of productSchema
productSchema.methods.toggleOnSale = function () {
  this.onSale = !this.onSale;
  return this.save(); // returns a thenable object (not a promise) that should be awaited in the function call
}

// Function to add a new Category to the schema
productSchema.methods.addCategory = function (newCategory) {
  this.categories.push(newCategory);
  return this.save(); // again returning a thenable object( not a promise ) that should be awaited during function call
}


// STATIC MODEL METHODS - ARE USUALLY USED TO PERFORM CRUD OPERATIONS THAT AFFECT ALL INSTANCE OF THE MODEL
// again, use traditional function syntax, the 'this' keyword in this case will refer to the model itself, not its 
// individual instances
productSchema.statics.fireSale = function () {
  return this.updateMany({}, { onSale: true, price: 0 }) // returns a thenabel object that needs to be awaited on call
}

const Product = mongoose.model('Product', productSchema);
// const bike = new Product({ price: 599 }); // Will throw Validation error
// const bike = new Product({ name: 'Mountain Bike', price: 'hello' }); // Will throw a datatype casting error
// const bike = new Product({ name: 'Mountain Bike', price: 599 });
// const bike = new Product({ name: 'Mountain Bike', price: '599' }); // Also works because type casting is successful.
// const bike = new Product({ name: 'Mountain Bike', price: 599, color: 'red' }); // Works!!

//  Including additional properties not mentioned in the Schema will not raise an Error. But the additional information
//  will not be included in the document. In this case, the property 'color' and its value will not show up.

// const bike = new Product({ name: 'Bike Helmet From Helmet Makers', price: 29.50 }); // throws validation error
// const bike = new Product({ name: 'Bike Helmet', price: -9.50 }); // raises ValidationError because price is less
//   than the minimum allowed value

// const bike = new Product({ name: 'Bike Helmet', price: 19.50, categories: ['Cycling', 'Safety'] });
// const bike = new Product({ name: 'Cycling Pump', price: 19.50 });
const bike = new Product({ name: 'Cycling Jersey', price: 28.50, size: 'S' });

// bike.save().then(data => {
//     console.log('IT WORKED!!');
//     console.log(data);
// })
//     .catch(err => {
//         console.log('OH NO, ERROR!');
//         console.log(err);
//     })

// Updating the document - You will notice that you can update the price to a negative number and it Works !!
// This behaviour is against the Schema definition which says that price should only have values >= 0
// Validation, by Default, is applied automatically when a document is created but not when it is being updated
// We can tell Mongose to Validate the Document upon Updation by setting the 'runValidators' option to true
// Product.findOneAndUpdate({ name: 'Cycling Jersey' }, { price: -19.99 }, { new: true, runValidators: true }) // VALIDATION ERROR!
// Product.findOneAndUpdate({ name: 'Cycling Jersey' }, { price: 19.99 }, { new: true, runValidators: true }) // Works!
//   // The 'new: true' option shows the new data after updation
//   .then(data => {
//     console.log('IT WORKED!!');
//     // console.log(data);
//   })
//   .catch(err => {
//     console.log('OH NO, ERROR!');
//     console.log(err);
//   })



// Function to find an instance of Product and call its custom 'greet' method
const findProduct = async () => {
  const foundProduct = await Product.findOne({ name: 'Mountain Bike' });
  // foundProduct.greet();
  // foundProduct.onSale = !foundProduct.onSale;
  // foundProduct.save();
  console.log(foundProduct);
  await foundProduct.toggleOnSale();
  console.log(foundProduct);
  await foundProduct.addCategory('Outdoors');
  console.log(foundProduct);
}


Product.fireSale().then(res => console.log(res)); // updateMany by default returns only the modification stats as an object

// findProduct();


/**
SchemaType Options:

You can declare a schema type using the type directly, or an object with a type property.

const schema1 = new Schema({
  test: String // `test` is a path of type String
});

const schema2 = new Schema({
  // The `test` object contains the "SchemaType options"
  test: { type: String } // `test` is a path of type string
});

In addition to the type property, you can specify additional properties for a path. For example, if you want to
lowercase a string before saving:

const schema2 = new Schema({
  test: {
    type: String,
    lowercase: true // Always convert `test` to lowercase
  }
});

You can add any property you want to your SchemaType options. Many plugins rely on custom SchemaType options.
For example, the mongoose-autopopulate plugin automatically populates paths if you set autopopulate: true in your
SchemaType options. Mongoose comes with support for several built-in SchemaType options, like lowercase in the above
example.

The lowercase option only works for strings. There are certain options which apply for all schema types, and some
that apply for specific schema types.
All Schema Types

    required: boolean or function, if true adds a required validator for this property
    default: Any or function, sets a default value for the path. If the value is a function, the return value of the
            function is used as the default.
    select: boolean, specifies default projections for queries
    validate: function, adds a validator function for this property
    get: function, defines a custom getter for this property using Object.defineProperty().
    set: function, defines a custom setter for this property using Object.defineProperty().
    alias: string, mongoose >= 4.10.0 only. Defines a virtual with the given name that gets/sets this path.
    immutable: boolean, defines path as immutable. Mongoose prevents you from changing immutable paths unless
               the parent document has isNew: true.
    transform: function, Mongoose calls this function when you call Document#toJSON() function, including when you
               JSON.stringify() a document.

const numberSchema = new Schema({
  integerOnly: {
    type: Number,
    get: v => Math.round(v),
    set: v => Math.round(v),
    alias: 'i'
  }
});

const Number = mongoose.model('Number', numberSchema);

const doc = new Number();
doc.integerOnly = 2.001;
doc.integerOnly; // 2
doc.i; // 2
doc.i = 3.001;
doc.integerOnly; // 3
doc.i; // 3

Indexes

You can also define MongoDB indexes using schema type options.

    index: boolean, whether to define an index on this property.
    unique: boolean, whether to define a unique index on this property.
    sparse: boolean, whether to define a sparse index on this property.

const schema2 = new Schema({
  test: {
    type: String,
    index: true,
    unique: true // Unique index. If you specify `unique: true`
    // specifying `index: true` is optional if you do `unique: true`
  }
});



String:

    - lowercase: boolean, whether to always call .toLowerCase() on the value
    - uppercase: boolean, whether to always call .toUpperCase() on the value
    - trim: boolean, whether to always call .trim() on the value
    - match: RegExp, creates a validator that checks if the value matches the given regular expression
    - enum: Array, creates a validator that checks if the value is in the given array.
    - minLength: Number, creates a validator that checks if the value length is not less than the given number
    - maxLength: Number, creates a validator that checks if the value length is not greater than the given number
    - populate: Object, sets default populate options

Number:

    - min: Number, creates a validator that checks if the value is greater than or equal to the given minimum.
    - max: Number, creates a validator that checks if the value is less than or equal to the given maximum.
    - enum: Array, creates a validator that checks if the value is strictly equal to one of the values in the given
      array.
    - populate: Object, sets default populate options

Date:

    - min: Date
    - max: Date

ObjectId:

    - populate: Object, sets default populate options

USAGE NOTES:

String:

To declare a path as a string, you may use either the String global constructor or the string 'String'.

const schema1 = new Schema({ name: String }); // name will be cast to string
const schema2 = new Schema({ name: 'String' }); // Equivalent

const Person = mongoose.model('Person', schema2);

If you pass an element that has a toString() function, Mongoose will call it, unless the element is an array or the
toString() function is strictly equal to Object.prototype.toString().

new Person({ name: 42 }).name; // "42" as a string
new Person({ name: { toString: () => 42 } }).name; // "42" as a string

// "undefined", will get a cast error if you `save()` this document
new Person({ name: { foo: 42 } }).name;

Number:

To declare a path as a number, you may use either the Number global constructor or the string 'Number'.

const schema1 = new Schema({ age: Number }); // age will be cast to a Number
const schema2 = new Schema({ age: 'Number' }); // Equivalent

const Car = mongoose.model('Car', schema2);

There are several types of values that will be successfully cast to a Number.

new Car({ age: '15' }).age; // 15 as a Number
new Car({ age: true }).age; // 1 as a Number
new Car({ age: false }).age; // 0 as a Number
new Car({ age: { valueOf: () => 83 } }).age; // 83 as a Number

If you pass an object with a valueOf() function that returns a Number, Mongoose will call it and assign the
returned value to the path.

The values null and undefined are not cast.

NaN, strings that cast to NaN, arrays, and objects that don't have a valueOf() function will all result in a
CastError once validated, meaning that it will not throw on initialization, only when validated.
Dates

Built-in Date methods are not hooked into the mongoose change tracking logic which in English means that if you
use a Date in your document and modify it with a method like setMonth(), mongoose will be unaware of this change
and doc.save() will not persist this modification. If you must modify Date types using built-in methods, tell
mongoose about the change with doc.markModified('pathToYourDate') before saving.

const Assignment = mongoose.model('Assignment', { dueDate: Date });
Assignment.findOne(function (err, doc) {
  doc.dueDate.setMonth(3);
  doc.save(callback); // THIS DOES NOT SAVE YOUR CHANGE

  doc.markModified('dueDate');
  doc.save(callback); // works
})

Buffer:

To declare a path as a Buffer, you may use either the Buffer global constructor or the string 'Buffer'.

const schema1 = new Schema({ binData: Buffer }); // binData will be cast to a Buffer
const schema2 = new Schema({ binData: 'Buffer' }); // Equivalent

const Data = mongoose.model('Data', schema2);

Mongoose will successfully cast the below values to buffers.

const file1 = new Data({ binData: 'test'}); // {"type":"Buffer","data":[116,101,115,116]}
const file2 = new Data({ binData: 72987 }); // {"type":"Buffer","data":[27]}
const file4 = new Data({ binData: { type: 'Buffer', data: [1, 2, 3]}}); // {"type":"Buffer","data":[1,2,3]}

Mixed:

An "anything goes" SchemaType. Mongoose will not do any casting on mixed paths. You can define a mixed path using
Schema.Types.Mixed or by passing an empty object literal. The following are equivalent.

const Any = new Schema({ any: {} });
const Any = new Schema({ any: Object });
const Any = new Schema({ any: Schema.Types.Mixed });
const Any = new Schema({ any: mongoose.Mixed });

Since Mixed is a schema-less type, you can change the value to anything else you like, but Mongoose loses the
ability to auto detect and save those changes. To tell Mongoose that the value of a Mixed type has changed, you
need to call doc.markModified(path), passing the path to the Mixed type you just changed.

To avoid these side-effects, a Subdocument path may be used instead.

person.anything = { x: [3, 4, { y: "changed" }] };
person.markModified('anything');
person.save(); // Mongoose will save changes to `anything`.

ObjectIds:

An ObjectId is a special type typically used for unique identifiers. Here's how you declare a schema with a path
driver that is an ObjectId:

const mongoose = require('mongoose');
const carSchema = new mongoose.Schema({ driver: mongoose.ObjectId });

ObjectId is a class, and ObjectIds are objects. However, they are often represented as strings. When you convert an
ObjectId to a string using toString(), you get a 24-character hexadecimal string:

const Car = mongoose.model('Car', carSchema);

const car = new Car();
car.driver = new mongoose.Types.ObjectId();

typeof car.driver; // 'object'
car.driver instanceof mongoose.Types.ObjectId; // true

car.driver.toString(); // Something like "5e1a0651741b255ddda996c4"

Boolean:

Booleans in Mongoose are plain JavaScript booleans. By default, Mongoose casts the below values to true:

    true
    'true'
    1
    '1'
    'yes'

Mongoose casts the below values to false:

    false
    'false'
    0
    '0'
    'no'

Any other value causes a CastError. You can modify what values Mongoose converts to true or false using the
convertToTrue and convertToFalse properties, which are JavaScript sets.

const M = mongoose.model('Test', new Schema({ b: Boolean }));
console.log(new M({ b: 'nay' }).b); // undefined

// Set { false, 'false', 0, '0', 'no' }
console.log(mongoose.Schema.Types.Boolean.convertToFalse);

mongoose.Schema.Types.Boolean.convertToFalse.add('nay');
console.log(new M({ b: 'nay' }).b); // false

Arrays:

Mongoose supports arrays of SchemaTypes and arrays of subdocuments. Arrays of SchemaTypes are also called primitive
arrays, and arrays of subdocuments are also called document arrays.

const ToySchema = new Schema({ name: String });
const ToyBoxSchema = new Schema({
  toys: [ToySchema],
  buffers: [Buffer],
  strings: [String],
  numbers: [Number]
  // ... etc
});

Arrays are special because they implicitly have a default value of [] (empty array).

const ToyBox = mongoose.model('ToyBox', ToyBoxSchema);
console.log((new ToyBox()).toys); // []

To overwrite this default, you need to set the default value to undefined

const ToyBoxSchema = new Schema({
  toys: {
    type: [ToySchema],
    default: undefined
  }
});

Note: specifying an empty array is equivalent to Mixed. The following all create arrays of Mixed:

const Empty1 = new Schema({ any: [] });
const Empty2 = new Schema({ any: Array });
const Empty3 = new Schema({ any: [Schema.Types.Mixed] });
const Empty4 = new Schema({ any: [{}] });

Maps:

New in Mongoose 5.1.0

A MongooseMap is a subclass of JavaScript's Map class. In these docs, we'll use the terms 'map' and MongooseMap
interchangeably. In Mongoose, maps are how you create a nested document with arbitrary keys.

Note: In Mongoose Maps, keys must be strings in order to store the document in MongoDB.

const userSchema = new Schema({
  // `socialMediaHandles` is a map whose values are strings. A map's
  // keys are always strings. You specify the type of values using `of`.
  socialMediaHandles: {
    type: Map,
    of: String
  }
});

const User = mongoose.model('User', userSchema);
// Map { 'github' => 'vkarpov15', 'twitter' => '@code_barbarian' }
console.log(new User({
  socialMediaHandles: {
    github: 'vkarpov15',
    twitter: '@code_barbarian'
  }
}).socialMediaHandles);

The above example doesn't explicitly declare github or twitter as paths, but, since socialMediaHandles is a map,
you can store arbitrary key/value pairs. However, since socialMediaHandles is a map, you must use .get() to get the
value of a key and .set() to set the value of a key.

const user = new User({
  socialMediaHandles: {}
});

// Good
user.socialMediaHandles.set('github', 'vkarpov15');
// Works too
user.set('socialMediaHandles.twitter', '@code_barbarian');
// Bad, the `myspace` property will **not** get saved
user.socialMediaHandles.myspace = 'fail';

// 'vkarpov15'
console.log(user.socialMediaHandles.get('github'));
// '@code_barbarian'
console.log(user.get('socialMediaHandles.twitter'));
// undefined
user.socialMediaHandles.github;

// Will only save the 'github' and 'twitter' properties
user.save();

Map types are stored as BSON objects in MongoDB. Keys in a BSON object are ordered, so this means the insertion
order property of maps is maintained.

Mongoose supports a special $* syntax to populate all elements in a map. For example, suppose your
socialMediaHandles map contains a ref:

const userSchema = new Schema({
  socialMediaHandles: {
    type: Map,
    of: new Schema({
      handle: String,
      oauth: {
        type: ObjectId,
        ref: 'OAuth'
      }
    })
  }
});
const User = mongoose.model('User', userSchema);

To populate every socialMediaHandles entry's oauth property, you should populate on socialMediaHandles.$*.oauth:

const user = await User.findOne().populate('socialMediaHandles.$*.oauth');

Getters:

Getters are like virtuals for paths defined in your schema. For example, let's say you wanted to store user profile
pictures as relative paths and then add the hostname in your application. Below is how you would structure your userSchema:

const root = 'https://s3.amazonaws.com/mybucket';

const userSchema = new Schema({
  name: String,
  picture: {
    type: String,
    get: v => `${root}${v}`
  }
});

const User = mongoose.model('User', userSchema);

const doc = new User({ name: 'Val', picture: '/123.png' });
doc.picture; // 'https://s3.amazonaws.com/mybucket/123.png'
doc.toObject({ getters: false }).picture; // '/123.png'

Generally, you only use getters on primitive paths as opposed to arrays or subdocuments. Because getters override
what accessing a Mongoose path returns, declaring a getter on an object may remove Mongoose change tracking for that
path.

const schema = new Schema({
  arr: [{ url: String }]
});

const root = 'https://s3.amazonaws.com/mybucket';

// Bad, don't do this!
schema.path('arr').get(v => {
  return v.map(el => Object.assign(el, { url: root + el.url }));
});

// Later
doc.arr.push({ key: String });
doc.arr[0]; // 'undefined' because every `doc.arr` creates a new array!

Instead of declaring a getter on the array as shown above, you should declare a getter on the url string as
shown below. If you need to declare a getter on a nested document or array, be very careful!

const schema = new Schema({
  arr: [{ url: String }]
});

const root = 'https://s3.amazonaws.com/mybucket';

// Good, do this instead of declaring a getter on `arr`
schema.path('arr.0.url').get(v => `${root}${v}`);

Schemas:

To declare a path as another schema, set type to the sub-schema's instance.

To set a default value based on the sub-schema's shape, simply set a default value, and the value will be cast
based on the sub-schema's definition before being set during document creation.

const subSchema = new mongoose.Schema({
  // some schema definition here
});

const schema = new mongoose.Schema({
  data: {
    type: subSchema
    default: {}
  }
});

Creating Custom Types:

Mongoose can also be extended with custom SchemaTypes. Search the plugins site for compatible types like
mongoose-long, mongoose-int32, and other types.

Read more about creating custom SchemaTypes here.
The `schema.path()` Function

The schema.path() function returns the instantiated schema type for a given path.

const sampleSchema = new Schema({ name: { type: String, required: true } });
console.log(sampleSchema.path('name'));
// Output looks like:

 * SchemaString {
 *   enumValues: [],
 *   regExp: null,
 *   path: 'name',
 *   instance: 'String',
 *   validators: ...

You can use this function to inspect the schema type for a given path, including what validators it has and what
the type is. */


// Creating a custom instance method (use traditional function declaration, not arrow function to ensure
// that the 'this' keyword points to this specific instance):



// NODE COMMANDS
// node
// .load product.js
// const p = new Product({name: 'Bike Bag', price: 10})
// p.greet()
// 