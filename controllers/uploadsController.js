const path = require('path');
const { StatusCodes } = require('http-status-codes');
const CustomError = require('../errors');
const cloudinary = require('cloudinary').v2;
const fs = require('fs');


const uploadProductImageLocal = async (req, res) => {

  console.log(req);
  console.log(req.files);
  if (!req.files) {
    throw new CustomError.BadRequestError('No File Uploaded');
  }
  const productImage = req.files.image;

  if (!productImage.mimetype.startsWith('image')) {
    throw new CustomError.BadRequestError('Please Upload an Image');
  }
  const maxSize = 1024 * 1024;

  if (productImage.size > maxSize) {
    throw new CustomError.BadRequestError('Please Upload Image < 1KB');
  }

  const imagePath = path.join(__dirname, `../public/uploads/${productImage.name}`);

  await productImage.mv(imagePath);
  return res.status(StatusCodes.OK).json({ image: { src: `/uploads/${productImage.name}` } });
};


const uploadProductImage = async (req, res) => {
  const imageTempFilePath = req.files.image.tempFilePath;
  const result = await cloudinary.uploader.upload(imageTempFilePath, {
    use_filename: true,
    folder: 'express-file-upload'
  });
  fs.unlinkSync(imageTempFilePath);
  return res.status(StatusCodes.OK).json({ image: { src: result.secure_url } });
};

module.exports = {
  uploadProductImageLocal,
  uploadProductImage
};


