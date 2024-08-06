function updateFileBackground() {
	if (postFileInput.files.length > 0) {
		const reader = new FileReader();

		reader.onload = function (e) {
			imgContainer.style.backgroundImage = `url(${e.target.result})`;
		};

		reader.readAsDataURL(postFileInput.files[0]);
		imgContainerContent.style.display = "none";
	} else {
		imgContainer.style.backgroundImage = `none`;
		imgContainerContent.style.display = "block";
	}
}

const addPostUrl = baseUrl + "/posts";
async function getAddPostResponse(postInfo) {
	try {
		// Append the 'Content-Type' header for FormData

		let token = localStorage.getItem("userToken");

		const config = {
			headers: {
				"Content-Type": "multipart/form-data",
				Authorization: `Bearer ${token}`,
			},
		};

		let response = await axios.post(addPostUrl, postInfo, config);

		let data = response.data.data;
		return data;
	} catch (error) {
		throw error.response.data.message;
	}
}

async function handleAddPost() {
	let postInfo = new FormData();

	postInfo.append("title", postTitle.value);
	postInfo.append("body", postBody.value);
	let trimTags = postTags.value.replace(/\s+/g, " ");
	let arrTags = trimTags.split(" ");
	postInfo.append("tags", arrTags.join(","));

	let imgFile = postFileInput.files[0];
	if (imgFile) {
		postInfo.append("image", imgFile);
	}

	try {
		let postJsonData = await getAddPostResponse(postInfo);

		appendAlert("Post added with Success", "info");
		await clearAlert();

		return [true, postJsonData];
	} catch (errorMsg) {
		await appendAlert(errorMsg, "danger");
		clearAlert();
		return [false, ""];
	}
}

// function from app.js : postJsonToHtml

function clearPostModal() {
	imgContainer.style.backgroundImage = `none`;
	imgContainerContent.style.display = "block";
	AddPostFrom.reset();
}

AddPostFrom.addEventListener("submit", async function (event) {
	event.preventDefault();
	addPostBtn.setAttribute("disabled", true);
	let [status, postJson] = await handleAddPost();
	addPostBtn.removeAttribute("disabled");
	if (status) {
		closeAddPostBtn.click();

		let htmlPost = postJsonToHtml(postJson);

		domPostsParent.insertAdjacentHTML("afterbegin", htmlPost);
		initializeTooltips();
		clearPostModal();
		clearAlert();
	}
});
