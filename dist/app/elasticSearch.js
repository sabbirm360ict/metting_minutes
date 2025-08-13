"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const elasticsearch_1 = require("@elastic/elasticsearch");
const client = new elasticsearch_1.Client({
    node: 'http://localhost:9200',
    auth: {
        username: 'elastic',
        password: '12345678', //EGQlIumwjG=V+5N-TAv3
    },
    tls: {
        rejectUnauthorized: false, // only needed if using https
    },
});
client
    .ping()
    .then(() => console.log('✅ Elasticsearch is connected!'))
    .catch((err) => console.error('❌ Connection failed:', err));
exports.default = client;
