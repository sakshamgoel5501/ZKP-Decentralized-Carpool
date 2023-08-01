// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

contract Carpool {
    address payable owner;
    uint256 securityAmount;

    constructor() {
        owner = payable(msg.sender);
        // The msg.sender is the address that has called or initiated a function or 
        // created a transaction.
        securityAmount = 1;
    }

    struct driver {
        address payable account;
        string name;
        uint256 rating;
        string phoneNumber;
        uint256 numRidesCompleted;
    }

    struct availableDriver {
        address payable account;
        string source;
        string destination;
        string car;
        uint256 fare;
        string name;
        uint256 rating;
        string phoneNumber;
        uint256 numRidesCompleted;
    }

    availableDriver[] availableDrivers;
    availableDriver[] eligibleDrivers;

    mapping(address => driver) public driverTable;
    address[] registeredAddresses;

    address payable passenger;
    address payable bookedDriver;
    uint256 selectedDriver;


    /*
    Which function is called - fallback() or receive() ?

                    send ether
                        |
                msg.data is empty ?
                       / \
                     yes  No
                     /     \
      receive()  exists?   fallback()                    
                  /  \
                Yes   No
                /      \
           receive()    fallback()
    */

    receive() external payable {}


    fallback() external payable {}


    function getBalance() public view returns (uint) {
        return address(this).balance;
    }


    function sendViaTransfer(address payable _to) public payable {
        // This function is no longer recommended for sending ether
        _to.transfer(msg.value);
    }


    function sendViaSend(address payable _to) public payable {
        // send returns a boolean value indicating success or failure
        // This function is no longer recommended for sending ether
        bool sent = _to.send(msg.value);
        require(sent, "Failed to send Ether");
    }


    function sendViaCall(address payable _to) public payable {
        // call returns a boolean value indicating success or failure
        // This is the current recommended method to use
        (bool sent,) = _to.call{value: msg.value}("");
        // (bool sent, bytes memory data) = _to.call{value: msg.value}("");
        require(sent, "Failed to send Ether");
    }


    function driverRegistration(string memory name, string memory phoneNumber) public returns (bool) {
        // Check if already registered or not
        for(uint256 i=0 ; i<registeredAddresses.length ; i++){
            if(msg.sender == registeredAddresses[i])
                return false;
        }

        driver memory d = driver(payable(msg.sender), name, 0, phoneNumber, 0);
        driverTable[msg.sender] = d;
        registeredAddresses.push(msg.sender);

        return true;    // True return shows successful registration
    }


    function findPassengers(string memory src, string memory dest, string memory car, uint256 fare) public returns (bool) {
        // Check if this driver is registered or not (registered drivers have their addresses
        // as key in driverTable)
        // Problem : There's no such thing as "existence" in a Solidity mapping. Every key maps to something.
        bool registered = false;
        for(uint256 i=0 ; i<registeredAddresses.length ; i++){
            if(msg.sender == registeredAddresses[i]){
                registered = true;
                break;
            }
        }

        if(registered == false)
            return false;

        driver memory who = driverTable[msg.sender];

        availableDriver memory d = availableDriver(payable(msg.sender), src, dest, car, fare, who.name, who.rating, who.phoneNumber, who.numRidesCompleted);
        availableDrivers.push(d);

        return true;
    }


    function searchRide(string memory src, string memory dest) public {
        int256 n = (int256)(availableDrivers.length);
        for(int256 i=0 ; i<n ; i++){
            string memory s = availableDrivers[uint256(i)].source;
            string memory d = availableDrivers[uint256(i)].destination;

            if(keccak256(abi.encodePacked(src)) == keccak256(abi.encodePacked(s))){
                if(keccak256(abi.encodePacked(dest)) == keccak256(abi.encodePacked(d))){
                    eligibleDrivers.push(availableDrivers[uint256(i)]);
                    availableDrivers[uint256(i)] = availableDrivers[uint256(n)-1];   // Modify available drivers
                    n = n - 1;
                    i = i - 1;
                    availableDrivers.pop();
                }
            }
        }
    }


    function getEligibleDrivers() public view returns (availableDriver[] memory) {
        return eligibleDrivers;
    }


    function bookRide(uint256 driverSelected) public {
        selectedDriver = driverSelected;
        uint256 fare = eligibleDrivers[selectedDriver].fare;
        bookedDriver = eligibleDrivers[selectedDriver].account;
        passenger = payable(msg.sender);

        // Sometimes what happens is either the driver or the passenger cancels the ride,
        // which leads the other to some amount of loss. So to avoid this, some money / ether (say 5 eth)
        // will be collected in the contract at the time of ride confirmation. Now suppose
        // the driver cancels the ride then that whole security money deposited (driver + passsenger)
        // will get transfered to the passenger as compensation for their loss being its their
        // valuable time, etc.

        require(passenger.balance >= fare / 1000, "Sorry ! Not enough ethers in your account");
        // msg.sender.balance returns the ETH balance in wei denomination of the sender account
        require(bookedDriver.balance >= securityAmount / 1000, "Not enough security money");

        // sendViaCall(owner);
        // First both driver and passenger will call this function from react frontend (client) to send security 
        // ether to the owner where there msg.value will be equal to the securityAmount.

        /*
        way of getting balance of a certain address -->
            address a;
            "a.balance" This will get the balance of the address "a".
        */

        for(uint256 i=0 ; i<eligibleDrivers.length ; i++){
            if(i != driverSelected)
                availableDrivers.push(eligibleDrivers[i]);   
        }
        // Just removed the selected driver from the available drivers
    }


    function getBookedDriverAddress() public view returns(address payable) {
        return bookedDriver;
    }


    function getFare() public view returns(uint256){
        return eligibleDrivers[selectedDriver].fare;
    }


    function completeRide() public {
        // complete ride button will be provided to passenger only as the driver may use this
        // button in a wrong way, i.e., without giving ride to the passenger and getting his
        // fare from the passenger. So passenger will click this button only when he/she reaches
        // his/her dest. as on clicking this button amount will be deducted from their account.

        // sendViaCall(bookedDriver);
        // Owner will call this via frontend to send securityAmount back to the driver with msg.value
        // to be equal to the securityAmount.

        // sendViaCall(passenger);
        // Owner will call this via frontend to send securityAmount back to the passenger with msg.value
        // to be equal to the securityAmount.
        
        // sendViaCall(bookedDriver);
        // Passenger will call this to send fare to the driver
        // (fare can be changed considering road jam, etc. It's pre decided)

        delete eligibleDrivers;  // Use delete on arrays to delete all its elements.
    }


    function abortRide() public {
        if(msg.sender == passenger){
            // Passenger clicked on abort ride
            // sendViaCall(bookedDriver);  // driver's own + passenger's
            // Owner gives security amount of passenger + driver to driver
        }
        else{
            // driver clicked on abort ride
            // sendViaCall(passenger);  // passenger's own + driver's
            // Owner gives security amount of passenger + driver to passenger
        }

        // <<<<<<<<-----------------NOTE --------------------->>>>>>>>

        // To book ride, passenger will select from the available drivers and will call him/her 
        // for location and all. Then the driver will ask the passenger to pay securityAmount to 
        // the contract as a confirmation. Now, driver will validate if transaction has been made 
        // or not by looking at the blockchain network. Upon validating that the passenger has made 
        // transaction, the driver will now be assured.

        // Currently I have Implemented in the way that to find passengers, first driver has to 
        // send securityAmount to the contract to show the genuinity. After paying securityAmount, 
        // it is assumed that why would the driver abort if he/she genuinely wants to find a passenger 
        // as aborting will result in loss of securityAmount. So no abort option is given to the driver.

        // Now, if after booking the ride, passenger aborts, passenger has to pay the securityAmount
        // again. Now contract has 2 passenger's securityAmount + 1 driver's securityAmount. All
        // this amount will be transferred to the driver as the compensation.  ***Not Implemented as of now***

        delete eligibleDrivers;  // Use delete on arrays to delete all its elements.
    }


    function giveRating(uint256 rating) public view {
        driver memory d = driverTable[bookedDriver];
        d.rating = ((d.numRidesCompleted * d.rating) + rating) / (d.numRidesCompleted + 1);
        // Average of rating based on number of rides completed by driver
        d.numRidesCompleted = d.numRidesCompleted + 1;
    }
}








