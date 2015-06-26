var ScormFu = {
  url:function() {
   return "tbd";
  },
  get:function(key,callback) {
  $.ajax({
      url: ScormFu.url(),
      data:{"key":key},
      dataType: "jsonp",
      success:function(v) {
        callback(v);
      }
      });
  },
  set:function(key,value) {
    if(key.indexOf("cmi.interactions.") != -1) {
      key = "answer." + ScormFu.last+"."+key;
    }
    $.ajax({
      url: ScormFu.url(),
      data:{"key":key,"value":value},
      dataType: "jsonp"
      });
  },
  session:"",
  last:"",
  complete:false
};
