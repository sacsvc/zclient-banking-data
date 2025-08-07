import fetch from "node-fetch";

export async function getProfileData(id) {

    try {
        const response = await fetch(`https://smucl.zendesk.com/api/v2/users/${id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Basic ${process.env.Zendesk_Authorization}`
            }
        });

        if (!response.ok) {
            console.error("Respuesta no válida:", response.statusText);
            return null;
        }

        const userData = await response.json();
        const profileData = userData.user;
        const fields = userData.user?.user_fields || {};

        const bankingData = {
            fullName: profileData.name || "Sin Informacion",
            nameCtaBancaria: fields.nombre || "Sin Informacion",
            banco: fields.banco || "Sin Informacion",
            nCtaBancaria: fields.n_cta_bancaria || "Sin Informacion",
            rutUser: fields.rut || "Sin Informacion",
            rutCtaBancaria: fields.rut_cta_bancaria || "Sin Informacion",
            tipoCuentaBancaria: fields.tipo_cta_bancaria || "Sin Informacion",
            cuentaDestino: fields.cuenta_destino || "Sin Informacion"
        };
        return bankingData;
    }
    catch (error) {
        console.error("Error al obtener datos del perfil:", error);
        throw error;
    }
}