const mongodb = require('mongodb');
const getDb = require('../utils/database').getDb;

class Product {
  constructor(title, price, description, imageUrl, id, userId) {
    this.title = title;
    this.price = price;
    this.description = description;
    this.imageUrl = imageUrl;
    this._id = id ? new mongodb.ObjectId(id) : null;
    this.userId = userId;
  }

  save() {
    const db = getDb();
    if (this._id) {
      return db.collection('products').updateOne({ _id: this._id }, { $set: this });
    } else {
      return db.collection('products').insertOne(this);
    }
  }

  static fetchAll() {
    const db = getDb();
    return db.collection('products').find().toArray()
      .then(products => {
        console.log(products);
        return products;
      })
      .catch(err => {
        console.log(err);
      })
  }

  static findById(id) {
    const db = getDb();
    return db.collection('products').findOne({ _id: new mongodb.ObjectId(id)})
      .then(product => {
        console.log(product);
        return product;
      })
      .catch(err => {
        console.log(err);
      })
  }

  static deleteById(id) {
    const db = getDb();
    return db.collection('products').deleteOne({ _id: new mongodb.ObjectId(id)})
      .then(result => {
        console.log('deleted');
      })
      .catch(err => {
        console.log(err);
      })
  }
}


module.exports = Product;