import mongoose from 'mongoose';

const AdminSchema = new mongoose.Schema({
  username: { type: String, required: true },
  password: { type: String, required: true }, // hashed
});

export default mongoose.model('Admin', AdminSchema);
