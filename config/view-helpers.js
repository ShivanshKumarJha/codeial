const env = require('dotenv').config();
const fs = require('fs');
const path = require('path');

module.exports = app => {
  // giving the global variable assetPath to the app
  app.locals.assetPath = function (filePath) {
    if (process.env.CODEIAL_ENVIRONMENT == 'development') {
      return '/' + filePath;
    }

    return (
      '/' +
      JSON.parse(
        fs.readFileSync(
          path.join(__dirname, '../public/assets/rev-manifest.json')
        )
      )[filePath]
    );
  };
};
