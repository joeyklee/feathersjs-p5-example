const client = feathers();

// Connect to a different URL
const restClient = feathers.rest('http://localhost:3030') // for dev
// Configure an AJAX library (see below) with that client 
client.configure(restClient.fetch(window.fetch));
const todos = client.service('todos');

let todoForm;
let deleteContainer;

let myData = [];

function setup(){

    createCanvas(400, 400).parent('#get-sketch-container');

    todoForm = select("#todo-form");
    todoForm.elt.addEventListener('submit', postData);

    deleteContainer = select("#delete-items-container")

    // initialize by getting the data in the database
    getData();
    // initalize the buttons 
    createRemoveItems();
    
}

function draw(){   
    randomSeed(1);
    background(200);
    
    myData.forEach( (item, idx) => {
        text(item.todo,  random(width), random(height) );
    })
}

async function deleteSelected(e){
    try {
        e.preventDefault();
        console.log(e.currentTarget.id)
        await todos.remove(e.currentTarget.id);
        await getData()
    }catch(err){
        return err
    }
}

async function createRemoveItems(){
    try{
        deleteContainer.elt.innerHTML = "";
        const {data} = await todos.find()
        data.forEach(item => {
            let removeBtn = createElement('button', item.todo).parent('#delete-items-container');
            removeBtn.id(item._id);
            removeBtn.elt.addEventListener('click', deleteSelected);
        });
    } catch(err){
        return err;
    }
}



async function postData(e){
    try {
        e.preventDefault();    
        const newForm = new FormData(e.currentTarget)
        const newTodo = newForm.get('todo');

        await todos.create({todo: newTodo})
        await getData()
    }catch(err){
        return err
    }
}


async function getData(){
    try {
        const retrievedData = await todos.find()
        console.log('my new data', retrievedData);
        myData = retrievedData.data;
        // make sure to update our remove items buttons
        await createRemoveItems()
    }catch(err){
        return err;
    }
}

