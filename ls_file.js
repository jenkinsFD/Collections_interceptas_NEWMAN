const fs = require('fs');

fs.readdir("./files_csv", function (err, archivos) {

	if (err) {
		onError(err);
		return;
	}
console.log(archivos);
});


fs.readdir("./files_csv",function(err, list){
	list.forEach(function(file){
		console.log(file);
		stats = fs.statSync(file);
		console.log(stats.mtime);
		console.log(stats.ctime);
	});
});
