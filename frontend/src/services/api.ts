import axios from "axios";

const API = axios.create({
    baseURL: "https://moodsync-ai-v2.onrender.com"
});

export default API;