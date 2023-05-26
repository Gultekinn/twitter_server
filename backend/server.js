const express = require('express');
const bodyParser = require('body-parser');
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = 8080;

// Middleware
app.use(bodyParser.json());

// Dummy database
const users = [
  {
    id: "ajn2-sa23m-cmkd2-csmc",
    name: "Suleyman",
    surname: "Dadashov",
    email: "suleyman@code.edu.az",
    password: "password",
  },
];

const posts = [
  {
    id: "asc-a123-cxaz-123-acasdas",
    description: "lorem ipsum dolor",
    createdOn: "17.01.2023",
    user: {
      id: "ajn2-sa23m-cmkd2-csmc",
      name: "Suleyman",
      surname: "Dadashov",
      email: "suleyman@code.edu.az"
    }
  }
];

let isLoggedIn = false;

// Login middleware
const requireLogin = (req, res, next) => {
  if (!isLoggedIn) {
    return res.sendStatus(401);
  }
  next();
};

// API endpoints
app.get('/api/users', (req, res) => {
  res.json(users);
});

app.put('/api/users/:id', requireLogin, (req, res) => {
  const { id } = req.params;
  const { name, surname, age } = req.body;

  const user = users.find((user) => user.id === id);
  if (!user) {
    return res.sendStatus(204);
  }

  if (name) {
    user.name = name;
  }
  if (surname) {
    user.surname = surname;
  }
  if (age) {
    user.age = age;
  }

  res.json(user);
});

app.delete('/api/users/:id', requireLogin, (req, res) => {
  const { id } = req.params;
  const index = users.findIndex((user) => user.id === id);

  if (index === -1) {
    return res.sendStatus(204);
  }

  users.splice(index, 1);
  res.sendStatus(200);
});

app.post('/api/register', (req, res) => {
  const { name, surname, age, email, password } = req.body;

  const existingUser = users.find((user) => user.email === email);
  if (existingUser) {
    return res.status(400).json({ message: 'User already exists' });
  }

  const newUser = {
    id: uuidv4(),
    name,
    surname,
    age,
    email,
    password,
  };

  users.push(newUser);
  res.sendStatus(201);
});

app.post('/api/login', (req, res) => {
  const { email, password } = req.body;

  const user = users.find((user) => user.email === email
  && user.password === password);

  if (!user) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  isLoggedIn = true;
  res.sendStatus(200);
});

app.post('/api/logout', requireLogin, (req, res) => {
  isLoggedIn = false;
  res.sendStatus(200);
});

app.get('/api/posts', (req, res) => {
  res.json(posts);
});

app.post('/api/posts', requireLogin, (req, res) => {
  const { description, userId } = req.body;

  const user = users.find((user) => user.id === userId);
  if (!user) {
    return res.status(400).json({ message: 'User not found' });
  }

  const newPost = {
    id: uuidv4(),
    description,
    createdOn: new Date().toLocaleDateString(),
    user,
  };

  posts.push(newPost);
  res.sendStatus(201);
});

app.put('/api/posts/:id', requireLogin, (req, res) => {
  const { id } = req.params;
  const { description } = req.body;

  const post = posts.find((post) => post.id === id);
  if (!post) {
    return res.sendStatus(204);
  }

  post.description = description;
  res.json(post);
});

app.delete('/api/posts/:id', requireLogin, (req, res) => {
  const { id } = req.params;
  const index = posts.findIndex((post) => post.id === id);

  if (index === -1) {
    return res.sendStatus(204);
  }

  posts.splice(index, 1);
  res.sendStatus(200);
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
