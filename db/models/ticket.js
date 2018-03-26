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
}



module.exports = Ticket