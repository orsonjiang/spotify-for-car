import express from 'express';
import queryString from 'query-string';
import axios from 'axios';

let client_id = 'bcda302975934602abe93b7c80a76c79';
let redirect_uri = 'http://localhost:8888/callback';
const port = 8888

let app = express();

function generateRandomString(length) {
    let result = '';
    let characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}

app.get('/login', function (req, res) {
    let state = generateRandomString(16);
    let scope = 'user-read-playback-state user-modify-playback-state';
    let query = queryString.stringify({
        response_type: 'code',
        client_id: client_id,
        scope: scope,
        redirect_uri: redirect_uri,
        state: state
    });
    console.log(query)

    res.redirect('https://accounts.spotify.com/authorize?' + query);
});

app.get("/callback", async function (req, res) {
    let data = queryString.stringify({
        'grant_type': 'authorization_code',
        'code': req.query.code,
        'redirect_uri': 'http://localhost:8888/callback'
    });
    let config = {
        method: 'post',
        url: 'https://accounts.spotify.com/api/token',
        headers: {
            'Authorization': 'Basic YmNkYTMwMjk3NTkzNDYwMmFiZTkzYjdjODBhNzZjNzk6ZjQxYjExYjVlOTAwNDU5OThhMGFjYjc5NGYyNDAxYjc=',
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        data: data
    };

    try {
        let response = await axios(config);
        return res.status(200).json(response.data);
    } catch (err) {
        return res.status(400).json(err);
    }
});

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})