let input = prompt('What would you like to do ?');
const todos = ['Collect Chicken Eggs', 'Clean Litter Box'];
while (input !== 'quit' && input !== 'q') {
    if (input === 'list') {
        console.log('**************************************');
        for (let i = 0; i < todos.length; i++) {
            console.log(`${i}: ${todos[i]}`)
        }
        console.log('**************************************');
    }
    else if (input === 'new') {
        const newTodo = prompt('Ok, what is the new todo?');
        todos.push(newTodo);
        console.log(`${newTodo} added to the list!`);
    }
    else if (input === 'delete') {
        const index = parseInt(prompt('Ok, enter an index to delete:'));
        if (!Number.isNaN(index)) {
            if (index < todos.length) {
                const deleted = todos.splice(index, 1);
                console.log(`OK, deleted ${deleted[0]}`);
            }
            else if (index >= todos.length) {
                console.log(`Index ${index} out of range!`);
            }
        }
        else {
            console.log('Unknown index');
        }
    }
    input = prompt('What would you like to do ?');
}
console.log('OK, YOU QUIT THE APP!')