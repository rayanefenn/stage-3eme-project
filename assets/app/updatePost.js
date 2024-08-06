let modal = new bootstrap.Modal(updatePostModal);
function openUpdateModal() {
	modal.show();
}

function closeUpdateModal() {
	modal.hide();
}

function changeFileBackground() {
	if (updatePostFileInput.files.length > 0) {
		const reader = new FileReader();

		reader.onload = function (e) {
			imgUpdateContainer.style.backgroundImage = `url(${e.target.result})`;
		};

		reader.readAsDataURL(updatePostFileInput.files[0]);
		imgUpdateContainerContent.style.display = "none";
	} else {
		imgUpdateContainer.style.backgroundImage = `none`;
		imgUpdateContainerContent.style.display = "block";
	}
}
function fillDateToModal(postInfo) {
	updatePostTitle.value = postInfo.title;

	updatePostBody.innerText = postInfo.bodyText;
	imgUpdateContainer.style.backgroundImage = `url(${postInfo.bodyImg})`;
	imgUpdateContainerContent.style.display = "none";
	updatePostTags.value = postInfo.tags.join(" ");
}
function clearUpdateModal() {
	imgUpdateContainer.style.backgroundImage = `none`;
	imgUpdateContainerContent.style.display = "block";
	updatePostFrom.reset();
}

let postObject;
let  currentPost=""; 
function editPost(postInfo,thisPost) {
	
	currentPost=thisPost; 
	postInfo = decodeURIComponent(postInfo);

	// Parse the JSON string back into an object
	postObject = JSON.parse(postInfo);
	fillDateToModal(postObject);
	openUpdateModal();
}
const BaseUpdatePostUrl = baseUrl + "/posts";
async function getUpdatePostResponse(postInfo) {
	try {
		// Append the 'Content-Type' header for FormData

		let token = localStorage.getItem("userToken");

		const config = {
			headers: {
				"Content-Type": "multipart/form-data",
				Authorization: `Bearer ${token}`,
			},
		};
		let updateUrl = BaseUpdatePostUrl + "/" + postObject.id;
		let response = await axios.post(updateUrl, postInfo, config);

		let data = response.data.data;
		return data;
	} catch (error) {
		throw error.response.data.message;
	}
}

async function handleUpdatePost() {
	let postInfo = new FormData();

	postInfo.append("title", updatePostTitle.value);
	postInfo.append("body", updatePostBody.value);
	let trimTags = updatePostTags.value.replace(/\s+/g, " ");
	let arrTags = trimTags.split(" ");
	postInfo.append("tags", arrTags.join(","));

	let imgFile = updatePostFileInput.files[0];
	if (imgFile) {
		postInfo.append("image", imgFile);
	}
	postInfo.append("_method", "put");

	try {
		let postJsonData = await getUpdatePostResponse(postInfo);

		appendAlert("Post updated with Success", "info");
		await clearAlert();

		return [true, postJsonData];
	} catch (errorMsg) {
		appendAlert(errorMsg, "danger");
		await clearAlert();
		return [false, ""];
	}
}
function scrollToTop() {
	window.scrollTo({
		top: 0,
		behavior: "smooth",
	});
}

updatePostFrom.addEventListener("submit", async function (event) {
	event.preventDefault();
	updatePostBtn.setAttribute("disabled", true);
	let [status, postJson] = await handleUpdatePost();
	updatePostBtn.removeAttribute("disabled");
	if (status) {
		closeUpdateModal();

		let htmlPost = postJsonToHtml(postJson);
		let currentPageName = window.location.pathname.split("/").pop().toLowerCase();

		if (currentPageName == "index.html" || currentPageName=="" ||  currentPageName=='profile.html') {
		    
                currentPost.remove();
			domPostsParent.insertAdjacentHTML("afterbegin", htmlPost);
		}
		else  
		domPostsParent.innerHTML = htmlPost;
		initializeTooltips();
		scrollToTop();
		clearAlert();
	}
});
