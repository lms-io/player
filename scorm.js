window.API = (function(){
  var data = {
    "cmi.core.student_id": "000000",
    "cmi.core.student_name": "Student,Default",
    "cmi.core.lesson_location": "",
    "cmi.core.lesson_status": "not attempted"
  };
  return {
    LMSInitialize: function() {
      API.LMSGetValue('cmi.suspend_data');
      return "true";  
    },
    LMSCommit: function() {
      return "true";  
    },
    LMSFinish: function() {
      return "true";  
    },
    LMSGetValue: function(model) {
      ScormFu.get(model, function(v) {
        data[model] = v; 
      });
      if(data[model]) {
        return data[model];
      }

    },
    LMSSetValue: function(model, value) {
      ScormFu.set(model,value);
      data[model] = value;
      return "true";
    },
    LMSGetLastError: function() {
      return "0";
    },
    LMSGetErrorString: function(errorCode) {
      return "No error";
    },
    LMSGetDiagnostic: function(errorCode) {
      return "No error";
    }
  };
})();

API_1484_11 = {
  version : "1.0", // mandatory version attribute
  STATE : {
    NOT_INITIALIZED : "Not Initialized",
    RUNNING : "Running",
    TERMINATED : "Terminated"
  },
  running : false,
  debug : typeof (console) == "undefined" ? null : console, // console, false
  error : 0,
  cmiDefault : {
    "cmi._version" : this.version,
    "cmi.mode" : "normal",
    "cmi.credit" : "no-credit",
    "cmi.entry" : "ab-initio",
    "cmi.location" : "",
    "cmi.success_status" : "unknown",
    "cmi.completion_status" : "",
    "cmi.score._children" : "scaled,min,max,raw",
    "cmi.interactions._children" : "", //"id,type,objectives,timestamp,correct_responses,weighting,learner_response,result,latency,description",
    "cmi.interactions._count" : "0"
  },
  cmi : null,
  _valuesChanged : {},
  _valueNameSecurityCheckRe : /^cmi\.(\w|\.)+$/,

  // help functions
  _stringEndsWith : function(str, suffix) {
    return str.length >= suffix.length && str.substr(str.length - suffix.length) == suffix;
  },
  _valueNameSecurityCheck : function(name) {
    this.error = name.search(this._valueNameSecurityCheckRe) === 0 ? 0 : 401;
    return this.error === 0;
  },
  _valueNameCheckReadOnly : function(name) {
    this.error = 0;
    if (this._stringEndsWith(name, "._children")) {
      this.error = 403;
    }
    return this.error === 0;
  },
  _checkRunning : function(errBefore, errAfter) {
    if (this.state === this.STATE.NOT_INITIALIZED) {
      this.error = errBefore;
    } else if (this.state === this.STATE.TERMINATED) {
      this.error = errAfter;
    } else {
      this.error = 0;
    }
    return this.error === 0;
  },

  _preInitialize : function() {
    this.state = this.STATE.NOT_INITIALIZED;

    // set cmi - clone default cmi
    this.cmi = this.cmiDefault;
    
    // custom code
    this.GetValue('cmi.suspend_data');
  },

  // SCO RTE functions
  Initialize : function() {

    if (this.debug) this.debug.log("LMS Initialize");
    if (this.state === this.STATE.RUNNING) {
      this.error = 103;
      return "false";
    }
    if (this.state === this.STATE.TERMINATED) {
      this.error = 103;
      return "false";
    }
    this.state = this.STATE.RUNNING;
    this.error = 0;

    return "true";
  },

  Terminate : function() {
    if (this.debug) this.debug.log("LMS Terminate");
    if (!this._checkRunning(112, 113)) return "false";

    this.Commit();
    this.state = this.STATE.TERMINATED;
    window.location = "/close"; 
    
    // custom code ...
    
    return "true";
  },

  GetValue : function(model) {
    ScormFu.get(model, function(v) {
      API_1484_11.cmi[model] = v; 
    });
    if(this.cmi[model]) {
      return this.cmi[model];
    }
  },

  SetValue : function(name, value) {
    if(name.indexOf("cmi.interactions.") != -1 && name.indexOf(".id") != -1) {
      ScormFu.last = value;
    }
    ScormFu.set(name,value);
    if(name.indexOf(".result") != -1) {
      name="Question."+ScormFu.last;
      if(value == "incorrect") {
        value = 0;
      } else {
        value = 1;
      }
      ScormFu.set(name,value);
    }

    if(name.indexOf(".description") != -1) {
      name="Question."+ScormFu.last+".description";
      ScormFu.set(name,value);
    }


    if(name.indexOf("cmi.success_status") != -1 && "passed" == value) {
      ScormFu.set("cmi.completion_status","completed");
      name="status";
      value="completed";
      ScormFu.set("status","completed");
    }

    if(name.indexOf("cmi.completion_status") != -1) {
      name="status";
      ScormFu.set(name,value);
    }
    if(name.indexOf("cmi.score.raw") != -1) {
      name="raw_score";
      ScormFu.set(name,value);
    }
    if(name.indexOf("cmi.score.scaled") != -1) {
      name="scaled_score";
      ScormFu.set(name,value);
    }
  if (this.debug) this.debug.log("LMS SetValue", name, value);
    if (!this._checkRunning(132, 133)) return "false";
    if (!this._valueNameSecurityCheck(name)) return "false";
    if (!this._valueNameCheckReadOnly(name)) return "false";

    this._valuesChanged[name] = value;
    return "true";
  },

  Commit : function() {
    if (this.debug) this.debug.log("LMS Commit", this._valuesChanged);
    if (!this._checkRunning(142, 143)) return "false";

    // merge values
    //jQuery.extend(true, this.cmi, this._valuesChanged);

    // custom code ...

    
    this._valuesChanged = {}; // clean changed values
    return "true";
  },

  GetDiagnostic : function(errCode) {
    if (this.debug) this.debug.log("LMS GetDiagnostic", errCode);
    if (!errCode) return this.GetLastError();
    return this.error_strings[errCode] ? this.error_strings[errCode] : 'Uknown errCode.';
  },

  GetErrorString : function(errCode) {
    if (this.debug) this.debug.log("LMS GetErrorString", errCode);
    return this.error_strings[errCode] ? this.error_strings[errCode] : '';
  },

  GetLastError : function() {
    if (this.debug && this.error != 0) this.debug.log("LMS GetLastError return", this.error);
    return this.error;
  },

  // predefined constants
  error_strings : {
    0 : "No error",
    // General Errors 100-199
    101 : "General Exception",
    102 : "General Initialization Failure",
    103 : "Already Initialized",
    104 : "Content Instance Terminated",
    111 : "General Termination Failure",
    112 : "Termination Before Initialization",
    113 : "Termination After Termination",
    122 : "Retrieve Data Before Initialization",
    123 : "Retrieve Data After Termination",
    132 : "Store Data Before Initialization",
    133 : "Store Data After Termination",
    142 : "Commit Before Initialization",
    143 : "Commit After Termination",
    // Syntax Errors 200-299
    201 : "General Argument Error",
    // RTS (LMS) Errors 300-399
    301 : "General Get Failure",
    351 : "General Set Failure",
    391 : "General Commit Failure",
    // Data Model Errors 400-499
    401 : "Undefined Data Model Element",
    402 : "Unimplemented Data Model Element",
    403 : "Data Model Element Value Not Initialized",
    404 : "Data Model Element Is Read Only",
    405 : "Data Model Element Is Write Only",
    406 : "Data Model Element Type Mismatch",
    407 : "Data Model Element Value Out Of Range",
    408 : "Data Model Dependency Not Established",
    // Implementation-defined Errors 1000-65535
    1000 : "General communication failure (Ajax)"
  }

};

SCORM2004_objAPI = API_1484_11;
API_1484_11._preInitialize();

