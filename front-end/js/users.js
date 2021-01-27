import { checkToken } from './common-functions.js';
checkToken(sessionStorage);

const urlCreateUser = 'http://localhost:3000/api/admin/users-list';
const urlDeleteUser = 'http://localhost:3000/api/admin/delete-user';

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

function printUserList(list) {
    const userListElement = document.querySelector('#userList');
    userListElement.innerHTML = `
        <table class="table table-striped">
            <thead>
                <tr>
                    <th scope="col">#</th>
                    <th scope="col">Nombre y Apellido</th>
                    <th scope="col">E-Mail</th>
                    <th scope="col">Role</th>
                    <th scope="col"></th>
                </tr>
            </thead>
            <tbody  id="userTable">
            </tbody>
        </table>`;

    const userTable = document.querySelector('#userTable');
    for (let index = 0; index < list.length; index++) {
        userTable.innerHTML +=
            `<th scope="row" class="align-middle">${index + 1}</th>
                        <td class="align-middle">${list[index].name}</td>
                        <td class="align-middle">${list[index].email}</td>
                        <td class="align-middle">${list[index].role}</td>
                        <td>
                            <div class="d-flex justify-content-end"> 
                                <a class="btn btn-secondary m-1" id="${list[index].user_id}">Editar</a>
                                <a class="btn btn-danger m-1" id="${list[index].user_id}">Eliminar</a>
                            </div>
                        </td>
                    </tr>`
    }
}

function deleteUser(userNumber) {
    const jsonToSend = JSON.stringify({ id: userNumber });
    fetchServer(urlDeleteUser, deleteOptions, jsonToSend)
        .then(res => res.json())
        .then(data => {
            if (data.status == 200) {
                alert('El usuario ha sido borrado correctamente');
                window.location.href = './users.html';
            } else if (data.status == 401) {
                alert(data.msg);
            } else if (data.status == 402) {
                alert('Ud no tiene permiso para borrar un usuario');
            } else if (data.status == 409) {
                alert('Error con la conexion a la BD');
            }
        })
        .catch(e => {
            console.log('Failed to connect to the Database, ', e);
            alert('Error de conexion con el servidor');
        });
}

fetchServer(urlCreateUser, postOptions)
    .then(res => res.json())
    .then(data => {
        if (data.status == 200) {
            printUserList(data.list);
            //BOTON EDITAR
            document.querySelectorAll('.btn-secondary').forEach(element => {
                element.addEventListener('click', event => {
                    sessionStorage.editUserNumber = event.target.id;
                    window.location.href = './edit-user.html';
                });
            });
            //BOTON ELIMINAR
            document.querySelectorAll('.btn-danger').forEach(element => {
                element.addEventListener('click', event => {
                    let userNumber = event.target.id;
                    if (confirm('Esta seguro que desea eliminar el usuario?'))
                        deleteUser(userNumber);
                });
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



