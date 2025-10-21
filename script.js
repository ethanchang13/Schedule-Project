// Get DOM elements used for schedule control and display
const scheduleSelector = document.getElementById("scheduleSelector");
const statusMessage = document.getElementById("statusMessage");
const scheduleContainer = document.getElementById("scheduleContainer");

/**
 * Event listener: Activates whenever a user selects a new item from the dropdown menu.
 * It's responsible for triggering the loading of the newly selected schedule.
 */
scheduleSelector.addEventListener("change", function (event) {
  // Retrieve the identifier (e.g., student name) from the dropdown's selected value
  const dataIdentifier = event.target.value;

  // Construct the expected JSON filename using a template literal (e.g., 'IdentifierSchedule.json')
  const fileName = `${dataIdentifier}Schedule.json`;

  // Call the asynchronous function to load and display the chosen schedule
  loadSchedule(fileName);
});

/**
 * Initial load handler: Runs automatically once the main document structure is fully loaded.
 * Ensures that a default schedule is displayed immediately upon the user opening the page.
 */
window.addEventListener("DOMContentLoaded", function () {
  // Load the initial, default schedule using its predefined filename
  loadSchedule("EthanSchedule.json");
});
