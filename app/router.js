'use strict';

const multer = require('koa-multer');

const upload = multer({ dest: 'uploads/' });

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller } = app;
  router.get('/', controller.home.index);
  router.get('/homeworks', controller.homework.index);
  router.get('/homeworks/:id', controller.homework.show);
  router.post('/homeworks', upload.fields([{ name: 'report', maxCount: 1 }, { name: 'homework', maxCount: 1 }]), controller.homework.create);
};
