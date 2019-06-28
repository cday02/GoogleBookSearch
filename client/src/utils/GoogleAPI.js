import Axios from "axios";

const URL="https://www.googleapis.com/books/v1/volumes?q="
export default {
    searchBook: function(query){
    return Axios.get(`${URL}${query}`)
    }
}


