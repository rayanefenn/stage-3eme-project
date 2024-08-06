let DeleteModal = new bootstrap.Modal(deletePostModal);
function openDeleteModal() {
	DeleteModal.show();
}

function closeDeleteModal() {
	DeleteModal.hide();
}

let post = "";
deletePostModal.addEventListener("hide.bs.modal", function () {
	ClearSetupPostToDelete(post);
});
function setUpPostToDelete(postDom) {
	postDom.style.transform = "scale(1.04)";
	postDom.firstElementChild.classList.remove("bg-dark");
	postDom.firstElementChild.classList.add("bg-danger");
}
function ClearSetupPostToDelete(postDom) {
	if (postDom == "") return;
	postDom.style.transform = "scale(1)";
	postDom.firstElementChild.classList.add("bg-dark");
	postDom.firstElementChild.classList.remove("bg-danger");
}
deletePostModal.addEventListener("hide.bs.modal", ClearSetupPostToDelete(post));

let postId = 0;
function deletePost(postDom, id) {
	post = postDom;
	postId = id;
	setUpPostToDelete(post);
	openDeleteModal();
}

const BaseDeletePostUrl = baseUrl + "/posts";
async function getDeletedPostResponse(postId) {
	try {
		let token = localStorage.getItem("userToken");

		const config = {
			headers: {
				Authorization: `Bearer ${token}`,
			},
		};
		let deleteUrl = BaseDeletePostUrl + "/" + postId;
		let response = await axios.delete(deleteUrl, config);
		let data = response.data.data;
		return data;
	} catch (error) {
		throw error.response.data.message;
	}
}

function removePost(postDom) {
	// Remove the element from the DOM
	postDom.remove();
}

async function handleDeletePost() {
	try {
		let postJsonData = await getDeletedPostResponse(postId);

		appendAlert("Post deleted  with Success", "warning");
		await clearAlert();

		return [true, postJsonData];
	} catch (errorMsg) {
		appendAlert(errorMsg, "danger");
		await clearAlert();
		return [false, ""];
	}
}

deletePostBtn.onclick = async function () {
	deletePostBtn.setAttribute("disabled", true);
	let [status, postJson] = await handleDeletePost();
	deletePostBtn.removeAttribute("disabled");

	if (status) {
		closeDeleteModal();
		removePost(post);
		clearAlert();
	}
};
