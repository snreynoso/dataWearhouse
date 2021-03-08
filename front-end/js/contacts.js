import { checkToken } from './common-functions.js';
checkToken(sessionStorage);

const urlGetDBList = 'http://localhost:3000/api/user/db-lists';
const urlGetContactList = 'http://localhost:3000/api/user/contact-list';
const urlDeleteContact = 'http://localhost:3000/api/user/delete-contact';
const urlFindContact = 'http://localhost:3000/api/user/find-contact';

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

const deleteOptions = {
    method: 'DELETE',
    credentials: 'same-origin',
    headers: myHeaders
}

async function fetchServer(url, options, jsonToSend) {
    options['body'] = jsonToSend; // Add body: jsonToSend
    const response = await fetch(url, options);
    return response;
}

function deleteContact(contactId) {
    const jsonToSend = JSON.stringify({ id: contactId });
    fetchServer(urlDeleteContact, deleteOptions, jsonToSend)
        .then(res => res.json())
        .then(data => {
            if (data.status == 200) {
                window.location.href = './contacts.html';
                alert('El contacto ha sido borrado correctamente');
            } else if (data.status == 401) {
                alert(data.msg);
            }
            else if (data.status == 409) {
                alert('Error con la conexión a la BD');
            }
        })
        .catch(e => {
            console.log('Failed to connect to the Database, ', e);
            alert('Error de conexión con el servidor');
        });
}

function printContactTable(list) {
    const contactsTable = document.querySelector('#contactsTable');
    contactsTable.innerHTML = '';
    for (let index = 0; index < list.length; index++) {
        contactsTable.innerHTML +=
            `<td class="align-middle text-center">
                <div class="custom-control custom-checkbox">
                    <input type="checkbox" name="checkbox" class="custom-control-input" id="${list[index].id}">
                </div>
            </td>
            <td class="align-middle text-center">${list[index].name}</td>
            <td class="align-middle text-center">${list[index].city.country.country}</td>
            <td class="align-middle text-center">${list[index].company.name}</td>
            <td class="align-middle text-center">${list[index].charge}</td>
            <td class="align-middle text-center">${list[index].interes}%</td>
                        
            <td>
                <div class="d-flex justify-content-center"> 
                    <a class="btn btn-secondary m-1" name="editContactBtn" id="${list[index].id}">Editar</a>
                    <a class="btn btn-danger m-1" name="deleteContact" id="${list[index].id}">Eliminar</a>
                </div>
            </td>`
    }

    let checkInputAll = document.querySelector('#checkAllContacts');
    let checksInput = document.querySelectorAll('[name="checkbox"]');
    checkInputAll.addEventListener('change', () => {
        if (checkInputAll.checked) {
            for (var i = 0; i < checksInput.length; i++) {
                document.querySelector('#numberSelected').innerHTML = checksInput.length + ' Seleccionados';
                if (checksInput[i].type == 'checkbox')
                    checksInput[i].checked = true;
            }
        } else {
            for (var i = 0; i < checksInput.length; i++) {
                document.querySelector('#numberSelected').innerHTML = '0 Seleccionados';
                if (checksInput[i].type == 'checkbox')
                    checksInput[i].checked = false;
            }
        }
    });

    checksInput.forEach(element => {
        element.addEventListener('change', event => {
            checkInputAll.checked = false;
            let cont = 0;
            for (var i = 0; i < checksInput.length; i++) {
                if (checksInput[i].checked)
                    cont++;
            }
            document.querySelector('#numberSelected').innerHTML = cont + ' Seleccionados';
        });
    });
    ////// DELETE CONTACTS //////
    let deleteContactBtn = document.querySelectorAll('[name="deleteContact"]');
    deleteContactBtn.forEach(element => {
        element.addEventListener('click', event => {
            let contactId = event.target.id;
            if (confirm('Esta seguro que desea eliminar el contacto?'))
                deleteContact(contactId);
        });
    });

    let deleteAllContactsBtn = document.querySelector('#deleteAllSelected')
    deleteAllContactsBtn.addEventListener('click', () => {
        let contactsDelList = [];
        checksInput.forEach(element => {
            if (element.checked)
                contactsDelList.push(element.id)
        });
        if (confirm('Esta seguro que desea eliminar los contactos seleccionados?'))
            deleteContact(contactsDelList);
    });
    ////// EDIT CONTACTS //////
    document.querySelectorAll('[name="editContactBtn"]').forEach(element => {
        element.addEventListener('click', event => {
            sessionStorage.editContactId = event.target.id;
            window.location.href = './edit-contact.html';
        });
    });
}

fetch(urlGetDBList, getOptions)
    .then(res => res.json())
    .then(data => {
        if (data.status == 200) {
            let select_city = document.querySelector('#findCity')
            select_city.innerHTML = `<option selected value="">...</option>`;
            data.cityList.forEach(element => {
                select_city.innerHTML += `<option value="${element.id}">${element.city}</option>`
            });
            let select_company = document.querySelector('#findCompany')
            select_company.innerHTML = `<option selected value="">...</option>`;
            data.companyList.forEach(element => {
                select_company.innerHTML += `<option value="${element.id}">${element.name}</option>`
            });

            document.querySelector('#btnSearch').addEventListener('click', () => {
                let nameValue = document.querySelector('#findName').value;
                let cargoValue = document.querySelector('#findCargo').value;
                let cityValue = document.querySelector('#findCity').value;
                let companyValue = document.querySelector('#findCompany').value;
                let interesValue = document.querySelector('#findInteres').value;

                let findData = new Object;
                if (nameValue != '')
                    findData.name = nameValue;
                if (cargoValue != '')
                    findData.charge = cargoValue;
                if (cityValue != '')
                    findData.city_id = cityValue;
                if (companyValue != '')
                    findData.company_id = companyValue;
                if (interesValue != '')
                    findData.interes = interesValue;

                const jsonToSend = JSON.stringify(findData);
                fetchServer(urlFindContact, postOptions, jsonToSend)
                    .then(res => res.json())
                    .then(data => {
                        printContactTable(data.contacts)
                    })
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

fetch(urlGetContactList, getOptions)
    .then(res => res.json())
    .then(data => {
        if (data.status == 200) {
            let list = data.contactsList;
            printContactTable(list);
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





