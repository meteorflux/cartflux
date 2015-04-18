// CountersStore Publications

// server: publish the current size of a collection
Meteor.publish('CountersStore.CatalogCounter', function (search_query) {
  var catalog_counter_id = 'Catalog';
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
