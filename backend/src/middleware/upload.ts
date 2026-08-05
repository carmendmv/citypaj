import multer from 'multer';

// Configuración de Multer para almacenamiento temporal
const storage = multer.memoryStorage();

// Filtro de archivos - solo imágenes
const fileFilter = (_req: any, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  const allowedMimes = [
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/webp',
  ];

  if (allowedMimes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Tipo de archivo no permitido. Solo se permiten imágenes (JPEG, PNG, WebP)'));
  }
};

// Configuración de Multer
export const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB por archivo
    files: 6, // máximo 6 archivos
  },
});

// Middleware para subir múltiples imágenes
export const uploadImages = upload.array('imagenes', 6);

// Middleware para subir una sola imagen
export const uploadSingleImage = upload.single('imagen');
