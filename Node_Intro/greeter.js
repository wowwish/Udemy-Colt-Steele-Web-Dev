const args = process.argv.slice(2); // keep only elements with index >= 2
for (let arg of args) {
    console.log(`Hi there, ${arg}`);
}

// 'node greeter.js Ram Bheem'