const urlCreateRegion = 'http://localhost:3000/api/user/create-region';
const urlCreateCountry = 'http://localhost:3000/api/user/create-country';
const urlCreateCity = 'http://localhost:3000/api/user/create-city';
const urlGetList = 'http://localhost:3000/api/user/get-list';
const urlDeleteRegion = 'http://localhost:3000/api/user/delete-region';
const urlDeleteCountry = 'http://localhost:3000/api/user/delete-country';
const urlDeleteCity = 'http://localhost:3000/api/user/delete-city';
const urlEditRegion = 'http://localhost:3000/api/user/edit-region';
const urlEditCountry = 'http://localhost:3000/api/user/edit-country';
const urlEditCity = 'http://localhost:3000/api/user/edit-city';

const btnCreateRegion = document.querySelector('#createRegionBtn');
const btnCreateCountry = document.querySelector('#createCountryBtn');
const btnCreateCity = document.querySelector('#createCityBtn');

const myHeaders = new Headers();
myHeaders.append('Content-Type', 'application/json');
myHeaders.append('Authorization', sessionStorage.token);
import { checkToken } from './common-functions.js';
checkToken(sessionStorage);

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

function printLocationList(locations) {
    let regions_div = document.querySelector('#regions');
    let n = 0;

    locations.forEach(element => {
        regions_div.innerHTML += `
        <div class="container border p-2 d-flex flex-row align-items-center justify-content-between" style="background-color:#c6c9cf;">
            <div class="d-flex flex-row align-items-center">
                <h3 class="d-inline">${element.region}</h3>
                <button type="submit" class="btn btn-secondary m-2 edi_reg" id="${element.region_id}">Editar</button>
                <button type="submit" class="btn btn-danger m-2 del_reg" id="${element.region_id}">Eliminar</button>
            </div>
            <button type="submit" class="btn btn-primary m-2 con" id="${element.region_id}">Agregar país</button>
        </div>
        
        <div class="border" id="${element.region}">
        </div>
        `;

        let n_countries = element.countries.length;
        let countries_div = document.getElementById(element.region);

        for (let index = 0; index < n_countries; index++) {
            countries_div.innerHTML += `
            <div class="d-flex flex-row align-items-center justify-content-between" style="background-color: #e8ebf1;">
                <div class="d-flex flex-row align-items-center">
                    <h4 class="d-inline m-2">${element.countries[index].country}</h4>
                    <button type="submit" class="btn btn-secondary m-2 edi_con" id="${element.countries[index].country_id}">Editar</button>
                    <button type="submit" class="btn btn-danger m-2 del_con" id="${element.countries[index].country_id}">Eliminar</button>
                </div>
                <button type="submit" class="btn btn-primary m-2 cit" id="${element.countries[index].country_id}">Agregar ciudad</button>
            </div>

            <div class="border" id="${element.countries[index].country}">
            </div>
            `;

            let country = element.countries[index].country;
            let n_cities = element.countries[index].cities.length;
            let cities_div = document.getElementById(country);

            for (let index_2 = 0; index_2 < n_cities; index_2++) {

                let city_id = element.countries[index].cities[index_2].city_id;

                cities_div.innerHTML += `
                <div class="d-flex flex-row justify-content-between ms-4">
                    <div class="d-flex flex-row align-items-center">
                        <h5 class="d-inline m-2">${element.countries[index].cities[index_2].city}</h5>
                        <button type="submit" class="btn btn-secondary m-2 edi_cit" id="${city_id}">Editar</button>
                        <button type="submit" class="btn btn-danger m-2 del_cit" id="${city_id}">Eliminar</button>
                    </div>
                </div>
                `;
            }
        };
    });
}

fetch(urlGetList, getOptions)
    .then(res => res.json())
    .then(data => {
        if (data.status == 200) {
            printLocationList(data.list);
            // BOTON AGREGAR PAIS   
            document.querySelectorAll('.con').forEach(element => {
                element.addEventListener('click', event => {
                    let newCountry = prompt("Nombre de la PAIS que desea crear:");
                    let blngRegion = event.target.id;

                    const jsonToSend = JSON.stringify({
                        country: newCountry,
                        region_id: blngRegion
                    });

                    fetchServer(urlCreateCountry, postOptions, jsonToSend)
                        .then(res => res.json())
                        .then(data => {
                            console.log(data);
                            window.location.href = './city-region.html';
                        })
                        .catch(e => {
                            window.location.href = './index.html';
                            console.log('Failed to connect to the Database, ', e);
                            alert('Error de conexion con el servidor');
                        });
                });
            });
            // BOTON AGREGAR CIUDAD 
            document.querySelectorAll('.cit').forEach(element => {
                element.addEventListener('click', event => {
                    let newCity = prompt("Nombre de la CIUDAD que desea crear:");
                    let blngCountry = event.target.id;

                    const jsonToSend = JSON.stringify({
                        city: newCity,
                        country_id: blngCountry
                    });

                    fetchServer(urlCreateCity, postOptions, jsonToSend)
                        .then(res => res.json())
                        .then(data => {
                            console.log(data);
                            window.location.href = './city-region.html';
                        })
                        .catch(e => {
                            window.location.href = './index.html';
                            console.log('Failed to connect to the Database, ', e);
                            alert('Error de conexion con el servidor');
                        });
                });
            });
            // BOTON ELIMINAR REGION
            document.querySelectorAll('.del_reg').forEach(element => {
                element.addEventListener('click', event => {
                    if (confirm('Esta seguro que desea eliminar la región?')) {
                        let region_id = event.target.id;
                        const jsonToSend = JSON.stringify({ id: region_id });

                        fetchServer(urlDeleteRegion, deleteOptions, jsonToSend)
                            .then(res => res.json())
                            .then(data => {
                                if (data.status == 200) {
                                    window.location.href = './city-region.html';
                                } else if (data.status == 401) {
                                    alert(data.msg);
                                } else if (data.status == 402) {
                                    alert('Ud no tiene permiso para borrar una region');
                                } else if (data.status == 409) {
                                    alert('Error con la conexion a la BD');
                                }
                            })
                            .catch(e => {
                                console.log('Failed to connect to the Database, ', e);
                                alert('Error de conexion con el servidor');
                            });
                    }
                });
            });
            // BOTON ELIMINAR PAIS
            document.querySelectorAll('.del_con').forEach(element => {
                element.addEventListener('click', event => {
                    if (confirm('Esta seguro que desea eliminar el pais?')) {
                        let country_id = event.target.id;
                        const jsonToSend = JSON.stringify({ id: country_id });

                        fetchServer(urlDeleteCountry, deleteOptions, jsonToSend)
                            .then(res => res.json())
                            .then(data => {
                                if (data.status == 200) {
                                    window.location.href = './city-region.html';
                                } else if (data.status == 401) {
                                    alert(data.msg);
                                } else if (data.status == 402) {
                                    alert('Ud no tiene permiso para borrar un pais');
                                } else if (data.status == 409) {
                                    alert('Error con la conexion a la BD');
                                }
                            })
                            .catch(e => {
                                console.log('Failed to connect to the Database, ', e);
                                alert('Error de conexion con el servidor');
                            });
                    }
                });
            });
            // BOTON ELIMINAR CIUDAD
            document.querySelectorAll('.del_cit').forEach(element => {
                element.addEventListener('click', event => {
                    if (confirm('Esta seguro que desea eliminar la ciudad?')) {
                        let city_id = event.target.id;
                        const jsonToSend = JSON.stringify({ id: city_id });

                        fetchServer(urlDeleteCity, deleteOptions, jsonToSend)
                            .then(res => res.json())
                            .then(data => {
                                if (data.status == 200) {
                                    window.location.href = './city-region.html';
                                } else if (data.status == 401) {
                                    alert(data.msg);
                                } else if (data.status == 402) {
                                    alert('Ud no tiene permiso para borrar una ciudad');
                                } else if (data.status == 409) {
                                    alert('Error con la conexion a la BD');
                                }
                            })
                            .catch(e => {
                                console.log('Failed to connect to the Database, ', e);
                                alert('Error de conexion con el servidor');
                            });
                    }
                });
            });
            // BOTON EDITAR REGION
            document.querySelectorAll('.edi_reg').forEach(element => {
                element.addEventListener('click', event => {
                    let region_id = event.target.id;
                    let new_reg_name = prompt('Cambiar nombre:');
                    const jsonToSend = JSON.stringify({ id: region_id, new_name: new_reg_name });

                    fetchServer(urlEditRegion, postOptions, jsonToSend)
                        .then(res => res.json())
                        .then(data => {
                            if (data.status == 200) {
                                window.location.href = './city-region.html';
                            } else if (data.status == 401) {
                                alert(data.msg);
                            } else if (data.status == 402) {
                                alert('Ud no tiene permiso para editar');
                            } else if (data.status == 409) {
                                alert('Error con la conexion a la BD');
                            }
                        })
                        .catch(e => {
                            console.log('Failed to connect to the Database, ', e);
                            alert('Error de conexion con el servidor');
                        });
                });
            });
            // BOTON EDITAR PAIS
            document.querySelectorAll('.edi_con').forEach(element => {
                element.addEventListener('click', event => {
                    let country_id = event.target.id;
                    let new_con_name = prompt('Cambiar nombre:');
                    const jsonToSend = JSON.stringify({ id: country_id, new_name: new_con_name });

                    fetchServer(urlEditCountry, postOptions, jsonToSend)
                        .then(res => res.json())
                        .then(data => {
                            if (data.status == 200) {
                                window.location.href = './city-region.html';
                            } else if (data.status == 401) {
                                alert(data.msg);
                            } else if (data.status == 402) {
                                alert('Ud no tiene permiso para editar');
                            } else if (data.status == 409) {
                                alert('Error con la conexion a la BD');
                            }
                        })
                        .catch(e => {
                            console.log('Failed to connect to the Database, ', e);
                            alert('Error de conexion con el servidor');
                        });
                });
            });
            // BOTON EDITAR CIUDAD
            document.querySelectorAll('.edi_cit').forEach(element => {
                element.addEventListener('click', event => {
                    let city_id = event.target.id;
                    let new_cit_name = prompt('Cambiar nombre:');
                    const jsonToSend = JSON.stringify({ id: city_id, new_name: new_cit_name });

                    fetchServer(urlEditCity, postOptions, jsonToSend)
                        .then(res => res.json())
                        .then(data => {
                            if (data.status == 200) {
                                window.location.href = './city-region.html';
                            } else if (data.status == 401) {
                                alert(data.msg);
                            } else if (data.status == 402) {
                                alert('Ud no tiene permiso para editar');
                            } else if (data.status == 409) {
                                alert('Error con la conexion a la BD');
                            }
                        })
                        .catch(e => {
                            console.log('Failed to connect to the Database, ', e);
                            alert('Error de conexion con el servidor');
                        });
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

btnCreateRegion.addEventListener('click', event => {
    let newRegion = prompt("Nombre de la REGION que desea crear:");
    const jsonToSend = JSON.stringify({ region: newRegion });

    fetchServer(urlCreateRegion, postOptions, jsonToSend)
        .then(res => res.json())
        .then(data => {
            console.log(data);
            window.location.href = './city-region.html';
        })
        .catch(e => {
            window.location.href = './index.html';
            console.log('Failed to connect to the Database, ', e);
            alert('Error de conexion con el servidor');
        });
});

