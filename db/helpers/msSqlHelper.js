const sql = require('mssql')


class MSSQLHelper {
    static async executeSqlStatement() {
        try {
            // let pool = await sql.connect(this.getConfig());
            // let result = await pool.request()
            //     .input()
        } catch (e) {

        }
    }

    static getConfig() {
        return {
            user: 'cyber',
            password: 'Cyber2017',
            server: 'localhost', // You can use 'localhost\\instance' to connect to named instance
            database: 'CyberDB',
            options: {
                instanceName: 'SQLEXPRESS',
                useUTC: false,
            }
        } 
    }
}

module.exports = MSSQLHelper;