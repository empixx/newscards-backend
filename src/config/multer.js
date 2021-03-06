const multer = require('multer');
const crypto = require('crypto');
const path = require('path');

const dest = path.resolve(__dirname, '..', '..', 'uploads');

module.exports = {
  dest,
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, dest);
    },
    filename: (req, file, cb) => {
      crypto.randomBytes(16, (err, hash) => {
        if (err) cb(err);

        const extension = file.mimetype == 'image/png' ? '.png' : '.jpg';
        const filename = `${hash.toString('hex')}${extension}`;
        cb(null, filename);
      });
    },
  }),
  limits: {
    fileSize: 2 * 1024 * 1024,
  },
  fileFilter: (req, file, cb) => {
    const allowedMimes = ['image/jpeg', 'image/pjpeg', 'image/png'];

    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      const error = new multer.MulterError();
      error.code = 'UNSUPPORTED_FILE_TYPE';
      error.message = 'Unsupported file type';

      cb(error);
    }
  },
};
