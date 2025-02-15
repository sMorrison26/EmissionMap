import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSearch } from '@fortawesome/free-solid-svg-icons'
import { useState } from 'react'

import "./searchbar.css"

const INITIAL_CENTER = [-73.935242, 40.730610]
const INITIAL_ZOOM = 10.12

export default function SearchBar(){

  //api: https://api.mapbox.com/geocoding/v5
  const [searchText, setSearchText] = useState('')

  const handleSearchText = (text) => {
    // console.log('Before: ',text);
    setSearchText(encodeURI(text));
    // console.log('After: ',searchText);
  }

  // const handleSearch = async (event) => {
  //   if (event.key === 'Enter') {
  //     console.log('Enter key pressed');
  //     console.log('SearchText: ', searchText);
  //     // Add your logic here to handle the search
  //     try {
  //       const apiToken = 'pk.eyJ1IjoiZGFuZ2IyNCIsImEiOiJjbTc2amR0NXIwdXphMmxwcnZtanprZXZzIn0.heEc3MDcr2E2grB7VXRKgw'
  //       const response = await fetch(`https://api.mapbox.com/geocoding/v5/mapbox.places/${searchText}.json?proximity=${INITIAL_CENTER[0]},${INITIAL_CENTER[1]}&bbox=-122.30937,37.84214,-122.23715,37.89838&access_token=${apiToken}`)
  //     } catch {

  //     }

  //   }
  // }

  return (
    // <div className="searchbar">
    //   <div className="searchbar-input-container">
    //     <FontAwesomeIcon icon={faSearch} className="search-icon" />
    //     <input 
    //       type="text" 
    //       placeholder='Search...' 
    //       onChange={(e) => handleSearchText(e.target.value) }
    //       onKeyDown={handleSearch}
    //     />
    //   </div>
    // </div>
    <></>
  )
}