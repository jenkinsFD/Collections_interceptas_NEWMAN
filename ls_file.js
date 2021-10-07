

fs.readdir("./files_csv", function (err, archivos) {

	if (err) {
		onError(err);
		return;
	}

console.log(archivos);
});