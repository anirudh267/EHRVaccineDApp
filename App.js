import React, { useState, useEffect } from "react";
import Web3 from "web3";
import EHRContract from "./contracts/EHR.json";
import "./App.css";

const App = () => {
  const [contract, setContract] = useState(null);
  const [accounts, setAccounts] = useState([]);
  const [patientName, setPatientName] = useState("");
  const [patientAge, setPatientAge] = useState(0);
  const [vaccinationType, setVaccinationType] = useState("");
  const [vaccinationDate, setVaccinationDate] = useState(0);
  const [vaccinationSite, setVaccinationSite] = useState("");
  const [message, setMessage] = useState("");
  const [recordedInfo, setRecordedInfo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [searchedPatientName, setSearchedPatientName] = useState("");
  const [patientRecords, setPatientRecords] = useState([]);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loggedIn, setLoggedIn] = useState(false);
  const [role, setRole] = useState("");
  const [appointmentDate, setAppointmentDate] = useState(0);
  const [requestedAppointment, setRequestedAppointment] = useState(null);
  const [doctorAppointments, setDoctorAppointments] = useState([]);
  const [searchedDoctorName, setSearchedDoctorName] = useState("");
  const [vaccineName, setVaccineName] = useState("");
  const [manufacturer, setManufacturer] = useState("");
  const [batchNumber, setBatchNumber] = useState("");
  const [expirationDate, setExpirationDate] = useState(0);
  const [addedVaccine, setAddedVaccine] = useState(null);
  const [vaccineID, setVaccineID] = useState("");
  const [totalCount, setTotalCount] = useState(0);
  const [searchedVaccineID, setSearchedVaccineID] = useState("");
  const [vaccinationSlot, setVaccinationSlot] = useState(null);
  const [savedRecords, setSavedRecords] = useState([]);

  useEffect(() => {
    const initWeb3 = async () => {
      if (window.ethereum) {
        const web3 = new Web3(window.ethereum);
        try {
          await window.ethereum.enable();
          setAccounts(await web3.eth.getAccounts());
          const networkId = await web3.eth.net.getId();
          const deployedNetwork = EHRContract.networks[networkId];
          const contract = new web3.eth.Contract(
            EHRContract.abi,
            deployedNetwork && deployedNetwork.address
          );
          setContract(contract);
        } catch (error) {
          console.error(error);
        }
      }
    };
    initWeb3();
  }, []);

  const handleRecordVaccination = async () => {
    if (!contract) return;
    setLoading(true);
    try {
      await contract.methods
        .recordVaccination(
          patientName,
          patientAge,
          vaccinationType,
          vaccinationDate,
          vaccinationSite
        )
        .send({ from: accounts[0] });
      setMessage("Update Log: Vaccination recorded successfully!");
      setRecordedInfo({
        patientName,
        patientAge,
        vaccinationType,
        vaccinationDate,
        vaccinationSite,
      });

      updateSavedRecords();

    } catch (error) {
      console.error(error);
      setMessage("Update Log: Failed to record vaccination.");
    }
    setLoading(false);
  };

  const handleSearch = async () => {
    if (!contract) return;
    try {
      setMessage("Update Log: Searching for patient records...");
      const patientRecord = await contract.methods
        .vaccinations(searchedPatientName.trim())
        .call();
      setPatientRecords([
        {
          patientName: patientRecord.patientName,
          patientAge: parseInt(patientRecord.patientAge),
          vaccinationType: patientRecord.vaccinationType,
          vaccinationDate: parseInt(patientRecord.vaccinationDate),
          vaccinationSite: patientRecord.vaccinationSite,
        },
      ]);
      setMessage("Update Log: Patient records found!");
    } catch (error) {
      console.error(error);
      setMessage("Update Log: Failed to fetch patient records.");
    }
  };

  const handleLogin = async () => {
    if (username === "doctor123" && password === "doctor123") {
      setRole("doctor");
      setLoggedIn(true);
    } else if (username === "patient123" && password === "patient123") {
      setRole("patient");
      setLoggedIn(true);
    } else if (username === "provider123" && password === "provider123") {
      setRole("provider");
      setLoggedIn(true);
    }
  };

  const handleLogout = () => {
    setLoggedIn(false);
    setRole("");
    setUsername("");
    setPassword("");
  };

  const handleRequestAppointment = async () => {
    if (!contract) return;
    setLoading(true);
    try {
      await contract.methods
        .requestAppointment(patientName, appointmentDate)
        .send({ from: accounts[0] });
      setMessage("Update Log: Appointment requested successfully!");
      setRequestedAppointment({
        patientName,
        appointmentDate,
      });
    } catch (error) {
      console.error(error);
      setMessage("Update Log: Failed to request appointment.");
    }
    setLoading(false);
  };

  const handleSearchDoctorAppointments = async () => {
    if (!contract) return;
    try {
      setMessage("Update Log: Searching for doctor appointments...");
      const appointments = await contract.methods
        .appointmentRequests(searchedDoctorName.trim())
        .call();
      setDoctorAppointments([
        {
          patientName: appointments.patientName,
          appointmentDate: parseInt(appointments.appointmentDate),
        },
      ]);
      setMessage("Update Log: Doctor appointments found!");
    } catch (error) {
      console.error(error);
      setMessage("Update Log: Failed to fetch doctor appointments.");
    }
  };

  const handleAddVaccine = async () => {
    if (!contract) return;
    setLoading(true);
    try {
      await contract.methods
        .addVaccine(vaccineName, manufacturer, batchNumber, expirationDate)
        .send({ from: accounts[0] });
      setMessage("Update Log: Vaccine added successfully!");
      setAddedVaccine({
        vaccineName,
        manufacturer,
        batchNumber,
        expirationDate,
      });
    } catch (error) {
      console.error(error);
      setMessage("Update Log: Failed to add vaccine.");
    }
    setLoading(false);
  };

  const handleAddVaccinationSlot = async () => {
    if (!contract) return;
    setLoading(true);
    try {
      await contract.methods
        .updateVaccinationSlot(vaccineID, totalCount)
        .send({ from: accounts[0] });
      setMessage("Update Log: Vaccination slot added successfully!");
    } catch (error) {
      console.error(error);
      setMessage("Update Log: Failed to add vaccination slot.");
    }
    setLoading(false);
  };

  const handleSearchVaccinationSlot = async () => {
    if (!contract) return;
    try {
      setMessage("Update Log: Searching for vaccination slot...");
      const slot = await contract.methods
        .vaccinationSlots(searchedVaccineID.trim())
        .call();
      setVaccinationSlot({
        totalCount: parseInt(slot.totalCount),
      });
      setMessage("Update Log: Vaccination slot found!");
    } catch (error) {
      console.error(error);
      setMessage("Update Log: Failed to fetch vaccination slot.");
    }
  };

  const handleViewSavedRecords = () => {
    const records = localStorage.getItem("savedRecords");
    if (records) {
      setSavedRecords(JSON.parse(records));
    }
  };

  const updateSavedRecords = () => {
    const record = {
      patientName,
      patientAge,
      vaccinationType,
      vaccinationDate,
      vaccinationSite,
    };
    const records = localStorage.getItem("savedRecords");
    if (records) {
      const parsedRecords = JSON.parse(records);
      parsedRecords.push(record);
      localStorage.setItem("savedRecords", JSON.stringify(parsedRecords));
    } else {
      localStorage.setItem("savedRecords", JSON.stringify([record]));
    }
  };

  return (
    <div>
      {!loggedIn && (
        <div>
          <h1>VAXBLOCK: Decentralized Vaccination Record Manager</h1>
          <div>
            <label>Enter Username:</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div>
            <label>Enter Password:</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button onClick={handleLogin}>Login</button>
        </div>
      )}
      {loggedIn && role === "doctor" && (
        <div>
          <h1>Welcome Doctor! Please Enter Patient Record for Vaccination Appointment:</h1>
          <div>
            <label>Patient Name:</label>
            <input
              type="text"
              value={patientName}
              onChange={(e) => setPatientName(e.target.value)}
            />
          </div>
          <div>
            <label>Patient Age:</label>
            <input
              type="number"
              value={patientAge}
              onChange={(e) => setPatientAge(parseInt(e.target.value))}
            />
          </div>
          <div>
            <label>Vaccination Type:</label>
            <input
              type="text"
              value={vaccinationType}
              onChange={(e) => setVaccinationType(e.target.value)}
            />
          </div>
          <div>
            <label>Vaccination Date:</label>
            <input
              type="number"
              value={vaccinationDate}
              onChange={(e) => setVaccinationDate(parseInt(e.target.value))}
            />
          </div>
          <div>
            <label>Vaccination Site:</label>
            <input
              type="text"
              value={vaccinationSite}
              onChange={(e) => setVaccinationSite(e.target.value)}
            />
          </div>
          <button onClick={handleRecordVaccination} disabled={loading}>
            {loading ? "Recording..." : "Record Vaccination"}
          </button>
          <p>{message}</p>
          {recordedInfo && (
            <div>
              <h2>Your vaccination record has been successfully saved to the blockchain:</h2>
              <p>Patient Name: {recordedInfo.patientName}</p>
              <p>Patient Age: {recordedInfo.patientAge}</p>
              <p>Vaccination Type: {recordedInfo.vaccinationType}</p>
              <p>Vaccination Date: {recordedInfo.vaccinationDate}</p>
              <p>Vaccination Site: {recordedInfo.vaccinationSite}</p>
            </div>
          )}
          <div>
            <h2>View Saved Records:</h2>
            <button onClick={handleViewSavedRecords}>View Records</button>
            {savedRecords && (
              <div>
                <h2>Saved Vaccination Records:</h2>
                <ul>
                  {savedRecords.map((record, index) => (
                    <li key={index}>
                      <p>Patient Name: {record.patientName}</p>
                      <p>Patient Age: {record.patientAge}</p>
                      <p>Vaccination Type: {record.vaccinationType}</p>
                      <p>Vaccination Date: {record.vaccinationDate}</p>
                      <p>Vaccination Site: {record.vaccinationSite}</p>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
          <div>
            <h2>Search Appointments by Patient Name:</h2>
            <label>Enter Patient Name:</label>
            <input
              type="text"
              value={searchedDoctorName}
              onChange={(e) => setSearchedDoctorName(e.target.value)}
            />
            <button onClick={handleSearchDoctorAppointments}>Search Appointments</button>
          </div>
          <p>{message}</p>
          <ul>
            {doctorAppointments.map((appointment, index) => (
              <li key={index}>
                <p>Patient Name: {appointment.patientName}</p>
                <p>Appointment Date: {appointment.appointmentDate}</p>
              </li>
            ))}
          </ul>
          <button onClick={handleLogout}>Logout</button>
        </div>
      )}

      {loggedIn && role === "patient" && (
        <div>
          <h1>Dear Patient, please enter your name to view your vaccination record:</h1>
          <div>
            <input
              type="text"
              placeholder="Enter patient name"
              value={searchedPatientName}
              onChange={(e) => setSearchedPatientName(e.target.value)}
            />
            <button onClick={handleSearch}>Search</button>
          </div>
          <p>{message}</p>
          <ul>
            {patientRecords.map((record, index) => (
              <li key={index}>
                <p>Patient Name: {record.patientName}</p>
                <p>Patient Age: {record.patientAge}</p>
                <p>Vaccination Type: {record.vaccinationType}</p>
                <p>Vaccination Date: {record.vaccinationDate}</p>
                <p>Vaccination Site: {record.vaccinationSite}</p>
              </li>
            ))}
          </ul>
          <div>
            <h2>Enter vaccine name to search for available vaccination allocations:</h2>
            <label>Vaccine Name:</label>
            <input
              type="text"
              value={searchedVaccineID}
              onChange={(e) => setSearchedVaccineID(e.target.value)}
            />
            <button onClick={handleSearchVaccinationSlot}>Search Vaccination Allocation</button>
          </div>
          <p>{message}</p>
          {vaccinationSlot && (
            <div>
              <h2>Vaccination Allocation Details:</h2>
              <p>Total Available Vaccination Allocations: {vaccinationSlot.totalCount}</p>
            </div>
          )}
          <div>
            <h2>Enter your details to request for a Vaccination Appointment:</h2>
            <label>Patient Name:</label>
            <input
              type="text"
              value={patientName}
              onChange={(e) => setPatientName(e.target.value)}
            />
            <label>Appointment Date:</label>
            <input
              type="number"
              value={appointmentDate}
              onChange={(e) => setAppointmentDate(parseInt(e.target.value))}
            />
            <button onClick={handleRequestAppointment} disabled={loading}>
              {loading ? "Requesting..." : "Request Appointment"}
            </button>
            <p>{message}</p>
            {requestedAppointment && (
              <div>
                <h3>Your appointment request has been sent to the doctor:</h3>
                <p>Patient Name: {requestedAppointment.patientName}</p>
                <p>Appointment Date: {requestedAppointment.appointmentDate}</p>
              </div>
            )}
          </div>
          <button onClick={handleLogout}>Logout</button>
        </div>
      )}

      {loggedIn && role === "provider" && (
        <div>
          <h1>Welcome Provider! Please enter vaccine information to update inventory:</h1>
          <div>
            <label>Vaccine Name:</label>
            <input
              type="text"
              value={vaccineName}
              onChange={(e) => setVaccineName(e.target.value)}
            />
          </div>
          <div>
            <label>Manufacturer:</label>
            <input
              type="text"
              value={manufacturer}
              onChange={(e) => setManufacturer(e.target.value)}
            />
          </div>
          <div>
            <label>Batch Number:</label>
            <input
              type="text"
              value={batchNumber}
              onChange={(e) => setBatchNumber(e.target.value)}
            />
          </div>
          <div>
            <label>Expiration Date:</label>
            <input
              type="number"
              value={expirationDate}
              onChange={(e) => setExpirationDate(parseInt(e.target.value))}
            />
          </div>
          <button onClick={handleAddVaccine} disabled={loading}>
            {loading ? "Placing Order..." : "Place Order"}
          </button>
          <p>{message}</p>
          {addedVaccine && (
            <div>
              <h2>The order for the vaccine has been successfully placed for the inventory:</h2>
              <p>Vaccine Name: {addedVaccine.vaccineName}</p>
              <p>Manufacturer: {addedVaccine.manufacturer}</p>
              <p>Batch Number: {addedVaccine.batchNumber}</p>
              <p>Expiration Date: {addedVaccine.expirationDate}</p>
            </div>
          )}
          <p>{message}</p>
          <div>
            <h2>Add Vaccination Allocation:</h2>
            <label>Vaccine Name:</label>
            <input
              type="text"
              value={vaccineID}
              onChange={(e) => setVaccineID(e.target.value)}
            />
            <label>Total Count:</label>
            <input
              type="number"
              value={totalCount}
              onChange={(e) => setTotalCount(parseInt(e.target.value))}
            />
            <button onClick={handleAddVaccinationSlot} disabled={loading}>
              {loading ? "Adding Slot..." : "Add Slot"}
            </button>
          </div>
          <p>{message}</p>
          <div>
            <h2>Click the link to update vaccine inventory:</h2>
            <a href="https://docs.google.com/spreadsheets/d/1hAHCtPc7HeSocOCG5zIlTmIsgZocPvkdC0QcrNtyPCM/edit#gid=0" target="_blank" rel="noopener noreferrer">Update Vaccine Inventory</a>
          </div>
          <button onClick={handleLogout}>Logout</button>
        </div>
      )}
    </div>
  );
};

export default App;
