let SQLHelper = require('../helpers/sql-helper');
let TYPES = require('tedious').TYPES;

class Ticket {
    static async createTicket(ticket) {
        var proc = 'servidor.CrearTicket';
        SQLHelper.createConnection();
        SQLHelper.clearSqlParameters();
        SQLHelper.addSqlParameter(SQLHelper.sqlParameter('total', ticket.total, TYPES.Money));
        SQLHelper.addSqlParameter(SQLHelper.sqlParameter('pago', ticket.pago, TYPES.Money));
        SQLHelper.addSqlParameter(SQLHelper.sqlParameter('cambio', ticket.cambio, TYPES.Money));
        if (ticket.idRegistro > 0) {
            SQLHelper.addSqlParameter(SQLHelper.sqlParameter('idRegistro', ticket.idRegistro, TYPES.Int));
        }
        return SQLHelper.executeStatement(proc, true);       
    }

    static async createTicketDetail(insertDetail) {
        SQLHelper.createConnection();
        // var query = "servidor.CrearTicketDetalle"
        SQLHelper.clearSqlParameters();
        return SQLHelper.executeStatement(insertDetail, false); 
    }

    static async getTicketByID(idTicket) {
        SQLHelper.createConnection();
        var query = `SELECT td.cantidad, p.nombre, CASE WHEN td.idProducto = 1360 THEN reg.totalPagar ELSE p.precio END precio 
                        FROM Entidad.Ticket t
                        INNER JOIN Entidad.TicketDetalle td ON td.idTicket = t.idTicket
                        INNER JOIN Catalogo.Producto p ON p.idProducto = td.idProducto
                        LEFT JOIN Entidad.RegistroComputadora reg ON reg.idRegistro = t.idRegistro
                        WHERE t.idTicket = @idTicket`
        SQLHelper.clearSqlParameters();
        SQLHelper.addSqlParameter(SQLHelper.sqlParameter('idTicket', idTicket, TYPES.Int));
        return SQLHelper.executeStatement(query, false); 
    }

    // static async getTicket(idTicket) {
    //     SQLHelper.createConnection();
    //     var query = `SELECT td.cantidad, p.nombre, p.precio 
    //                     FROM Entidad.Ticket t
    //                     INNER JOIN Entidad.TicketDetalle td ON td.idTicket = t.idTicket
    //                     INNER JOIN Catalogo.Producto p ON p.idProducto = td.idProducto
    //                     WHERE t.idTicket = @idTicket`
    //     SQLHelper.clearSqlParameters();
    //     SQLHelper.addSqlParameter(SQLHelper.sqlParameter('idTicket', idTicket, TYPES.Int));
    //     return SQLHelper.executeStatement(insertDetail, false); 
    // }
}



module.exports = Ticket