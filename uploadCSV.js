const fs = require('fs');
const Papa = require('papaparse');
const newman = require('newman');

newman.run({
    collection: "https://api.getpostman.com/collections/cc2c6966-ce7b-43a1-9163-dee7ee5a4638?apikey=PMAK-615cd157a54a40003535a9be-4602d0a449d9aaf5cda552bb1e348e6b88",  // jsonCollectionPostman
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
