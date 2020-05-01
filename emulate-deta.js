const app = require('.')
const port = process.env.PORT || 8080;
app.listen(port);
console.log(`Listening http://localhost:${port}`);
