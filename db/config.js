/**
 * Credentials for CosmosDB connection
 *
 * @type {{endpoint: string, key: string}}
 */
module.exports = {
  endpoint: process.env.COSMOS_URI,
  key: process.env.COSMOS_PRIMARY_KEY,
};
