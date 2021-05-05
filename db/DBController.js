const { CosmosClient } = require('@azure/cosmos');
const cosmosConfig = require('./config.js');

/**
 * DBController is responsible for all communication with CosmosDB database
 */
class DBController {
  /**
   * Creates instance of DBController
   *
   * @param {string} databaseId
   * @param {string} containerId
   */
  constructor(databaseId, containerId) {
    this.client = new CosmosClient(cosmosConfig);
    this.database = this.client.database(databaseId);
    this.container = this.database.container(containerId);
  }

  /**
   * Query data from container
   *
   * @param {string} query - SQL query
   *
   * @return {Promise<any[]>}
   */
  async query(query) {
    const { resources } = await this.container.items
      .query({ query })
      .fetchAll();

    return resources;
  }

  /**
   * Adds new items
   *
   * @param {Object} item
   *
   * @return {Promise<any>}
   */
  async add(item) {
    const { resource } = await this.container.items.create(item);

    return resource;
  }

  /**
   * Deletes item by id
   * (partitionKey == id)
   *
   * @param {string} id
   *
   * @return {Promise<any>}
   */
  async delete(id) {
    const { resource } = await this.container.item(id, id).delete();

    return resource;
  }

  /**
   * Updates item
   * (partitionKey == id)
   *
   * @param {Object} item
   *
   * @return {Promise<any>}
   */
  async update(item) {
    const { id } = item;

    const { resource } = await this.container.item(id, id).replace(item);

    return resource;
  }
}

module.exports = DBController;
