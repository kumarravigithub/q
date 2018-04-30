var fs = Npm.require("fs");


counter = 1;
Meteor.methods({
    'file-upload': function (fileInfo, fileData) {
        counter += 1;
        console.log(counter);
        // TODO: manage file location and duplicacy properly, also, put filename in database and create log
        let savefilename="/Users/kumarravi/projects/files/" + fileInfo;
        fs.writeFile(savefilename, new Buffer(fileData, 'binary'), Meteor.bindEnvironment(function() {
            Meteor.call('readfile', "/Users/kumarravi/projects/files/" + fileInfo)
        }));
    },
    'readfile': function (filename) {
        // filename = "/Users/kumarravi/projects/files/base data abc.xlsx"
        var XLSX = Npm.require('xlsx');
        console.log("Opening " + filename)
        var workbook = XLSX.readFile(filename);
        console.log("Selecting Sheets " + filename);
        var sheet_name_list = workbook.SheetNames;
        console.log("Loading first sheet into memory");
        let jsonxlsx = XLSX.utils.sheet_to_json(workbook.Sheets[sheet_name_list[0]]);
        console.log("Inserting " + jsonxlsx.length + " rows into the database..");
        var newIds = product.batchInsert(jsonxlsx);
        console.log("Inserted " + jsonxlsx.length + " records into the database");
        console.log(newIds.length);
    },
    'emptyproducts': function () {
        product.remove({});
    }
});

Meteor.publish('product_pub', function tasksPublication() {
    return product.find();
});
