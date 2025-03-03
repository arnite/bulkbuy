const dotenv = require('dotenv');
dotenv.config({ path: './.env' });
const app = require('./app');

//Server connection
const port = process.env.PORT;
app.listen(port, () => {
  console.log(`App running on port ${port}`);
});
