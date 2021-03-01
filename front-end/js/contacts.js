import { checkToken } from './common-functions.js';
checkToken(sessionStorage);

const urlGetDBList = 'http://localhost:3000/api/user/db-lists';
const urlGetContactList = 'http://localhost:3000/api/user/contact-list';
const urlDeleteContact = 'http://localhost:3000/api/user/delete-contact';

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
        } else if (data.status == 409) {
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

fetch(urlGetContactList, getOptions)
    .then(res => res.json())
    .then(data => {
        if (data.status == 200) {
            const contactsTable = document.querySelector('#contactsTable');

            let list = data.contactsList;

            for (let index = 0; index < list.length; index++) {
                //for(let index_2 = 0; index_2 < list[index].cities.length; index_2++) {
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

                //}
            }

            let checkInputAll = document.querySelector('#checkAllContacts');
            let checksInput = document.querySelectorAll('[name="checkbox"]');
            //let checksInput = document.getElementsByName('checkbox');
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





