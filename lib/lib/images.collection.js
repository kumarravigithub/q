shouldDatabaseDie = false;
Images = new FilesCollection({
  debug: true,
  collectionName: 'Images',
  allowClientCode: false, // Disallow remove files from Client
  storagePath: '/Users/kumarravi/projects/files',
  onBeforeUpload: function(file) {
    // Allow upload files under 10MB, and only in png/jpg/jpeg formats
    return true;
    if (file.size <= 1024 * 1024 * 1000 && /png|xlsx?g/i.test(file.extension)) {
      return true;
    }
    return 'Please upload image, with size equal or less than 10MB';
  },
  onAfterUpload: function(file) {
    readExcel(file);
  }
});

if (Meteor.isServer) {
  rowjsonkeys = [];
  rowjsonvalues = [];
  uniquestoreids = [];
  uniqueproducts = [];
  uniquegencat = [];
  Images.denyClient();
  // TODO : Organize Publishings.
  Meteor.publish('files.images.all', function() {
    return Images.find({
      userId: this.userId
    }).cursor;
  });
  Meteor.publish('excelimportstatus', function() {
    return __pre_excel_process.find({
      userid: this.userId,
      status: {
        $ne: "DONE"
      }
    });
  });
  Meteor.startup(function() {
    if (shouldDatabaseDie) {
      product.remove({});
      products_withabc.remove({});
      __pre_excel_process.remove({});
      uniquestores.remove({});
      uniqueproducts.remove({});
      Images.remove({});
      console.log(" ** DATABASE EMPTY **");
    }
    fileobj = {
      "_id": "rwrDQJkoCj8FXExDR",
      "size": Number("7832679"),
      "type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "name": "Dataset 1.xlsx",
      "meta": {

      },
      "ext": "xlsx",
      "extension": "xlsx",
      "extensionWithDot": ".xlsx",
      "mime": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "mime-type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "userId": "6JXWEN5THSABKLKgM",
      "path": "/Users/kumarravi/projects/files/rwrDQJkoCj8FXExDR.xlsx",
      "versions": {
        "original": {
          "path": "/Users/kumarravi/projects/files/rwrDQJkoCj8FXExDR.xlsx",
          "size": Number("7832679"),
          "type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
          "extension": "xlsx"
        }
      },
      "_downloadRoute": "/cdn/storage",
      "_collectionName": "Images",
      "isVideo": false,
      "isAudio": false,
      "isImage": false,
      "isText": false,
      "isJSON": false,
      "isPDF": false,
      "_storagePath": "/Users/kumarravi/projects/files",
      "public": false,
      "status": {
        "for": "EXCELIMPORT",
        "status": "DONE",
        "excellinecount": Number("128296"),
        "filename": "/Users/kumarravi/projects/files/rwrDQJkoCj8FXExDR.xlsx",
        "fileid": "rwrDQJkoCj8FXExDR",
        "message": "DONE",
        "uniquestorecount": Number("408"),
        "uniqueproductcount": Number("714"),
        "uniquegencat": Number("4"),
        "timestamp": new Date()
      }
    }
    products_withabc.remove({});
    report1(fileobj);
  });
} else {
  Meteor.subscribe('files.images.all');
}


function updateMessage(message, workBookReader) {
  workBookReader.globalvars.message = message;
  __pre_excel_process.upsert({
    fileid: workBookReader.filedata._id
  }, {
    $set: workBookReader.globalvars
  });

}

function readExcel(file) {
  fileName = file.path
  rowjsonkeys = [];
  rowjsonvalues = [];
  uniquestoreids = [];
  uniqueproducts = [];
  uniquegencat = [];
  const XlsxStreamReader = Npm.require("xlsx-stream-reader");


  var workBookReader = new XlsxStreamReader();
  workBookReader.filedata = file;
  workBookReader.globalvars = {
    for: 'EXCELIMPORT',
    status: 'processing',
    excellinecount: 0,
    filename: fileName,
    fileid: file._id,
    userid: file.userId
  };
  updateMessage("processing the excel uploaded", workBookReader);
  workBookReader.on('error', function(error) {
    throw (error);
  });
  workBookReader.on('sharedStrings', Meteor.bindEnvironment(function() {
    // do not need to do anything with these,
    // cached and used when processing worksheets
    // console.log(workBookReader.workBookSharedStrings);
    updateMessage("Reading the excel layouts", workBookReader);
  }));

  workBookReader.on('styles', Meteor.bindEnvironment(function() {
    // do not need to do anything with these
    // but not currently handled in any other way
    //console.log(workBookReader.workBookStyles);
    updateMessage("Understanding styles", workBookReader)
  }));

  workBookReader.on('worksheet', Meteor.bindEnvironment(function(workSheetReader) {
    //console.log(workSheetReader.name);
    updateMessage("getting sheet names : " + workSheetReader.name, workBookReader);
    console.log(workSheetReader.name);
    if (workSheetReader.name != 'Sheet1') {
      // we only want first sheet
      workSheetReader.skip();
      return;
    }
    // print worksheet name
    updateMessage("Working on sheet : " + workBookReader.name, workBookReader);


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
        updateMessage(" Reading Coloumn names. Found " + (rowjsonkeys.length - 1) + " coloumns", workBookReader);
        // process.exit();
      } else {
        // second param to forEach colNum is very important as
        // null columns are not defined in the array, ie sparse array
        // row.values.forEach(function(rowVal, colNum) {
        //   // do something with row values
        // });

        valuetoinsert = {}
        for (let i = 0; i < row.values.length; i++) {
          if (i == 0) {
            continue;
          }
          // console.log(rowjsonkeys[i])
          valuetoinsert[rowjsonkeys[i]] = row.values[i];
          //rowjsonkeys.push(row.values[i].replace(/ /g, "").toLowerCase());
        }
        valuetoinsert["fileid"] = workBookReader.filedata._id;
        valuetoinsert["createdby"] = workBookReader.filedata.userId;
        //console.log(valuetoinsert)
        product.insert(valuetoinsert);
        if (!uniquestoreids.includes(row.values[1])) {
          uniquestoreids.push(row.values[1])
          // console.log("Unique Stores : " + uniquestoreids.length);
          workBookReader.globalvars.uniquestorecount = uniquestoreids.length;
        }
        if (!uniqueproducts.includes(row.values[5])) {
          uniqueproducts.push(row.values[5])
          // console.log("Unique products : " + uniqueproducts.length);
          workBookReader.globalvars.uniqueproductcount = uniqueproducts.length;
        }
        if (!uniquegencat.includes(row.values[7])) {
          uniquegencat.push(row.values[7])
          // console.log("Unique products : " + uniqueproducts.length);
          workBookReader.globalvars.uniquegencat = uniquegencat.length;
        }
        workBookReader.globalvars.message = "processing each row .. ";
        workBookReader.globalvars.excellinecount++;
        workBookReader.globalvars.userid = this.userId;
        __pre_excel_process.upsert({
          fileid: workBookReader.filedata._id
        }, {
          $set: workBookReader.globalvars
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

    workBookReader.globalvars.status = "DONE";
    workBookReader.globalvars.message = "DONE";
    workBookReader.globalvars.timestamp = new Date();
    workBookReader.filedata.status = workBookReader.globalvars;
    __pre_excel_process.upsert({
      fileid: workBookReader.filedata._id
    }, {
      $set: workBookReader.globalvars
    });
    Images.update({
      _id: workBookReader.filedata._id
    }, {
      $set: workBookReader.filedata
    })

    console.log("Done with import.. Starting Report generation");
    report1(workBookReader.filedata);
    console.log("DONE WITH REPORT");
  }));
  console.log("Initiating read..");
  updateMessage("Initiating excel processing", workBookReader)
  var fs = Npm.require("fs");
  fs.createReadStream(fileName).pipe(workBookReader);
}
