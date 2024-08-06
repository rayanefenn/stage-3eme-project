let loginRegisterContent = `
<button type="button" class="btn btn-outline-success  me-2"  data-bs-toggle="modal" data-bs-target="#loginModal" id="loginNavBtn" >Login</button>

<button type="button" class="btn btn-outline-success" style="margin-left: 0.5rem"  data-bs-toggle="modal" data-bs-target="#registerModal">Register</button>
`;

function innerLogoutButtons() {
	navBarBtnsParent.innerHTML = loginRegisterContent;
}

function removeUserInfoFromLocalStorage() {
	localStorage.removeItem("userToken");
	localStorage.removeItem("user");

	if (localStorage.getItem("user")) {
		let user = JSON.parse(localStorage.getItem("user"));
		document.getElementById("usernameLogin").value = user.username;
	}
}
function removeAddPostContent() {
	mainContent.firstElementChild.innerHTML = "";
}

function updatePostToLogout() {
	let postHeaders = document.querySelectorAll("#posts .headerContent");

	postHeaders.forEach((header) => {
		// Check if the header contains an element with id 'editPostBtn'
		let editPostBtn = header.querySelector("#editPostBtn");
		let deletePostBtn = header.querySelector("#deletePostBtn");

		if (editPostBtn && deletePostBtn) {
			editPostBtn.style.display = "none";
			editPostBtn.style.visibility = "hidden";

			deletePostBtn.style.display = "none";
			deletePostBtn.style.visibility = "hidden";
			// change the background of the header :
			header.classList.remove("bg-dark");

			//change the styling of the header  text :
			let headerTextContent = header.querySelector("h4");
			headerTextContent.classList.remove("text-white");
			headerTextContent.classList.add("text-dark");

			//   change the color of @ :
			let hashtag = headerTextContent.querySelector("span");

			hashtag.classList.remove("text-warning");
			hashtag.classList.add("text-secondary");
		}
	});
}

async function logout() {
	let currentPageName = window.location.pathname.split("/").pop().toLowerCase();

	removeUserInfoFromLocalStorage();
	innerLogoutButtons();
	if (currentPageName == "index.html" || currentPageName=="") removeAddPostContent();
	else if (currentPageName == "postdetails.html") {
		addCommentForm = document.getElementById("addComments");
		addCommentForm.innerHTML = "";
	}
	updatePostToLogout();
	await delay(200);
	appendAlert("Logged out successfully", "danger");

	await delay(100);
	await clearAlert();
}
