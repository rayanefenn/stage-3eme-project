let parent = document.querySelector(".parent");

function delay(milliseconds) {
	return new Promise((resolve) => setTimeout(resolve, milliseconds));
}
function goToTop() {
	document.documentElement.scrollTop = 0; // For modern browsers
	document.body.scrollTop = 0; // For older browsers
}

async function upDownAnim() {
	goToTop();
	parent.style.display = "flex";
	for (let i = 1; i >= 0; i -= 0.01) {
		parent.style.opacity = i;
		await delay(16);
	}
	parent.style.display = "none";
}

upDownAnim();
