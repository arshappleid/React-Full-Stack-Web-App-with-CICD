// Author: Lance Haoxiang Xu (All the code here is written by Lance Haoxiang Xu unless specified otherwise)
// Tested by: Lance Haoxiang Xu
const express = require('express');
path = require('path');
const router = express.Router();

const removeStudentsAndGroupsFromCourseService = require('../services/removeStudentsAndGroupsFromCourseService');

router.post('/', async (req, res) => {
	try {
		const course_id = req.body.course_id;
		const group_id = req.body.group_id;
		const instructor_id = req.body.instructor_id;

		if (course_id === null || course_id === '' || course_id === undefined) {
			return res.json({
				status: 'error',
				message: 'course id can not be null.',
			});
		}
		if (group_id === null || group_id === '' || group_id === undefined) {
			return res.json({
				status: 'error',
				message: 'group id can not be null.',
			});
		}
		if (
			instructor_id === null ||
			instructor_id === '' ||
			instructor_id === undefined
		) {
			return res.json({
				status: 'error',
				message: 'instructor id can not be null.',
			});
		}
		const result = await removeStudentsAndGroupsFromCourseService(
			course_id,
			group_id,
			instructor_id
		);

		return res.json(result);
	} catch (e) {
		return res.json({
			status: 'error',
			message:
				'Error occured while parsing request in removeStudentsAndGroupsFromCourseController.js: ' +
				e.message,
		});
	}
});

module.exports = router;
