const express = require('express');     // import Express

// !!!! DEPRECATED !!!
// const Joi = require('joi');          // import Joi - used for validation
const Joi = require('@hapi/joi');       // import Joi - used for validation

const app = express();                  // create Express Application on the app variable
app.use(express.json());                // use JSON
 

// **** data for the server (we do not have a DB at this time) ****
const books = [
{title: 'Get Programming with Node.js', id: 1},
{title: 'Hacker\'s Delight', id: 2},
{title: 'Deep Learning', id: 3},
{title: 'Work Deep', id: 4},
{title: 'Head First Java', id: 5}
]


// **** READ request handlers ****
app.get('/', (req, res) => {
    res.send('<h3>Welcome to this REST API demo with Node.js !!!</h3>');
});

// **** display list of books ****
app.get('/api/books', (req,res)=> {
    res.send(books);
});

// **** get book by id ****
app.get('/api/books/:id', (req, res) => {
const book = books.find(c => c.id === parseInt(req.params.id));
 
if (!book)
    res.status(404).send('<h2 style="font-family: Courier; color: red;">Not found!!!</h2>');

res.send(book);
});


// **** CREATE request handler ****
app.post('/api/books', (req, res)=> {
 
const { error } = validateBook(req.body);
if (error){
    res.status(400).send(error.details[0].message)
    return;
}

// **** add book and next available ID ****
const book = {
    id: books.length + 1,
    title: req.body.title
};

books.push(book);

// ???? ????
console.log("create title: " + book.title);

// **** ****
res.send(book);
});
 

// **** UPDATE book by ID request handler ****
app.put('/api/books/:id', (req, res) => {
const book = books.find(c=> c.id === parseInt(req.params.id));
if (!book)
    res.status(404).send('<h2 style="font-family: Courier; color: red;">Not found!!! </h2>');
 
const { error } = validateBook(req.body);
if (error){
    res.status(400).send(error.details[0].message);
    return;
}

// ???? ????
console.log("update title: " + req.body.title);

// **** ****
book.title = req.body.title;
res.send(book);
});


// **** DELETE request handler ****
app.delete('/api/books/:id', (req, res) => {
 
const book = books.find( c=> c.id === parseInt(req.params.id));
if(!book)
    res.status(404).send('<h2 style="font-family: Courier; color: red;"> Not found!!! </h2>');
 
const index = books.indexOf(book);

// **** remove book from DB (array for now) ****
books.splice(index,1);

// ???? ????
console.log("delete title: " + book.title);

// **** ****
res.send(book);
});


// **** ****
function validateBook(book) {
const schema = Joi.object().keys({
    title: Joi.string().min(3).required()
});
return Joi.object(this.schema).validate(book);
}


// **** PORT environment variable ****
const port = process.env.PORT || 8080;
app.listen(port, () => console.log(`listening on port ${port} ...`));