import { checkToken } from './common-functions.js';

checkToken(sessionStorage);

const urlGetCompaniesList = 'http://localhost:3000/api/user/companies-list&regions';
const urlCreateContact = 'http://localhost:3000/api/user/create-contact';


const myHeaders = new Headers();
myHeaders.append('Content-Type', 'application/json');
myHeaders.append('Authorization', sessionStorage.token);

const postOptions = {
    method: 'POST',
    credentials: 'same-origin',
    headers: myHeaders
}

const getOptions = {
    method: 'GET',
    credentials: 'same-origin',
    //headers: myHeaders
}

async function fetchServer(url, options, jsonToSend) {
    options['body'] = jsonToSend; // Add body: jsonToSend
    const response = await fetch(url, options);
    return response;
}

fetch(urlGetCompaniesList, postOptions)
    .then(res => res.json())
    .then(data => {
        if (data.status == 200) {
            let select_company = document.querySelector('#newContactCompany');
            select_company.innerHTML = `<option selected>...</option>`;
            data.companies.forEach(element => {
                select_company.innerHTML += `<option value="${element.id}">${element.name}</option>`;
            });
            let select_region = document.querySelector('#newContactRegion');
            let select_country = document.querySelector('#newContactCountry');
            let select_city = document.querySelector('#newContactCity');

            select_region.innerHTML = `<option selected>...</option>`;
            data.regions.forEach(element => {
                select_region.innerHTML += `<option value="${element.id}">${element.region}</option>`;
            });

            let countrySelectedData;
            select_region.addEventListener('change', () => {
                select_city.disabled = true;
                select_city.innerHTML = `<option selected>...</option>`;

                let regionSelected = select_region.options[select_region.selectedIndex].text;
                if (regionSelected !== '...') {
                    select_country.disabled = false;
                    select_country.innerHTML = `<option selected>...</option>`;
                    data.regions.forEach(element => {
                        if (element.region === regionSelected) {
                            element.countries.forEach(element2 => {
                                select_country.innerHTML += `<option value="${element2.id}">${element2.country}</option>`;
                            });
                            countrySelectedData = element.countries;
                        }
                    });
                } else {
                    select_country.disabled = true;
                }
            });

            select_country.addEventListener('change', () => {
                let countrySelected = select_country.options[select_country.selectedIndex].text;
                if (countrySelected !== '...') {
                    select_city.disabled = false;
                    select_city.innerHTML = `<option selected>...</option>`;
                    countrySelectedData.forEach(element => {
                        if (element.country === countrySelected) {
                            element.cities.forEach(element2 => {
                                select_city.innerHTML += `<option value="${element2.id}">${element2.city}</option>`;
                            });
                        }
                    });
                } else {
                    select_city.disabled = true;
                }
            });
        } else if (data.status == 401) {
            alert(data.msg);
        } else if (data.status == 409) {
            alert('Error con la conexion a la BD');
        }
    })
    .catch(e => {
        console.log('Failed to connect to the Database, ', e);
        alert('Error de conexion con el servidor');
    });

document.querySelector('#createContactBtn').addEventListener('click', () => {
    let contactData = new Object;

    contactData.name = document.querySelector('#newContactName').value;
    contactData.surname = document.querySelector('#newContactSurname').value;
    contactData.charge = document.querySelector('#newContactCharge').value;
    contactData.email = document.querySelector('#newContactEmail').value;
    contactData.company_id = document.querySelector('#newContactCompany').value;
    contactData.city_id = document.querySelector('#newContactCity').value;
    contactData.address = document.querySelector('#newContactAddress').value;
    contactData.interes = document.querySelector('#newContactInteres').value;

    if (document.querySelector('#newContactChannelWA').checked) {
        contactData.WAAccount = document.querySelector('#newWAUserAccount').value
        contactData.WAPreference = document.querySelector('#newContactChannelWAPref').value
    } else {
        contactData.WAAccount = '';
        contactData.WAPreference = '';
    }
    if (document.querySelector('#newContactChannelIN').checked) {
        contactData.INAccount = document.querySelector('#newINUserAccount').value
        contactData.INPreference = document.querySelector('#newContactChannelINPref').value
    } else {
        contactData.INAccount = '';
        contactData.INPreference = '';
    }
    if (document.querySelector('#newContactChannelFB').checked) {
        contactData.FBAccount = document.querySelector('#newFBUserAccount').value
        contactData.FBPreference = document.querySelector('#newContactChannelFBPref').value
    } else {
        contactData.FBAccount = '';
        contactData.FBPreference = '';
    }

    const jsonToSend = JSON.stringify(contactData);

    fetchServer(urlCreateContact, postOptions, jsonToSend)
        .then(res => res.json())
        .then(data => {
            if (data.status == 201) {
                alert('El contacto ha sido creado correctamente');
                window.location.href = './contacts.html';
            } else if (data.status == 401) {
                alert(data.msg);
            } else if (data.status == 409) {
                alert('Error con la conexion a la BD');
            }
        })
        .catch(e => {
            window.location.href = './index.html';
            console.log('Failed to connect to the Database, ', e);
            alert('Error de conexion con el servidor');
        });
});
