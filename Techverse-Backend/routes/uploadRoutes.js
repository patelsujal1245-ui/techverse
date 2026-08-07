import path from 'path'
import fs from 'fs'
import express from 'express'
import multer from 'multer'

const router = express.Router()

// Ensure uploads directory exists
if (!fs.existsSync('uploads')) {
  fs.mkdirSync('uploads', { recursive: true })
}

const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, 'uploads/')
  },
  filename(req, file, cb) {
    cb(
      null,
      `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`
    )
  },
})

function fileFilter(req, file, cb) {
  const filetypes = /jpe?g|png|webp|svg/
  const mimetypes = /image\/jpeg|image\/png|image\/webp|image\/svg\+xml/

  const extname = filetypes.test(path.extname(file.originalname).toLowerCase())
  const mimetype = mimetypes.test(file.mimetype)

  if (extname && mimetype) {
    cb(null, true)
  } else {
    cb(new Error('Images only (jpeg, jpg, png, webp, svg)!'), false)
  }
}

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
})

router.post('/', upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded' })
  }
  res.status(200).json({
    message: 'Image uploaded successfully',
    url: `/uploads/${req.file.filename}`,
  })
})

export default router
