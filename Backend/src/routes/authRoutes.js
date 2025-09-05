import { Router } from 'express';  
const router = Router() ;  
import { body } from 'express-validator';  // npm express validator 
import { checkUser, loginUser, registerUser } from '../controllers/authController.js';



router.post('/register',[body('email').isEmail(), body('password').isLength({ min: 6 })],registerUser)    
// Aunthenticate a user using : POST "/api/auth/login" now we are checking whether a user of email or passoword exist or not  
router.post('/check-username',checkUser);

router.post('/login', [
    body('email').isEmail().withMessage('Please enter a valid email address'),
    body('password').isLength({ min: 5 }).withMessage('Password must be at least 5 characters long'),
], loginUser);


export default router ;