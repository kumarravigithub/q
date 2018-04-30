Template.abc_report.rendered = function(){

};

Template.abc_report.events({

    'change .file-upload-input' : function(event, template){
        var func = this;
        var file = event.currentTarget.files[0];
        var reader = new FileReader();
        reader.onload = function(fileLoadEvent) {
            console.log(file);
            Meteor.call('file-upload', file.name, reader.result);
        };
        reader.readAsBinaryString(file);
    },
    'click .btnEmptyCollection': function(event, template) {
        Meteor.call('emptyproducts');
    }

});

Template.abc_report.helpers({
    settings: function () {
        return {
            collection: product,
            rowsPerPage: 10,
            showFilter: true,
            fields: ['Brand', 'Gender', 'Category', 'SubCategory', 'Collection', 'Fit', 'Mood', 'Description']
        };
    },
    isDataPresent: function() {
        if(product.find().count()>0) {
            return false;
        } else {
            return true;
        }
    }
});
