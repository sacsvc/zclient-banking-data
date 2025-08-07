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

        const codeBank = {
            'falabella': '051',
            'santander': '037',
            'estado': '012',
            'coopeuch': '672',
            'chile': '001',
            'itau': '039',
            'bci': '016',
            'scotiabank': '014',
        }

        const bankCode = codeBank[fields.banco]

        const bankingData = {
            fullName: profileData.name || "Sin Informacion",
            nameCtaBancaria: fields.nombre || "Sin Informacion",
            banco: fields.banco || "Sin Informacion",
            bankCode: bankCode || "Sin Informacion",
            nroCtaBancaria: fields.n_cta_bancaria || "Sin Informacion",
            rutUser: fields.rut || "Sin Informacion",
            rutCtaBancaria: fields.rut_cta_bancaria || "Sin Informacion",
            tipoCtaBancaria: fields.tipo_cta_bancaria || "Sin Informacion",
            tipoCuenta: !fields.tipo_cta_bancaria || fields.tipo_cta_bancaria === "Sin Informacion"
                ? "Sin Informacion"
                : fields.tipo_cta_bancaria === "corriente"
                    ? "cc"
                    : "cv",
            cuentaDestino: fields.cuenta_destino || "Sin Informacion"
        };
        return bankingData;
    }
    catch (error) {
        console.error("Error al obtener datos del perfil:", error);
        throw error;
    }
}