function initializeTooltips() {
	// Initialize tooltips for the newly added posts
	const newTooltipTriggerList = domPostsParent.querySelectorAll('[data-bs-toggle="tooltip"]');
	newTooltipTriggerList.forEach((tooltipTriggerEl) => new bootstrap.Tooltip(tooltipTriggerEl));
}
