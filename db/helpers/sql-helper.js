//SQL Objects
const SqlConnection = require("tedious").Connection;
const Request = require("tedious").Request;
const async = require('async');

//SQL Connection
let connection = null;

//SQL Parameter class
class Parameter {
    constructor(paramName, paramValue, paramType) {
        this.name = paramName;
        this.value = paramValue;
        this.type = paramType;
    }
}

//SQL Parameters array
let parameters = [];
let arrObj = []

//Main SQLHelper object
var SQLHelper = {
    
    //Create SQL Parameter
    sqlParameter: function (paramName, paramValue, paramType) {
        return new Parameter(paramName, paramValue, paramType);
    },
    
    //Add SQL Parameter to the array
    addSqlParameter: function(parameter) {
        parameters.push(parameter);
    },

    //Get the SQL Parameters array
    sqlParameters: function(){
        return parameters;
    },

    //Clear the SQL Parameters array
    clearSqlParameters: function() {
        parameters = [];
    },

    //Get the IP Server
    getIPServer: function() {
        return "127.0.0.1";
    },
  
    getConfig() {
        return config = {
            userName: 'cyber',
            password: 'Cyber2017',
            instanceName: 'SQLEXPRESS',
            server: this.getIPServer(),
            port: "1433",
            options: {
                database: 'CyberDB',
                useUTC: false,
                rowCollectionOnDone: true
            },
            debug: {
                packet: true,
                data: true,
                payload: true,
                token: true,
                log: true
            }
        }
    },
  
    //Open the SQL connection
    createConnection: function() {
        connection = new SqlConnection(this.getConfig());

        connection.on('infoMessage', infoError);
        connection.on('errorMessage', infoError);
        connection.on('end', end);
        connection.on('debug', debug);
    },

    //Execute any SQL statement, simple SELECT statement or stored procedure.
    executeStatement: function(query, isProcedure, execTrans = false, dataArray = []) {
        var $this = this;
        var parameters = $this.sqlParameters();
        arrObj = []

        return new Promise((resolve, reject) => {

            connection.on('connect', function (errConnection) {
                
                if (errConnection) {
                    console.log(errConnection);
                } else {
                    var request = new Request(query, function(errRequest, rowCount, rows) {
                        if (errRequest) {
                            console.log(errRequest);
                        } else {
                            resolve(arrObj);
                            connection.close();
                        }                        
                    });
    
                    //Adding sql parameters
                    for(var i = 0; i < parameters.length; i++) {
                        request.addParameter(parameters[i].name, parameters[i].type, parameters[i].value);
                    }
                    
                    request.on('row', function(columns) {
                        var item = {}
                        columns.forEach(function(column) {
                            item[column.metadata.colName] = column.value; 
                        });
                        
                        arrObj.push(item);
                    });

                    request.on('requestCompleted', function () { 
                        console.log(request);
                    });
                    
                    if (isProcedure) {
                        connection.callProcedure(request);
                    } else {
                        connection.execSql(request);
                    }     
                }
            });            
        }); 
    },
  }


  function infoError(info) {
    var dd = info;
    console.log('infoError => ' + JSON.stringify(info));
  }
  
  function debug(message) {
    var dd = message;
    console.log('debug => ' + message);
  }
  
  function end() {
    var dd = '';
  }
  
module.exports = SQLHelper;