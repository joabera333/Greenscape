const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');
const APIFeatures = require('./../utils/apiFeatures');


exports.deleteOne = Model => catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndDelete(req.params.id);
    if (!doc) {
        return next(new AppError('No document found with that ID', 404));
    }
    res.status(204).json({
        status: 'success',
        data: null,
    });
});

exports.updateOne = Model => catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
    });

    if (!doc) {
        return next(new AppError('No document found with that ID', 404));
    }
    res.status(200).json({
        status: 'success',
        data: {
            data: doc
        },
    });
});

exports.createOne = Model => catchAsync(async (req, res, next) => {
    const doc = await Model.create(req.body);

    res.status(201).json({
        status: 'success',
        data: {
            data: doc,
        },
    });
});


exports.getOne = (Model, popOptions) => catchAsync(async (req, res, next) => {
    let query = Model.findById(req.params.id)
    if (popOptions) query = query.populate(popOptions);
    const doc = await query;

    //   const doc = await Model.findById(req.params.id).populate('reviews').populate({
    //     path: 'guides',
    //     select: '-__v -passwordChangedAt'
    //   });

    if (!doc) {
        return next(new AppError('No document found with that ID', 404));
    }
    //Tour.findOne({_id: req.params.id })
    res.status(200).json({
        status: 'success',
        //results: tours.length,
        data: {
            data: doc,
        },
    });
});

exports.getAll = Model => catchAsync(async (req, res) => {
    //console.log(req.requestTime);

    //console.log(req.query);

    // BUILD QUERY
    //1A) Filtering
    // const queryObj = { ...req.query };
    // const excludedFields = ['page', 'sort', 'limit', 'fields'];
    // excludedFields.forEach((el) => delete queryObj[el]);

    // //1B) Advanced filtering
    // let queryStr = JSON.stringify(queryObj);
    // queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);

    // console.log(JSON.parse(queryStr));

    // let query = Tour.find(
    //   JSON.parse(queryStr),

    //   //   {
    //   //   duration: 5,
    //   //   difficulty: 'easy',
    //   // }
    // );
    //2) Sorting
    // if (req.query.sort) {
    //   const sortBy = req.query.sort.split(',').join('');
    //   console.log(sortBy);
    //   query = query.sort(sortBy);
    //   //sort('price ratingsAverage)
    // } else {
    //   query = query.sort('-createdAt');
    // }

    // 3) Field limiting
    // if (req.query.fields) {
    //   const fields = req.query.fields.split(',').join(' ');
    //   query = query.select(fields);
    // } else {
    //   query = query.select('-__v');
    // }

    // 4) Pagination

    // const page = req.query.page * 1 || 1;
    // const limit = req.query.limit * 1 || 100;
    // const skip = (page - 1) * limit;

    // query = query.skip(skip).limit(limit);

    // if (req.query.page) {
    //   const numTour = await Tour.countDocuments();
    //   if (skip > numTours) throw new Error('This page does not exist');
    // }

    //EXCUTE QUERY

    ////////////////////////////////////
    // to allow for nested GET reviews on tour(HACK):)
    let filter = {};
    if (req.params.tourId) filter = { tour: req.params.tourId };

    const features = new APIFeatures(Model.find(filter), req.query)
        .filter()
        .sort()
        .limitFields()
        .pagnation();


    // const doc = await features.query.explain();

    const doc = await features.query;

    //const tours = await query;
    // query.sort().select().skip().limit()

    // SEND RESPONSE

    // option 1
    // const query = await Tour.find()
    //   .where('duration')
    //   .equals(5)
    //   .where('difficulty')
    //   .equals('easy');

    // SEND MESSSAGE
    res.status(200).json({
        status: 'success',
        //requestedAt: req.requestTime,
        results: doc.length,
        data: {
            data: doc
        },
    });
    // {
    //   res.status(404).json({
    //     status: 'fail',
    //     message: err.message,
    //   });
    // }
});
