Meteor.methods({
  getDistinctStores: function(fileid) {
    result=product.find({fileid:fileid}).fetch();
    const uniqueStores = [...new Set(result.map(item => item.shiptocustomer2))];
    const uniqueGencats = [...new Set(result.map(item => item.gencat2))];
    return {uniqueStores:uniqueStores, uniqueGencats:uniqueGencats};
    // return Meteor.wrapAsync(callback => {
    //   product.rawCollection().distinct('shiptocustomer2', callback);
    // })();
  },
  getDistinctProducts: function() {
    return Meteor.wrapAsync(callback => {
      product.rawCollection().distinct('product', callback);
    })();
  }
});
