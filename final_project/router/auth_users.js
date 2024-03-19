const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
    let existingUser = users.filter((user)=>{ return user.username === username });
    return existingUser.length > 0;
}

const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.
    let validUsers = users.filter((user)=>{
        return (user.username === username && user.password === password)
    });    
    return validUsers.length > 0;
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  //Write your code here
    const username = req.body.username
    const password = req.body.password
    if (!username || !password) 
        return res.status(404).json({message: `Error logging in ${username}`});

    if (authenticatedUser(username, password)) {
        let accessToken = jwt.sign({ data: {username: username, password: password}}, 'access', { expiresIn: 60 * 60 });
        req.session.authorization = { accessToken, username};    
        return res.status(200).send({accessToken: accessToken});
    } else {
        return res.status(208).json({message: "Invalid Login. Check username and password"});
    }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    //Write your code here
    const isbn = req.params.isbn
    let book = books[isbn]
    let username = req.user.data.username
    if(!book)
        return res.status(300).json({message: "Unable to find the book"});
    if(!req.body.comment)
        return res.status(300).json({message: "Review should be provided"});

    book.reviews[username] = req.body.comment; 
    return res.send(`book with isbn: ${isbn} has been updated`)
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
    //Write your code here
    const isbn = req.params.isbn
    let book = books[isbn];
    let username = req.user.data.username;
    if(!book)
        return res.status(300).json({message: "Unable to find the book"});
    delete book.reviews[username]; 
    return res.send(`book with isbn: ${isbn} has been deleted successfully`)
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
