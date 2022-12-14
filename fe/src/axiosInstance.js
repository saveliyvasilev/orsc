import axios from "axios";

var getBaseUrl = () => {
    let hostname = window.location.hostname;
    return `http://${hostname}:3001`;
};

export default axios.create({
    baseURL: getBaseUrl(),
});
