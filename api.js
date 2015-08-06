var ScormFu = {
  get:function(key,callback) {
    var url = configuration.scormfu + '/sys/'+ organization +'/track/' + registration + '/' + course + '/?key=' + key;
    var xhr = new XMLHttpRequest();
    xhr.open('GET', encodeURI(url));
    xhr.onload = function() {
      if (xhr.status === 200) {
        var resp = JSON.parse(xhr.responseText);
        console.log(key);
        console.log(resp);
        if(resp.length == 1) {
          callback(resp[0]);
        } else {
          callback(resp);
        }
      } else {
      }
    };
    xhr.send();
  },
  set:function(key,value) {
    console.log(key + " " + value);
    if(key.indexOf("cmi.interactions.") != -1) {
      key = "answer." + ScormFu.last+"."+key;
    }
    var url = configuration.scormfu + '/sys/'+ organization +'/track/' + registration + '/' + course + '/?key=' + key + '&value='+value;
    var xhr = new XMLHttpRequest();
    xhr.open('GET', encodeURI(url));
    xhr.onload = function() {
      if (xhr.status === 200) {
        var resp = JSON.parse(xhr.responseText);
        console.log(resp);
      } else {
      }
    };
    xhr.send();
    console.log(key);

  },
  session:"",
  last:"",
  complete:false
};
