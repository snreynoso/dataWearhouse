import { checkToken } from './common-functions.js';
checkToken(sessionStorage);

const urlGetDBList = 'http://localhost:3000/api/user/db-lists';

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

fetch(urlGetDBList, getOptions)
    .then(res => res.json())
    .then(data => {
        if (data.status == 200) {
            let select_country = document.querySelector('#findCountry')
            select_country.innerHTML = `<option selected>...</option>`;
            data.countryList.forEach(element => {
                select_country.innerHTML += `<option value="${element.country}">${element.country}</option>`
            });
            let select_company = document.querySelector('#findCompany')
            select_company.innerHTML = `<option selected>...</option>`;
            data.companyList.forEach(element => {
               select_company.innerHTML += `<option value="${element.name}">${element.name}</option>`
            });
        } else if (data.status == 401) {
            alert(data.msg);
        } //else if (data.status == 402) {
          //  alert('Ud no tiene permiso para crear un usuario');
          //} 
        else if (data.status == 409) {
            alert('Error con la conexion a la BD');
        }
    })
    .catch(e => {
        console.log('Failed to connect to the Database, ', e);
        alert('Error de conexion con el servidor');
    });

document.querySelector('#btnSearch').addEventListener('click', event => {
    let findData = new Object();
    findData.name = document.querySelector('#name').value;
    findData.cargo = document.querySelector('#findCargo').value;
    findData.country = document.querySelector('#findCountry').value;
    findData.company = document.querySelector('#findCompany').value;
    findData.chanel = document.querySelector('#findChanel').value;
    findData.interes = document.querySelector('#findInteres').value;
    console.log(findData)
})

