const urlLoginUser = 'http://localhost:3000/api/user/login';
const loginUserForm = document.querySelector('#loginForm');

const postOptions = {
    method: 'POST',
    credentials: 'same-origin',
    headers: {
        'Content-Type': 'application/json'
    }
}

async function fetchServer(url, options, jsonToSend) {
    options['body'] = jsonToSend; // Add body: jsonToSend
    const response = await fetch(url, options);
    return response;
}

loginUserForm.addEventListener('submit', event => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    let formValues = [];

    for (let value of formData.values()) {
        formValues.push(value);
    };

    const [username, password] = formValues;
    const jsonToSend = JSON.stringify({
        username: username,
        password: password,
    });

    fetchServer(urlLoginUser, postOptions, jsonToSend)
        .then(res => res.json())
        .then(data => {
            if (data.status == 200) {
                sessionStorage.token = data.token;
                sessionStorage.role = data.role;
                window.location.href = './contacts.html';
            } else if (data.status == 401) {
                alert('Los datos ingresados son incorrectos');
                document.querySelector('#login-user').value = '';
                //document.querySelector('#login-password').value = '';
            } else if (data.status == 409) {
                alert('Error con la conexion a la BD');
                document.querySelector('#login-user').value = '';
                //document.querySelector('#login-password').value = '';
            }
        })
        .catch( e => {
           console.log('Failed to connect to the Database, ', e);
           alert('Falla de conexion con el Servidor');
        });
});