let SQLHelper = require('../helpers/sql-helper');
let TYPES = require('tedious').TYPES;

class Computadora {
    static async getDesktops() {
        SQLHelper.createConnection();
        var query = 'SELECT * FROM [Catalogo].[Computadora] WHERE enLinea = 1'
        SQLHelper.clearSqlParameters();
        return SQLHelper.executeStatement(query, false);  
    }

    static async getDesktopsInUse() {
        SQLHelper.createConnection();
        var query = `SELECT idRegistro
                            ,idComputadora
                            ,fechaInicio
                            ,fechaFin
                            ,totalPagar 
                            ,pagado
                       FROM [Entidad].[RegistroComputadora]
                      WHERE CAST(fechaInicio AS DATE) = CAST(GETDATE() AS DATE)
                        AND fechaFin IS NULL`;
        SQLHelper.clearSqlParameters();
        return SQLHelper.executeStatement(query, false);  
    }

    static async updateDesktopOnline(idComputadora, enLinea) {
        SQLHelper.createConnection();
        var query = "servidor.ActualizarEstadoComputadora"
        SQLHelper.clearSqlParameters();
        SQLHelper.addSqlParameter(SQLHelper.sqlParameter('idComputadora', idComputadora, TYPES.Int));
        SQLHelper.addSqlParameter(SQLHelper.sqlParameter('enLinea', enLinea, TYPES.Bit));
        return SQLHelper.executeStatement(query, true);  
    }

    static async getDesktop(localAddress, hostname) {
        SQLHelper.createConnection();
        var query = 'cliente.ObtenerIdComputadora'
        SQLHelper.clearSqlParameters();
        SQLHelper.addSqlParameter(SQLHelper.sqlParameter('ipCliente', localAddress, TYPES.VarChar));
        SQLHelper.addSqlParameter(SQLHelper.sqlParameter('nombreCliente', hostname, TYPES.VarChar));
        return SQLHelper.executeStatement(query, true);
    }

    static async getDesktopByName(hostname) {
        SQLHelper.createConnection();
        var query = 'SELECT * FROM Catalogo.Computadora WHERE nombre = @nombre'
        SQLHelper.clearSqlParameters();
        SQLHelper.addSqlParameter(SQLHelper.sqlParameter('nombre', hostname, TYPES.VarChar));
        return SQLHelper.executeStatement(query, false);
    }

    static async getDesktopByIPAddress(IPAddress) {
        SQLHelper.createConnection();
        var query = 'SELECT * FROM Catalogo.Computadora WHERE [IP] = @ipAddress'
        SQLHelper.clearSqlParameters();
        SQLHelper.addSqlParameter(SQLHelper.sqlParameter('ipAddress', IPAddress, TYPES.VarChar));
        return SQLHelper.executeStatement(query, false);
    }

    static async updateDesktopRecord(idComputadora, fecha, minutos, idUsuario) {
        SQLHelper.createConnection();
        var query = "cliente.GuardarRegistroComputadora"
        SQLHelper.clearSqlParameters();
        SQLHelper.addSqlParameter(SQLHelper.sqlParameter('idComputadora', idComputadora, TYPES.Int));
        SQLHelper.addSqlParameter(SQLHelper.sqlParameter('fecha', fecha, TYPES.DateTime));
        SQLHelper.addSqlParameter(SQLHelper.sqlParameter('minutos', minutos, TYPES.Int));
        SQLHelper.addSqlParameter(SQLHelper.sqlParameter('idUsuario', idUsuario, TYPES.Int));
        return SQLHelper.executeStatement(query, true);  
    }

    static async getLatestDesktopRecord(idComputadora) {
        SQLHelper.createConnection();
        var query = "cliente.ObtenerUltimoRegistroComputadora";
        SQLHelper.clearSqlParameters();
        SQLHelper.addSqlParameter(SQLHelper.sqlParameter('idComputadora', idComputadora, TYPES.Int));
        return SQLHelper.executeStatement(query, true);
    }
}

// var Computadora = {
   
// }

module.exports = Computadora