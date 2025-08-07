import fetch from "node-fetch";
import { getProfileData } from './getProfileData.js';

export async function getFieldOptionNameByValue(fieldId, value) {
    const url = `https://smucl.zendesk.com/api/v2/ticket_fields/${fieldId}`;

    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Basic ${process.env.Zendesk_Authorization}`
            }
        });

        if (!response.ok) {
            console.error("Error al obtener el campo:", response.statusText);
            return value; // Devuelve el valor original como fallback
        }

        const data = await response.json();
        const options = data.ticket_field?.custom_field_options || [];

        const option = options.find(opt => opt.value === value);
        return option?.name || value;

    } catch (error) {
        console.error("Error al obtener la opción:", error);
        return value;
    }
}
export async function getTicketData(ticketId) {
    const url = `https://smucl.zendesk.com/api/v2/tickets/${ticketId}.json`;

    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Basic ${process.env.Zendesk_Authorization}`
            }
        });

        if (!response.ok) {
            console.error("Error al obtener el ticket:", response.statusText);
            return null;
        }

        const data = await response.json();
        const ticket = data.ticket;

        if (!ticket) {
            console.error("No se encontró el ticket con ID:", ticketId);
            return null;
        }

        // Extraer valores por ID desde custom_fields
        const customFieldsMap = Object.fromEntries(
            (ticket.custom_fields || []).map(f => [f.id, f.value])
        );

        const requester_id = ticket.requester_id || "Sin Informacion";
        const fechaTicket = ticket.created_at
            ? ticket.created_at.split('T')[0]
            : "Sin Informacion";


        const profileData = await getProfileData(requester_id);
        const fullName = profileData?.fullName || "Sin Informacion";
        console.log("Datos del usuario => ", fullName);

        const resultado = {
            id: ticket.id || "Sin Informacion",
            fechaTicket: fechaTicket || "Sin Informacion",
            profileId: ticket.requester_id || "Sin Informacion",
            motivoDevolucion: await getFieldOptionNameByValue(360053290773, customFieldsMap[360053290773]) || "Sin Informacion",
            tienda: await getFieldOptionNameByValue(360052677134, customFieldsMap[360052677134]) || "Sin Informacion",
            medioDePago: await getFieldOptionNameByValue(360053290693, customFieldsMap[360053290693]) || "Sin Informacion",
            estadoDevolucion: await getFieldOptionNameByValue(360054407433, customFieldsMap[360054407433]) || "Sin Informacion",
            folioNc: customFieldsMap[360053290533] || "Sin Informacion",
            fechaNc: customFieldsMap[1500003696702] || "Sin Informacion",
            montoDevolucion: customFieldsMap[360053290593] || "Sin Informacion",
            order: customFieldsMap[360056187993] || "Sin Informacion",
            datosBancarios: profileData || {}  // <- si quieres incluir todos los datos bancarios
        };

        console.log("Datos del ticket obtenidos correctamente:", resultado);
        return resultado;

    } catch (error) {
        console.error("Error en la petición:", error);
        return null;
    }
}

// Ejecutar para probar
// const ticketId = 793134;
// getTicketData(ticketId);
