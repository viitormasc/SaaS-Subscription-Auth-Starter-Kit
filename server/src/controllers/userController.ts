import dotenv from 'dotenv';
import type { NextFunction, Request, Response } from 'express';
import cloudinary from '../middleware/cloudinary';
import User from '../models/UserModel';
dotenv.config();

export const updateUser = async (req: Request, res: Response, next: NextFunction) => {
  const userLoggedIn = req.user;
  const userId = userLoggedIn?._id;
  const { firstName, lastName, profilePhoto } = req.body;

  if (!userId) {
    res.status(400).json({ success: false, message: 'User not sent' });
    return;
  }

  try {
    const user = await User.findById(userId);
    if (!user) {
      res.status(400).json({ success: false, message: 'User does not exist' });
      return;
    }
    user.name = firstName + ' ' + lastName;
    user.profilePhoto = profilePhoto;
    await user.save();
    res.status(200).json({ success: true, message: 'User updated successfully' });
    return;
  } catch (error: any) {
    res.status(500).json({ success: false, errors: 'Internal error' });
    throw new Error(error);
  }
};

export const updateProfilePhoto = async (req: Request, res: Response, next: NextFunction) => {
  const userLoggedIn = req.user;
  const userId = userLoggedIn?._id;
  const file = req.file;

  if (!userId) {
    res.status(401).json({ success: false, message: 'Unauthorized' });
    return;
  }
  if (!file) {
    res.status(400).json({ success: false, message: 'Please send a image file' });
    return;
  }
  try {
    const cloudinaryResponse = await cloudinary.uploader.upload(file.path);
    const imageUrl = cloudinaryResponse.secure_url;
    const user = await User.findById(userId);
    if (!user) {
      res.status(401).json({ success: false, message: 'User does not exist' });
      return;
    }
    user.profilePhoto = imageUrl;
    await user.save();
    const userData = {
      name: user.name,
      email: user.email,
      profilePhoto: user.profilePhoto,
      _id: user._id,
    };
    res.status(200).json({ success: true, message: 'Profile picture updated successfully', user: { ...userData } });
    return;
  } catch (error: any) {
    console.log(error);
    res.status(500).json({ success: false, errors: 'Internal error' });
    throw new Error(error);
  }
};

export const deleteUser = async (req: Request, res: Response, next: NextFunction) => {
  const userLoggedIn = req.user;
  const userId = userLoggedIn?._id;
  if (!userId) {
    res.status(401).json({ success: false, message: 'Unauthorized' });
    return;
  }
  try {
    const user = await User.findByIdAndDelete(userId);
    if (!user) {
      res.status(401).json({ success: false, message: 'User does not exist' });
      return;
    }
    // await user.save();
    // const userData = {
    //   name: user.name,
    //   email: user.email,
    //   profilePhoto: user.profilePhoto,
    //   _id: user._id,
    // };
    res.status(200).json({ success: true, message: 'User Deleted successfully' });
    return;
  } catch (error: any) {
    console.log(error);
    res.status(500).json({ success: false, errors: 'Internal error' });
    throw new Error(error);
  }
};