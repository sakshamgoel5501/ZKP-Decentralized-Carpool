import { useState } from 'react';
import "./SearchRide.css";
import logo from ".././logo.png";
import BookRide from "./BookRide.js";

const SearchRide = ({ state }) => {
    const [showBookRide, setBookRide] = useState(false);
    const [showSearchRide, setSearchRide] = useState(true);

    const eligibleDrivers = () => {
        setBookRide(true);
        setSearchRide(false);
    }

    const searchRide = async(event) => {
        event.preventDefault();
        const {contract} = state;
        const source = document.querySelector("#source").value;
        const destination = document.querySelector("#destination").value;
        const search = await contract.searchRide(source, destination);
        await search.wait();
        eligibleDrivers();
    }

    return  (
        <div>
            {showSearchRide &&
                <div>
                    <img src={logo} className="logo" alt = ".." />

                    <div className="center" style={{width:'30vw', height:'40vh'}}>
                        <h1 style={{marginLeft:'0.4vw'}}>SEARCH RIDE</h1>
                        <form class="form" onSubmit = {searchRide}>
                            <div className="inputbox"  style={{width:'27.5vw'}}>
                                <input type="text" required="required" id="source" style={{marginTop:'1vw'}} />
                                <span style={{marginTop:'1vw'}}> Source... </span>
                            </div>

                            <div className="inputbox"  style={{width:'27.5vw'}}>
                                <input type="text" required="required" id="destination" style={{marginTop:'2.2vw'}} />
                                <span style={{marginTop:'2.2vw'}}> Destination... </span>
                            </div>

                            <div className="inputbox">
                                <input type="submit" value="Search"  disabled={!state.contract}
                                       style={{width:'29vw', marginLeft:'0.4vw', marginTop:'3vw'}}
                                />
                            </div>
                        </form>
                    </div>
                </div>
            }

            {showBookRide &&
                <div>
                    <BookRide state={state} />
                </div>
            }
        </div>
    );
}

export default SearchRide;

