import {connect} from 'mongoose'
import {config} from 'dotenv' // dot.env for environmant variables
config(); 
 
 const connectDB = async()=>{
    const string = process.env.DATABASE_URL ; 
    await connect(string);
    console.log('Database connected sucessfully...');

} 
export default connectDB;