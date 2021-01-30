import { checkToken } from './common-functions.js';
checkToken(sessionStorage);

const urlCreateCompany = 'http://localhost:3000/api/user/companies-list';
const urlDeleteCompany = 'http://localhost:3000/api/user/delete-company';

// FETCH HEADER //
const myHeaders = new Headers();
myHeaders.append('Content-Type', 'application/json');
myHeaders.append('Authorization', sessionStorage.token);

const postOptions = {
    method: 'POST',
    credentials: 'same-origin',
    headers: myHeaders
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

function printCompaniesList(list) {
    const userListElement = document.querySelector('#companyList');
    userListElement.innerHTML = `
        <table class="table table-striped">
            <thead>
                <tr>
                    <th scope="col">#</th>
                    <th scope="col">Nombre</th>
                    <th scope="col">País</th>
                    <th scope="col">Dirección</th>
                    <th scope="col"></th>
                </tr>
            </thead>
            <tbody  id="companyTable">
            </tbody>
        </table>`;

    const companyTable = document.querySelector('#companyTable');
    for (let index = 0; index < list.length; index++) {
        companyTable.innerHTML +=
            `<th scope="row" class="align-middle">${index + 1}</th>
                        <td class="align-middle">${list[index].name}</td>
                        <td class="align-middle">${list[index].city.country.country}</td>
                        <td class="align-middle">${list[index].address}</td>
                        <td>
                            <div class="d-flex justify-content-end"> 
                                <a class="btn btn-secondary m-1" id="${list[index].company_id}">Editar</a>
                                <a class="btn btn-danger m-1" id="${list[index].company_id}">Eliminar</a>
                            </div>
                        </td>
                    </tr>`
    }
}

function deleteCompany(companyNumber) {
    const jsonToSend = JSON.stringify({ id: companyNumber });
    fetchServer(urlDeleteCompany, deleteOptions, jsonToSend)
        .then(res => res.json())
        .then(data => {
            if (data.status == 200) {
                alert('La compañia ha sido borrado correctamente');
                window.location.href = './companies.html';
            } else if (data.status == 401) {
                alert(data.msg);
            } 
            // else if (data.status == 402) {
            //     alert('Ud no tiene permiso para borrar una compañia');
            // } 
            else if (data.status == 409) {
                alert('Error con la conexión a la BD');
            }
        })
        .catch(e => {
            console.log('Failed to connect to the Database, ', e);
            alert('Error de conexión con el servidor');
        });
}

fetchServer(urlCreateCompany, postOptions)
    .then(res => res.json())
    .then(data => {
        if (data.status == 200) {
            printCompaniesList(data.list);
            //BOTON EDITAR
            document.querySelectorAll('.btn-secondary').forEach(element => {
                element.addEventListener('click', event => {
                    sessionStorage.editCompanyNumber = event.target.id;
                    window.location.href = './edit-company.html';
                });
            });
            //BOTON ELIMINAR
            document.querySelectorAll('.btn-danger').forEach(element => {
                element.addEventListener('click', event => {
                    let companyNumber = event.target.id;
                    if (confirm('Esta seguro que desea eliminar la compañia?'))
                        deleteCompany(companyNumber);
                });
            });
        } else if (data.status == 401) {
            alert(data.msg);
        } 
        // else if (data.status == 402) {
        //     alert('Ud no tiene permiso para crear una compa');
        // }
        else if (data.status == 409) {
            alert('Error con la conexion a la BD');
        }
    })
    .catch(e => {
        console.log('Failed to connect to the Database, ', e);
        alert('Error de conexion con el servidor');
    });