const route = require('express').Router();

route.use(require('./user').route);
route.use('/campgrounds',require('./campgrounds').route);
route.use('/campgrounds/:id/comments',require('./comments').route);

module.exports = { route };
