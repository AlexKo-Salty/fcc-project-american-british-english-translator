'use strict';

const Translator = require('../components/translator.js');

module.exports = function (app) {
  
  const translator = new Translator();

  app.use(function(req, res, next) {
    console.log(req.body, req.originalUrl, req.method);
    next();
  });
  
  app.route('/api/translate')
    .post((req, res) => {
      let text = req.body.text;
      let locale = req.body.locale;

      let result = translator.translate(text, locale);
      if (result === "Required field(s) missing" ||
          result === "No text to translate" ||
          result === "Invalid value for locale field")
      {
        res.json({ error: result});
      }
      else
      {
        res.json({ text: text, translation: result})
      }
    });
};
