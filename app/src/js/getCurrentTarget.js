function getCurrentTarget(event) {
	console.log(event);
	console.log(event.currentTarget.id);
	return event.currentTarget.id;
}

export { getCurrentTarget } ;
