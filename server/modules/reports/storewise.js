Meteor.methods({
  getDistinctStores: function(fileid) {
    result=product.find({fileid:fileid},{fields: {'onlyThisField':1}}).fetch();
    console.log(result);
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
  },
  getDistinctCatMaster: function() {
    return Meteor.wrapAsync(callback => {
      product_master.rawCollection().distinct('Gen_cat', callback);
    })();
  },
  callme : function() {
    var result = Meteor.call('getDistinctCatMaster');
    returnValue=[]
    result.forEach(function(ele) {
      var a = product_master.find({Gen_cat:ele}).count()
      var rv={};
      rv.cat=ele;
      rv.count=a;
      returnValue.push(rv);
    });
    console.log(returnValue);
    return returnValue;
  }
});
