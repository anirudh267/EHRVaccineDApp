// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

contract EHR {
    struct Vaccination {
        string patientName;
        uint256 patientAge;
        string vaccinationType;
        uint256 vaccinationDate;
        string vaccinationSite;
    }

    struct AppointmentRequest {
        string patientName;
        uint256 appointmentDate;
    }

    struct VaccineInventory {
        string vaccineName;
        string manufacturer;
        string batchNumber;
        uint256 expirationDate;
    }

    struct VaccinationSlots {
        string vaccineID;
        uint256 totalCount;
    }

    mapping(string => Vaccination) public vaccinations;
    mapping(string => AppointmentRequest) public appointmentRequests;
    mapping(string => VaccineInventory) public vaccineInventory;
    mapping(string => VaccinationSlots) public vaccinationSlots;

    event VaccinationRecorded(
        string patientName,
        uint256 patientAge,
        string vaccinationType,
        uint256 vaccinationDate,
        string vaccinationSite
    );

    event AppointmentRequested(
        string patientName,
        uint256 appointmentDate
    );

    event VaccineAdded(
        string vaccineName,
        string manufacturer,
        string batchNumber,
        uint256 expirationDate
    );

    event VaccinationSlotUpdated(
        string vaccineID,
        uint256 totalCount
    );

    function recordVaccination(
        string memory _patientName,
        uint256 _patientAge,
        string memory _vaccinationType,
        uint256 _vaccinationDate,
        string memory _vaccinationSite
    ) public {
        vaccinations[_patientName] = Vaccination(
            _patientName,
            _patientAge,
            _vaccinationType,
            _vaccinationDate,
            _vaccinationSite
        );
        
        emit VaccinationRecorded(
            _patientName,
            _patientAge,
            _vaccinationType,
            _vaccinationDate,
            _vaccinationSite
        );
    }

    function requestAppointment(
        string memory _patientName,
        uint256 _appointmentDate
    ) public {
        appointmentRequests[_patientName] = AppointmentRequest(
            _patientName,
            _appointmentDate
        );

        emit AppointmentRequested(
            _patientName,
            _appointmentDate
        );
    }

    function addVaccine(
        string memory _vaccineName,
        string memory _manufacturer,
        string memory _batchNumber,
        uint256 _expirationDate
    ) public {
        vaccineInventory[_vaccineName] = VaccineInventory(
            _vaccineName,
            _manufacturer,
            _batchNumber,
            _expirationDate
        );

        emit VaccineAdded(
            _vaccineName,
            _manufacturer,
            _batchNumber,
            _expirationDate
        );
    }

    function updateVaccinationSlot(
        string memory _vaccineID,
        uint256 _totalCount
    ) public {
        vaccinationSlots[_vaccineID] = VaccinationSlots(
            _vaccineID,
            _totalCount
        );

        emit VaccinationSlotUpdated(
            _vaccineID,
            _totalCount
        );
    }

    function getVaccineInventory(string memory _vaccineName) public view returns (string memory, string memory, string memory, uint256) {
        VaccineInventory storage vaccine = vaccineInventory[_vaccineName];
        return (vaccine.vaccineName, vaccine.manufacturer, vaccine.batchNumber, vaccine.expirationDate);
    }

    function getAppointmentRequest(string memory _patientName) public view returns (string memory, uint256) {
        AppointmentRequest storage appointment = appointmentRequests[_patientName];
        return (appointment.patientName, appointment.appointmentDate);
    }

    function getVaccinationSlot(string memory _vaccineID) public view returns (string memory, uint256) {
        VaccinationSlots storage slot = vaccinationSlots[_vaccineID];
        return (slot.vaccineID, slot.totalCount);
    }
}
