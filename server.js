'use strict';

let app = require('./index');

app.listen(process.env.PORT, () => {
  app.set('port', process.env.PORT);
});
