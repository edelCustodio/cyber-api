let SQLHelper = require('../helpers/sql-helper');
let TYPES = require('tedious').TYPES;

var Producto = {
    getProducts: function() {
        SQLHelper.createConnection();
        var query = 'SELECT * FROM [Catalogo].[Producto]'
        SQLHelper.clearSqlParameters();
        return SQLHelper.executeStatement(query, false);  
    },

    getProductByName: function (busqueda) {
        SQLHelper.createConnection();
        var query = 'servidor.BuscarProductoPorNombre' 
        SQLHelper.clearSqlParameters();
        SQLHelper.addSqlParameter(SQLHelper.sqlParameter('busqueda', busqueda, TYPES.VarChar));
        return SQLHelper.executeStatement(query, true);
    }
}

module.exports = Producto