import { Router } from "express"
import { validateAdminLogin, validateCreateAdmin } from "../zod/adminSchema";
import { prisma } from "../db/client";
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { verifyAdmin } from "../middlewares/admin/verifyAdmin";

const router = Router();


router.post('/create' ,verifyAdmin, async(req, res) => {
    try {
      const adminValidate = validateCreateAdmin.safeParse(req.body)
      if(!adminValidate.success){
        return res.status(400).json({success: false, message: "Invalid details"})
      }
      const {name, email, password, role} = adminValidate.data
      const existingAdmin = await prisma.admin.findFirst({
        where: {
          email
        }
      });
      if(existingAdmin){
        return res.status(400).json({success: false, message: "Admin already exists"});
      }
      const salt = await bcrypt.genSalt(10);
      const hash = await bcrypt.hash(password, salt)
      const admin = await prisma.admin.create({
        data: {
          name, email, password: hash, role: role || "admin"
        }
      })
      return res.status(200).json({success: false, message: "Admin created successfully", admin})
    } catch (error) {
      return res.status(500).json({success: false, message: "Internal server error", error})
    }
  })
  
  
  
  // @route   POST /api/admin/login
  // @desc    Login admin and return token
  // @access  Public
  
  router.post('/login', async(req, res) => {
    const adminValidate = validateAdminLogin.safeParse(req.body);
    if(!adminValidate.success){
        return res.status(400).json({success: false, message: "Inavlid credentials"})
    }
    const {email, password} = adminValidate.data
    try {
      const admin = await prisma.admin.findUnique({
        where: {
          email
        }
      });
      if(!admin){
        return res.status(400).json({success: false, message: 'Invalid email or password'})
      }
      const isMatch = await bcrypt.compare(password, admin.password)
      if(!isMatch){
        return res.status(400).json({success: false, message: "Inavlid email or password"})
      }
      const token = jwt.sign( { id: admin.adminId, role: admin.role }, 
        process.env.JWT_SECRET || "secret"
      );
  
      return res.status(200).json({
        token, // Return token to the client
        admin: {
          name: admin.name,
          email: admin.email,
          password: admin.password,
          role: admin.role
        }
      });
  
    } catch (error) {
      return res.status(500).json({success: false, message: "Internal server error"})
    }
  })


  export default router;