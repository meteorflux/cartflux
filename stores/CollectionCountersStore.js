// Collections
if (Meteor.isClient)
  CollectionCounters = new Mongo.Collection("collectioncounters");

// Creator
var newCollectionCountersStore = function(){

  // Private Vars
  var catalog_counter_id = 'Catalog';

  // Object
  var CollectionCountersStore = {
    // Getters
    getCatalogCounter: function(){
      var catalog_counter = CollectionCounters.findOne('Catalog');
      if ( catalog_counter ) {
        return catalog_counter.count;
      } else {
        return 0;
      }
    }
  };

  // Subscriptions
  if (Meteor.isClient)
    Tracker.autorun(function(){
      Meteor.subscribe('CollectionCountersStore.CatalogCounter', CatalogStore.getSearchQuery());
    });


  // Publications
  if (Meteor.isServer) {

    // server: publish the current size of a collection
    Meteor.publish('CollectionCountersStore.CatalogCounter', function (search_query) {
      var self = this;
      var count = 0;
      var initializing = true;
      var regexp = new RegExp(search_query, 'i');

      var handle = Catalog.find({name: regexp}).observeChanges({
        added: function(id){
          count++;
          if (!initializing)
            self.changed("collectioncounters", catalog_counter_id, {count:count});
        },
        removed: function(id){
          count--;
          self.changed("collectioncounters", catalog_counter_id, {count:count});
        }
      });

      initializing = false;
      self.added("collectioncounters", catalog_counter_id, {count:count});
      self.ready();

      self.onStop(function () {
        handle.stop();
      });

    });
  }

  return CollectionCountersStore;

};

// Create the instance and pass Collections
CollectionCountersStore = newCollectionCountersStore();
