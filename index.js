import xlsx from 'xlsx';
import cron from 'node-cron';
import dotenv from 'dotenv';
dotenv.config();
import { getTicketData } from './src/getTicketData.js';

cron.schedule('*/30 8-20 * * *', async () => {
    const workbook = xlsx.readFile('input.xlsx');
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const rows = xlsx.utils.sheet_to_json(worksheet);

    if (!rows || rows.length === 0) {
        console.error("No se encontraron datos en el archivo de entrada.");
        return;
    }

    console.log("Procesando", rows.length, "tickets...");

    for (const row of rows) {
        const ticketId = row.ticketId || row.id; 
        const result = await getTicketData(ticketId);

        if (result) {
            row.fullName = result.datosBancarios.fullName;
            row.nameCtaBancaria = result.datosBancarios.nameCtaBancaria;
            row.banco = result.datosBancarios.banco;
            row.bankCode = result.datosBancarios.bankCode;
            row.n_cta_bancaria = result.datosBancarios.nroCtaBancaria;
            row.rut = result.datosBancarios.rutUser;
            row.rut_cta_bancaria = result.datosBancarios.rutCtaBancaria;
            row.tipo_cta_bancaria = result.datosBancarios.tipoCtaBancaria;
            row.tipo_Cuenta = result.datosBancarios.tipoCuenta;
            row.cuenta_destino = result.datosBancarios.cuentaDestino;

            row.tienda = result.tienda;
            row.medioDePago = result.medioDePago;
            row.motivoDevolucion = result.motivoDevolucion;
            row.folioNc = result.folioNc;
            row.fechaNc = result.fechaNc;
            row.montoDevolucion = result.montoDevolucion;
            row.estadoDevolucion = result.estadoDevolucion;
            row.order = result.order;
            row.fechaTicket = result.fechaTicket;
        } else {
            console.warn("No se pudo procesar el ticket ID:", ticketId);
        }
    }

    const updatedSheet = xlsx.utils.json_to_sheet(rows);
    const updatedWorkbook = xlsx.utils.book_new();
    xlsx.utils.book_append_sheet(updatedWorkbook, updatedSheet, sheetName);
    xlsx.writeFile(updatedWorkbook, 'output.xlsx');

    console.log("Archivo 'output.xlsx' actualizado correctamente.");
}, {
    timezone: 'America/Santiago'
});


// async function main() {
//     const workbook = xlsx.readFile('input.xlsx');
//     const sheetName = workbook.SheetNames[0];
//     const worksheet = workbook.Sheets[sheetName];
//     const rows = xlsx.utils.sheet_to_json(worksheet);

//     if (!rows || rows.length === 0) {
//         console.error("No se encontraron datos en el archivo de entrada.");
//         return;
//     }

//     console.log("Procesando", rows.length, "tickets...");

//     for (const row of rows) {
//         const ticketId = row.ticketId || row.id; // Asegúrate de tener una columna con el ID
//         const result = await getTicketData(ticketId);

//         if (result) {
//             row.ticketId = result.id;
//             row.fullName = result.datosBancarios.fullName;
//             row.nameCtaBancaria = result.datosBancarios.nameCtaBancaria;
//             row.banco = result.datosBancarios.banco;
//             row.bankCode = result.datosBancarios.bankCode;
//             row.n_cta_bancaria = result.datosBancarios.nroCtaBancaria;
//             row.rut = result.datosBancarios.rutUser;
//             row.rut_cta_bancaria = result.datosBancarios.rutCtaBancaria;
//             row.tipo_cta_bancaria = result.datosBancarios.tipoCtaBancaria;
//             row.tipo_Cuenta = result.datosBancarios.tipoCuenta;
//             row.cuenta_destino = result.datosBancarios.cuentaDestino;

//             row.tienda = result.tienda;
//             row.medioDePago = result.medioDePago;
//             row.motivoDevolucion = result.motivoDevolucion;
//             row.folioNc = result.folioNc;
//             row.tipoNC = result.tipoNC;
//             row.fechaNc = result.fechaNc;
//             row.montoDevolucion = result.montoDevolucion;
//             row.estadoDevolucion = result.estadoDevolucion;
//             row.order = result.order;
//             row.fechaTicket = result.fechaTicket;
//         } else {
//             console.warn("No se pudo procesar el ticket ID:", ticketId);
//         }
//     }

//     const updatedSheet = xlsx.utils.json_to_sheet(rows);
//     const updatedWorkbook = xlsx.utils.book_new();
//     xlsx.utils.book_append_sheet(updatedWorkbook, updatedSheet, sheetName);
//     xlsx.writeFile(updatedWorkbook, 'output.xlsx');

//     console.log("Archivo 'output.xlsx' actualizado correctamente.");
// }

// main();