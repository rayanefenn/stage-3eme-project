function setUpUi() {
	let currentPageName = window.location.pathname.split("/").pop().toLowerCase();
	if (localStorage.getItem("userToken") && localStorage.getItem("user")) {
		if (currentPageName == "index.html" || currentPageName=="") goToLoginPage();
		else if (currentPageName == "profile.html") goToProfilePage();
		else goToLoginDetailsPage();

		updatePostToLogin();
	} else {
		innerLogoutButtons();
		removeUserInfoFromLocalStorage();

		if (currentPageName == "index.html" || currentPageName=="") removeAddPostContent();

		updatePostToLogout();
	}
}
window.onload = setUpUi;
