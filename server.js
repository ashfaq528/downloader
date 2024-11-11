const express = require('express');
const app = require('./app');
const port = process.env.PORT || 3000;

const server = app.listen(port, () => {
  console.log(`Server is start at Port ${port}`);
});

console.log(process.env.NODE_ENV);
