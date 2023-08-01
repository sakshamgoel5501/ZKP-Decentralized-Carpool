import "./GiveRating.css";
import logo from ".././logo.png";

const GiveRating = ({ state }) => {
    const rate = async(event) => {
      event.preventDefault();
      const {contract} = state;
      const rating = document.querySelector("#rating").value;
      await contract.giveRating(rating);
      alert("Thank you !!");
      window.location.reload();
    }

    return  (
      <div>
        <img src={logo} class="logo" alt = ".." />

        <div className="center" style={{ height:"35vh", width:"25vw"}}>
          <h1>RATE YOUR EXPERIENCE</h1>
          <form class="form" onSubmit = {rate}>
            <div className="inputbox" style={{ width:"47vh"}}>
              <input type="text" required="required" id="rating" style={{marginTop:'2vh'}} />
              <span style={{marginTop:'2vh'}}> Rating... </span>
            </div>

            <div className="inputbox">
              <input type="submit" value="Rate" disabled={!state.contract} 
                     style={{ width:"23.5vw", marginLeft:'0.4vw'}}
              />
            </div>
          </form>
        </div>

        <small> <p style={{marginTop:'2vh', marginLeft:'29vw'}}>* Give rating on the scale of 10 (Only Integers).</p> </small>
      </div>
    );
}

export default GiveRating;

