const mongodb = require('mongodb');
const getDb = require('../utils/database').getDb;

class User {
  constructor(name, email, cart, id) {
    this.email = email;
    this.name = name;
    this.cart = cart;
    this.id = id;
  }

  save() {
    const db = getDb();
    return db.collection('users').insertOne(this);
  }

  addToCart(product) {
    const db = getDb();
    if (!this.cart) {
      const items = [{ id: product._id, quantity: 1 }];
      return db.collection('users').updateOne({ _id: new mongodb.ObjectId(this.id) }, { $set: {cart:  {items} } });
    }

    const cartProduct = this.cart.items.findIndex(cp => {
      return cp.id.toString() === product._id.toString();
    });

    let qty = 1;
    const updatedCartItems = [...this.cart.items];

    if (cartProduct >= 0) {
      updatedCartItems[cartProduct].quantity += 1;
    } else {
      updatedCartItems.push({ id: product._id, quantity: 1});
    }

    const updatedCart = { items: updatedCartItems };


    return db.collection('users').updateOne({ _id: new mongodb.ObjectId(this.id) }, { $set: {cart: updatedCart} });
  }

  getCart() {
    const db = getDb();
    const prodIds = this.cart.items.map(item => item.id);
    return db.collection('products').find({ _id: { $in: prodIds}}).toArray()
      .then(products => {
        return products.map(product => {
          return {
            ...product,
            quantity: this.cart.items.find(i => {
              return i.id.toString() === product._id.toString()
            }).quantity
          }
        })
      })
      .catch(err => {
        console.log(err);
      })
  }

  deleteItemFromCart(id) {
    const db = getDb();
    const updatedCartItems = this.cart.items.filter(item => item.id.toString() !== id.toString());
    const updatedCart = {items: updatedCartItems};
    return db.collection('users').updateOne({ _id: new mongodb.ObjectId(this.id) }, { $set: {cart: updatedCart} });
  }

  addOrder() {
    const db = getDb();
    return this.getCart()
      .then(products => {
        const order = {
          items: products,
          user: {
            _id: new mongodb.ObjectId(this.id),
            name: this.name
          }
        };
        db.collection('orders').insertOne(order)
      })
      .then(result => {
        const updatedCart = { items: [] }
        return db.collection('users').updateOne({ _id: new mongodb.ObjectId(this.id) }, { $set: {cart: updatedCart} });
      })

  }

  getOrders() {
    const db = getDb();
    return db.collection('orders').find({ 'user._id' : new mongodb.ObjectId(this.id) }).toArray();
  }

  static findById(id) {
    const db = getDb();
    return db.collection('users').findOne({ _id: new mongodb.ObjectId(id) })
      .then(user => user)
      .catch(err => {
        console.log(err);
      })
  }
}

module.exports = User;