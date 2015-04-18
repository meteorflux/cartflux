// CatalogStore Publications
Meteor.publish('CatalogStore.searchedProducts', function(search, limit, skip) {
  //Meteor._sleepForMs(500);
  var regexp = new RegExp(search, 'i');
  return Catalog.find({name: regexp}, {limit: limit, sort: {date:1}, skip: skip});
});
Meteor.publish('CatalogStore.productsInCart', function(products) {
  return Catalog.find({_id: {$in: _.pluck(products, 'product_id')}});
});
