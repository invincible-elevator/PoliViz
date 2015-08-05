var express = require('express');
var app = express();
var port = process.env.PORT || 8000;
app.listen(port);
console.log('server is running on port ' + port);
