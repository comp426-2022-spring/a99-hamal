import axios from 'axios'
const BASE_URL = 'http://localhost:5000/app/'

class RequestService {
    // GET request to find user based on username
    getUser(username) {
        return axios.get(BASE_URL + 'users/' + username + '/')
    }
    
    // GET request that returns array of JSON data for countries that match user's languages and vaccinations
    getUserCountries(username) {
        return axios.get(BASE_URL + 'getUserCountries/' + username + '/')
    }

    // POST request to add user to the DB
    async addUser(username, name, password, email) {
        const body = {
            "username": username,
            "name": name,
            "password": password,
            "email": email
        }

        return axios.post(BASE_URL + 'users/add/', body)
    }

    // POST request to update user based on username
    updateUser(username, name, password, email, hasMalaria, hasHepatitisA, hasHepatitisB, hasYellowFever, hasTyfoid, hasDTP, hasCholera, languages) {
        const body = {
            "username": username,
            "name": name,
            "password": password,
            "email": email,
            "malaria": hasMalaria,
            "hepatitisA": hasHepatitisA,
            "hepatitisB": hasHepatitisB,
            "yellowFever": hasYellowFever,
            "tyfoid": hasTyfoid,
            "dtp": hasDTP,
            "cholera": hasCholera,
            "languages": languages
        }

        axios.post(BASE_URL + 'update/', body)
          .then(function (response) {
            console.log(response);
          })
          .catch(function (error) {
            console.log(error);
          });
    }

    // DELETE request to delete user
    deleteUser(username) {
        axios.delete(BASE_URL + username + '/')
        .then(function (response) {
          console.log(response);
        })
        .catch(function (error) {
          console.log(error);
        });
    }

    // GET request to get array of country names
    getCountries() {
        return axios.get(BASE_URL + 'getCountries/')
    }

    // GET request to get a specific country JSON data
    getCountryData(country) {
        return axios.get(BASE_URL + 'getCountry/' + country + '/')
    }

    // GET request to get array of all country JSON data
    getAllCountriesData() {
        return axios.get(BASE_URL + 'getAllCountriesData/')
    }

    async login(username, password) {
      const body = {
        "username": username,
        "password": password
      }
      const res = axios.post(BASE_URL + 'login/', body)
      res.then((res) => {
          console.log(res)
          localStorage.setItem("token", res.data.token)
        })
        .catch(function (error) {
        console.log(error);
      });
      return res
    }

    logout() {
      localStorage.removeItem("token")
    }

    getUsername() {
      const headers= { headers: 
        {
        "Content-type": "application/json",
        "x-access-token": localStorage.getItem("token")
        }
      }
      return axios.get(BASE_URL + 'getUsername/', headers)
    }

}
export default new RequestService()

// To use in other files do RequestService.(desired method) after importing this file
// ex:  import RequestService from '../services/RequestService.js'
//      RequestService.getCountryData("USA")