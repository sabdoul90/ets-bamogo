const router = require('express').Router();

router.use('/auth', require('./auth'));
router.use('/roles', require('./role'));
router.use('/medias', require('./media'));
router.use('/clients', require('./client'));
router.use('/produits', require('./produit'));
router.use('/imports', require('./import'));
router.use('/ventes', require('./vente'));
router.use('/etablissements', require('./etablissement'));
router.use('/venteproduits', require('./venteproduit'));
router.use('/stats', require('./stats'));


module.exports = router;
