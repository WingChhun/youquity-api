require('dotenv').config();

exports.DATABASE_URL = process.env.DATABASE_URL || 'mongodb://localhost:27017/youquity-api';
exports.TEST_DATABASE_URL = process.env.TEST_DATABASE_URL || 'mongodb://localhost:27017/test-youquity-api';
exports.PORT = process.env.PORT || 8080;
exports.TEST_PORT = process.env.TEST_PORT || 8888;
exports.JWT_SECRET = process.env.JWT_SECRET || 'The quick brown fox jumped over the lazy dog.';
exports.JWT_EXPIRY = process.env.JWT_EXPIRY || '7d';
exports.CLIENT_ORIGIN = process.env.CLIENT_ORIGIN || 'http://localhost:3000';