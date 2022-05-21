// Set the mongodb server ip, port and the database name you want to connect to. The 'test' database specified in 
// the connection will be created automatically if the database doesn't exist
// THE MONGODB DATABASE SERVER SERVICE (DAEMON) MUST BE RUNNING (mongod) for the connection to work. In wsl2, run the
// mongod command and let it keep running in a seperate terminal
// The maximum port number is 65535

// MONGODB INSTALLATION IN WSL2:
// sudo apt-get update -y
// sudo apt-get install -y mongodb
// cd /
// sudo mkdir -p /data/db 
// sudo chown -R `id -un` data/db 

const mongoose = require('mongoose');

// Connection error handling
// main().catch(err => console.log(err));

// // Asynchronous function to connect to the MongoDB resource
// async function main() {
//     await mongoose.connect('mongodb://localhost:27017/test');
//     console.log('CONNECTION OPENED!!');
// }

// The movieApp database will be created since it does not exist
mongoose.connect('mongodb://localhost:27017/movieApp')
  .then(() => {
    console.log('CONNECTION OPEN!!!');
  })
  .catch(err => {
    console.log('OH NO ERROR!!!');
    console.log(err);
  });

// Everything in Mongoose starts with a Schema. Each schema maps to a MongoDB collection and defines the shape
// of the documents within that collection.

// import mongoose from 'mongoose';
// const { Schema } = mongoose;

// const blogSchema = new Schema({
//   title:  String, // String is shorthand for {type: String}
//   author: String,
//   body:   String,
//   comments: [{ body: String, date: Date }],
//   date: { type: Date, default: Date.now },
//   hidden: Boolean,
//   meta: {
//     votes: Number,
//     favs:  Number
//   }
// });



// If you want to add additional keys later, use the Schema.add method.

// Each key in our code blogSchema defines a property in our documents which will be cast to its associated SchemaType.
// For example, we've defined a property title which will be cast to the String SchemaType and property date which will
//  be cast to a Date SchemaType.

// Notice above that if a property only requires a type, it can be specified using a shorthand notation
// (contrast the title property above with the date property).

// Keys may also be assigned nested objects containing further key/type definitions like the meta property above.
// This will happen whenever a key's value is a POJO that doesn't have a type property.

// In these cases, Mongoose only creates actual schema paths for leaves in the tree. (like meta.votes and meta.favs above),
// and the branches do not have actual paths. A side-effect of this is that meta above cannot have its own validation.
// If validation is needed up the tree, a path needs to be created up the tree - see the Subdocuments section for more
// information on how to do this. Also read the Mixed subsection of the SchemaTypes guide for some gotchas.

// The permitted SchemaTypes are:

// String
// Number
// Date
// Buffer (Buffer type is used when you usually work with items that get saved in binary form, a good example would be images.)
// Boolean
// Mixed (Since it is a schema-less type, you can change the value to anything else you like, 
//        but Mongoose loses the ability to auto detect/save those changes. To "tell" Mongoose that the value of a 
//        Mixed type has changed, call the .markModified(path) method of the document passing the path to the 
//        Mixed type you just changed.)
// ObjectId (Hash ID)
// Array
// Decimal128
// Map

// Read more about SchemaTypes here: https://mongoosejs.com/docs/schematypes.html

// Schemas not only define the structure of your document and casting of properties, they also define document instance
// methods, static Model methods, compound indexes, and document lifecycle hooks called middleware.


// REFER THE MONGOOSE GETTING STARTED GUIDE https://mongoosejs.com/docs/guide.html FOR FURTHER DETAILS


// Our schema for each movie

// {
//     title: 'Amadeus',
//     year: 1986,
//     score: 9.2,
//     rating: 'R'
// }

const movieSchema = new mongoose.Schema({
  title: String,
  year: Number,
  score: Number,
  rating: String
});


// Models are fancy constructors compiled from Schema definitions. An instance of a model is called a document.
// Models are responsible for creating and reading documents from the underlying MongoDB database.
// When you call mongoose.model() on a schema, Mongoose compiles a model for you.

// const schema = new mongoose.Schema({ name: 'string', size: 'string' });
// const Tank = mongoose.model('Tank', schema);

// The first argument is the singular name of the collection your model is for. 
// Mongoose automatically looks for the plural, lowercased version of your model name. Thus, for the example above, 
// the model Tank is for the tanks collection in the database.
// In our case, the model 'Movie' is for the 'movies' collection in the database.

// Note: The .model() function makes a copy of schema. Make sure that you've added everything you want to schema, 
// including hooks, before calling .model()!

const Movie = mongoose.model('Movie', movieSchema); // Create a collection or Model Class called 'Movie' 

// An instance of a model is called a document.

// const Tank = mongoose.model('Tank', yourSchema);

// const small = new Tank({ size: 'small' });
// small.save(function (err) {
//   if (err) return handleError(err);
//   // saved!
// });

// // or

// Tank.create({ size: 'small' }, function (err, small) {
//   if (err) return handleError(err);
//   // saved!
// });

// // or, for inserting large batches of documents
// Tank.insertMany([{ size: 'small' }], function(err) {

// });

// Note that no tanks will be created/removed until the connection your model uses is open.
// Every model has an associated connection. When you use mongoose.model(), your model will use the default
// mongoose connection.

// mongoose.connect('mongodb://localhost/gettingstarted');

// If you create a custom connection, use that connection's model() function instead.

// const connection = mongoose.createConnection('mongodb://localhost:27017/test');
// const Tank = connection.model('Tank', yourSchema);

// Document and Model are distinct classes in Mongoose. The Model class is a subclass of the Document class.
// When you use the Model constructor, you create a new document.
// In Mongoose, a "document" generally means an instance of a model. You should not have to create an instance of
// the Document class without going through a model.
// When you load documents from MongoDB using model functions like findOne(), you get a Mongoose document back.


// Creating an instance of the 'Movie' Model (a document)
const amadeus = new Movie({ title: 'Amadeus', year: 1986, score: 9.2, rating: 'R' })

// When the script is run, you can check in mongo shell that nothing is returned when you query the movie Collection
// with 'db.movies.find({})'

// We can save the Model instance as a document in the database using .save()
// The save() method returns a promise. If save() succeeds, the promise resolves to the document that was saved.
// If the document with the corresponding _id is not found, Mongoose will report a DocumentNotFoundError
// Mongoose documents track changes. You can modify a document using vanilla JavaScript assignments and Mongoose will
// convert it into MongoDB update operators.

// The save() function is generally the right way to update a document with Mongoose. With save(), you get full validation and middleware.

// For cases when save() isn't flexible enough, Mongoose lets you create your own MongoDB updates with
// casting, middleware, and limited validation.

// // Update all documents in the `mymodels` collection
// await MyModel.updateMany({}, { $set: { name: 'foo' } });

// Note that update(), updateMany(), findOneAndUpdate(), etc. do not execute save() middleware.
// If you need save middleware and full validation, first query for the document and then save() it.


// Documents are casted and validated before they are saved. Mongoose first casts values to the specified type
// and then validates them. Internally, Mongoose calls the document's validate() method before saving.

// const schema = new Schema({ name: String, age: { type: Number, min: 0 } });
// const Person = mongoose.model('Person', schema);

// let p = new Person({ name: 'foo', age: 'bar' });
// // Cast to Number failed for value "bar" at path "age"
// await p.validate();

// let p2 = new Person({ name: 'foo', age: -1 });
// // Path `age` (-1) is less than minimum allowed value (0).
// await p2.validate();

// Mongoose also supports limited validation on updates using the runValidators option. Mongoose casts parameters
// to query functions like findOne(), updateOne() by default. However, Mongoose does not run validation on query function
// parameters by default. You need to set runValidators: true for Mongoose to validate.

// // Cast to number failed for value "bar" at path "age"
// await Person.updateOne({}, { age: 'bar' });

// // Path `age` (-1) is less than minimum allowed value (0).
// await Person.updateOne({}, { age: -1 }, { runValidators: true });


await amadeus.save();

// Now check in mongo:
// use movieApp
// db.movies.find({})

// Any changes made to the document / Model instance must be saved to reflect in the database
amadeus.score = 9.5;
amadeus.save();

// Check out https://mongoosejs.com/docs/api/model.html for Model methods in mongoose

// Insert many documents into the collection at once using Mongoose Model's method
// Returns a promise resolving to the raw result from the MongoDB driver if `options.rawResult` was `true`,
// or the documents that passed validation, otherwise
Movie.insertMany([
  { title: 'Amelie', year: 2001, score: 8.3, rating: 'R' },
  { title: 'Alien', year: 1979, score: 8.1, rating: 'R' },
  { title: 'The Iron Giant', year: 1999, score: 7.5, rating: 'PG' },
  { title: 'Stand By Me', year: 1986, score: 8.6, rating: 'R' },
  { title: 'Moonrise Kingdom', year: 2012, score: 7.3, rating: 'PG-13' }
])
  .then(data => {
    console.log('IT WORKED!!');
    // console.log(data);
    // use db.movies.drop() to remove the collection from mongo and prevent repeat insertions
  })
/* 
Finding documents is easy with Mongoose, which supports the rich query syntax of MongoDB.
A mongoose query can be executed in one of two ways. First, if you pass in a callback function,
Mongoose will execute the query asynchronously and pass the results to the callback.

A query also has a .then() function, and thus can be used as a promise.

Documents can be retrieved using a model's find, findById, findOne, or where static methods.
Model.find() is very similar to native mongo db.collection.find() command
We need to wait to get the data back from mongo because finding stuff / querying takes time

Examples:

// find all documents
await MyModel.find({});

// find all documents named john and at least 18
await MyModel.find({ name: 'john', age: { $gte: 18 } }).exec();

// executes, passing results to callback
MyModel.find({ name: 'john', age: { $gte: 18 }}, function (err, docs) {});

// executes, name LIKE john and only selecting the "name" and "friends" fields
await MyModel.find({ name: /john/i }, 'name friends').exec();

// passing options
await MyModel.find({ name: /john/i }, null, { skip: 10 }).exec();

When executing a query with a callback function, you specify your query as a JSON document.
The JSON document's syntax is the same as the MongoDB shell.

const Person = mongoose.model('Person', yourSchema);

// find each person with a last name matching 'Ghost', selecting the `name` and `occupation` fields
Person.findOne({ 'name.last': 'Ghost' }, 'name occupation', function (err, person) {
  if (err) return handleError(err);
  // Prints "Space Ghost is a talk show host".
  console.log('%s %s is a %s.', person.name.first, person.name.last,
    person.occupation);
});

Mongoose executed the query and passed the results to callback. All callbacks in Mongoose use the
pattern: callback(error, result). If an error occurs executing the query, the error parameter will
contain an error document, and result will be null. If the query is successful, the error parameter will
be null, and the result will be populated with the results of the query.

Anywhere a callback is passed to a query in Mongoose, the callback follows the pattern
callback(error, results). What results is depends on the operation: For findOne() it is a potentially-null
single document, find() a list of documents, count() the number of documents, update() the number of documents
affected, etc. The API docs for Models provide more detail on what is passed to the callbacks.

Now let's look at what happens when no callback is passed:

// find each person with a last name matching 'Ghost'
const query = Person.findOne({ 'name.last': 'Ghost' });

// selecting the `name` and `occupation` fields
query.select('name occupation');

// execute the query at a later time
query.exec(function (err, person) {
  if (err) return handleError(err);
  // Prints "Space Ghost is a talk show host."
  console.log('%s %s is a %s.', person.name.first, person.name.last,
    person.occupation);
});

In the above code, the query variable is of type Query. A Query enables you to build up a query using
chaining syntax, rather than specifying a JSON object. The below 2 examples are equivalent.

// With a JSON doc
Person.
  find({
    occupation: /host/,
    'name.last': 'Ghost',
    age: { $gt: 17, $lt: 66 },
    likes: { $in: ['vaporizing', 'talking'] }
  }).
  limit(10).
  sort({ occupation: -1 }).
  select({ name: 1, occupation: 1 }).
  exec(callback);

// Using query builder
Person.
  find({ occupation: /host/ }).
  where('name.last').equals('Ghost').
  where('age').gt(17).lt(66).
  where('likes').in(['vaporizing', 'talking']).
  limit(10).
  sort('-occupation').
  select('name occupation').
  exec(callback);




Mongoose queries are not promises. They have a .then() function for co and async/await as a convenience.
However, unlike promises, calling a query's .then() can execute the query multiple times.

For example, the below code will execute 3 updateMany() calls, one because of the callback, and two because .then() is called twice.

const q = MyModel.updateMany({}, { isDeleted: true }, function() {
  console.log('Update 1');
});

q.then(() => console.log('Update 2'));
q.then(() => console.log('Update 3'));

Don't mix using callbacks and promises with queries, or you may end up with duplicate operations. That's because passing a callback to a query function immediately executes the query, and calling then() executes the query again.

Mixing promises and callbacks can lead to duplicate entries in arrays. For example, the below code inserts 2 entries into the tags array, not just 1.

const BlogPost = mongoose.model('BlogPost', new Schema({
  title: String,
  tags: [String]
}));

// Because there's both `await` **and** a callback, this `updateOne()` executes twice
// and thus pushes the same string into `tags` twice.
const update = { $push: { tags: ['javascript'] } };
await BlogPost.updateOne({ title: 'Introduction to Promises' }, update, (err, res) => {
  console.log(res);
});



References to other documents

There are no joins in MongoDB but sometimes we still want references to documents in other collections.
This is where population comes in. Read more about how to include documents from other collections in your
query results here.
Streaming

You can stream query results from MongoDB. You need to call the Query#cursor() function to return an
instance of QueryCursor.

const cursor = Person.find({ occupation: /host/ }).cursor();

for (let doc = await cursor.next(); doc != null; doc = await cursor.next()) {
  console.log(doc); // Prints documents one at a time
}

Iterating through a Mongoose query using async iterators also creates a cursor.

for await (const doc of Person.find()) {
  console.log(doc); // Prints documents one at a time
}

Cursors are subject to cursor timeouts. By default, MongoDB will close your cursor after 10 minutes and
subsequent next() calls will result in a MongoServerError: cursor id 123 not found error. To override this,
set the noCursorTimeout option on your cursor.

// MongoDB won't automatically close this cursor after 10 minutes.
const cursor = Person.find().cursor().addCursorFlag('noCursorTimeout', true);

However, cursors can still time out because of session idle timeouts. So even a cursor with noCursorTimeout set
will still time out after 30 minutes of inactivity. You can read more about working around session idle timeouts
in the MongoDB documentation.




Versus Aggregation

Aggregation can do many of the same things that queries can. For example, below is how you can use aggregate() to
find docs where name.last = 'Ghost':

const docs = await Person.aggregate([{ $match: { 'name.last': 'Ghost' } }]);

However, just because you can use aggregate() doesn't mean you should. In general, you should use queries where
possible, and only use aggregate() when you absolutely need to.

Unlike query results, Mongoose does not hydrate() aggregation results. Aggregation results are always POJOs,
not Mongoose documents.

const docs = await Person.aggregate([{ $match: { 'name.last': 'Ghost' } }]);

docs[0] instanceof mongoose.Document; // false

Also, unlike query filters, Mongoose also doesn't cast aggregation pipelines. That means you're responsible
for ensuring the values you pass in to an aggregation pipeline have the correct type.

const doc = await Person.findOne();

const idString = doc._id.toString();

// Finds the `Person`, because Mongoose casts `idString` to an ObjectId
const queryRes = await Person.findOne({ _id: idString });

// Does **not** find the `Person`, because Mongoose doesn't cast aggregation
// pipelines.
const aggRes = await Person.aggregate([{ $match: { _id: idString } }])


TRY THE COMMANDS BELOW IN NODE REPL AFTER LOADING index.js USING '.load index.js' BY RUNNING 'node' IN
THE SAME DIRECTORY

Movie.find({}).then(data => {console.log(data)}); // returns a thenable object, not a promise
Movie.find({year: {$lte: 1990}}).then(data => {console.log(data)})
Movie.findOne({}).then(m => {console.log(m)}) // returns only the first movie document in the movies collection
Movie.find({_id: '626833a355e4b27141a6c517'}).then(m => console.log(m)) // Works
Movie.findById('626833a355e4b27141a6c517').then(m => console.log(m)) // much better option to find by ID


Using the .exec() method on a query returns us an actual full Promise instead of a thenable object
We can use async / await keywords with a function that uses this .exec() method to execute queries.
IT IS A GOOD PRACTICE TO USE .exec() AS IT GIVES A BETTER STACK TRACE - TACING WHERE THINGS WENT WRONG WHEN YOU ERROR!



Model.update() Updates one document in the database without returning it. This is a deprecated method.
Use Model.updateOne() or Model.updateMany() which behave in a similar way to update one or many documents.
Movie.updateOne({title: 'Amadeus'}, {year: 1984}).then(res => console.log(res)) // remember, this does not
    return the updated document, but return an object with information about the modification process
Movie.updateMany({title: {$in: ['Amadeus', 'Stand By Me']}}, {score: 10}).then(res => console.log(res))

check from mongo with 'use movieApp' followed by db.movies.find({title: {$in: ['Amadeus', 'Stand By Me']}})



The methods findByIdAndUpdate() and findOneAndUpdate() find a matching document, updates it according to the
update arg, passing any options recieved, and return the found document (if any) to the callback.
The query executes if callback is passed else a Query object is returned.
All top level update keys which are not atomic operation names are treated as set operations:
Example:

const query = { name: 'borne' };
Model.findOneAndUpdate(query, { name: 'jason bourne' }, options, callback)

// is sent as
Model.findOneAndUpdate(query, { $set: { name: 'jason bourne' }}, options, callback)

This helps prevent accidentally overwriting your document with { name: 'jason bourne' }.

Note:

findOneAndX and findByIdAndX functions support limited validation that you can enable by setting the
runValidators option.

If you need full-fledged validation, use the traditional approach of first retrieving the document.

const doc = await Model.findById(id);
doc.name = 'jason bourne';
await doc.save();


TRY THESE UPDATE COMMANDS IN NODE REPL:
Movie.findOneAndUpdate({title: 'The Iron Giant'}, {score: 7.0}).then(m => console.log(m))
By default, the .findOneAndUpdate() method will return the original un-updated version of the document that
is being queried and updated. We can add a third argument to the method with {new: true} to return the updated
version of the document like so:
Movie.findOneAndUpdate({title: 'The Iron Giant'}, {score: 7.8}, {new: true}).then(m => console.log(m))


Model.remove() Removes all documents that match conditions from the collection. To remove just the first document
that matches conditions, set the single option to true. This method is deprecated. This method sends a remove command
directly to MongoDB, no Mongoose documents are involved. Because no Mongoose documents are involved, Mongoose
does not execute document middleware. Model.remove() is a deprecated method. Use Model.deleteOne() or
Model.deleteMany() instead.
The Model.remove() method also does not return a document, it only returns an object with details of modification

Movie.remove({title: 'Amelie'}).then(msg => console.log(msg)) // Provides a Deprecation warning
Movie.deleteMany({year: {$gte: 1999}}).then(msg => console.log(msg)) // Check using sb.movies.find({}) in mongo
Movie.findOneAndDelete({title: 'Alien'}).then(m => console.log(m)) // This method returns the deleted document */