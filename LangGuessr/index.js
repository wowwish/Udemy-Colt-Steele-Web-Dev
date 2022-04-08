// Node.js has two module systems: CommonJS modules and ECMAScript modules.
// Authors can tell Node.js to use the ECMAScript modules loader via the .mjs file extension, 
// the package.json "type" field, or the --input-type flag. Outside of those cases, Node.js will use the CommonJS module loader. 


// Node.js will treat the following as ES modules when passed to node as the initial input, or when referenced by import statements 
// or import() expressions:

//   *  Files with an .mjs extension.

//   *  Files with a .js extension when the nearest parent package.json file contains a top-level "type" field with a value of "module".

//   *  Strings passed in as an argument to --eval, or piped to node via STDIN, with the flag --input-type=module.

// Node.js will treat as CommonJS all other forms of input, such as .js files where the nearest parent package.json file contains no 
// top-level "type" field, or string input without the flag --input-type. This behavior is to preserve backward compatibility. 
// However, now that Node.js supports both CommonJS and ES modules, it is best to be explicit whenever possible. 
// Node.js will treat the following as CommonJS when passed to node as the initial input, or when referenced by import statements, 
// import() expressions, or require() expressions:

//   *  Files with a .cjs extension.

//   *  Files with a .js extension when the nearest parent package.json file contains a top-level field "type" with a value of "commonjs".

//   *  Strings passed in as an argument to --eval or --print, or piped to node via STDIN, with the flag --input-type=commonjs.

// Package authors should include the "type" field, even in packages where all sources are CommonJS. 
// Being explicit about the type of the package will future-proof the package in case the default type of Node.js ever changes, 
// and it will also make things easier for build tools and loaders to determine how the files in the package should be interpreted.

// Add "type: module" in the package.json file for both franc and langs to load them as ES modules.
import { franc } from 'franc';  // ESM module
// 'npm i  @types/langs' for type 'any' in langs error
// Refer https://stackoverflow.com/questions/41292559/could-not-find-a-declaration-file-for-module-module-name-path-to-module-nam

// both 'colors' and 'langs' are CommonJS modules
// So basically we can't use import (newer syntax with ESM) and require (older syntax with CommonJS) together in the same file 
// unless we do some extra work.

// FIX:
// const require = createRequire(import.meta.url)
// const langs = require ('langs');
// const colors = require('colors');
// where we use import { function } from 'module'; syntax, but in order to use require alongside this syntax we have to pull it 
// from the "module" module. For all of this to work you need a version of node greater than or equal to 12.

// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules

import langs from 'langs'; // CommonJS module
import colors from 'colors'; // CommonJS module


const langCode = franc(process.argv[2]);
if (langCode === 'und') {
    console.log('No language detected for the given string ! Try adding more words !'.red);
}
else if (langs.where('3', langCode) === undefined) {
    console.log('SORRY, the language of the given sentence could not be predicted !'.red);
}
else {
    console.log(langs.where('3', langCode).name.green);
}

