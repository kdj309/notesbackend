var jwt = require('jsonwebtoken');
require('dotenv').config()
const jwtkey = 'Kdj@309'
function Fetchuser(req, res, next) {
    const token = req.header('auth-token')
    if (!token) {
        return res.status(401).send("please authenticate yourself")
    }
    try {
        const data = jwt.verify(token, jwtkey)
        req.id = data.id
        next()
    } catch (error) {
        return res.status(500).send("some internal error occured")
    }

}
module.exports = Fetchuser




export function authenticate(data, next) {
    if (typeof window != undefined) {
        //console.log(document.cookie);
        localStorage.setItem('token', data.token)
        console.log(data);
        localStorage.setItem("signinuser", JSON.stringify({ email: data.Email, id: data.id, Name: data.name, role: data.role, authtoken: data.token }))
        next()
    }
}

exports.isAdmin = () => {

}