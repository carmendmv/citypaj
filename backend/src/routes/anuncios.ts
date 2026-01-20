import { Router, Request, Response } from 'express';
import { body, query, param } from 'express-validator';
import { validate } from '../middleware/validation';
import { auth } from '../middleware/auth';
import { upload } from '../middleware/upload';
import {
  getAnuncios,
  getAnuncioById,
  createAnuncio,
  updateAnuncio,
  deleteAnuncio,
  hideAnuncio,
  searchAnuncios,
  toggleFavorito,
  incrementarVistas,
} from '../controllers/anuncios';

const router = Router();

// Validaciones
const createAnuncioValidation = [
  body('titulo')
    .isLength({ min: 5, max: 200 })
    .withMessage('El título debe tener entre 5 y 200 caracteres')
    .trim()
    .escape(),
  body('descripcion')
    .isLength({ min: 20, max: 2000 })
    .withMessage('La descripción debe tener entre 20 y 2000 caracteres')
    .trim(),
  body('categoria')
    .isIn(['educacion', 'empleo', 'vivienda', 'ocio', 'servicios', 'intercambios'])
    .withMessage('Categoría no válida'),
  body('subcategoria')
    .optional()
    .isString()
    .trim(),
  body('comunidad_autonoma')
    .isString()
    .isLength({ min: 2 })
    .withMessage('La comunidad autónoma es obligatoria'),
  body('provincia')
    .isString()
    .isLength({ min: 2 })
    .withMessage('La provincia es obligatoria'),
  body('barrio')
    .optional()
    .isString()
    .trim(),
  body('precio')
    .optional()
    .isFloat({ min: 0, max: 999999.99 })
    .withMessage('El precio debe ser un número positivo'),
  body('modalidad')
    .isIn(['venta', 'regalo', 'intercambio', 'servicio'])
    .withMessage('Modalidad no válida'),
  body('contacto_email')
    .isBoolean()
    .withMessage('contacto_email debe ser booleano'),
  body('contacto_telefono')
    .isBoolean()
    .withMessage('contacto_telefono debe ser booleano'),
  body('contacto_anonimo')
    .isBoolean()
    .withMessage('contacto_anonimo debe ser booleano'),
];

const updateAnuncioValidation = [
  body('titulo')
    .optional()
    .isLength({ min: 5, max: 200 })
    .withMessage('El título debe tener entre 5 y 200 caracteres')
    .trim()
    .escape(),
  body('descripcion')
    .optional()
    .isLength({ min: 20, max: 2000 })
    .withMessage('La descripción debe tener entre 20 y 2000 caracteres')
    .trim(),
  body('categoria')
    .optional()
    .isIn(['educacion', 'empleo', 'vivienda', 'ocio', 'servicios', 'intercambios'])
    .withMessage('Categoría no válida'),
  body('subcategoria')
    .optional()
    .isString()
    .trim(),
  body('comunidad_autonoma')
    .optional()
    .isString()
    .isLength({ min: 2 })
    .withMessage('La comunidad autónoma es obligatoria'),
  body('provincia')
    .optional()
    .isString()
    .isLength({ min: 2 })
    .withMessage('La provincia es obligatoria'),
  body('barrio')
    .optional()
    .isString()
    .trim(),
  body('precio')
    .optional()
    .isFloat({ min: 0, max: 999999.99 })
    .withMessage('El precio debe ser un número positivo'),
  body('modalidad')
    .optional()
    .isIn(['venta', 'regalo', 'intercambio', 'servicio'])
    .withMessage('Modalidad no válida'),
  body('contacto_email')
    .optional()
    .isBoolean()
    .withMessage('contacto_email debe ser booleano'),
  body('contacto_telefono')
    .optional()
    .isBoolean()
    .withMessage('contacto_telefono debe ser booleano'),
  body('contacto_anonimo')
    .optional()
    .isBoolean()
    .withMessage('contacto_anonimo debe ser booleano'),
];

const queryValidation = [
  query('pagina')
    .optional()
    .isInt({ min: 1 })
    .withMessage('La página debe ser un número entero positivo'),
  query('limite')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('El límite debe ser entre 1 y 100'),
  query('categoria')
    .optional()
    .isString()
    .trim(),
  query('subcategoria')
    .optional()
    .isString()
    .trim(),
  query('comunidad_autonoma')
    .optional()
    .isString()
    .trim(),
  query('provincia')
    .optional()
    .isString()
    .trim(),
  query('modalidad')
    .optional()
    .isIn(['venta', 'regalo', 'intercambio', 'servicio']),
  query('precio_min')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('El precio mínimo debe ser un número positivo'),
  query('precio_max')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('El precio máximo debe ser un número positivo'),
  query('solo_con_fotos')
    .optional()
    .isBoolean()
    .withMessage('solo_con_fotos debe ser booleano'),
  query('orden')
    .optional()
    .isIn(['relevancia', 'fecha_asc', 'fecha_desc', 'precio_asc', 'precio_desc'])
    .withMessage('Orden no válido'),
];

const searchValidation = [
  query('q')
    .isLength({ min: 2, max: 100 })
    .withMessage('La búsqueda debe tener entre 2 y 100 caracteres')
    .trim(),
  ...queryValidation,
];

// Rutas públicas
router.get('/', validate(queryValidation), getAnuncios);
router.get('/search', validate(searchValidation), searchAnuncios);
router.get('/:id', validate([
  param('id').isUUID().withMessage('ID de anuncio no válido'),
]), getAnuncioById);

// Incrementar vistas (público pero con tracking)
router.post('/:id/vistas', validate([
  param('id').isUUID().withMessage('ID de anuncio no válido'),
]), incrementarVistas);

// Rutas protegidas - requieren autenticación
router.use(auth); // Aplicar middleware de autenticación a todas las rutas siguientes

router.post('/', 
  upload.array('imagenes', 6), // Máximo 6 imágenes
  validate(createAnuncioValidation),
  createAnuncio
);

router.put('/:id',
  validate([
    param('id').isUUID().withMessage('ID de anuncio no válido'),
    ...updateAnuncioValidation,
  ]),
  updateAnuncio
);

router.delete('/:id',
  validate([
    param('id').isUUID().withMessage('ID de anuncio no válido'),
  ]),
  deleteAnuncio
);

// Ocultar anuncio (sin eliminar de la base de datos)
router.patch('/:id/ocultar',
  validate([
    param('id').isUUID().withMessage('ID de anuncio no válido'),
    body('ocultar').isBoolean().withMessage('ocultar debe ser booleano'),
  ]),
  hideAnuncio
);

// Favoritos
router.post('/:id/favorito',
  validate([
    param('id').isUUID().withMessage('ID de anuncio no válido'),
  ]),
  toggleFavorito
);

// Subir imágenes a un anuncio existente
router.post('/:id/imagenes',
  upload.array('imagenes', 6),
  validate([
    param('id').isUUID().withMessage('ID de anuncio no válido'),
  ]),
  async (_req: Request, res: Response) => {
    // TODO: Implementar subida de imágenes adicional
    res.json({ message: 'Subida de imágenes adicional no implementada aún' });
  }
);

// Eliminar imagen específica
router.delete('/:id/imagenes/:imagenId',
  validate([
    param('id').isUUID().withMessage('ID de anuncio no válido'),
    param('imagenId').isUUID().withMessage('ID de imagen no válido'),
  ]),
  async (_req: Request, res: Response) => {
    // TODO: Implementar eliminación de imagen específica
    res.json({ message: 'Eliminación de imagen específica no implementada aún' });
  }
);

export { router as anunciosRoutes };
