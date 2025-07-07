const jwt = require('jsonwebtoken');
const emailSender = require('../utils/mailer');
const Admin = require('../Models/user');
const bcrypt = require('bcryptjs'); 
require("dotenv").config();


exports.getAdmin = async(req,res) => {
    try {
        const admins = await Admin.find({role: "admin"});
        if(!admins) {
            return res.status(404).json({message: "No admins found"});
        }
        res.status(200).json(admins);
    }catch (error) {
        res.status(500).json({message: "Error fetching admins"});
    }
}

exports.getAdminById = async(req, res) => {
    try {
        const id = req.query.id;
        const admin = await Admin.findOne({user_id:id});
        if(!admin) {
            return res.status(404).json({message: "Admin not found"});
        }
        res.status(200).json(admin);
    }catch (error) {
        res.status(500).json({message: "Error fetching admin"});
    }
};

exports.getAdminByEmail = async (req, res) => {
    try {
        const email = req.body.email;
        const admin = await Admin.findOne({email:email, role:'admin'});

        if(!admin) return res.status(404).json("Admin not found");

        res.status(200).json(admin);
    }catch (error) {
        res.status(500).json(error);
    }
    
};

exports.addAdmin = async(req,res) => {
    try {
        const {firstName, lastName, email, password,confirmPassword,address,phone} = req.body;

        const isUserExist = await Admin.findOne({email});

        if(isUserExist){
            return res.status(400).json({ message: "Admin with this email already exists." });
        }

        if(password !== confirmPassword){
            return res.status(400).json({message: "Passwords do not match"});
        }

        const hashedPassword = await bcrypt.hash(password,12);

        const admin = new Admin({
            firstName,
            lastName,
            email,
            password: hashedPassword,
            profilePic : req.file ? `/uploads/${req.file.filename}` : "",
            address,
            phone,
            role: 'admin'
        })
        await admin.save();

        const token = jwt.sign({ email }, process.env.SECRET_KEY, { expiresIn: "1h" });
        await emailSender.sendAccountCredentitals(firstName,lastName,email,address,phone,password);
        await emailSender.sendVerificationEmail(email,token);

        res.json({ message: "Admin SignUp successfully", admin });
    }catch (error) {
        res.status(500).json(error);
    }
   
}


exports.updateAdmin = async(req,res) => {
    try {
        const {firstName, lastName,email,address,phone} = req.body;
        const user_id = req.body.userId; 
        
        const existingAdmin = await Admin.findOne({user_id});
        if (!existingAdmin) {
            return res.status(404).json({ message: "Admin not found" });
        }

        // If a new file is uploaded, use it; otherwise, keep the existing profilePic
        const profilePic = req.file ? `/uploads/${req.file.filename}` : existingAdmin.profilePic;

        const updateData = {
            firstName,
            lastName,
            email,
            address,
            phone,
            profilePic , 
        }

        const admin = await Admin.findOneAndUpdate({user_id},updateData, {new:true});
        if(!admin) return res.status(404).json("User not found");
        console.log(admin);
        res.json({ message: "Admin updated successfully", admin });
    }catch (error) {
        res.status(500).json(error);
    }
   
}

exports.updatePassword = async (req,res) => {
    try{
        const id = req.body.userId;
        const {password, confirmPassword} = req.body;

        if(password !== confirmPassword){
            return res.status(400).json({message: "Passwords do not match"});
        }

        const hashedPassword = await bcrypt.hash(password,12);
        const admin = await Admin.findOneAndUpdate({user_id: id},{password: hashedPassword},{new:true});

        res.status(200).json({message: "Password updated Successfully!"});
    }catch (error) {
        res.status(500).json(error);
    }
}

exports.deleteAdmin = async(req,res) => {
    try {
        const user_id = req.body.userId; 
        const admin = await Admin.findOneAndDelete({user_id});
        res.json({message: "Admin deleted successfully"});
    }catch (error) {
        res.status(500).json({message: "Error deleting admin"});
    }
}
