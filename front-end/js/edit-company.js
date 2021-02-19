import { checkToken } from './common-functions.js';
checkToken(sessionStorage);

const urlGetCitiesList = 'http://localhost:3000/api/user/cities-list';
const urlGetCompany = 'http://localhost:3000/api/user/get-company';
const urlEditCompany = 'http://localhost:3000/api/user/edit-company';
const editCompanyForm = document.querySelector('#editCompanyForm');

// FETCH HEADER //
const myHeaders = new Headers();
myHeaders.append('Content-Type', 'application/json');
myHeaders.append('Authorization', sessionStorage.token);

const getOptions = {
    method: 'GET',
    credentials: 'same-origin',
    //headers: myHeaders
}

const postOptions = {
    method: 'POST',
    credentials: 'same-origin',
    headers: myHeaders
}

async function fetchServer(url, options, jsonToSend) {
    options['body'] = jsonToSend; // Add body: jsonToSend
    const response = await fetch(url, options);
    return response;
}

function getOptionByValue(value) {
    let allOptions = document.getElementsByTagName("option");
    let result;
    for (var x = 0; x < allOptions.length; x++)
        if (allOptions[x].textContent == value)
            result = allOptions[x];
    return result;
}

fetch(urlGetCitiesList, getOptions)
    .then(res => res.json())
    .then(data => {
        if (data.status == 200) {
            let select_element = document.querySelector('#create-city')
            select_element.innerHTML = `<option selected id="selectedCity">...</option>`;
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

const companyId = JSON.stringify({ id: sessionStorage.editCompanyNumber });

fetchServer(urlGetCompany, postOptions, companyId)
    .then(res => res.json())
    .then(data => {
        if (data.status == 200) {
            document.querySelector('#create-name').value = data.company.name;
            document.querySelector('#create-address').value = data.company.address;
            document.querySelector('#create-email').value = data.company.email;
            document.querySelector('#create-phone').value = data.company.phone;
            document.querySelector('#selectedCity').innerHTML = data.company.city.city;
            document.querySelector('#selectedCity').value = data.company.city_id;

            let cityInOptionsList = getOptionByValue(data.company.city.city);
            cityInOptionsList.remove();

        } else if (data.status == 401) {
            alert(data.msg);
        }
        // else if (data.status == 402) {
        //             alert('Ud no tiene permiso para crear un usuario');
        // } 
        else if (data.status == 409) {
            alert('Error con la conexion a la BD');
        }
    })
    .catch(e => {
        console.log('Failed to connect to the Database, ', e);
        alert('Error de conexion con el servidor');
    });

editCompanyForm.addEventListener('submit', event => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    let formValues = [];

    for (let value of formData.values()) {
        formValues.push(value);
    };

    const [name, address, email, phone, city_id] = formValues;

    const jsonToSend = JSON.stringify({
        id: sessionStorage.editCompanyNumber,
        name: name,
        address: address,
        email: email,
        phone: phone,
        city_id: city_id
    });

    fetchServer(urlEditCompany, postOptions, jsonToSend)
        .then(res => res.json())
        .then(data => {
            if (data.status == 200) {
                alert('La compañia ha sido modificada correctamente');
                window.location.href = './companies.html';
            } else if (data.status == 401) {
                alert(data.msg);
            }
            // else if (data.status == 402) {
            // alert('Ud no tiene permiso para crear un usuario');
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
});