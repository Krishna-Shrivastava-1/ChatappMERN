import express from 'express'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import User from '../Models/User.js'
// import { verifytoken } from '../Middleware/verifytoken.js'
const app = express

const router = app.Router()
const secretKey = process.env.SecretKey || 'cbahbcheahecvhvevu487gbfacajjh'


export const verifytoken = (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1] || req.cookies.token
    if (!token) {
        return res.status(401).json({ message: "Authorization token is missing" })
    }
    try {
        const decode = jwt.verify(token, secretKey)
        req.userId = decode.id
        next()
    } catch (error) {
        return res.status(401).json({ message: "Invalid Token" })
    }
}


// Register Route
router.post('/register', async (req, res) => {
    const { name, email, password } = req.body
    try {
        const existinguser = await User.findOne({ email })
        if (existinguser) {
            return res.status(400).json({
                message: "User already exist",
                success: false
            })
        }

        const hashedpassword = await bcrypt.hash(password, 10)
        const newuser = new User({ name, email, password: hashedpassword })
        newuser.save()
        return res.status(200).json({
            message: "User Registered Successfully",
            success: true
        })


    } catch (error) {
        console.log(error)
        return res.status(500).json({
            message: "User failed to register",
            success: false
        })
    }
})






// Login Route

router.post('/login', async (req, res) => {
    const { email, password } = req.body
    try {
        const user = await User.findOne({ email })
        if (!user) {
            return res.status(400).json({
                message: "User not found",
                success: false
            })
        }
        const ispasswordcorrect = await bcrypt.compare(password, user.password)
        if (!ispasswordcorrect) {
            return res.status(400).json({
                message: "Invalid Credentials"

            })
        }
        const token = jwt.sign({ id: user._id }, secretKey, { expiresIn: '1d' })

        res.cookie('token', token, {
            httpOnly: true,
            secure: true,
            sameSite: 'None',
            maxAge: 24 * 60 * 60 * 1000
        })

        return res.status(201).json({
            message: `User Logged in Succesfully ${user.name}`,
            success: true,
            token: token
        })

    } catch (error) {
        console.log(error)
        return res.status(500).json({
            message: "User failed to login",
            success: false
        })
    }
})




// Logout Route


router.post('/logout', async (req, res) => {
    try {
        return res.cookie("token", "", {
            expires: new Date(0),
            httpOnly: true
        }).json({
            message: "User logged out successfully",
            success: true
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            message: "User not logout Successfully",
            success: false
        })
    }
})



// Get All Users

router.get('/alluser', async (req, res) => {
    try {
        const alluser = await User.find().select('-password')
        res.status(200).json(alluser)
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Failed to retrieve users', success: false });
    }
})


// Get Logged in user

router.get('/logged', verifytoken, async (req, res) => {
    try {
        const userId = req.userId
        const user = await User.findById(userId).select('-password');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json([user]);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Server error' });

    }
})


// fetchuser by id

router.get('/user/:id', verifytoken, async (req, res) => {
    try {
        const userId = req.params.id
        const user = await User.findById(userId).select('-password');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json([user]);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Server error' });

    }
})


// UpdateProfile

router.put('/:id', async (req, res) => {
    try {
        if (!req.body.descript) {
            return res.status(400).send({ message: 'Please fill correctly' })
        }
        const { id } = req.params
        const result = await User.findByIdAndUpdate(id, req.body)
        if (!result) {
            return res.status(404).json({ message: 'Profile not found' })
        }
        return res.status(200).send({ message: 'Profile Updated Succesfully' })
    } catch (error) {
        console.log(error.message)
        res.status(500).send({ message: error.message })
    }
})

export default router