const urlLoginCheck = 'http://localhost:3000/api/user/loginCheck';
//const userHeaderBtn = document.querySelector('#userHeaderBtn');

function checkToken(sessionStorage) {

    const myHeaders = new Headers();
    myHeaders.append('Content-Type', 'application/json');
    myHeaders.append('Authorization', sessionStorage.token);

    const postOptions = {
        method: 'POST',
        credentials: 'same-origin',
        headers: myHeaders
    }

    fetch(urlLoginCheck, postOptions)
        .then(res => res.json())
        .then(resJson => {
            if (resJson.status != 200) {
                alert('Por favor inicie sesion');
                window.location.href = './index.html';
            }
            // if (resJson.role != 'admin') {
            //     userHeaderBtn.style.display='none';
            // } 
        })
        .catch(e => {
            window.location.href = './index.html';
            console.log(e);
            alert('Error de conexion con el servidor');
        });
};

export { checkToken };