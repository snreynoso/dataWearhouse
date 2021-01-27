import { checkToken } from './common-functions.js';
checkToken(sessionStorage);

const urlGetUser = 'http://localhost:3000/api/admin/get-user';
const urlEditUser = 'http://localhost:3000/api/admin/edit-user';
const editUserForm = document.querySelector('#editUserForm');

// FETCH HEADER //
const myHeaders = new Headers();
myHeaders.append('Content-Type', 'application/json');
myHeaders.append('Authorization', sessionStorage.token);

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

const userId = JSON.stringify({ id: sessionStorage.editUserNumber });

fetchServer(urlGetUser, postOptions, userId)
    .then(res => res.json())
    .then(data => {
        if (data.status == 200) {
            document.querySelector('#create-username').value = data.user.username;
            document.querySelector('#create-name').value = data.user.name;
            document.querySelector('#create-email').value = data.user.email;

            if (data.user.role == 'user') {
                document.querySelector('#checkUser').checked = true;
            };

            document.querySelector('#create-password').value = data.user.password;
            document.querySelector('#create-repeatPassword').value = data.user.password;
        }
        else if (data.status == 401) {
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

editUserForm.addEventListener('submit', event => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    let formValues = [];

    for (let value of formData.values()) {
        formValues.push(value);
    };

    const [username, name, email, role, password, repeatPasword] = formValues;

    if (password != repeatPasword) {
        alert('La contraseña ingreasadas nos son iguales!');
        document.querySelector('#create-repeatPassword').value = '';
    } else {
        const jsonToSend = JSON.stringify({
            id: sessionStorage.editUserNumber,
            username: username,
            name: name,
            email: email,
            role: role,
            password: password
        });

        fetchServer(urlEditUser, postOptions, jsonToSend)
            .then(res => res.json())
            .then(data => {
                if (data.status == 200) {
                    alert('El usuario ha sido modificado correctamente');
                    window.location.href = './users.html';
                } else if (data.status == 401) {
                    alert(data.msg);
                } else if (data.status == 402) {
                    alert('Ud no tiene permiso para crear un usuario');
                } else if (data.status == 409) {
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