// Imports
import busboy from 'busboy';
import { Buffer } from 'buffer';

// Define the base64 decode function
const decodeBase64 = (base64String) => {
    return Buffer.from(base64String, 'base64').toString('utf-8');
};

// Function to parse multipart/form-data
export const parseFormData = async (event) => {
    return new Promise((resolve, reject) => {
        const contentType = event.headers['content-type'] || event.headers['Content-Type'];
        const bb = busboy({ headers: { 'content-type': contentType } });
        const result = {};

        bb.on('file', (fieldname, file, filename, encoding, mimetype) => {
            // Initialize an array to collect file data
            const fileChunks = [];
            file.on('data', (data) => {
                // Push chunks into the array
                fileChunks.push(data);
            }).on('end', () => {
                // Combine chunks and store them in result
                result[fieldname] = {
                    filename,
                    encoding,
                    mimetype,
                    data: Buffer.concat(fileChunks)  // Combine chunks into a single Buffer
                };
            });
        });

        bb.on('field', (fieldname, val) => {
            result[fieldname] = val;
        });

        bb.on('finish', () => {
            resolve(result);
        });

        bb.on('error', (error) => {
            reject(error);
        });

        bb.write(event.isBase64Encoded ? decodeBase64(event.body) : event.body, 'utf-8');
        bb.end();
    });
};
