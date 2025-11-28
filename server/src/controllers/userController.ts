import dotenv from 'dotenv';
import type { NextFunction, Request, Response } from 'express';
import User from '../models/UserModel';
import fs, { mkdirSync } from 'fs';
import path from 'path';

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
    const uploadsDir = path.join(process.cwd(), 'uploads', 'profile-photos');
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }
    const fileExtension = path.extname(file.originalname);
    console.log('fileExtension', fileExtension);
    const acceptedFileExtensios = ['.png', '.jpg', '.jpeg', '.svg', '.webpg'];
    if (!acceptedFileExtensios.includes(fileExtension)) {
      res.status(400).json({ success: false, errors: 'Only accept image files' });
      return;
    }
    const fileSize = file.size / (1024 * 1024);
    if (fileSize > 10) {
      res.status(400).json({ success: false, errors: 'File bigger than 10MB' });
      return;
    }
    const fileName = `profile-${userId}-${Date.now()}${fileExtension}`;
    const filePath = path.join(uploadsDir, fileName);
    fs.renameSync(file.path, filePath);
    const imageUrl = `${process.env.BACKEND_URL}/uploads/profile-photos/${fileName}`;
    const user = await User.findById(userId);
    if (!user) {
      fs.unlinkSync(filePath);
      res.status(403).json({ success: false, message: 'User does not exist' });
      return;
    }

    if (user.profilePhoto && user.profilePhoto.startsWith('/uploads/profile-photos/')) {
      const oldFilePath = path.join(process.cwd(), user.profilePhoto);
      if (fs.existsSync(oldFilePath)) {
        fs.unlinkSync(oldFilePath);
      }
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
    next(error);
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
