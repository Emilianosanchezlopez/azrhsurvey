var account = "encuestasmainbitstorage";

var sas = "?sv=2017-07-29&ss=bfqt&srt=sco&sp=rwdlacup&se=2019-08-01T00:04:16Z&st=2018-05-04T16:04:16Z&spr=https&sig=Mu7zPYYw4ZhYNlh9HaQlyOp5kUqrcyd8PxtkKz4dGLg%3D";
var table = '';
var tableUri = '';

function checkParameters() {
    account 
    sas 

    if (account == null || account.length < 1)
    {
        alert('Please enter a valid storage account name!');
        return false;
    }
    if (sas == null || sas.length < 1)
    {
        alert('Please enter a valid SAS Token!');
        return false;
    }

    return true;
}
    
function getTableService() {
    if (!checkParameters())
        return null;

    tableUri = 'https://' + account + '.table.core.windows.net';
    var tableService = AzureStorage.createTableServiceWithSas(tableUri, sas).withFilter(new AzureStorage.ExponentialRetryPolicyFilter());
    return tableService;
}

function refreshTableList()
{
    var tableService = getTableService();
    if (!tableService)
        return;

    document.getElementById('tables').innerHTML = 'Loading table list...';
    tableService.listTablesSegmented(null, {maxResults : 200}, function(error, results) {
        if (error) {
            alert('List table list error, please open browser console to view detailed error');
            console.log(error);
        } else {
            var output = [];
            output.push('<tr>',
                            '<th>TableName</th>',
                            '<th>Operations</th>',
                        '</tr>');
            if (results.entries.length < 1) {
                output.push('<tr><td>Empty results...</td></tr>');
            }                                    
            for (var i = 0, table; table = results.entries[i]; i++) {
                output.push('<tr>',
                                '<td>', table, '</td>',
                                '<td>', '<button class="btn btn-xs btn-danger" onclick="deleteTable(\'', table ,'\')">Delete</button> ',
                                        '<button class="btn btn-xs btn-success" onclick="viewTable(\'', table ,'\')">Select</button>', '</td>',
                            '</tr>');
            }
            document.getElementById('tables').innerHTML = '<table class="table table-condensed table-bordered">' + output.join('') + '</table>';
        }
    });
}

function viewTable(selectedTable) {
    table = selectedTable;
    // alert('Selected ' + table + ' !');
    refreshEntityList();
}

function refreshEntityList() {
    var tableService = getTableService();
    if (!tableService)
        return;
    
    if (table == null || table.length < 1) {
        alert('Please select a table from table list!')
        return;
    }

    document.getElementById('result').innerHTML = 'Loading table entities...';
    var tableQuery = new AzureStorage.TableQuery().top(200);
    tableService.queryEntities(table, tableQuery, null, function(error, results) {
        if (error) {
            alert('List table entities error, please open browser console to view detailed error');
            console.log(error);
        } else {
                        
            if (results.entries.length < 1) {
                output.push('<tr><td>Empty results...</td></tr>');
            }
            for (var i = 0, entity; entity = results.entries[i]; i++) {
                var nombre = '';
                var tipo = '';
                var fecha = '';
                var lugar = '';
                var expo1 = '';
                var expo2 = '';
                

                if (typeof entity.Nombre !== 'undefined') {
                    nombre = entity.Nombre._;
                }
                if (typeof entity.Tipo !== 'undefined') {
                    tipo = entity.Tipo._;
                }
                if (typeof entity.Fecha !== 'undefined') {
                    fecha = entity.Fecha._;
                }
                if (typeof entity.Lugar !== 'undefined') {
                    lugar = entity.Lugar._;
                }
                if (typeof entity.Expositor1 !== 'undefined') {
                    expo1 = entity.Expositor1._;
                }
                if (typeof entity.Expositor2 !== 'undefined') {
                    expo2 = entity.Expositor2._;
                }
            }
            document.getElementById('result').innerHTML = `
<div class="col-lg-6">
    <div class="input-group">
        <span class="input-group-addon">Tipo de Capacitación</span>
        <input id="tipo" type="text" class="form-control"  value="${tipo}" disabled>
    </div>
  
<br>
            
<div class="input-group">
    <span class="input-group-addon">Fecha</span>
    <input id="fecha" class="form-control" type="text" value="${fecha}" disabled >
</div>
            
            <br>
    

    <div class="input-group">
        <span class="input-group-addon">Lugar</span>
        <input id="lugar" type="text" class="form-control"  value="${lugar}" disabled >
    </div>
    <br>
</div>
  <div class="col-lg-6">
  <div class="input-group">
  <span class="input-group-addon">Nombre del tema</span>
  <input id="nombre" type="text" class="form-control"  value="${nombre}" disabled >
</div>
<br>
<div class="input-group">
    <span class="input-group-addon">Nombre del Expositor 1</span>
    <input id="expo1" type="text" class="form-control"  value="${expo1}" disabled >
  </div>
  <br>
<div class="input-group">
    <span class="input-group-addon">Nombre del Expositor 2</span>
    <input id="expo2" type="text" class="form-control"  value="${expo2}" disabled >
  </div>
  </div>
            
            
            `;
        }
    });
}

function addEncuesta() {
    var x = function myFunc() {
        //   var x = Math.floor((Math.random() * 500) + 1);
        //  return x;
    var x = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
      
          for( var i=0; i < 9; i++ )
          
              x += possible.charAt(Math.floor(Math.random() * possible.length));
              
      // document.getElementById("demo2").innerHTML = x;
          return x;
      
      };
    y = x();
    var tableService = getTableService();
    if (!tableService)
        return;
    
    if (table == null || table.length < 1) {
        alert('Invalid table name!')
        return;
    }

    var tablita = "resultadosrh";
     
    var partitionKey = document.getElementById('nombre').value;
    var rowKey = y;
    var fecha = document.getElementById('fecha').value;
    var tipo = document.getElementById('tipo').value;
    var lugar = document.getElementById('lugar').value;
    var expo1 = document.getElementById('expo1').value;
    var expo2 = document.getElementById('expo2').value;
    var a1 = $('input[name=optradio-1-1]:checked').val();
    var a2 = $('input[name=optradio-1-2]:checked').val();
    var a3= $('input[name=optradio-1-3]:checked').val();
    var b1= $('input[name=optradio-2-1]:checked').val();
    var b2= $('input[name=optradio-2-2]:checked').val();
    var b3= $('input[name=optradio-2-3]:checked').val();
    var b4= $('input[name=optradio-2-4]:checked').val();
    var b5= $('input[name=optradio-2-5]:checked').val();
    var b6= $('input[name=optradio-2-6]:checked').val();
    var b7= $('input[name=optradio-2-7]:checked').val();
    var b8= $('input[name=optradio-2-8]:checked').val();
    var b9= $('input[name=optradio-2-9]:checked').val();
    var b10= $('input[name=optradio-2-10]:checked').val();
    var c1= $('input[name=optradio-3-1]:checked').val();
    var c2= $('input[name=optradio-3-2]:checked').val();
    var d1= $('input[name=optradio-4-1]:checked').val();
    var d2= $('input[name=optradio-4-2]:checked').val();
    var d3= $('input[name=optradio-4-3]:checked').val();
    var e1= $('input[name=optradio-5-1]:checked').val();
    var e2= $('input[name=optradio-5-2]:checked').val();
    var comCalif= $('#calif')["0"].value;
    var comFort= $('#fort')["0"].value;
    var comMejora= $('#mejora')["0"].value;
    var comOtros= $('#otros')["0"].value;

    var insertEntity = {
        PartitionKey: {'_': partitionKey},
        RowKey: {'_': rowKey},
        Tipo: {'_': tipo},
        Lugar: {'_': lugar},
        Fecha: {'_': fecha},
        Expositor1: {'_': expo1},
        Expositor2: {'_': expo2},
        A1: {'_': a1},
        A2: {'_': a2},
        A3: {'_': a3},
        B1: {'_': b1},
        B2: {'_': b2},
        B3: {'_': b3},
        B4: {'_': b4},
        B5: {'_': b5},
        B6: {'_': b6},
        B7: {'_': b7},
        B8: {'_': b8},
        B9: {'_': b9},
        B10: {'_': b10},
        C1: {'_': c1},
        C2: {'_': c2},
        D1: {'_': d1},
        D2: {'_': d2},
        D3: {'_': d3},
        E1: {'_': e1},
        E2: {'_': e2},
        ComCalif: {'_': comCalif},
        ComFort: {'_': comFort},
        ComMejora: {'_': comMejora},
        ComOtros: {'_': comOtros}
        
    };

    tableService.insertOrMergeEntity(tablita, insertEntity, function(error, result, response) {
        if(error) {
            alert('Insert table entity error, please open browser console to view detailed error');
            console.log(error);
        } else {
            alert('Sus datos han sido enviados Correctamente!');
            refreshEntityList();
        }
    });
}

function deleteEntity(partitionKey, rowKey) {
    var tableService = getTableService();
    if (!tableService)
        return;
    
    if (table == null || table.length < 1) {
        alert('Invalid table name!')
        return;
    }

    var deleteEntity = {
        PartitionKey: {'_': partitionKey},
        RowKey: {'_': rowKey}
    };

    tableService.deleteEntity(table, deleteEntity, function(error, result, response) {
        if(error) {
            alert('Delete table entity error, please open browser console to view detailed error');
            console.log(error);
        } else {
            alert('Delete table entity successfully!');
            refreshEntityList();
        }
    });
};
$(document).ready(function () {
    refreshTableList();
    viewTable('encuestasrh');//leer tabla
});
