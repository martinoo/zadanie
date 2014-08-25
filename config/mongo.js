var client = require('mongodb').MongoClient
    , uri = 'mongodb://localhost:27017/test'
    , db;

/**
 * Funkcia sluzi na ziskanie pristupu k databaze.
 *
 * Popis: Najskor skontrolujem, ci je inicializovane spojenie s databazou.
 * Ak ano, vratim existujuce spojenie.
 * Ak nie, pokusim sa znovu pripojit k databaze a vratim bud chybu alebo nove pripojenie.
 *
 * @param callback
 * @returns {*}
 */
module.exports.get = function(callback) {
    if (db && db.serverConfig && db.serverConfig.isConnected()) {
        return callback(null, db);
    }
    this.init(callback);
};

/**
 * Funkcia sluzi na vytvorenie pripojenia k databaze.
 *
 * @param callback
 */
module.exports.init = function(callback) {
    client.connect(uri, {
        auto_reconnect: true,
        native_parser: true
    }, function(err, instance) {
        db = instance;
        return callback(err, db);
    });
};

/**
 * Funkcia sluzi na uzatvorenie pripojenia k databaze.
 *
 * @returns {*}
 */
module.exports.close = function() {
    if (db && db.serverConfig && db.serverConfig.isConnected()) {
        db.close();
    }
};
