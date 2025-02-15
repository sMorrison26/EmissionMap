import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPenNib } from '@fortawesome/free-solid-svg-icons'
import { faEnvelope } from '@fortawesome/free-solid-svg-icons'

import "./searchbar.css"


export default function SearchBar(){
  return (
    <div className="searchbar">
      {/* <FontAwesomeIcon icon="fa-solid fa-magnifying-glass" /> */}
      <FontAwesomeIcon icon={faPenNib} />
      <FontAwesomeIcon icon={faEnvelope} />
      <input type="text" placeholder='Search...'/>
    </div>
  )
}