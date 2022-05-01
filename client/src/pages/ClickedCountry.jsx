import React, { useEffect, useState }from "react";
import RequestService from "../services/RequestService";
import {Link} from "react-router-dom"
import LoadingSpinner from "../components/LoadingSpinner";
function ClickedCountry(props) {
    const [country, setCountry] = useState()
    const value = ""
    //get countries data
    function getCountryData() {
        RequestService.getCountryData(props.country).then((res) => {
          setCountry(res.data);
          console.log(res.data);
        }).catch(error => {
          console.log(error);
        })
      }

      useEffect(() => {
          getCountryData()
      }, [])

      if (typeof country === 'undefined') {
        return (
          <div style={{display: 'flex',  justifyContent:'center', alignItems:'center', height:100}}>
                <LoadingSpinner />
            </div>
        )
      }
      return(
          <pre> 
              <div>
                {JSON.stringify(country)}
            </div>
            <div>
                <b>
                  {country.names.name}
                </b>
            </div>
          </pre>
      )
}

export default ClickedCountry;