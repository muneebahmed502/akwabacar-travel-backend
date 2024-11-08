import { oauth2client } from "../utils/googleConfig.mjs"
import googleUser from "../models/googleUser.mjs"
import axios from "axios"
import jwt  from "jsonwebtoken"

export const googleLogin = async(req,res) => {
try{
    const {code} = req.query
    const googleRes = await oauth2client.getToken(code)
    oauth2client.setCredentials(googleRes.tokens)
    const userRes = await axios.get(
        `https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${googleRes.tokens.access_token}`,
    )
    console.log('userRes ==>',userRes)
    const {email,name,picture} = userRes.data
    let user = await googleUser.findOne({email})
    if (!user){
        user = await googleUser.create({email,name,image:picture})
    }
    const { _id} = user
    const token = jwt.sign({
        _id,
        email,
    }, "secret");
    
    return res.status(200).json({
        message:'success',
        token,
        user
    })
} catch (error){
res.status(500).json({
    message : "internal server error"
})
}
}