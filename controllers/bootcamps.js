const asyncHandler = require("../middleware/asyncHandler")
const bootCamp = require("../models/bootcamp")

const errorResponse = require("../utils/errorResponse")

exports.getBootcamps = asyncHandler(async (req, res, next) => {
    let query
    //Copy req.query
    let reqQuery = { ...req.query }

    //fields to remove
    const removeFields = ['select', 'sort']
    removeFields.forEach(params => delete reqQuery[params])

    //create query string
    let queryStr = JSON.stringify(reqQuery)
    //create operators like $gte $gt
    queryStr = queryStr.replace(/\b(lt|lte|gt|gte|in)\b/g, match => `$${match}`)
    query = bootCamp.find(JSON.parse(queryStr))

    //For Select Fields
    if (req.query.select) {
        const fields = req.query.select.split(',').join(' ')
        query = query.select(fields)
    }
    //For Sort Field
    if (req.query.sort) {
        const fields = req.query.sort.split(',').join(' ')
        query = query.sort(fields)
    } else {
        query = query.sort('-createdAt')
    }
    //For pagination
    const page = parseInt(req.query.page, 10) || 1
    const limit = parseInt(req.query.limit, 10) || 100
    const skip = (page - 1) * limit
    query = query.skip(skip).limit(limit)
    // console.log(req.query)
    const bootcamps = await query
    res.status(201).json({ success: true, count: bootcamps.length, data: bootcamps })
})

exports.getBootcamp = asyncHandler(async (req, res, next) => {
    const bootcamp = await bootCamp.findById(req.params.id)
    if (!bootCamp) {
        return next(new errorResponse(`Bootcamp not found with id of ${req.params.id}`, 404))
    }
    res.status(201).json({ success: true, data: bootcamp })
})

exports.createBootcamps = asyncHandler(async (req, res, next) => {
    const bootcamp = await bootCamp.create(req.body)
    res.status(201).json({ success: true, data: bootcamp })
})

exports.updateBootcamps = asyncHandler(async (req, res, next) => {
    const bootcamp = await bootCamp.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    })
    if (!bootCamp) {
        return next(new errorResponse(`Bootcamp not found with id of ${req.params.id}`, 404))
    }
    res.status(201).json({ success: true, data: bootcamp })
})

exports.deleteBootcamps = asyncHandler(async (req, res, next) => {
    const bootcamp = await bootCamp.findByIdAndDelete(req.params.id)
    if (!bootCamp) {
        return next(new errorResponse(`Bootcamp not found with id of ${req.params.id}`, 404))
    }
    res.status(200).json({ success: true, data: bootcamp })
})

exports.getBootcampsInRadius = asyncHandler(async (req, res, next) => {
    const { zipcode, distance } = req.params;

    // Get lat/lng from geocoder
    const loc = await geocoder.geocode(zipcode);
    const lat = loc[0].latitude;
    const lng = loc[0].longitude;

    // Calc radius using radians
    // Divide dist by radius of Earth
    // Earth Radius = 3,963 mi / 6,378 km
    const radius = distance / 3963;

    const bootcamps = await Bootcamp.find({
        location: { $geoWithin: { $centerSphere: [[lng, lat], radius] } }
    });

    res.status(200).json({
        success: true,
        count: bootcamps.length,
        data: bootcamps
    });
});