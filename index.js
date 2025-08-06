import xlsx from 'xlsx';
import dotenv from 'dotenv';
dotenv.config();
import { getProfileData } from './src/getProfileData.js';

async function main() {
    const workbook = xlsx.readFile('input.xlsx');
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const data = xlsx.utils.sheet_to_json(worksheet);
    
    if (!data || data.length === 0) {
        console.error("No se encontraron datos en el archivo de entrada.");
        return;
    }

    console.log("Datos a procesar:", data.length, "filas.");
    for (const items of data) {
        const data = await getProfileData(items);
        items.banco = data?.banco || "Sin Informacion";
        items.n_cta_bancaria = data?.n_cta_bancaria || "Sin Informacion";
        items.rut = data?.rut || "Sin Informacion";
        items.rut_cta_bancaria = data?.rut_cta_bancaria || "Sin Informacion";
        items.tipo_cta_bancaria = data?.tipo_cta_bancaria || "Sin Informacion";
        items.cuenta_destino = data?.cuenta_destino || "Sin Informacion";
    }
    const updatedSheet = xlsx.utils.json_to_sheet(data);
    const updatedWorkbook = xlsx.utils.book_new();
    xlsx.utils.book_append_sheet(updatedWorkbook, updatedSheet, sheetName);

    // ⚠️ Sobrescribe el archivo existente
    xlsx.writeFile(updatedWorkbook, 'output.xlsx');
}

main();