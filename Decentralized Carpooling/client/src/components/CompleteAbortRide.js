import { useState, useEffect } from 'react';
import { ethers } from "ethers";
import "./CompleteAbortRide.css";
import logo from ".././logo.png";
import GiveRating from "./GiveRating.js";
import constants from "../constants.js";

const CompleteAbortRide = ({ state }) => {
    const {contract} = state;

    const [showCompleteAbortRide, setShowCompleteAbortRide] = useState(true);
    const [showRating, setShowRating] = useState(false);

    const [fare, setFare] = useState([]);
    const [bookedDriverAddress, setBookedDriverAddress] = useState([]);

    const rating = () => {
        setShowCompleteAbortRide(false);
        setShowRating(true);
    }

    useEffect(() => {
        const rideInfo = async()=>{
          var fare = await contract.getFare();
          fare = Number(fare) / 1000;
          setFare(fare);
          const bookedDriverAddress = await contract.getBookedDriverAddress();
          setBookedDriverAddress(bookedDriverAddress);
        }
        contract && rideInfo();
    }, [contract]);

    const completeRide = async(event) => {
        event.preventDefault();
        const complete = await contract.completeRide();
        await complete.wait();
        const amount = { value: ethers.parseEther(fare.toString()) };
        const pay = await contract.sendViaCall(bookedDriverAddress.toString(), amount);
        await pay.wait();
        rating();
    }

    const abortRide = async(event) => {
        event.preventDefault();
        const {contract} = state;
        const search = await contract.abortRide();
        await search.wait();
        const amount = { value: ethers.parseEther(constants.securityAmount) };
        const pay = await contract.sendViaCall(constants.contractAddress, amount);
        await pay.wait();
        alert("Ride Aborted !!");
        window.location.reload(true);
    }

    return  (
        <div>
            {showCompleteAbortRide &&
                <div>
                    <img src={logo} className="logo" alt = ".." />

                    <div className="center" style={{ height:"21vh", width:"26vw" }}>
                        <form class="form" onSubmit = {completeRide}>
                            <div className="inputbox">
                                <input type="submit" value="Complete Ride"  disabled={!state.contract}/>
                            </div>
                            <div className="inputbox">
                                <input type='button' onClick={abortRide} value="Abort Ride" disabled={!state.contract} />
                            </div>
                        </form>
                    </div>
                </div>
            }

            {showRating &&
                <div>
                    <GiveRating state={state} />
                </div>
            }
        </div>
    );
}

export default CompleteAbortRide;






