/**
 * Checks the entered password and changes the border color of the input field based on its content.
 * If the password is more than 0 characters long, the border color changes to 'bluehover', otherwise it stays grey.
 */
function validateLogin() {
  let inputColor = document.getElementById('password-content');
  let password = document.getElementById('password').value;
  if (password > 0) {
    inputColor.style.borderColor = 'var(--bluehover)';
  } else {
    inputColor.style.borderColor = 'lightgrey';
  };
}


/**
 * Performs the login process by loading user data.
 */
async function login() {
  resetErrorMessages();
  let email = document.getElementById('email').value;
  let password = document.getElementById('password').value;
  const response = await postToDatabase("api/auth/login", {
    email: email,
    password: password,
  })
  return handleLoginResponse(response);
}


/**
 * Handles the login response by saving the token and user data to localStorage
 * and redirecting to the summary page.
 */
function handleLoginResponse(response) {
  if (response && response.token) {
    localStorage.setItem("token", response.token);
    localStorage.setItem("currentUser", response.full_name);
    window.location.replace('/html/summary.html');
    return { success: true, username: response.username };
  } else {
    if (response.error === "E-Mail-Adresse ist nicht registriert.") {
      notRegistered();
      return false;
    } else if (response.error === "Invalid email or password.")
      loginDataDontMatch();
    return false;
  }
}


/**
 * Handles the guest login process by sending the user's email to the backend
 * for guest login authentication and then processing the response.
 */
async function guestLogin() {
  resetErrorMessages();
  let email = document.getElementById('email').value;
  const response = await postToDatabase("api/auth/guestlogin", {
    email: email,
  })
  return handleGuestLoginResponse(response);
}


/**
 * Processes the guest login response. If the login is successful,
 * it stores the token and username in localStorage and redirects the user.
 */
function handleGuestLoginResponse(response) {
  if (response && response.token) {
    localStorage.setItem("token", response.token);
    localStorage.setItem("currentUser", response.username);
    window.location.replace('/html/summary.html');
    return { success: true, username: response.username };
  } else {
    guestLoginFailed();
    return false;
  }
}

/**
 * Displays an error message if the guest login fails.
 */
function guestLoginFailed() {
  document.getElementById('guestError').classList.add('msg-span');
  document.getElementById('email-content').classList.add('msg-box');
  document.getElementById('guestError').classList.remove('d-none');
}


/**
 * Displays an error message if a user is not registered.
 */
function notRegistered() {
  document.getElementById('notRegistered').classList.add('msg-span');
  document.getElementById('email-content').classList.add('msg-box');
  document.getElementById('password-content').classList.add('msg-box');
  document.getElementById('notRegistered').classList.remove('d-none');
}


/**
 * Displays an error message if the entered login data does not match.
 */
function loginDataDontMatch() {
  document.getElementById('error').classList.add('msg-span');
  document.getElementById('email-content').classList.add('msg-box');
  document.getElementById('password-content').classList.add('msg-box');
  document.getElementById('error').classList.remove('d-none');
}


/**
 * Clears error messages and resets input styling.
 */
function resetErrorMessages() {
  document.getElementById('notRegistered').classList.add('d-none');
  document.getElementById('error').classList.add('d-none');
  document.getElementById('email-content').classList.remove('msg-box');
  document.getElementById('password-content').classList.remove('msg-box');
}


/**
 * Changes the image of the password field based on the current state of the password (empty or not empty).
 */
function changeImage() {
  let input = document.getElementById('password');
  let image = document.getElementById('image');
  if (input.value == 0) {
    input.type = "password";
    image.src = "/assets/icon/lock.svg";
  } else {
    if (input.type == "password" && input.value > 0) {
      image.src = "/assets/icon/visibility_off.png";
    } else {
      image.src = "/assets/icon/visibility.png";
    };
  };
}


/**
 * Toggles the visibility of the password and changes the image accordingly.
 */
function passwordVisibility() {
  let input = document.getElementById('password');
  let image = document.getElementById('image');
  if (input.value == 0) {
    return;
  } else {
    if (image.src.includes('visibility_off.png')) {
      changeTypeAndImage(input, image);
    } else {
      resetPasswort(input, image);
    };
  };
}


/**
 * Changes the password field type to 'text' and the image to the visible password icon.
 * @param {HTMLInputElement} input - The password field element.
 * @param {HTMLImageElement} image - The image element representing the visibility state.
 */
function changeTypeAndImage(input, image) {
  input.type = "text";
  image.src = "/assets/icon/visibility.png";
}


/**
 * Resets the password field type to 'password' and changes the image to the hidden password icon.
 * @param {HTMLInputElement} input - The password field element.
 * @param {HTMLImageElement} image - The image element representing the visibility state.
 */
function resetPasswort(input, image) {
  input.type = "password";
  image.src = "/assets/icon/visibility_off.png";
}


/**
 * Stores the user's email in local storage if the "Remember me" option is selected.
 */
function saveRemember() {
  let email = document.getElementById('email').value;
  localStorage.setItem("userEmail", email);
}


/**
 * Retrieves the saved email from local storage and sets it in the email field.
 */
function getRemember() {
  let email = localStorage.getItem("userEmail");
  document.getElementById('email').value = email;
}