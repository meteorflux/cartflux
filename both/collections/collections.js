// Client & Server Collections
Catalog = new Mongo.Collection('catalog');
Cart    = new Mongo.Collection('cart');

// Client only Collections
if (Meteor.isClient) {
  Counters = new Mongo.Collection("collectioncounters");
}
