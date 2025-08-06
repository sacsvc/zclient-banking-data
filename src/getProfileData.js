import fetch from "node-fetch";

export async function getProfileData(data) {
    try {
        const response = await fetch(`https://smucl.zendesk.com/api/v2/users/search.json?query=${data.mail}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Basic ${process.env.Zendesk_Authorization}`
            }
        });
        console.log("Datos del usuario => ", data.mail);
        if (response.ok) {
            const userData = await response.json();
            const data = userData.users[0]?.user_fields;

            const banco = data?.banco || "Sin Informacion";
            const nCtaBancaria = data?.n_cta_bancaria || "Sin Informacion";
            const rutUser = data?.rut || "Sin Informacion";
            const rutCtaBancaria = data?.rut_cta_bancaria || "Sin Informacion";
            const tipoCuentaBancaria = data?.tipo_cta_bancaria || "Sin Informacion";
            const cuentaDestino = data?.cuenta_destino || "Sin Informacion";

            if (banco && nCtaBancaria && rutUser && rutCtaBancaria && tipoCuentaBancaria && cuentaDestino === null) {
                console.log("No se encontraron datos del usuario con el correo:", data.mail);
                return;
            }else{
            console.log("Banco del usuario:", banco);
            console.log("Cuenta de destino del usuario:", cuentaDestino);
            console.log("Número de cuenta bancaria del usuario:", nCtaBancaria);
            console.log("RUT del usuario:", rutUser);
            console.log("RUT de la cuenta bancaria del usuario:", rutCtaBancaria);
            console.log("Tipo de cuenta bancaria del usuario:", tipoCuentaBancaria);
            console.log("===========================================");
            }
            return data;
        }
    }
    catch (error) {
        console.error("Error al obtener datos del perfil:", error);
        throw error;
    }
}