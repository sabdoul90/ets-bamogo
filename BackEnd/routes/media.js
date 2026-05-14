const router = require('express').Router();
const mediaController = require('../controllers/media');
const upload = require('../middleware/uploads');

//router.use(auth);

router.get('/', mediaController.getMedias);
router.post('/', upload.single("file"), mediaController.mediaUploads);
//router.put('/:id', RoleController.updateRole);
router.get('/:id', mediaController.getMediaById);
router.delete('/:id', mediaController.deleteMedia);

module.exports = router;