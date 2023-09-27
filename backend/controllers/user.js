import User from "../models/user.js";
import { Op } from 'sequelize'


import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'


// register user
export const register = async (req, res) => {
    try {
        const { name, email, password, phonenumber } = req.body;
      // Check if a user with the same name or email already exists
        const existingUser = await User.findOne({
            where: {
                [Op.or]: [{ name }, { email }],
            },
        });

        if (existingUser) {
            return res.status(409).json('User already exists!');
        }

         // Hash the password
        const salt = bcrypt.genSaltSync(10);
        const hash = bcrypt.hashSync(password, salt);

        // Create a new user using Sequelize
        const newUser = await User.create({ name, email, password: hash, phonenumber });

        return res.status(200).json('User registered successfully');
    } catch (error) {
            console.error(error);
            return res.status(500).json('Internal server error');
        } 
};

// login user
export const login = async (req, res) => {
    try {
        const { name, password } = req.body;

        // Find the user by name using Sequelize
        const user = await User.findOne({ where: { name } });

        if (!user) {
            return res.status(404).json('User not found');
        }

        // Check the password
        const isPasswordCorrect = bcrypt.compareSync(password, user.password);

        if (!isPasswordCorrect) {
            return res.status(400).json('Wrong username or password');
        }

        // Generate a JWT token
        const token = jwt.sign({ id: user.id }, 'jwtkey');

        res.cookie('access_token', token, {
            httpOnly: true,
        });

        const responseData = {
            id: user.id,
            name: user.name,
            email: user.email,
            access_token: token,
        };

        return res.status(200).json(responseData);
    } catch (error) {
        console.error(error);
        return res.status(500).json('Internal server error');
    }
};




// logout user
export const logout = (req, res) => {
    try {
        res.clearCookie('access_token', {
            sameSite:"none",
            secure:true
        });

        return res.status(200).json('User has been logged out.');
    } catch (error) {
        console.error(error);
        return res.status(500).json('Internal server error');
    }
};

