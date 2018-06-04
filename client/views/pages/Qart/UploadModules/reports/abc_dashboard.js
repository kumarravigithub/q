Template.abc_dashboard.created = function() {
  this.seasons = new ReactiveVar( [] );
};


Template.abc_dashboard.rendered = function() {

  // Tooltips demo
  $("[data-toggle=tooltip]").tooltip();
  var lineData = {
    labels: ["January", "February", "March", "April", "May", "June", "July"],
    datasets: [

      {
        label: "Data 1",
        backgroundColor: 'rgba(26,179,148,0.5)',
        borderColor: "rgba(26,179,148,0.7)",
        pointBackgroundColor: "rgba(26,179,148,1)",
        pointBorderColor: "#fff",
        data: [28, 48, 40, 19, 86, 27, 90]
      }, {
        label: "Data 2",
        backgroundColor: 'rgba(220, 220, 220, 0.5)',
        pointBorderColor: "#fff",
        data: [65, 59, 80, 81, 56, 55, 40]
      }
    ]
  };

  var lineOptions = {
    responsive: true
  };


  var ctx = document.getElementById("lineChart").getContext("2d");
  new Chart(ctx, {
    type: 'line',
    data: lineData,
    options: lineOptions
  });

  var barData = {
    labels: ["January", "February", "March", "April", "May", "June", "July"],
    datasets: [{
        label: "Data 1",
        backgroundColor: 'rgba(220, 220, 220, 0.5)',
        pointBorderColor: "#fff",
        data: [65, 59, 80, 81, 56, 55, 40]
      },
      {
        label: "Data 2",
        backgroundColor: 'rgba(26,179,148,0.5)',
        borderColor: "rgba(26,179,148,0.7)",
        pointBackgroundColor: "rgba(26,179,148,1)",
        pointBorderColor: "#fff",
        data: [28, 48, 40, 19, 86, 27, 90]
      }
    ]
  };

  var barOptions = {
    responsive: true
  };


  var ctx2 = document.getElementById("barChart").getContext("2d");
  new Chart(ctx2, {
    type: 'bar',
    data: barData,
    options: barOptions
  });

  var polarData = {
    datasets: [{
      data: [
        300, 140, 200
      ],
      backgroundColor: [
        "#a3e1d4", "#dedede", "#b5b8cf"
      ],
      label: [
        "My Radar chart"
      ]
    }],
    labels: [
      "App", "Software", "Laptop"
    ]
  };

  var polarOptions = {
    segmentStrokeWidth: 2,
    responsive: true

  };

  var ctx3 = document.getElementById("polarChart").getContext("2d");
  new Chart(ctx3, {
    type: 'polarArea',
    data: polarData,
    options: polarOptions
  });
  var dynamicColors = function() {
    return '#' + (Math.random() * 0xFFFFFF << 0).toString(16);
  };
  const instance = Template.instance();
  Meteor.call('getSeason', function(err, result) {
    if (err) {
      console.log(err);
      return;
    }
    instance.seasons.set(result);
    
  });
  Meteor.call('callme', function(err, result) {
    if (err) {
      console.log(err);
      return;
    }
    labels = [];
    data = [];
    colours = [];
    for (i = 0; i < result.length; i++) {
      if (result[i].count > 100) {
        labels.push(result[i].cat);
        data.push(result[i].count);
        colours.push(dynamicColors());
      }
    }
    var doughnutData = {
      labels: labels,
      datasets: [{
        data: data,
        backgroundColor: colours
      }]
    };


    var doughnutOptions = {
      responsive: true
    };


    var ctx4 = document.getElementById("doughnutChart").getContext("2d");
    new Chart(ctx4, {
      type: 'doughnut',
      data: doughnutData,
      options: doughnutOptions
    });

  });


  var radarData = {
    labels: ["Eating", "Drinking", "Sleeping", "Designing", "Coding", "Cycling", "Running"],
    datasets: [{
        label: "My First dataset",
        backgroundColor: "rgba(220,220,220,0.2)",
        borderColor: "rgba(220,220,220,1)",
        data: [65, 59, 90, 81, 56, 55, 40]
      },
      {
        label: "My Second dataset",
        backgroundColor: "rgba(26,179,148,0.2)",
        borderColor: "rgba(26,179,148,1)",
        data: [28, 48, 40, 19, 96, 27, 100]
      }
    ]
  };

  var radarOptions = {
    responsive: true
  };

  var ctx5 = document.getElementById("radarChart").getContext("2d");
  new Chart(ctx5, {
    type: 'radar',
    data: radarData,
    options: radarOptions
  });

};

Template.abc_dashboard.helpers({
  statusdoc: function() {
    return __pre_excel_process.findOne();
  },
  seasons: function() {
    console.log(Template.instance().seasons.get());
    return Template.instance().seasons.get();
  },
  seasonlabel: function(season) {
    var a=tasks.findOne({season:season});
    if(typeof a == 'undefined') {
      return season;
    } else {
      if(a.status=="DONE") {
       return season; 
      } else {
      return a.status;
      }
    }
  },
  seasonhref: function(season) {
    var a=tasks.findOne({season:season});
    if(typeof a == 'undefined') {
      return "#";
    } else {
      return a.href;
    }
  },
  seasontarget: function(season) {
    var a=tasks.findOne({season:season});
    if(typeof a == 'undefined') {
      return "";
    } else {
      return "_blank";
    }
  },
  seasonclass: function(season) {
    var a=tasks.findOne({season:season});
    if(typeof a == 'undefined') {
      return "btn-success";
    } else {
      if(a.status=="DONE") {
        return "btn-primary"; 
      } else {
        return "btn-danger"; 
      }
    }
  },
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

Template.abc_dashboard.events({
  'click .abcdownload': function(event, template) {
    var season=$(event.currentTarget).attr("season-data");
    Meteor.call('runABC',season ,"wW22npzrJJoFaC6CW",function(err, result) {
      if (err) {
        console.log(err);
        return;
      }
      instance.seasons.set(result);
      
    });
    //wW22npzrJJoFaC6CW
  }
});