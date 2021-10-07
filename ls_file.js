const fs = require('fs');
const path = require("path");

fs.readdir("./files_csv", function (err, archivos) {

	if (err) {
		onError(err);
		return;
	}
console.log(archivos);
	

});



const getMostRecentFile = (dir) => {
  const files = orderReccentFiles(dir);
  return files.length ? files[0] : undefined;
};

const orderReccentFiles = (dir) => {
  return fs.readdirSync(dir)
    .filter((file) => fs.lstatSync(path.join(dir, file)).isFile())
    .map((file) => ({ file, mtime: fs.lstatSync(path.join(dir, file)).mtime }))
    .sort((a, b) => b.mtime.getTime() - a.mtime.getTime());
};

console.log("Ultimo archivo Creado ------> "+ getMostRecentFile('./files_csv'));
