// loginModal.addEventListener("hide.bs.modal", function () {
// 	clearLoginFrom();
// });

// function clearLoginFrom() {
// 	errorMsgDom.innerHTML = "";
// 	document.getElementById("passwordLogin").value = "";
// }

let allowSubmission = true;

// get Login response :
async function getUserResponse(username, password) {
	try {
		let response = await axios.post(loginUrl, {
			username: username,
			password: password,
		});

		let data = response.data;
		return data;
	} catch (error) {
		throw error.response.data.message;
	}
}

function showLoginErrorMsg(errorMsg) {
	const errorMsgDom = document.getElementById("errorMsg");
	errorMsgDom.classList.remove("text-success");
	errorMsgDom.classList.add("text-danger");
	errorMsgDom.innerText = errorMsg;
}

function showLoginSuccessMsg(successMsg) {
	const errorMsgDom = document.getElementById("errorMsg");
	errorMsgDom.classList.add("text-success");
	errorMsgDom.classList.remove("text-danger");
	errorMsgDom.innerText = successMsg;
}

function delay(milliseconds) {
	return new Promise((resolve) => setTimeout(resolve, milliseconds));
}

LoginForm.addEventListener("submit", async function (event) {
	event.preventDefault();
	let status = await handleLogin();

	if (status) {
		await delay(160);

		closeBtn.click();
		errorMsgDom.innerHTML = "";
		let currentPageName = window.location.pathname.split("/").pop().toLowerCase();
		if (currentPageName == "index.html" || currentPageName=="") goToLoginPage();
		else if (currentPageName == "profile.html") goToProfilePage();
		else goToLoginDetailsPage();

		updatePostToLogin();

		appendAlert("Logged in successfully", "info");
		await delay(200);
		await clearAlert();
	}
});

function updatePostToLogin() {
	// Get all elements with class 'headerContent' under the element with id 'posts'
	let postHeaders = document.querySelectorAll("#posts .headerContent");

	// Iterate through each post header
	postHeaders.forEach((header) => {
		// Check if the header contains an element with id 'editPostBtn'
		let editPostBtn = header.querySelector("#editPostBtn");
		let deletePostBtn = header.querySelector("#deletePostBtn");

		if (editPostBtn && deletePostBtn) {
			editPostBtn.style.display = "block";
			editPostBtn.style.visibility = "visible";

			deletePostBtn.style.display = "block";
			deletePostBtn.style.visibility = "visible";

			// change the background of the header :
			header.classList.add("bg-dark");

			//change the styling of the header  text :
			let headerTextContent = header.querySelector("h4");
			headerTextContent.classList.add("text-white");
			headerTextContent.classList.remove("text-dark");

			//   change the color of @ :
			let hashtag = headerTextContent.querySelector("span");

			hashtag.classList.add("text-warning");
			hashtag.classList.remove("text-secondary");
		}
	});
}

function goToLoginPage() {
	let user = JSON.parse(localStorage.getItem("user"));
	let profileImgUrl = user.profile_image;
	if (profileImgUrl instanceof Object) {
		profileImgUrl = backupProfileImg;
	}
	navBarBtnsParent.innerHTML = `

    <img src="${profileImgUrl}" alt="profile img" class="rounded-circle border border-2  me-3" style="width: 44px; height: 44px;  margin-left: 1px" />
    <button type="button" class="btn btn-outline-danger  me-2" onclick="logout()">Logout</button>`;

	let strFormContent = `	<div class="addPostFrom bg-light  px-4 rounded d-grid gy-5 mt-4   col-12 col-lg-8 "  style="padding-top: 20px; margin-top: 30px;">
	<div class="input-group mb-3 ">
		<img src="${profileImgUrl}" alt="" width="44px" height="44px"  style="aspect-ratio: 4/4;" class="rounded-5" onclick="showUserProfile()" >
	   
	   <input type="text" class="form-control fs-5 rounded-5 px-3 py-2 " placeholder="what's new today ?"   data-bs-toggle="modal" data-bs-target="#addPostModal"> 
	   
	 </div>	
   </div>`;

	mainContent.firstElementChild.innerHTML = strFormContent;
}
function goToProfilePage() {
	let user = JSON.parse(localStorage.getItem("user"));
	let profileImgUrl = user.profile_image;
	if (profileImgUrl instanceof Object) {
		profileImgUrl = backupProfileImg;
	}
	navBarBtnsParent.innerHTML = `

    <img src="${profileImgUrl}" alt="profile img" class="rounded-circle border border-2  me-3" style="width: 44px; height: 44px;  margin-left: 1px" />
    <button type="button" class="btn btn-outline-danger  me-2" onclick="logout()">Logout</button>`;
}

function getCommentForm() {
	if (localStorage.getItem("user") && localStorage.getItem("userToken")) {
		let user = JSON.parse(localStorage.getItem("user"));
		let profileImg = user.profile_image;

		if (profileImg instanceof Object) {
			profileImg = backupProfileImg;
		}

		return `
    <!-- start add comment  -->
    <div id="addComments" class="position-sticky bottom-0" style="width: 100%">
        <div class="input-group d-flex gap-2 justify-content-around p-3 bg-body rounded align-items-baseline" style="box-shadow: 0px -5px 3px rgba(122, 167, 191, 0.215)">
            <img src="${profileImg}" alt="" width="44px" height="44px" style="aspect-ratio: 4/4" class="rounded-5"  onclick="showUserProfile()"/>
            <form  id="commentForm " class="flex-grow-1 position-relative d-flex flex-column" onsubmit="return addComment();">
								<textarea type="text" class="form-control fs-6 rounded px-3 py-2 " placeholder="write a comment " rows="2" oninput="autoResize(this)" required></textarea>
								<input  type="submit" class="btn btn-primary align-self-end me-1 mt-1" value="Add" >
		</form>
        </div>
    </div>
    <!-- end add comment  -->`;
	} else {
		return `
		<div id="addComments" class="position-sticky bottom-0" style="width: 100%;"></div>
		`;
	}
}
function goToLoginDetailsPage() {
	let addCommentForm = document.getElementById("addComments");
	addCommentForm.innerHTML = getCommentForm();

	let user = JSON.parse(localStorage.getItem("user"));
	let profileImgUrl = user.profile_image;
	if (profileImgUrl instanceof Object) {
		profileImgUrl = backupProfileImg;
	}
	navBarBtnsParent.innerHTML = `

    <img src="${profileImgUrl}" alt="profile img" class="rounded-circle border border-2  me-3" style="width: 44px; height: 44px;  margin-left: 1px" />
    <button type="button" class="btn btn-outline-danger  me-2" onclick="logout()">Logout</button>`;
}

async function handleLogin() {
	let username = document.getElementById("usernameLogin").value;
	let password = document.getElementById("passwordLogin").value;

	try {
		let data = await getUserResponse(username, password);

		showLoginSuccessMsg("Your login was successful");

		// store the user token in local storage:
		localStorage.setItem("userToken", data.token);

		// store the use in the local storage :
		localStorage.setItem("user", JSON.stringify(data.user));

		return true;
	} catch (errorMsg) {
		showLoginErrorMsg(errorMsg);
		return false;
	}
}

const appendAlert = (message, type) => {
	const wrapper = document.createElement("div");
	wrapper.style.transition = "0.3s";

	wrapper.innerHTML = [`<div class="alert alert-${type} alert-dismissible" role="alert">`, `   <div class="fw-bold">${message}</div>`, '   <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>', "</div>"].join("");

	alertPlaceholder.innerHTML = "";
	alertPlaceholder.append(wrapper);
};

async function clearAlert() {
	for (let i = 1; i >= 0; i -= 0.01) {
		await delay(20);
		alertPlaceholder.style.opacity = i;
	}
	alertPlaceholder.innerHTML = "";
	alertPlaceholder.style.opacity = 1;
}
