const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;
    // Check if both username and password are provided
    if (username && password) {
        // Check if the user does not already exist
        if (!isValid(username)) {
            // Add the new user to the users array
            users.push({"username": username, "password": password});
            return res.status(200).json({message: "User successfully registered. Now you can login"});
        } else {
            return res.status(404).json({message: "User already exists!"});
        }
    }
    // Return error if username or password is missing
    return res.status(404).json({message: "Unable to register user."});
});

// Get the book list available in the shop
public_users.get('/', function (req, res) {
  new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(books);
    }, 100);  
  })
  .then((result) => {
    res.status(200).json(result); 
  })
  .catch((error) => {
    res.status(500).json({ message: "Internal Server Error" }); // Manejo de errores
  });
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  const isbn = req.params.isbn; 

  if (books[isbn]) {
    return res.status(200).json(books[isbn]); // Enviamos el libro con estado 200
  } else {
    return res.status(404).json({ message: "Book not found" });
  }
});
  
// Get book details based on author
public_users.get('/author/:author',async function (req, res) {
  const author = req.params.author;
  try {
    // Simulamos una operación asíncrona, como una llamada a una base de datos
    const filteredBooks = await new Promise((resolve, reject) => {
      const result = Object.values(books).filter(book => book.author === author);
      resolve(result);
    });

    if (filteredBooks.length > 0) {
      return res.status(200).json(filteredBooks); // Enviamos los libros del autor
    } else {
      return res.status(404).json({ message: "Author not found" });
    }
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  const title = req.params.title;

  // Filtramos los libros por título
  const filteredBooks = Object.values(books).filter(book => book.title === title);

  if (filteredBooks.length > 0) {
    return res.status(200).json(filteredBooks); // Enviamos los libros que coinciden con el título
  } else {
    return res.status(404).json({ message: "Title not found" });
  }
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  const review = req.params.review;

  // Simulamos una operación asíncrona con una promesa
  new Promise((resolve, reject) => {
    
    // Verificamos si el libro existe
    if (books[isbn]) {
      const reviews = books[isbn].reviews || {}; // Aseguramos que existan reseñas
      resolve(reviews); // Resolvemos la promesa con las reseñas
    } else {
      reject(new Error("Book not found")); // Rechazamos la promesa si no se encuentra el libro
    }
  })
  .then((reviews) => {
    return res.status(200).json(reviews); // Enviamos las reseñas con estado 200
  })
  .catch((error) => {
    return res.status(404).json({ message: error.message }); // Enviamos un error 404 si el libro no se encuentra
  });
});

module.exports.general = public_users;
