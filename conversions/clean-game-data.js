const fs = require('fs');

//Thanks chat gpt
function cleanGameData(inputFile, outputFile) {
	// Read the raw data from the input file
	const rawData = fs.readFileSync(inputFile, 'utf-8');

	// Extract the data between #START and #END
	const startIndex = rawData.indexOf('#START');
	const endIndex = rawData.indexOf('#END');

	if (startIndex === -1 || endIndex === -1) {
		console.error('Invalid data format: #START or #END not found.');
		return;
	}

	// Get the relevant data and remove unnecessary text
	const dataString = rawData
		.substring(startIndex + 7, endIndex)
		.replace(/call Preload\(\s*"/g, '') // Remove 'call Preload("'
		.replace(/"\s*\)/g, '') // Remove '")'
		.trim();

	// Split the cleaned data into lines
	let lines = dataString.split('\n').map((line) => line.trim());

	// Merge broken lines that span across preload boundaries
	lines = mergeBrokenLines(lines);

	// Remove color codes and filter out empty lines
	const cleanedLines = lines
		.map((line) => {
			return line.replace(/\|cff[0-9a-fA-F]{6}/g, ''); // Remove color codes
		})
		.filter((line) => line.length > 0); // Remove any empty lines

	// Reformat the data with #START and #END
	const cleanedData = `#START\n${cleanedLines.join('\n')}\n#END`;

	// Write the cleaned data to the output file
	fs.writeFileSync(outputFile, cleanedData, 'utf-8');
	console.log(`Cleaned data has been written to ${outputFile}`);
}

// Function to merge lines that are broken across preload boundaries
function mergeBrokenLines(lines) {
	const mergedLines = [];
	let currentLine = '';

	for (const line of lines) {
		if (currentLine) {
			// If the current line does not end with a complete entry, keep merging
			if (!currentLine.includes(',')) {
				currentLine += line;
				continue;
			}

			// Add the current line to the result if it is complete
			mergedLines.push(currentLine);
			currentLine = '';
		}

		// If the line is complete, add it directly
		if (line.includes(',')) {
			mergedLines.push(line);
		} else {
			// Otherwise, start merging
			currentLine = line;
		}
	}

	// If there is a leftover line, add it to the result
	if (currentLine) {
		mergedLines.push(currentLine);
	}

	return mergedLines;
}

const inputFile = 'input.txt'; // Replace with your input file path
const outputFile = 'output.txt'; // Replace with your output file path

cleanGameData(inputFile, outputFile);
