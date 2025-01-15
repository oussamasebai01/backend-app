import mongoose from 'mongoose'


const databaseName = 'emarkethub';
const connectDB = () => {
  //mongoose.connect('mongodb://127.0.0.1:27017/stock?retryWrites=true&w=majority&appName=stock')
  mongoose
      .connect(`mongodb+srv://oussama:21824847Sebai@emarkethub.smyuf.mongodb.net/?retryWrites=true&w=majority&appName=emarkethub`)
      .then(() => {
        console.log(`Connected to ${databaseName}`);
      })
      .catch(err => {
        console.log(err);
      });
}
  export default  connectDB; 
