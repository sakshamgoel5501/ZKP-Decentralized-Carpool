import { useState, useEffect } from 'react';
import abi from "./contracts/Carpool.json";
import { ethers } from "ethers";
import DriverRegistration from './components/DriverRegistration.js';
import FindPassengers from './components/FindPassengers.js';
import SearchRide from './components/SearchRide.js';
import logo from "./logo.png";
import './App.css';
import { Divider } from "@material-ui/core";
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import LocalPhoneIcon from '@mui/icons-material/LocalPhone';
import constants from "./constants.js";

function App() {
  const [state, setState] = useState({
    provider: null,
    signer: null,
    contract: null,
  });

  const [account, setAccount] = useState("Not Connected");

  useEffect(() => {
    const connectWallet = async () => {
      const contractAddress = constants.contractAddress;
      const contractABI = abi.abi;
      try {
        const { ethereum } = window;

        if(ethereum){
          const account = await ethereum.request({
            method: "eth_requestAccounts",
          });

          window.ethereum.on("chainChanged", () => {
            window.location.reload();
          });

          window.ethereum.on("accountsChanged", () => {
            window.location.reload();
          });

          // Earlier in v5 provider = new ethers.providers.Web3Provider(window.ethereum)
          // In v6: provider = new ethers.BrowserProvider(window.ethereum)

          // const provider = new ethers.providers.Web3Provider(ethereum);
          const provider = new ethers.BrowserProvider(window.ethereum);
          // const signer = provider.getSigner();
          const signer = await provider.getSigner();

          const contract = new ethers.Contract(
            contractAddress, 
            contractABI, 
            signer
          );

          setAccount(account);
          setState({ provider, signer, contract });
        } else {
          alert("Please Install MetaMask");
        }
      } catch (error) {
        console.log(error);
      }
    };

    connectWallet();

  }, []);

  const [showDriverRegistration, setDriverRegistration] = useState(false);
  const [showSearchRide, setSearchRide] = useState(false);
  const [showFindPassengers, setFindPassengers] = useState(false);

  const driverRegistration = () => {
    setDriverRegistration(true);
    setFindPassengers(false);
    setSearchRide(false);
  }

  const findPassengers = () => {
    setFindPassengers(true);
    setDriverRegistration(false);
    setSearchRide(false);
  }

  const searchRide = () => {
    setSearchRide(true);
    setFindPassengers(false);
    setDriverRegistration(false);
  }

  return (
    <div>
      <div class="sidebar">
        <div
          class = "driverRegistration"
          onClick = {driverRegistration}
        >
          DRIVER REGISTRATION
        </div>

        <Divider class="divider" />

        <div
          class="findPassengers"
          onClick = {findPassengers}
        >
          FIND PASSENGERS
        </div>

        <Divider class="divider" />

        <div
          class = "searchRide"
          onClick = {searchRide}
        >
          SEARCH RIDE
        </div>

        <Divider class="divider" />

        <div class="contact">
          <MailOutlineIcon style={{ fontSize:"25px", float:"left", marginLeft:"7px", position:"absolute", bottom:"8vh" }} />
          <p style={{ position:"absolute", left:"8vh", bottom:"6.5vh", fontSize:"14px" }}> sakshamgoel5501@gmail.com </p>
          <LocalPhoneIcon style={{ fontSize:"25px", float:"left", marginLeft:"7px", position:"absolute", bottom:"1vh" }} />
          <p style={{ position:"absolute", left:"7vh", bottom:"-0.3vh", fontSize:"14px" }}> +91&nbsp;9719007003 </p>
        </div>

        <div class="copyright">
          &copy; P2P Carpool DAPP
        </div>
      </div>

      <div class="display">
        <p style={{ marginTop: "15px", marginRight: "30px", float: "right", fontSize: "18px" }}>
          <small>
            <b>Connected Account :</b> {account}
          </small>
        </p>

        {!showDriverRegistration && !showFindPassengers && !showSearchRide && 
          <div>
            <img src={logo} class="logo" alt = ".." />

            <div class="css-typing">
              <p>
                PeerPool, A Decentralized Solution to Carpooling Services, solves the problems that many corporate 
              </p>
              <p>
                giants fail to address. It decentralize this service with trustless smart contracts and eliminates
              </p>
              <p>
                the middleman, and the fees that comes along with them ...
              </p>
            </div>
          </div>
        }

        {showDriverRegistration &&
          <div>
            <DriverRegistration state={state} />
          </div>
        }

        {showFindPassengers &&
          <div>
            <FindPassengers state={state} />
          </div>
        }

        {showSearchRide &&
          <div>
            <SearchRide state={state} />
          </div>
        }
      </div>
    </div>
  );
}

export default App;

