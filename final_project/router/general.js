const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

public_users.post("/register", (req,res) => {
  //Write your code here
    if(!req.body.username)
        return res.send("Username is mandatory!")

    if(!req.body.password)
        return res.send("Password is mandatory!")

    let existingUser = users.find(user => user.username === req.body.username);
    if(existingUser && existingUser.username)
        return res.send("ERROR! The user" + (' ')+ (req.body.username) + " already exist!")

    users.push({"username":req.body.username,"password":req.body.password});
    res.send("The user" + (' ')+ (req.body.username) + " Has been added!")
    });

const getBooksPromise = new Promise( (resolve, reject) => {
    try{
        const data = books;
        resolve(data)
    }catch(err){
        reject(err)
    }
})

// Get the book list available in the shop
public_users.get('/',async function (req, res) {
  //Write your code here
  getAllBooks.then(
    (data) => res.send(data,null,4),
    (err) => res.send("couldnt find any books")
  )
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', async function (req, res) {
  //Write your code here
  try{
    const isbn = req.params.isbn
    const bookDetails = await getBooksPromise
    if (bookDetails[isbn]) {
        return res.json(bookDetails[isbn]);
    } else {
        return res.status(404).send(`Could not find a book with ISBN: ${isbn}`);
    }
    } catch (error) {
    console.error("Error getting book details:", error);
    return res.status(500).send("Internal Server Error");
  }
});
 
// Get book details based on author
public_users.get('/author/:author',async function (req, res) {
  //Write your code here
  try {
    const author = req.params.author
    const booksByAuthor = await getBooksPromise
    books_filtered = Object.values(booksByAuthor).filter(book => book.author == author)
    return res.json(books_filtered)
} catch (error) {
    console.error("Error getting books by the author:", error);
    return res.status(500).send("Internal Server Error");
}
});

// Get all books based on title
public_users.get('/title/:title',async function (req, res) {
  //Write your code here
    try {
        const title = req.params.title
        const booksByTitle = await getBooksPromise
        books_filtered = Object.values(booksByTitle).filter(book => book.title == title)
        res.json(books_filtered)
    } catch (error) {
        console.error("Error getting book by title:", error);
        return res.status(500).send("Internal Server Error");
    }
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  const isbn = req.params.isbn
  if (books[isbn].reviews && Object.keys(books[isbn].reviews).length > 0) return res.send(JSON.stringify(books[isbn].reviews))
  else return res.send(`couldnt find reviews for the book with isbn of : ${isbn}`)
});

module.exports.general = public_users;
