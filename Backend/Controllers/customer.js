const Customer = require('../Models/user');
const bcrypt = require('bcryptjs'); 
const mongoose = require('mongoose');
const jwt = require("jsonwebtoken");
const {sendVerificationEmail} = require("../utils/mailer");
require("dotenv").config();



exports.getCustomers = async (req, res) => {
    try {
        const customers = await Customer.find({role:'customer'});
        res.status(200).json(customers);
    }catch (error) {
        res.status(500).json(error);
    }
};

exports.getCustomerById = async(req, res) => {
    try {
        const id = req.query.id;
        const customer = await Customer.findOne({user_id:id, role:'customer'});

        if(!customer) return res.status(404).json("User not found");

        res.status(200).json(customer);
    }catch (error) {
        res.status(500).json(error);
    }
};

exports.getCustomerByEmail = async (req, res) => {
    try {
        const email = req.body.email;
        const customer = await Customer.findOne({email:email, role:'customer'});

        if(!customer) return res.status(404).json("User not found");

        res.status(200).json(customer);
    }catch (error) {
        res.status(500).json(error);
    }
    
};

exports.addCustomer = async(req, res) => {
    try {
        const {firstName, lastName, email, password,confirmPassword,address,phone} = req.body;

        const isUserExist = await Customer.findOne({email});

        if(isUserExist){
            return res.status(400).json({ message: "Customer with this email already exists." });
        }

        if(password !== confirmPassword){
            return res.status(400).json({message: "Passwords do not match"});
        }

        const hashedPassword = await bcrypt.hash(password,12);

        const customer = new Customer({
            firstName,
            lastName,
            email,
            password: hashedPassword,
            profilePic : req.file ? `/uploads/${req.file.filename}` : "",
            address,
            phone
        })
        await customer.save();
        
        const token = jwt.sign({ email }, process.env.SECRET_KEY, { expiresIn: "1h" });

        await sendVerificationEmail(email, token);
    
        res.status(200).json({ message: "Customer registered! Please check your email for verification." });
    }catch (error) {
        res.status(500).json(error);
        console.log(error);
    }
   
};

exports.updateCustomer = async(req, res) => {
    try {
        const {firstName, lastName,email,address,phone} = req.body;
        const user_id = req.body.userId; 
        
        const existingCustomer = await Customer.findOne({user_id});
        if (!existingCustomer) {
            return res.status(404).json({ message: "Customer not found" });
        }

        // If a new file is uploaded, use it; otherwise, keep the existing profilePic
        const profilePic = req.file ? `/uploads/${req.file.filename}` : existingCustomer.profilePic;

        const updateData = {
            firstName,
            lastName,
            email,
            address,
            phone,
            profilePic , 
        }

        const customer = await Customer.findOneAndUpdate({user_id},updateData, {new:true});
        if(!customer) return res.status(404).json("User not found");
        console.log(customer);
        res.json({ message: "Customer updated successfully", customer });
    }catch (error) {
        res.status(500).json(error);
    }
   
};

exports.updatePassword = async (req,res) => {
    try{
        const id = req.body.userId;
        const {password, confirmPassword} = req.body;

        if(password !== confirmPassword){
            return res.status(400).json({message: "Passwords do not match"});
        }

        const hashedPassword = await bcrypt.hash(password,12);
        const customer = await Customer.findOneAndUpdate({user_id: id},{password: hashedPassword},{new:true});

        res.status(200).json({message: "Password updated Successfully!"});
    }catch (error) {
        res.status(500).json(error);
    }
}

exports.updateCustomerPoints = async(req, res) => {
    try {
        const id = req.query.id;
        const points = req.body.points;
        const customer = await Customer.findOne({user_id:id, role: 'customer'});

        if(!customer){
            res.status(404).json({message: "Customer not found"})
        }
        const newPoints = customer.points + points;

        const customerUpdate = await Category.findOneAndUpdate({user_id: id, points: newPoints})

        res.status(200).json({message: "Points updated successfully"}, customerUpdate);
    }catch (error) {
        res.status(500).json(error);
    }

};

exports.deleteCustomer = async(req, res) => {
    try{
        const id = req.query.id;
        const customer = await Customer.findOneAndDelete({user_id: id});
        res.status(200).json({message: "Customer deleted successfully!"});
    }catch (error) {
        res.status(500).json(error);
    }
};


exports.getCustomerNameById = async(req, res) => {
    try {
        const id = req.query.id;
        const customer = await Customer.findOne({ user_id: id, role: 'customer' }).select('-password');

        if(!customer) return res.status(404).json("User not found");

        res.status(200).json(customer);
    }catch (error) {
        res.status(500).json(error);
    }
};