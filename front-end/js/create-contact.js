import { checkToken } from './common-functions.js';

checkToken(sessionStorage);

const urlGetCompaniesList = 'http://localhost:3000/api/user/companies-list&regions';
//const urlGetCountryAndCitiesList = 'http://localhost:3000/api/user/country&cities-list';


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

fetch(urlGetCompaniesList, postOptions)
    .then(res => res.json())
    .then(data => {
        if (data.status == 200) {
            // Fill Company Selct Element
            //let elementBefore = '';
            let select_company = document.querySelector('#newContactCompany');
            select_company.innerHTML = `<option selected>...</option>`;
            data.companies.forEach(element => {
                //if (element.name != elementBefore) { // Remove repetead companies
                select_company.innerHTML += `<option value="${element.id}">${element.name}</option>`;
                //}
                //elementBefore = element.name;
            });
            // Fill Region/Country/City Selects depending on Company Selected
            // select_company.addEventListener('change', () => {
            //     let companySelected = select_company.options[select_company.selectedIndex].text;

            //     let select_region = document.querySelector('#newContactRegion');
            //     select_region.innerHTML = `<option selected>...</option>`;

            //     data.list.forEach(element => {
            //         if (element.name === companySelected) { // && element.name != elementBefore) { // Find regions of Compnay selected and Remove repetead regions
            //             console.log(element.city.country.region.region)
            //             select_region.innerHTML += `<option value="${element.id}">${element.city.country.region.region}</option>`
            //         }
            //         //elementBefore = element.city.country.region.region;
            //     });
            // });
            let select_region = document.querySelector('#newContactRegion');
            let select_country = document.querySelector('#newContactCountry');
            let select_city = document.querySelector('#newContactCity');

            select_region.innerHTML = `<option selected>...</option>`;
            data.regions.forEach(element => {
                select_region.innerHTML += `<option value="${element.id}">${element.region}</option>`;
            });

            let countrySelectedData;
            select_region.addEventListener('change', () => {
                select_city.disabled = true;
                select_city.innerHTML = `<option selected>...</option>`;

                let regionSelected = select_region.options[select_region.selectedIndex].text;
                if (regionSelected !== '...') {
                    select_country.disabled = false;
                    select_country.innerHTML = `<option selected>...</option>`;
                    data.regions.forEach(element => {
                        if (element.region === regionSelected) {
                            element.countries.forEach(element2 => {
                                select_country.innerHTML += `<option value="${element2.id}">${element2.country}</option>`;
                            });
                            countrySelectedData = element.countries;
                        }
                    });
                } else {
                    select_country.disabled = true;
                }
            });

            select_country.addEventListener('change', () => {
                let countrySelected = select_country.options[select_country.selectedIndex].text;
                if (countrySelected !== '...') {
                    select_city.disabled = false;
                    select_city.innerHTML = `<option selected>...</option>`;
                    countrySelectedData.forEach(element => {
                        if (element.country === countrySelected) {
                            element.cities.forEach(element2 => {
                                select_city.innerHTML += `<option value="${element2.id}">${element2.city}</option>`;
                            });
                        }
                    });
                } else {
                    select_city.disabled = true;
                }
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

