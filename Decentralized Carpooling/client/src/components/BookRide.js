import { useState, useEffect } from "react";
import { ethers } from "ethers";
import "./BookRide.css";
import logo from ".././logo.png";
import CompleteAbortRide from "./CompleteAbortRide.js";
import constants from "../constants.js";
import { Divider } from "@material-ui/core";

const BookRide = ({ state }) => {
    const { contract } = state;
    const [eligibleDrivers, setEligibleDrivers] = useState([]);

    const [showAbortComplete, setAbortComplete] = useState(false);
    const [showBookRide, setBookRide] = useState(true);

    const booked = () => {
        setBookRide(false);
        setAbortComplete(true);
    }

    useEffect(() => {
        const driversEligibility = async()=>{
          const eligibleDrivers = await contract.getEligibleDrivers();
          setEligibleDrivers(eligibleDrivers);
        }
        contract && driversEligibility();
    }, [contract]);

    const bookRide = async(event) => {
        event.preventDefault();
        const selectedDriver = document.querySelector("#selectedDriver").value;
        const book = await contract.bookRide(selectedDriver);
        await book.wait();
        const amount = { value: ethers.parseEther(constants.securityAmount) };
        const pay = await contract.sendViaCall(constants.contractAddress, amount);
        await pay.wait();
        alert("Booked !!");
        booked();
        // window.location.reload(true);
    }

    return (
        <div>
            {showBookRide &&
                <div className = "container-fluid">
                    <div>
                        <img src={logo} class="logo" alt = ".." style={{ width:"30%", height:"30%", marginLeft:"28vw", marginTop:"-2.5vh"}} />

                        <div className="center" style={{ height:"16vh", width:"26vw", marginTop:'-0.5vh' }}>
                            {/* <h1>BOOK RIDE</h1> */}
                            <form class="form" onSubmit = {bookRide}>
                                <div className="inputbox">
                                    <input type="text" required="required" id="selectedDriver" style={{marginTop:'1.5vh'}} />
                                    <span style={{marginTop:'1.5vh'}}> Driver ID ... </span>
                                </div>

                                <div className="inputbox">
                                    <input type="submit" value="Book Ride"  disabled={!state.contract}
                                           style={{width:'23.8vw', marginLeft:'0.5vw', marginTop:'0.5vw'}}
                                    />
                                </div>
                            </form>
                        </div>
                    </div>

                    <div className="eligibleDrivers" style={{}}>
                        {eligibleDrivers.map((eligibleDriver, i) => {
                            return (
                                <div style={{ backgroundColor: `${i%2===0 ? 'lightgrey' : 'lightblue'}`}}>
                                    <Divider class="divider" style={{width:'57vw'}} />
                                    <p className="driverNumber"> <b>Driver ID :</b> {i} </p>
                                    <p className="name" style={{}}> <i><b>{eligibleDriver.name}</b></i> </p>
                                    <p className="address" style={{}}> <b>{eligibleDriver.account}</b> </p>
                                    <p className="phoneNumber" style={{}}> <b>Contact :</b> {eligibleDriver.phoneNumber} </p>
                                    <p className="car" style={{}}> <b>Car :</b> {eligibleDriver.car} </p>
                                    <p className="rating" style={{}}> <b>Rating :</b> {eligibleDriver.rating.toString()} </p>
                                    <p className="fare" style={{}}> <b>Fare :</b> {eligibleDriver.fare.toString()} ethers </p>
                                    <Divider class="divider" style={{width:'57vw'}} />
                                </div>
                            );
                        })}
                    </div>
                </div>
            }

            {showAbortComplete &&
                <div>
                    <CompleteAbortRide state={state} />
                </div>
            }
        </div>
    );
}

export default BookRide;




