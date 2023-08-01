import "./DriverRegistration.css";
import logo from ".././logo.png";

const DriverRegistration = ({ state }) => {
    const register = async(event) => {
      event.preventDefault();
      const {contract} = state;
      const name = document.querySelector("#name").value;
      const phoneNumber = document.querySelector("#phoneNumber").value;
      const registration = await contract.driverRegistration(name, phoneNumber);
      await registration.wait();
      alert("Registration successful !!");
      window.location.reload();
    }

    return  (
      <div>
        <img src={logo} class="logo" alt = ".." />

        <div className="center" style={{ height:"43vh", width:"25vw"}}>
          <h1 style={{marginLeft:'0.35vw'}}>DRIVER REGISTRATION</h1>
          <form class="form" onSubmit = {register}>
            <div className="inputbox" style={{ width:"47vh", marginTop:'3vh'}}>
              <input type="text" required="required" id="name" />
              <span> Name... </span>
            </div>
            
            <div className="inputbox" style={{ width:"47vh", marginTop:'3vh'}}>
              <input type="text" required="required" id="phoneNumber" />
              <span> Phone Number... </span>
            </div>

            <div className="inputbox">
              <input type="submit" value="Register" disabled={!state.contract} style={{ width:"23.5vw", marginLeft:'0.4vw'}}/>
            </div>
          </form>
        </div>
      </div>
    );
}

export default DriverRegistration;

