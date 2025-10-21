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

/**
 * Asynchronous function to fetch schedule data from a specific JSON file,
 * handle its processing, and manage the dynamic display states.
 * @param {string} fileName - The name of the JSON file to fetch (e.g., "StudentNameSchedule.json")
 */
async function loadSchedule(fileName) {
  // Display a loading indicator to inform the user that data fetching is in progress
  statusMessage.innerHTML = `
        <div class="loading-container">
            <div class="spinner"></div>
            <p class="loading-text">Loading schedule...</p>
        </div>
    `;

  // Clear any previously displayed schedule content
  scheduleContainer.innerHTML = "";

  try {
    // Attempt to fetch the JSON file from the specified path
    const response = await fetch(`./json/${fileName}`);

    // Check if the HTTP response indicates a successful request (status 200-299)
    if (!response.ok) {
      // Throw an error if the resource could not be loaded (e.g., 404 Not Found)
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    // Convert the successful HTTP response stream into a JavaScript JSON object
    const data = await response.json();

    // Process the data: Sort the array of classes numerically by the 'period' property
    const sortedData = data.sort((a, b) => a.period - b.period);

    // Clear the status message now that the data is ready
    statusMessage.innerHTML = "";

    // Check if the fetched data array is empty
    if (sortedData.length === 0) {
      // Display a specific message for an empty or missing schedule
      scheduleContainer.innerHTML = `
                <div class="empty-state">
                    <i class="bi bi-calendar-x"></i>
                    <p class="empty-text">No schedule data available</p>
                </div>
            `;
      return;
    }

    // Iterate through the sorted schedule items to create and inject HTML
    sortedData.forEach((classItem, index) => {
      // Determine the appropriate CSS class for header styling based on the subject area
      const subjectClass = getSubjectClass(classItem.subjectArea);

      // Construct the complete HTML string for a single schedule card
      const cardHTML = `
                <div class="schedule-card" style="animation-delay: ${
                  index * 0.1
                }s">
                    <div class="card-header-custom ${subjectClass}">
                        <span class="subject-name">${
                          classItem.subjectArea
                        }</span>
                        <div class="period-badge">
                            <i class="bi bi-clock"></i>
                            <span class="period-number">Period ${
                              classItem.period
                            }</span>
                        </div>
                    </div>
                    <div class="card-body-custom">
                        <h3 class="class-name">${classItem.className}</h3>
                        <div class="info-row">
                            <i class="bi bi-person"></i>
                            <span>${classItem.teacher}</span>
                        </div>
                        <div class="info-row">
                            <i class="bi bi-geo-alt"></i>
                            <span>Room ${classItem.roomNumber}</span>
                        </div>
                    </div>
                </div>
            `;

      // Efficiently insert the new card HTML into the schedule container element
      scheduleContainer.insertAdjacentHTML("beforeend", cardHTML);
    });
  } catch (error) {
    // Display a detailed, user-friendly error message if the fetch or processing fails
    statusMessage.innerHTML = `
            <div class="error-message">
                Oops! Unable to load the schedule. Please make sure the JSON file exists and try again later.
                <br><small>Error: ${error.message}</small>
            </div>
        `;
    scheduleContainer.innerHTML = "";
  }
}

/**
 * Helper function that maps specific subject names to corresponding CSS class names
 * used for color-coding the schedule cards.
 * @param {string} subject - The subject area name (e.g., 'Math', 'History').
 * @returns {string} The associated CSS class name or 'default' if no match is found.
 */
function getSubjectClass(subject) {
  const subjectMap = {
    Math: "math",
    Science: "science",
    English: "english",
    History: "history",
    "Social Studies": "social-studies",
    Technology: "technology",
    Language: "language",
    Arts: "arts",
  };
  // Return the specific class or 'default' if the subject isn't mapped
  return subjectMap[subject] || "default";
}
