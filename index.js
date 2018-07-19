'use strict';

/**
 * Module Dependencies
 */
const config  = require('./config'),
  restify = require('restify'),
  plugins = require('restify').plugins,
  mongodb = require('mongodb').MongoClient;

/**
 * Initialize Server
 */
const server = restify.createServer({
  name    : config.name,
  version : config.version
});

/**
 * Bundled Plugins (http://restify.com/#bundled-plugins)
 */
server.use(plugins.jsonBodyParser({ mapParams: true }));
server.use(plugins.acceptParser(server.acceptable));
server.use(plugins.queryParser({ mapParams: true }));
server.use(plugins.fullResponse());

/**
 * Lift Server, Connect to DB & Require Route File
 */
server.listen(config.port, () => {

  // establish connection to mongodb
  mongodb.connect(config.db.uri, {useNewUrlParser: true }, (err, client) => {

    if (err) {
      console.log('An error occurred while attempting to connect to MongoDB', err);
      process.exit(1)
    }

    console.log(
      '%s v%s ready to accept connections on port %s in %s environment.',
      server.name,
      config.version,
      config.port,
      config.env
    );

    var db = client.db('todoDB');
    require('./routes')({ db, server })

  })

});