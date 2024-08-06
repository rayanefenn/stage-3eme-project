allowSubmission = true;

const registerModal = document.getElementById("registerModal");
registerModal.addEventListener("hide.bs.modal", function () {
	clearRegisterFrom();
});

function clearRegisterFrom() {
	errorRegisterMsgDom.innerHTML = "";
	// document.getElementById("usernameRegister").value = "";
	document.getElementById("passwordRegister").value = "";
	document.getElementById("emailRegister").value = "";
	document.getElementById("nameRegister").value = "";
}

async function getRegisterResponse(registerInfo) {
	try {
		// Append the 'Content-Type' header for FormData
		const config = {
			headers: {
				"Content-Type": "multipart/form-data",
			},
		};

		let response = await axios.post(registerUrl, registerInfo, config);

		let data = response.data;
		return data;
	} catch (error) {
		throw error.response.data.message;
	}
}

function showRegisterErrorMsg(errorMsg) {
	errorRegisterMsgDom.classList.remove("text-success");
	errorRegisterMsgDom.classList.add("text-danger");
	errorRegisterMsgDom.innerText = errorMsg;
}
function showRegisterSuccessMsg(successMsg) {
	errorRegisterMsgDom.classList.add("text-success");
	errorRegisterMsgDom.classList.remove("text-danger");
	errorRegisterMsgDom.innerText = successMsg;
}

registerForm.addEventListener("submit", async function (event) {
	event.preventDefault();

	let [status, username, password] = await handleRegister();

	if (status) {
		await delay(160);
		errorRegisterMsgDom.innerHTML = "";
		closeRegisterBtn.click();
		OpenLoginModal(username, password);
	}
});

function OpenLoginModal(username, password) {
	const loginNavBtn = document.getElementById("loginNavBtn");
	loginNavBtn.click();
	document.getElementById("usernameLogin").value = username;
	document.getElementById("passwordLogin").value = password;
}

async function handleRegister() {
	let registerInfo = new FormData();

	registerInfo.append("username", document.getElementById("usernameRegister").value);
	registerInfo.append("password", document.getElementById("passwordRegister").value);

	let imgFile = document.getElementById("imgRegister").files[0];
	if (imgFile) {
		registerInfo.append("image", imgFile);
	}

	registerInfo.append("name", document.getElementById("nameRegister").value);
	if (document.getElementById("emailRegister").value) registerInfo.append("email", document.getElementById("emailRegister").value);

	try {
		let data = await getRegisterResponse(registerInfo);

		showRegisterSuccessMsg("Your Register was successful");
		return [true, registerInfo.get("username"), registerInfo.get("password")];
	} catch (errorMsg) {
		showRegisterErrorMsg(errorMsg);
		return [false, "", ""];
	}
}
