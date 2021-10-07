const fs = require('fs');
const Papa = require('papaparse');
const newman = require('newman');


//------------------------------------------------------------------------------------
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
let lastFileCreated = getMostRecentFile('./files_csv');
let lasFile = lastFileCreated.file;
console.log (lasFile);

//------------------------------------------------------------------------------------


newman.run({
    collection: urlRequest,  // jsonCollectionPostman
    reporters: 'cli',
    iterationData: './data.csv'  // File CSV Data Original
}, (error) => {
	if (error) { 
        throw error; 
    }
    console.log('Collection run complete.');
}).on('beforeDone', (error, data) => {
    if (error) {
        throw error;
    }
    const findFailures = (a, c) => {
        return a && (c.error === null || c.error === undefined);
    }
    const testResults = data.summary.run.executions.reduce((a, c) => {
        
        if (a[c.cursor.iteration] !== 'FAILED') {
            a[c.cursor.iteration] = c.assertions.reduce(findFailures, true) ? 'PASSED' : 'FAILED';
        }
        return a;
    }, []);

    updateCsvFile(testResults);
});

function updateCsvFile(testResults) {
    fs.readFile('./data.csv', 'utf8', (error, data) => {
        if (error) {
            throw error;
        }
        const jsonData = Papa.parse(data, { header: true });
                                                                
        jsonData.data.map((item, index) => item.testResult = testResults[index]);
        const updatedCsv = Papa.unparse(jsonData.data);
        console.log("----On updatedCsv actualizado---");
          console.log(updatedCsv);
        console.log("----Off updatedCsv---");

        fs.writeFile('./data-updated.csv', updatedCsv, (error) => {
            if (error) {
                throw error;
            }
            console.log('Updated CSV file DONE!!');
        });
    });
}
