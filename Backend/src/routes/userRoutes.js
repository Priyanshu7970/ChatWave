import {Router} from 'express' 
import User from '../models/User.js';
import { fetchuser } from '../middlewares/authMiddlewares.js';
  const router =  Router();
 //  Get log in User details using: GET:"/api/users/getuser". Login required 
  router.get('/getuser',fetchuser,async(req,res)=>{
  try{  
      let userId = req.user.id;
       const user =  await User.findById(userId).select("-password") 
        res.status(200).json({success:true,user})
  }

  catch(error){
    console.error(error.message)
      res.status(500).send("Internal server error");
  }
})
  router.post('/updateuser',fetchuser,async(req,res)=>{
  try{  
      let userId = req.user.id;
       const user =  await User.findById(userId);
          user[0].username = req.body.username;
          user[0].password = req.body.password;
          user[0].email = req.body.email; 
          user.save(); 
          

        res.status(200).json({success:true,user})
  }

  catch(error){
    console.error(error.message)
      res.status(500).send("Internal server error");
  }
})
// api/users/allusers to get all the users
router.get('/allusers', fetchuser, async (req, res) => {
  try {
        const currentUserId = req.user.id; 

        const searchTerm = req.query.search; // Get the search term from the query string

        let query = { _id: { $ne: currentUserId } }; // Exclude the current user

        if (searchTerm) {
            query.username = { $regex: searchTerm, $options: 'i' };
        }

        // Execute the Mongoose find query
        const users = await User.find(query, 'username avatar'); 

        res.json(users);
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ message: 'Server error' });
    }
});
// to get the information about particul
router.get('/:userId', fetchuser, async (req, res) => {
  try {
        const currentUserId = req.user.id; 

        const searchTerm = req.query.search; // Get the search term from the query string

        let query = { _id: { $ne: currentUserId } }; // Exclude the current user

        if (searchTerm) {
            query.username = { $regex: searchTerm, $options: 'i' };
        }

        // Execute the Mongoose find query
        const user = await User.find(query, 'username avatar');  

        res.json({success:true,username:user[0].username,avatar:user[0].avatar});
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ message: 'Server error' });
    }
  })
export default router ;