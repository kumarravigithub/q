Template.abc_data.rendered = function() {

};

Template.abc_data.events({
  'click .btnEmptyCollection': function(event, template) {
    Meteor.call('emptyproducts');
  }
});

Template.abc_data.helpers({
  importStatus: function(isDone=true) {
    statust = __pre_excel_process.findOne({});
    if (statust) {
      if (statust.status == 'na' || statust.status=='DONE') {
        return true;
      } else {
        return false;
      }
    } else {
      return true;
    }
  },
  statusdoc: function() {
    return __pre_excel_process.findOne();
  }
});
