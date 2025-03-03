let initial = [];


/**
 * Initializes user features based on the logged-in user's data.
 * @async
 * @function
 * @returns {Promise<void>} 
 */
async function initializeUserFeatures() {
  let loggedInUser = localStorage.getItem('currentUser');
  if (loggedInUser) {
      await onloadFuncHeader(loggedInUser);
  } else {
      await generateUserLetter();
  };
}


/**
 * Loads contacts from the database and initializes user initials based on the logged-in user's email.
 * @async
 * @function
 * @param {Object} loggedInUser - The currently logged-in user object.
 * @returns {Promise<void>}
 * @throws {Error} Throws an error if the contacts data cannot be loaded.
 */
async function onloadFuncHeader(loggedInUser) {
  const initial = loggedInUser.split(' ').map(n => n[0]).slice(0, 2).join('');
  generateUserLetter(initial);
}


/**
 * Displays the logged-in user's initials in the header.
 * If no user is logged in or no initials are provided, defaults to "G".
 * @async
 * @function
 * @param {string} [initial] - The initials to display.
 * @returns {Promise<void>}
 */
async function generateUserLetter(initial) {
  try {
    let userInitialRef = document.getElementById('user-initial');
    if (userInitialRef && initial) {
      userInitialRef.innerHTML = initial;
    } else {
      userInitialRef.innerHTML = "G";
    };
  } catch (error) {
    console.error(error);    
  };
}


/**
 * Toggles the user menu. For window widths greater than 1000 pixels, the menu is shown or hidden. 
 * For smaller screens, the mobile menu is opened.
 */
function toggleUserMenu() {
  let userMenu = document.getElementById('userMenu');
  if (window.innerWidth > 1000) {
    userMenu.classList.toggle('d-none');
  } else {
    mobilMenu();
  };
}


/**
 * Opens or closes the mobile user menu. If the menu is not visible, it opens; otherwise, it closes.
 */
function mobilMenu() {
  let userMobile = document.getElementById('userMobile');
  if (!userMobile.classList.contains('show-logout-mobile')) {
    openMobilMenu();
  } else {
    closeMobilMenu();
  };
}


/**
 * Opens the mobile user menu by removing and adding the appropriate classes.
 */
function openMobilMenu() {
  userMobile.classList.remove('exit-logout-mobile');
  userMobile.classList.add('show-logout-mobile');
  userMobile.classList.remove('d-none');
}


/**
 * Closes the mobile user menu by adding the exit class. 
 * After a delay of 700 milliseconds, the menu is hidden.
 */
function closeMobilMenu() {
  userMobile.classList.add('exit-logout-mobile');
  setTimeout(function () {
    userMobile.classList.add('d-none');
    userMobile.classList.remove('show-logout-mobile');
  }, 700);
}


/**
 * Logs out the user by redirecting to the login page.
 */
function logOut() {
  localStorage.clear();
  window.location.replace('/index.html');
}