let SQLHelper = require('../helpers/sql-helper');
let TYPES = require('tedious').TYPES;

class Ticket {
    static async createTicket(ticket) {
        SQLHelper.createConnection();
        var query = "servidor.CrearTicket"
        SQLHelper.clearSqlParameters();
        SQLHelper.addSqlParameter(SQLHelper.sqlParameter('total', ticket.total, TYPES.Money));
        SQLHelper.addSqlParameter(SQLHelper.sqlParameter('pago', ticket.pago, TYPES.Money));
        SQLHelper.addSqlParameter(SQLHelper.sqlParameter('cambio', ticket.cambio, TYPES.Money));
        return await SQLHelper.executeStatement(query, true); 
    }

    static async createTicketDetail(detail) {
        SQLHelper.createConnection();
        var query = "servidor.CrearTicketDetalle"
        SQLHelper.clearSqlParameters();
        SQLHelper.addSqlParameter(SQLHelper.sqlParameter('idTicket', detail.idTicket, TYPES.Int));
        SQLHelper.addSqlParameter(SQLHelper.sqlParameter('idProducto', detail.idProducto, TYPES.Int));
        SQLHelper.addSqlParameter(SQLHelper.sqlParameter('cantidad', detail.cantidad, TYPES.Int));
        SQLHelper.addSqlParameter(SQLHelper.sqlParameter('idRegistroComputadora', detail.idRegistroComputadora, TYPES.Int));
        await SQLHelper.executeStatement(query, true); 
    }
}

module.exports = Ticket