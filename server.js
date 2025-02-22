require("dotenv").config();
const express = require("express");
const mysql = require("mysql2/promise");
const { GoogleGenerativeAI } = require("@google/generative-ai");
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const genAI = new GoogleGenerativeAI(process.env.KEY); // Use environment variable


var host1 = "localhost";
var user1 = "root"; 
var pass1 = "mufasa@123";
var database = "company_db"

const connection = mysql.createPool({
    host: host1 , // Use env vars for db config
    user: user1 ,
    password: pass1,
    database: database,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
});

async function getTableNames(databaseName) {
    try {
        const [tables] = await connection.execute('SHOW TABLES');
        return tables.map(table => Object.values(table)[0]);
    } catch (err) {
        console.error(`Error getting table names for ${databaseName}:`, err);
        throw err;
    }
}

async function getColumnNames(databaseName, tableName) {
    try {
        const [columns] = await connection.execute(`SHOW COLUMNS FROM ${tableName}`);
        return columns.map(col => col.Field);
    } catch (err) {
        console.error(`Error getting column names for ${tableName} in ${databaseName}:`, err);
        throw err;
    }
}

async function generateSQL(userQuery, tableName, columnNames) {
    try {
        const model = genAI.getGenerativeModel({ model: "gemini-pro" });
        const prompt =`Translate the following natural language query into a precise MySQL query. Assume Table: ${tableName}, Columns: ${columnNames}. Output ONLY the raw SQL query, with no additional text, explanations, or special formatting: ${userQuery}
`;
        const result = await model.generateContent(prompt);
        return result.response.text();
    } catch (error) {
        console.error("Gemini API Error:", error);
        return null;
    }
}

app.post("/query", async (req, res) => {
    const  { query: userQuery, database: requestedDatabaseName } = req.body;
    host1 = req.body.host;
    user1 =  req.body.username;
    pass1 = req.body.password;

    if (!userQuery || !requestedDatabaseName) {
        return res.status(400).json({ error: "Query and database name are required." });
    }

    try {
        await connection.query(`USE ${mysql.escapeId(requestedDatabaseName)};`);
        const tableNames = await getTableNames(requestedDatabaseName);

        if (tableNames.length === 0) {
            return res.status(404).json({ error: `Database '${requestedDatabaseName}' has no tables.` });
        }

        const tableName = tableNames[0];
        const columnNames = await getColumnNames(requestedDatabaseName, tableName);
        const sqlQuery = await generateSQL(userQuery, tableName, columnNames);

        if (!sqlQuery) {
            return res.status(500).json({ error: "Failed to generate SQL query." });
        }

        const [results] = await connection.execute(sqlQuery);
        res.json({ sql: sqlQuery, results });

    } catch (err) {
        console.error(`Error processing query for ${requestedDatabaseName}:`, err);
        res.status(500).json({ error: err.message });
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`✅ Server running on http://localhost:${PORT}`);
});