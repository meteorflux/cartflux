var CountersStore = function(){
  var self = this;

  // Dependencies
  var CatalogStore;
  Dependency.autorun(function(){
    CatalogStore = Dependency.get('CatalogStore');
  });

  // Getters
  self.get = {
    numberOfProducts: function(){
      return Counters.findOne('Catalog') && Counters.findOne('Catalog').count || 0;
    }
  };

  // Subscriptions
  self.subscriptions = {
    catalogCounter: function(template){
      template.autorun(function(){
        template.subscribe('CountersStore.CatalogCounter', CatalogStore.get.searchQuery());
      });
    }
  };

  return self;

};

// Initialize
Dependency.add('CountersStore', new CountersStore());
