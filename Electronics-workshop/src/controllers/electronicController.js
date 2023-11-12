const router = require("express").Router();
const { isAuth } = require("../middlewares/authMiddleware.js");
const electronicService = require("../services/electronicService.js")
const { ExactErrorMsgs } = require("../utils/errorHandler.js")

router.get("/catalog", async (req, res) => {
    const electronyc = await electronicService.getAll().lean();

    res.render('electronic/catalog', { electronyc })
});

router.get("/create", isAuth, (req, res) => {
    res.render('electronic/create')
});

router.post("/create", async (req, res) => {
    const { name, type, damages, description, image, production, exploitation, price } = req.body
    const payload = { name, type, damages, description, image, production, exploitation, price, owner: req.user }
    try {
        await electronicService.create(payload)
        res.redirect('/electronics/catalog')
    } catch (error) {
        const errorMessages = ExactErrorMsgs(error)
        res.status(404).render('electronic/create', { errorMessages })
    }
});

router.get("/:electronicId/details", async (req, res) => {
    const { electronicId } = req.params
    const electronic = await electronicService.singleElectronic(electronicId).lean()
    const { user } = req
    const { owner } = electronic
    const isOwner = user?._id === owner.toString()
    const hasBuyed = electronic.buyingList.some((v) => v?._id.toString() === user?._id)
    // const jointEmailsOfOwners = creature.buyingList.map(v => v.email).join(", ")

    res.render('electronic/details', { electronic, isOwner, hasBuyed })

});

router.get("/:electronicId/edit", isAuth, async (req, res) => {
    const { electronicId } = req.params
    const electronic = await electronicService.singleElectronic(electronicId).lean()
    res.render('electronic/edit', { electronic })
});

router.post("/:electronicId/edit", async (req, res) => {
    const { electronicId } = req.params
    const { name, type, damages, description, image, production, exploitation, price } = req.body
    const payload = { name, type, damages, description, image, production, exploitation, price, owner: req.user }

    const creature = await electronicService.updateElectronic(electronicId, payload)

    res.redirect(`/electronics/${electronicId}/details`,)
});

router.get("/:electronicId/delete", isAuth, async (req, res) => {
    const { electronicId } = req.params
    await electronicService.deleteElectronic(electronicId)
    res.redirect('/electronics/catalog')
});

router.get("/:electronicId/buy", isAuth, async (req, res) => {
    const { electronicId } = req.params
    const { _id } = req.user
    await electronicService.addToBuyingList(electronicId, _id)
    res.redirect(`/electronics/${electronicId}/details`)
})

router.get("/search",isAuth, async (req, res) => {
    res.render("electronic/search",);
});

router.post("/search", async (req, res) => {
    const { name, type } = req.body;
    const FileterElectronic = await electronicService.getFilteredElectronics(name, type)
    res.render("electronic/search", {FileterElectronic});
});

module.exports = router