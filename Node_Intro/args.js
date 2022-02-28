// console.log('HELLO FROM ARGS FILE!!');
console.log(process.argv); // prints command-line arguments given, only works when a JS script is executed through Node
// returns only the node executable path in REPL
// 'node args.js' returns both the node executable path and this script path
// When additional space seperated arguments are supplied, they will be shown in the output
// 'node args.js puppies chickens hello' returns:
// [
//     '/home/vavish/miniconda3/bin/node',
//     '/mnt/c/Users/pdcdi/Documents/Web Dev/Node_Intro/args.js',
//     'puppies',
//     'chickens',
//     'hello'
// ]