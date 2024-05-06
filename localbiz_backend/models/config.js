const mongoose = require('mongoose');

const configSchema = new mongoose.Schema({
    apiKey: {
        type: String,
        required: true
    }
});

const Config = mongoose.model('Config', configSchema);

// Assuming you have connected to your MongoDB instance
const apiKey = "AIzaSyCnqbebQOpYAMedUi-Ct_xKwXmWlMsO_Q4";

const saveApiKey = async () => {
    const config = new Config({ apiKey });
    try {
        await config.save();
        console.log("API key saved successfully.");
    } catch (error) {
        console.error("Error saving API key:", error);
    }
};

saveApiKey(); // Call the function to save the API key

module.exports = Config;
