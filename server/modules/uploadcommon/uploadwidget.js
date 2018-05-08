Meteor.methods({
  file_delete: function(fileid) {
    product.remove({fileid:fileid});
    products_withabc.remove({fileid:fileid});
    __pre_excel_process.remove({fileid:fileid});
    Images.remove({_id:fileid});
    return true;
  }
});
