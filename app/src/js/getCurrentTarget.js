// This function returns the id of the select input when it is used
function getCurrentTarget(event) {
	console.log(event);
	console.log(event.currentTarget.id);
	return event.currentTarget.id;
}

export { getCurrentTarget } ;
