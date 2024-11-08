import express from 'express';
import {googleLogin} from '../controller/authController.mjs'
const router = express.Router();

router.get('/test',(req,res)=>{
  res.send('Hello World');
})
router.get('/google',googleLogin)
export default router;
