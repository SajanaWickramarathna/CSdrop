const CustomerSupporter = require('../Models/user');
const bcrypt = require('bcryptjs'); 
const emailSender = require('../utils/mailer');
require("dotenv").config();
const jwt = require("jsonwebtoken");

exports.getCustomerSupporter = async(req,res) => {
    try {
        const customerSupporters = await CustomerSupporter.find({role: "customer_supporter"});
        if(!customerSupporters) {
            return res.status(404).json({message: "No customerSupporters found"});
        }
        res.status(200).json(customerSupporters);
    }catch (error) {
        res.status(500).json({message: "Error fetching customerSupporters"});
    }
}

exports.getCustomerSupporterById = async(req, res) => {
    try {
        const id = req.query.id;
        const customerSupporter = await CustomerSupporter.findById(id);
        if(!customerSupporter) {
            return res.status(404).json({message: "CustomerSupporter not found"});
        }
        res.status(200).json(customerSupporter);
    }catch (error) {
        res.status(500).json({message: "Error fetching customerSupporter"});
    }
};

exports.getCustomerSupporterByEmail = async (req, res) => {
    try {
        const email = req.body.email;
        const customerSupporter = await CustomerSupporter.findOne({email:email, role:'customer_supporter'});

        if(!customerSupporter) return res.status(404).json("CustomerSupporter not found");

        res.status(200).json(customerSupporter);
    }catch (error) {
        res.status(500).json(error);
    }
    
};

exports.addCustomerSupporter = async(req,res) => {
    try {
        const {firstName, lastName, email, password,confirmPassword,address,phone} = req.body;

        const isUserExist = await CustomerSupporter.findOne({email});

        if(isUserExist){
            return res.status(400).json({ message: "Customer Supporter with this email already exists." });
        }

        if(password !== confirmPassword){
            return res.status(400).json({message: "Passwords do not match"});
        }

        const hashedPassword = await bcrypt.hash(password,12);
        
        const customerSupporter = new CustomerSupporter({
            firstName,
            lastName,
            email,
            password: hashedPassword,
            profilePic : req.file ? `/uploads/${req.file.filename}` : "",
            address,
            phone,
            role: 'customer_supporter'
        })
        await customerSupporter.save();

        const token = jwt.sign({ email }, process.env.SECRET_KEY, { expiresIn: "1h" });
        await emailSender.sendAccountCredentitals(firstName,lastName,email,address,phone,password);
        await emailSender.sendVerificationEmail(email,token);
        res.json({ message: "Customer Supporter SignUp successfully", customerSupporter });
    }catch (error) {
        res.status(500).json(error);
    }
   
}


exports.updateCustomerSupporter = async(req,res) => {
    try {
        const {firstName, lastName,email,address,phone} = req.body;
        const user_id = req.body.userId; 
        
        const existingCustomerSupporter = await CustomerSupporter.findOne({user_id});
        if (!existingCustomerSupporter) {
            return res.status(404).json({ message: "Inventory Manager not found" });
        }

        // If a new file is uploaded, use it; otherwise, keep the existing profilePic
        const profilePic = req.file ? `/uploads/${req.file.filename}` : existingCustomerSupporter.profilePic;

        const updateData = {
            firstName,
            lastName,
            email,
            address,
            phone,
            profilePic , 
        }

        const customerSupporter = await CustomerSupporter.findOneAndUpdate({user_id},updateData, {new:true});
        if(!customerSupporter) return res.status(404).json("User not found");
        console.log(customerSupporter);
        res.json({ message: "Inventory Manager updated successfully", customerSupporter });
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
        const customerSupporter = await CustomerSupporter.findOneAndUpdate({user_id: id},{password: hashedPassword},{new:true});

        res.status(200).json({message: "Password updated Successfully!"});
    }catch (error) {
        res.status(500).json(error);
    }
}

exports.deleteCustomerSupporter = async(req,res) => {
    try {
        const id = req.query.id;
        const customerSupporter = await CustomerSupporter.findByIdAndDelete(id);
        res.json({message: "CustomerSupporter deleted successfully"});
    }catch (error) {
        res.status(500).json({message: "Error deleting customerSupporter"});
    }
}
