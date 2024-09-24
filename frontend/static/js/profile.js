import { setupNavigationEventListeners, navigateAndReplace } from "./utils.js";
import { searchedHistory } from "./utils.js";
import { getCookie } from "./utils.js";
import { handleLogout } from "./utils.js";
import { searchUser } from "./utils.js";
import { loadText } from "./utils.js";

// Retrieve the CSRF token from cookies
const csrftoken = getCookie('csrftoken');

// Get the back button element from the DOM
const backButtonElem = document.getElementById('backButton');

// Load text for the current language
loadText();

// Remove any stored friend's username from local storage
localStorage.removeItem('friend_username');

// Add an event listener to the back button to navigate to the menu when clicked
backButtonElem.addEventListener('click',() => {
	navigateAndReplace('/menu')
});

// Function to get user information and update the profile page
function getUserInfo() {
	// Get the username from local storage
	var username = localStorage.getItem('username');
	if (username) {
		// Fetch user information to check if the user is a 42 user
		fetch('/api/user_42/')
		.then(response => response.json())
		.then(data => {
			// If the user is a 42 user, update the UI accordingly
			if (data.is_42 == true)
			{
				document.getElementById('username_42').innerHTML = '<p id="user42" class="data username_42"></p>';
				document.getElementById('user42').textContent = i18next.t('username');
				document.querySelector('.username_42').textContent += ': ' + username;
				document.getElementById('password_button').style.display = 'none';
			} else {
				// If the user is not a 42 user, update the UI accordingly
				var translation = i18next.t('username');
				document.querySelector('.name').textContent = translation + ': ';
				document.getElementById('username').value = username;
			}
		})
  	} else {
  		// If username is not found in local storage, log out the user
  		console.error("Username not found in local storage");
        handleLogout();
	}
	// Fetch additional user information to update the profile statistics
	searchUser(username)
	.then(user => {
		var translation = i18next.t('played');
		document.querySelector('.played').textContent = translation + user.games_played;
		translation = i18next.t('won');
		document.querySelector('.won').textContent = translation + user.games_won;
		translation = i18next.t('lost');
		document.querySelector('.lost').textContent = translation + user.games_lost;
	})
	.catch(error => {
		console.error('No user found', error);
	});

    // Fetch the user's profile image
    const profile_img = document.getElementById('profile_img');
    if (profile_img) {
        fetch('/api/getProfileImg/')
        .then(response => {
            if (!response.ok) {
                throw new Error('Response not ok');
            }
            return response.blob();
        })
        .then(blob => {
            const url = URL.createObjectURL(blob);
            profile_img.src = url;
        })
        .catch(error => {
            console.error('Error while accessing image: ', error);
        });
    }
}

// Create an error message element for profile picture upload
var errorPdp = document.createElement('p');
errorPdp.style.color = 'red';
errorPdp.style.display = 'none';
document.getElementById('pdpForm').appendChild(errorPdp);

// Add an event listener for profile picture upload form submission
document.getElementById('pdpForm').addEventListener('submit', function(e) {
	e.preventDefault();

	// Get the selected profile picture file
	const pdp_field = document.getElementById('select-pdp');
	if (pdp_field.files[0].type != 'image/jpeg' && pdp_field.files[0].type != 'image/png')
	{
		// Display error if the file type is not jpeg or png
		errorPdp.style.display = 'block';
		errorPdp.style.color = 'red';
		errorPdp.textContent = i18next.t('pdp-type');
	}
	else if (pdp_field.files[0].size >= 1048576)
	{
		// Display error if the file size is too large
		errorPdp.style.display = 'block';
		errorPdp.style.color = 'red';
		errorPdp.textContent = i18next.t('pdp-size');
	}
	else
	{
		// Create a FormData object to send the file to the server
		const formData = new FormData();
		formData.append('new_pdp', pdp_field.files[0]);
		fetch('/api/update_pdp/', {
	      	method: 'POST',
			headers: {
				'X-CSRFToken': csrftoken,
	       	},
	       	body: formData
	   	})
		.then(response => response.json())
	   	.then(data => {
			if (data.status === 'error') {
				// Display error if the server returns an error
				errorPdp.style.display = 'block';
				errorPdp.style.color = 'red';
				var msg = i18next.exists(data.message) ? i18next.t(data.message) : data.message;
				errorPdp.textContent = msg;
			} else {
				// Hide the error message and update the user information
				errorPdp.style.display = 'none';
				getUserInfo();
			}
	  	});
	}
});

// Create an error message element for user information update
var errorMessage = document.createElement('p');
errorMessage.style.color = 'red';
errorMessage.style.display = 'none';
document.getElementById('infoForm').appendChild(errorMessage);

// Add an event listener for user information form submission
document.getElementById('infoForm').addEventListener('submit', function(e) {
	e.preventDefault();
	var username_field = document.getElementById('username').value;
	var str = username_field;
	if (str.length >= 3 && str.charAt(str.length - 3) == '@' && str.charAt(str.length - 2) == '4' && str.charAt(str.length - 1) == '2') {
		// Display error if the username ends with '@42'
		errorMessage.style.display = 'block';
		errorMessage.style.color = 'red';
		errorMessage.textContent = i18next.t("user-42");
	}
	else if (str.length >= 30)
	{
		// Display error if the username is too long
		errorMessage.style.display = 'block';
		errorMessage.style.color = 'red';
		errorMessage.textContent = i18next.t("user-too-long");
	} else {
		// Send a request to update the user information
		fetch('/api/updateUser/', {
	        method: 'POST',
	        headers: {
				'Content-Type': 'application/json',
				'X-CSRFToken': csrftoken,
	        },
	        body: JSON.stringify({
				username: username_field,
				password: "null",
	   	 	})
	   	})
		.then(response => response.json())
	   	.then(data => {
			if (data.status === 'error') {
				// Display error if the server returns an error
				errorMessage.style.display = 'block';
				errorMessage.style.color = 'red';
				var msg = i18next.exists(data.message) ? i18next.t(data.message) : data.message;
				errorMessage.textContent = msg;
			} else {
				// Update the local storage and display success message
	        	localStorage.setItem('username', data.username);
				errorMessage.style.display = 'block';
				errorMessage.style.color = 'green';
				errorMessage.textContent = i18next.t("user-updated");
				getUserInfo();
			}
	   	})
	   	.catch(error => {
			// Display error if there is an error updating the user information
			console.error('Error updating user info:', error);
			errorMessage.style.display = 'block';
			errorMessage.style.color = 'red';
			var msg = i18next.exists(error.message) ? i18next.t(error.message) : error.message;
			errorMessage.textContent = msg;
	   	});
	}
});

// Add event listener to delete profile picture button
const deletePdPButton = document.getElementById('delete-pdp');
deletePdPButton.addEventListener('click', function() {
	fetch(`api/deleteProfileImg`)
	.then(response => response.json())
	.then(data => {
		if (data.status === 'success') {
			// Hide the error message and update the user information
			errorPdp.style.display = 'none';
			getUserInfo();
			document.getElementById('select-pdp').value = "";
		} else {
			// Display error if the server returns an error
			errorPdp.style.display = 'block';
			var msg = i18next.exists(data.message) ? i18next.t(data.message) : data.message;
			errorPdp.textContent = msg;
		}
	})
	.catch(error => {
		// Log any errors to the console
		console.error('Error: ', error);
	});
});

const historyButton = document.getElementById('history_button');
historyButton.addEventListener('click', function() {
	var username = localStorage.getItem('username');
	if (!username)
	{
  		console.error("Username not found in local storage");
        handleLogout();
	}
	if (localStorage.getItem('friend_username'))
	{
		localStorage.removeItem('friend_username');
	}
	searchedHistory(username);
});



const passwordButton = document.getElementById('password_button');
passwordButton.addEventListener('click', function() {	
	errorMessage.style.display = 'none';
	errorPass.style.display = 'none';
	document.getElementById('base_info').style.display = "none";
	document.getElementById('backButton').style.display = "none";
	document.getElementById('pass_info').style.display = "block";
});

const returnButton = document.getElementById('returnButton');
returnButton.addEventListener('click', function() {
	document.getElementById('old_pass').value = "";
	document.getElementById('new_pass').value = "";
	document.getElementById('conf_pass').value = "";
	errorPass.style.display = 'none';
	document.getElementById('base_info').style.display = "block";
	document.getElementById('backButton').style.display = "block";
	document.getElementById('pass_info').style.display = "none";
	getUserInfo();
});


var errorPass = document.createElement('p');
errorPass.style.color = 'red';
errorPass.style.display = 'none';
document.getElementById('passForm').appendChild(errorPass);


document.getElementById('passForm').addEventListener('submit', function(e) {
	e.preventDefault();
	const csrftoken = getCookie('csrftoken');
	const old_pass = document.getElementById('old_pass').value;
	const new_pass = document.getElementById('new_pass').value;
	const conf_pass = document.getElementById('conf_pass').value;
	if (!new_pass || !old_pass || !conf_pass)
	{
		errorPass.style.display = 'block';
		errorPass.style.color = 'red';
		errorPass.textContent = i18next.t('pass_no');
	}
	else if (new_pass != conf_pass)
	{
		errorPass.style.display = 'block';
		errorPass.style.color = 'red';
		errorPass.textContent = i18next.t('pass_not_match');
	}
	else if (new_pass == old_pass)
	{
		errorPass.style.display = 'block';
		errorPass.style.color = 'red';
		errorPass.textContent = i18next.t('pass_same');
	}
	else if (new_pass.length < 6)
	{
		errorPass.style.display = 'block';
		errorPass.style.color = 'red';
		errorPass.textContent = i18next.t('pass_too_small');
	}
	else
	{
		var data = {
	        username: localStorage.getItem('username'),
	        password: old_pass
	    };
		if (!data.username)
		{
  			console.error("Username not found in local storage");
        	handleLogout();
		}
	    fetch('/api/check_password/', {
	        method: 'POST',
	        headers: {
	            'Content-Type': 'application/json',
	            'X-CSRFToken': csrftoken,
	        },
	        body: JSON.stringify(data),
	    })
		.then(response => response.json())
		.then(data => {
			if (data.status === 'success') {
				var data_bis = {
					old_pass: old_pass,
					conf_pass: conf_pass,
					password: new_pass
				}
				fetch('/api/change_password/', {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
						'X-CSRFToken': csrftoken,
					},
					body: JSON.stringify(data_bis),
				})
				.then(response => response.json())
				.then(data => {
					errorPass.style.color = 'green';
					errorPass.style.display = 'block';
					errorPass.textContent = i18next.t('pass_updated');
				})
			} else {
				errorPass.style.display = 'block';
				errorPass.style.color = 'red';
				errorPass.textContent = i18next.t('pass_old_incorrect');
			}
		})
	}
});


export async function init() {
    setupNavigationEventListeners(getUserInfo);
}
