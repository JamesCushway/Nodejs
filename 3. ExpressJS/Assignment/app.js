const express = require('express');

const app = express();

/* Task 1 */
// app.use((req, res, next) => {
//   console.log('First Middleware function');
//   next();
// });
//
// app.use((req, res, next) => {
//   console.log("Second Middleware Function");
//   res.json('hello');
// });

/* Task 2 */
app.use('/users', (req, res, next) => {
  console.log("this is the users page");
});

app.use('/', (req, res, next) => {
  console.log("This is the default page");
});

app.listen(3000);