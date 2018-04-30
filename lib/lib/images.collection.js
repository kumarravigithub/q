Images = new FilesCollection({
  debug: true,
  collectionName: 'Images',
  allowClientCode: false, // Disallow remove files from Client
  storagePath: '/home/kumar/projects/files',
  onBeforeUpload: function(file) {
    // Allow upload files under 10MB, and only in png/jpg/jpeg formats
    return true;
    if (file.size <= 1024 * 1024 * 1000 && /png|xlsx?g/i.test(file.extension)) {
      return true;
    }
    return 'Please upload image, with size equal or less than 10MB';
  },
  onAfterUpload: function(file) {
    readExcel(file.path);
  }
});

if (Meteor.isServer) {
  globalvars = {
    for: 'EXCELIMPORT',
    status: 'na',
    excellinecount: 0
  };
  rowjsonkeys = [];
  rowjsonvalues = [];
  uniquestoreids = [];
  uniqueproducts = [];
  Images.denyClient();
  // TODO : Organize Publishings.
  Meteor.publish('files.images.all', function() {
    return Images.find().cursor;
  });
  Meteor.publish('excelimportstatus', function() {
    return __pre_excel_process.find({
      for: "EXCELIMPORT"
    });
  });
  Meteor.startup(function() {
    // readExcel('/home/kumar/Downloads/H1-17 FOR ABC.xlsx')
  });
} else {
  Meteor.subscribe('files.images.all');
}
function updateMessage(message) {
  globalvars.message = message;
  __pre_excel_process.upsert({
    for: 'EXCELIMPORT'
  }, {
    $set: globalvars
  });

}
function readExcel(fileName) {
  const XlsxStreamReader = Npm.require("xlsx-stream-reader");
  globalvars.status = "processing";
  globalvars.filename = fileName;
  updateMessage("processing the excel uploaded");
  var workBookReader = new XlsxStreamReader();
  workBookReader.on('error', function(error) {
    throw (error);
  });
  workBookReader.on('sharedStrings', Meteor.bindEnvironment(function() {
    // do not need to do anything with these,
    // cached and used when processing worksheets
    //console.log(workBookReader.workBookSharedStrings);
    updateMessage("Reading the excel layouts");
  }));

  workBookReader.on('styles', Meteor.bindEnvironment(function() {
    // do not need to do anything with these
    // but not currently handled in any other way
    //console.log(workBookReader.workBookStyles);
    updateMessage("Understanding styles")
  }));

  workBookReader.on('worksheet', Meteor.bindEnvironment(function(workSheetReader) {
    //console.log(workSheetReader.name);
    updateMessage("getting sheet names : " + workSheetReader.name);
    if (workSheetReader.name != 'EAST AND NORTH') {
      // we only want first sheet
      workSheetReader.skip();
      return;
    }
    // print worksheet name
    updateMessage("Working on sheet : " + workBookReader.name);
    console.log(workSheetReader.name);

    // if we do not listen for rows we will only get end event
    // and have infor about the sheet like row count
    workSheetReader.on('row', Meteor.bindEnvironment(function(row) {

      if (row.attributes.r == 1) {
        // do something with row 1 like save as column names
        for (let i = 0; i < row.values.length; i++) {
          if (i == 0) {
            rowjsonkeys.push("");
            continue;
          }
          rowjsonkeys.push(row.values[i].replace(/[^a-zA-Z0-9]/g, '').toLowerCase());
        }
        console.log(rowjsonkeys);
        updateMessage(" Reading Coloumn names. Found " + (rowjsonkeys.length-1) + " coloumns");
        // process.exit();
      } else {
        // second param to forEach colNum is very important as
        // null columns are not defined in the array, ie sparse array
        // row.values.forEach(function(rowVal, colNum) {
        //   // do something with row values
        // });

        valuetoinsert={}
        for (let i = 0; i < row.values.length; i++) {
          if (i == 0) {
            continue;
          }
          // console.log(rowjsonkeys[i])
          valuetoinsert[rowjsonkeys[i]]=row.values[i];
          //rowjsonkeys.push(row.values[i].replace(/ /g, "").toLowerCase());
        }
        //console.log(valuetoinsert)
        product.insert(valuetoinsert);
        if (!uniquestoreids.includes(row.values[3])) {
          uniquestoreids.push(row.values[3])
          // console.log("Unique Stores : " + uniquestoreids.length);
          globalvars.uniquestorecount = uniquestoreids.length;
        }
        if (!uniqueproducts.includes(row.values[9])) {
          uniqueproducts.push(row.values[9])
          // console.log("Unique products : " + uniqueproducts.length);
          globalvars.uniqueproductcount = uniqueproducts.length;
        }
        globalvars.message="processing each row .. ";
        globalvars.excellinecount++;
        globalvars.userid = Meteor.userid;
        __pre_excel_process.upsert({
          filename: globalvars.filename
        }, {
          $set: globalvars
        });

        //console.log(row.values);
        // console.log(row.values[3]);
      }
    }));
    workSheetReader.on('end', function() {
      console.log(workSheetReader.rowCount);

    });

    // call process after registering handlers
    workSheetReader.process();
  }));
  workBookReader.on('end', Meteor.bindEnvironment(function() {
    globalvars.status = "DONE";
    globalvars.userid = Meteor.userid;
    __pre_excel_process.upsert({
      for: 'EXCELIMPORT'
    }, {
      $set: globalvars
    });
    console.log("Done!");
  }));
  console.log("Initiating read..");
  updateMessage("Initiating excel processing")
  var fs = Npm.require("fs");
  fs.createReadStream(fileName).pipe(workBookReader);
}
