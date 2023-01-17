const express = require("express")
const router = express.Router()
const { getBootcampsInRadius, getBootcamp, getBootcamps, createBootcamps, updateBootcamps, deleteBootcamps } = require("../controllers/bootcamps")
router
    .route("/radius/:zipcode/:distance")
    .get(getBootcampsInRadius)

router
    .route("/")
    .get(getBootcamps)
    .post(createBootcamps)

router
    .route("/:id")
    .get(getBootcamp)
    .put(updateBootcamps)
    .delete(deleteBootcamps)

module.exports = router;
