/**
 * Base URL for the Firebase Realtime Database.
 * @constant {string}
 */
const BASE_URL = "http://127.0.0.1:8000/"


/**
 * Loads data from the database at the specified path.
 * @async
 * @function
 * @param {string} [path=""] - The path to the data in the database.
 * @returns {Promise<Object>} The retrieved data.
 */
async function loadFromDatabase(path = "") {
    const url = `${BASE_URL}${path}`;
    const token = localStorage.getItem("token");
    const response = await fetch(url, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": token ? `Token ${token}` : "",
        },
    });
    if (!response.ok) {
        return null;
    }
    const responseData = await response.json();
    return responseData;
}


/**
 * Posts new data to the database at the specified path.
 * @async
 * @function
 * @param {string} [path=""] - The path to store the data.
 * @param {Object} [data={}] - The data to be posted.
 * @returns {Promise<Object>} The response data.
 */
async function postToDatabase(path = "", data = {}) {
    const url = `${BASE_URL}${path}/`;
    const token = localStorage.getItem("token");

    const response = await fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": token ? `Token ${token}` : "",
        },
        body: JSON.stringify(data),
    });

    const responseData = await response.json();
    console.log(`Response from ${path}:`, responseData);  // Debugging
    return responseData;
}

/**
 * Updates data in the database at the specified path.
 * @async
 * @function
 * @param {string} [path=""] - The path to the data to update.
 * @param {Object} [data={}] - The new data to replace the existing data.
 * @returns {Promise<Object>} The updated data.
 */
async function updateOnDatabase(path = "", data = {}) {
    const url = `${BASE_URL}${path}/`;
    const token = localStorage.getItem("token");
    let response = await fetch(url, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            "Authorization": token ? `Token ${token}` : "",
        },
        body: JSON.stringify(data),
    });
    let responseData = await response.json();
    return responseData;
}


/**
 * Deletes data from the database at the specified path.
 * @async
 * @function
 * @param {string} [path=""] - The path to the data to delete.
 * @returns {Promise<Object>} The response after deletion.
 */
async function deleteFromDatabase(path = "") {
    const url = `${BASE_URL}${path}/`;
    const token = localStorage.getItem("token");
    let response = await fetch(url, {
        method: "DELETE",
        headers: {
            "Authorization": token ? `Token ${token}` : "",
        },
    });
    return response.ok ? '{}' : null;
}