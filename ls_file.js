const fs = require('fs');

fs.readdir("./files_csv", function (err, archivos) {

	if (err) {
		onError(err);
		return;
	}

	archivos.forEach(function(file){
		console.log(file);
		stats = fs.statSync(file);
		console.log(stats.mtime);
		console.log(stats.ctime);
	})

console.log(archivos);
});
