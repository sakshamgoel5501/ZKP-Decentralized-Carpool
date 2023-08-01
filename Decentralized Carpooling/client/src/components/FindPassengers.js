import { ethers } from "ethers";
import "./FindPassengers.css";
import logo from ".././logo.png";
import constants from "../constants.js";

const FindPassengers = ({ state }) => {
    const findPassengers = async(event) => {
        event.preventDefault();
        const {contract} = state;
        const source = document.querySelector("#source").value;
        const destination = document.querySelector("#destination").value;
        const car = document.querySelector("#car").value;
        const fare = document.querySelector("#fare").value;
        const amount = { value: ethers.parseEther(constants.securityAmount) };
        const pay = await contract.sendViaCall(constants.contractAddress, amount);
        await pay.wait();
        const find = await contract.findPassengers(source, destination, car, fare);
        await find.wait();
        alert("Search Initiated !!");
        window.location.reload();
    }

    return  (
        <div>
            <img src={logo} class="logo" alt = ".." style={{ width:"30%", height:"30%", marginLeft:"28vw", marginTop:"-2.5vh"}} />

            <div className="center" style={{ width:"30%", height:"58vh", marginTop:"-0.5vh"}}>
                <h1 style={{marginLeft:'0.4vw'}}>FIND PASSENGERS</h1>
                <form class="form" onSubmit = {findPassengers}>
                    <div className="inputbox">
                        <input type="text" required="required" id="source" style={{marginTop:'2.5vh'}} />
                        <span style={{marginTop:'2.5vh'}}> Source... </span>
                    </div>

                    <div className="inputbox">
                        <input type="text" required="required" id="destination" style={{marginTop:'4.5vh'}} />
                        <span style={{marginTop:'4.5vh'}}> Destination... </span>
                    </div>

                    <div className="inputbox">
                        <input type="text" required="required" id="car" style={{marginTop:'6.5vh'}} />
                        <span style={{marginTop:'6.5vh'}}> Car... </span>
                    </div>

                    <div className="inputbox">
                        <input type="text" required="required" id="fare" style={{marginTop:'8.5vh'}} />
                        <span style={{marginTop:'8.5vh'}}> Fare... </span>
                    </div>

                    <div className="inputbox">
                        <input type="submit" value="Find Passengers"  style={{marginTop:'10.5vh', width:'24vw', marginLeft:'0.4vw'}}  disabled={!state.contract} />
                    </div>
                </form>
            </div>

            <small> <p style={{marginTop:'2vh', marginLeft:'33vw'}}>* If fare is f then type (1000 X f).</p> </small>
        </div>
    );
}

export default FindPassengers;

