import axios from './axios'

export const createErpLeadAndUpdate = async (
    name,
    number,
    email,
    state,
    source,
    course_enquired,
    notes,
    campaign,
    exam
) => {
    try {
        const data = {
            first_name: name,
            mobile_no: number,
            state,
            email_id: email,
            source,
            course_exam: exam ? [exam] : "",
            course_enquired,
            notes,
            campaign_name: campaign ? campaign : "",
        };
        const data2 = {
            first_name: name,
            mobile_no: number,
            state,
            email_id: email,
            source: "",
            course_exam: exam ? [exam] : "",
            course_enquired,
            notes,
            campaign_name: campaign ? campaign : "",
        };

        const config = {
            method: "post",
            url: "https://aifer.frappe.cloud/api/method/aifer.api.crm.make_lead",
            headers: {
                Authorization: `Basic ${process.env.NEXT_PUBLIC_ERP_AUTH_TOKEN}`,
                "Content-Type": "application/json",
            },
            data,
        };
        const config2 = {
            method: "post",
            url: "https://aifer.frappe.cloud/api/method/aifer.api.crm.make_lead",
            headers: {
                Authorization: `Basic ${process.env.NEXT_PUBLIC_ERP_AUTH_TOKEN}`,
                "Content-Type": "application/json",
            },
            data: data2,
        };

        const checkLeadData = {
            mobile_no: number,
        };

        const checkLeadConfig = {
            method: "post",
            url: "https://aifer.frappe.cloud/api/method/aifer.api.crm.get_lead",
            headers: {
                Authorization: `Basic ${process.env.NEXT_PUBLIC_ERP_AUTH_TOKEN}`,
                "Content-Type": "application/json",
            },
            data: checkLeadData,
        };
        const checkLead = await axios(checkLeadConfig);

        if (checkLead.data.message.success) {
            // console.log("lead true");
            await axios(config2);
            // console.log(res, "lead  or updateed");
        } else {
            // console.log("no user");
            await axios(config);
            // console.log(res, "lead created ");
        }
    } catch (err) {
        console.log(err, "createErpLeadAndUpdate");
    }
};