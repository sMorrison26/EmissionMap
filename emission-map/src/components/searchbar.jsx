import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSearch } from '@fortawesome/free-solid-svg-icons'

import "./searchbar.css"

export default function SearchBar(){
  return (
    <div className="searchbar">
      <div className="searchbar-input-container">
        <FontAwesomeIcon icon={faSearch} className="search-icon" />
        <input type="text" placeholder='Search...'/>
      </div>
    </div>
  )
}