import { Client } from "discord.js";
import { CommandKit } from "commandkit";
import mongoose from "mongoose";
import { configDotenv } from "dotenv";
import express, { json, urlencoded } from "express";
import apiRoutes from "./routes";
import dotenv from "dotenv";
import cors from "cors";
import RegisterConfig from "./models/RegisterConfig";
import fs from "fs";
import { createObjectCsvWriter } from 'csv-writer';
// const fs = require('fs');
dotenv.config();
const app = express();
app.use(json());
app.use(urlencoded({ extended: true }));
app.use(cors());
app.use("/api", apiRoutes);

// export const client = new Client({
//     intents: ["Guilds", "GuildMembers", "GuildMessages", "MessageContent"],
// });

configDotenv();

// new CommandKit({
//     client,
//     commandsPath: `${__dirname}/commands`,
//     eventsPath: `${__dirname}/events`,
//     devGuildIds: [],
//     devUserIds: [],
//     bulkRegister: true,
// });

const MONGODB_URI = process.env.MONGODB_URI;
const TOKEN = process.env.TOKEN;

if (!MONGODB_URI || !TOKEN) {
    throw new Error("Missing environment variables");
}

mongoose.connect(MONGODB_URI).then(async () => {
    console.log("Connected to database.");
    app.listen(process.env.PORT, () => {
        console.log("Server listening at PORT: " + process.env.PORT);
    });
    const value = await RegisterConfig.find({role:"mb_cohort"});

    const csvWriter = createObjectCsvWriter({
        path: 'output.csv',
        // header: [
        //     {id: 'name', title: 'name'},
        //     {id: 'email', title: 'email'},
        //     {id: 'attributes', title: 'attributes'}
        // ]
        header: [
        {id: '_id', title: 'ID'},
        {id: 'name', title: 'Name'},
        {id: 'token', title: 'Token'},
        {id: 'enrolled', title: 'Enrolled'},
        {id: 'role', title: 'Role'},
        {id: 'email', title: 'Email'},
        {id: 'describeYourself', title: 'Describe Yourself'},
        {id: 'background', title: 'Background'},
        {id: 'github', title: 'GitHub'},
        {id: 'skills', title: 'Skills'},
        {id: 'year', title: 'Year'},
        {id: 'books', title: 'Books'},
        {id: 'why', title: 'Why'},
        {id: 'time', title: 'Time'},
        {id: 'location', title: 'Location'},
        {id: 'version', title: 'Version'},
        {id: 'cohortName', title: 'Cohort Name'},
        {id: 'createdAt', title: 'Created At'},
        {id: 'updatedAt', title: 'Updated At'}
    ]
    });
    
    let current = value.map((e)=>{
        // let attributes = {
        //     token: e.token,
        //     cohort: e.cohortName
        // };
        // return {email: e.email,name: e.name,attributes: JSON.stringify(attributes)};
        return e;
    });
    // console.log(current);

    csvWriter
    .writeRecords(current)       // returns a promise
    .then(() => {
        console.log('CSV file was written successfully');
    })
    .catch(err => {
        console.error('Error writing CSV file', err);
    });

    
    // client.login(TOKEN);
    // writeCSVToFile("data_dump.csv",value);
    
});

function arrayToCSV(data) {
    if (!data || !data.length) {
        return '';
    }

    // Get headers from the first object's keys
    const headers = Object.keys(data[0]);
    let csvContent = headers.join(',') + '\n';

    data.forEach(item => {
        let row = headers.map(header => {
            let value = item[header];

            if (value == null) {
                return '';
            } else if (Array.isArray(value)) {
                // Join array elements with semicolon and escape internal quotes
                return '"' + value.map(el => `${el}`.replace(/"/g, '""')).join(';') + '"';
            } else if (typeof value === 'object') {
                // Convert object to JSON, escape double quotes for CSV, and surround with quotes
                return `"${JSON.stringify(value).replace('""', '')}"`;
            } else {
                // Convert value to string, escape double quotes
                return `"${value.toString().replace(/"/g, '""')}"`;
            }
        }).join(',');

        csvContent += row + '\n';
    });

    return csvContent;
}

function writeCSVToFile(filename, data) {
    const csvData = arrayToCSV(data);
    console.log(csvData);
    // if (!csvData) {
    //     console.log("No data to write.");
    //     return;
    // }

    // fs.writeFile(filename, csvData, (err) => {
    //     if (err) {
    //         console.error('Error writing to CSV file', err);
    //     } else {
    //         console.log(`Saved as ${filename}`);
    //     }
    // });
}
