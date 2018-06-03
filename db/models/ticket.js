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
        SQLHelper.addSqlParameter(SQLHelper.sqlParameter('idUsuario', ticket.idUsuario, TYPES.Money));

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

    static async updateTicketDetail(idTicketDetalle, cantidad, precio) {
        SQLHelper.createConnection();
        var query = "UPDATE [Entidad].[TicketDetalle] SET cantidad = @cantidad, precio = @precio WHERE idTicketDetalle = @idTicketDetalle";;
        SQLHelper.clearSqlParameters();
        SQLHelper.addSqlParameter(SQLHelper.sqlParameter('cantidad', cantidad, TYPES.Int));
        SQLHelper.addSqlParameter(SQLHelper.sqlParameter('idTicketDetalle', idTicketDetalle, TYPES.Int));
        SQLHelper.addSqlParameter(SQLHelper.sqlParameter('precio', precio, TYPES.Money));
        return SQLHelper.executeStatement(query, false);
    }

    static async deleteTicketDetail(idTicketDetalle) {
        SQLHelper.createConnection();
        var query = "servidor.EliminarTicketDetalle";
        SQLHelper.clearSqlParameters();
        SQLHelper.addSqlParameter(SQLHelper.sqlParameter('idTicketDetalle', idTicketDetalle, TYPES.Int));
        return SQLHelper.executeStatement(query, true); 
    }

    static async payTicket(ticket) {
        SQLHelper.createConnection();
        var query = `UPDATE [Entidad].[Ticket] 
                        SET status = 1,
                            pago = @pago,
                            cambio = @cambio,
                            total = @total
                    WHERE idTicket = @idTicket`;
        SQLHelper.clearSqlParameters();
        SQLHelper.addSqlParameter(SQLHelper.sqlParameter('pago', ticket.pago, TYPES.Money));
        SQLHelper.addSqlParameter(SQLHelper.sqlParameter('cambio', ticket.cambio, TYPES.Money));
        SQLHelper.addSqlParameter(SQLHelper.sqlParameter('total', ticket.total, TYPES.Money));
        SQLHelper.addSqlParameter(SQLHelper.sqlParameter('idTicket', ticket.idTicket, TYPES.Int));
        return SQLHelper.executeStatement(query, false); 
    }

    static async deleteTicket(idTicket) {
        SQLHelper.createConnection();
        var query = "UPDATE [Entidad].[Ticket] SET eliminado = 1 WHERE idTicket = " + idTicket;
        SQLHelper.clearSqlParameters();
        return SQLHelper.executeStatement(query, false); 
    }

    static async getTicketByID(idTicket) {
        SQLHelper.createConnection();
        var query = `SELECT td.cantidad
                        ,p.nombre
                        ,CASE WHEN td.idProducto = 1360 
                            THEN reg.totalPagar 
                            ELSE CASE WHEN p.precio = 0 THEN td.precio ELSE td.cantidad * p.precio END
                            END precio
                        ,t.pago
                        ,t.cambio
                    FROM Entidad.Ticket t
                    INNER JOIN Entidad.TicketDetalle td ON td.idTicket = t.idTicket
                    INNER JOIN Catalogo.Producto p ON p.idProducto = td.idProducto
                    LEFT JOIN Entidad.RegistroComputadora reg ON reg.idRegistro = t.idRegistro
                    WHERE t.idTicket = @idTicket`
        SQLHelper.clearSqlParameters();
        SQLHelper.addSqlParameter(SQLHelper.sqlParameter('idTicket', idTicket, TYPES.Int));
        return SQLHelper.executeStatement(query, false); 
    }

    static async getTicketsPending() {
        SQLHelper.createConnection();
        var query = 'servidor.ObtenerTicketsPendientes'
        SQLHelper.clearSqlParameters();
        return SQLHelper.executeStatement(query, true); 
    }

    static async getTicketsDetallePending(ids) {
        SQLHelper.createConnection();
        var query = 'SELECT * FROM Entidad.TicketDetalle WHERE idTicket IN (' + ids + ')';
        SQLHelper.clearSqlParameters();
        // SQLHelper.addSqlParameter(SQLHelper.sqlParameter('ids', ids, TYPES.Int));
        return SQLHelper.executeStatement(query, false); 
    }

    static async getRecordsNoPay() {
        SQLHelper.createConnection();
        var query = 'SELECT * FROM Entidad.RegistroComputadora WHERE pagado = 0';
        SQLHelper.clearSqlParameters();
        // SQLHelper.addSqlParameter(SQLHelper.sqlParameter('ids', ids, TYPES.Int));
        return SQLHelper.executeStatement(query, false); 
    }
}



module.exports = Ticket