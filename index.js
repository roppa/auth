'use strict';

require('dotenv').config({ silent: true });

let app = require('express')();
app.set('views', './server/views');
app.set('view engine', 'ejs');

require('./server/middleware')(app);

app.listen(process.env.PORT);
