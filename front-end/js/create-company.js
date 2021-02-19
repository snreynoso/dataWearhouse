import { checkToken } from './common-functions.js';

checkToken(sessionStorage);

const urlGetCitiesList = 'http://localhost:3000/api/user/cities-list';
const urlCreateCompany = 'http://localhost:3000/api/user/create-company';
const createCompanyForm = document.querySelector('#createCompanyForm');

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

fetch(urlGetCitiesList, getOptions)
    .then(res => res.json())
    .then(data => {
        if (data.status == 200) {
            let select_element = document.querySelector('#create-city')
            select_element.innerHTML = `<option selected>...</option>`;
            data.list.forEach(element => {
                select_element.innerHTML += `<option value="${element.id}">${element.city}</option>`
            });
        } else if (data.status == 401) {
            alert(data.msg);
        } else if (data.status == 402) {
            alert('Ud no tiene permiso para crear un usuario');
        } else if (data.status == 409) {
            alert('Error con la conexion a la BD');
        }
    })
    .catch(e => {
        console.log('Failed to connect to the Database, ', e);
        alert('Error de conexion con el servidor');
    });

async function fetchServer(url, options, jsonToSend) {
    options['body'] = jsonToSend; // Add body: jsonToSend
    const response = await fetch(url, options);
    return response;
}

createCompanyForm.addEventListener('submit', event => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    let formValues = [];

    for (let value of formData.values()) {
        formValues.push(value);
    };

    const [name, address, email, phone, city_id] = formValues;

    if (city_id === "...") {
        alert('Seleccione una ciudad');
    } 
    else {
        const jsonToSend = JSON.stringify({
            name: name,
            address: address,
            email: email,
            phone: phone,
            city_id: city_id
        });

        fetchServer(urlCreateCompany, postOptions, jsonToSend)
            .then(res => res.json())
            .then(data => {
                if (data.status == 201) {
                    alert('La compañia ha sido creada correctamente');
                    window.location.href = './companies.html';
                } else if (data.status == 401) {
                    alert(data.msg);
                } 
                // else if (data.status == 402) {
                //     alert('Ud no tiene permiso para crear un usuario');
                // } 
                else if (data.status == 409) {
                    alert('Error con la conexion a la BD');
                }
            })
            .catch(e => {
                window.location.href = './index.html';
                console.log('Failed to connect to the Database, ', e);
                alert('Error de conexion con el servidor');
            });
    }
});