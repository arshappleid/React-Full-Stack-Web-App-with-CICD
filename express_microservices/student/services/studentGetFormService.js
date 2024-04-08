// Author: Lance Haoxiang Xu (All the code here is written by Lance Haoxiang Xu unless specified otherwise)
// Tested by: Lance Haoxiang Xu
const {
	Course,
	Student,
	StudentCourse,
	EvaluationForm,
	EvaluationSection,
	EvaluationQuestion,
	EvaluationQuestionOption,
} = require('../database/index');

async function studentGetFormService(student_id, course_id, form_id) {
	try {
		//Checking for undefined and empty values
		if (
			student_id === undefined ||
			course_id === undefined ||
			form_id === undefined
		) {
			return {
				status: 'error',
				message: 'Undefined values passed to Service Function',
			};
		}
		if (student_id === '' || course_id === '' || form_id === '') {
			return {
				status: 'error',
				message: 'Empty values passed',
			};
		}
		//Checking if student id, course id and form id exist
		const studentExist = await Student.findOne({
			where: {
				STUDENT_ID: student_id,
			},
		});
		if (studentExist === null) {
			return {
				status: 'error',
				message: 'Student id does not exist',
			};
		}
		const courseExist = await Course.findOne({
			where: {
				COURSE_ID: course_id,
			},
		});
		if (courseExist === null) {
			return {
				status: 'error',
				message: 'Course id does not exist',
			};
		}
		const studentInCourse = await StudentCourse.findOne({
			where: {
				STUDENT_ID: student_id,
				COURSE_ID: course_id,
			},
		});
		if (studentInCourse === null) {
			return {
				status: 'error',
				message: 'Student is not in course',
			};
		}
		const formExist = await EvaluationForm.findOne({
			where: {
				FORM_ID: form_id,
				COURSE_ID: course_id,
			},
		});
		if (formExist === null) {
			return {
				status: 'error',
				message: 'Form id does not exist',
			};
		}

		//Retrieving form details
		const form = await EvaluationSection.findAll({
			where: {
				FORM_ID: form_id,
			},
			include: [
				{
					model: EvaluationQuestion,
					required: true,
					include: [
						{
							model: EvaluationQuestionOption,
							required: false,
						},
					],
				},
			],
		});

		return await data_reformation(
			form,
			formExist.FORM_NAME,
			formExist.DEADLINE
		);
	} catch (err) {
		return {
			status: 'error',
			message:
				'Error occured while retrieving results in instructorGetFormService.js: ' +
				err.message,
		};
	}
}

async function data_reformation(form, form_name, form_deadline) {
	let unique_section_names = [];
	let unique_section_weights = [];
	for (let i = 0; i < form.length; i++) {
		const section = form[i];
		const section_name = section.SECTION_NAME;
		if (!unique_section_names.includes(section_name)) {
			unique_section_names.push(section_name);
			unique_section_weights.push(section.SECTION_WEIGHT);
		}
	}

	let questions_by_unique_section = [];
	for (let j = 0; j < unique_section_names.length; j++) {
		questions_by_unique_section.push([]);
	}

	//QUESTION LOOP
	for (let j = 0; j < form.length; j++) {
		const section = form[j];
		const section_name = section.SECTION_NAME;
		const question = form[j].EVALUATION_QUESTION;
		const question_id = question.QUESTION_ID;
		const question_type = question.QUESTION_TYPE;
		const question_text = question.QUESTION_TEXT;

		let options = [];
		let optionPoints = [];
		//OPTION LOOP
		if (question.EVALUATION_QUESTION_OPTIONs.length > 0) {
			for (
				let k = 0;
				k < question.EVALUATION_QUESTION_OPTIONs.length;
				k++
			) {
				const option = question.EVALUATION_QUESTION_OPTIONs[k];
				const option_text = option.OPTION_TEXT;
				const option_point = option.OPTION_POINT;
				options.push(option_text);
				optionPoints.push(option_point);
			}
			const section_index = unique_section_names.indexOf(section_name);
			if (question_type !== 'ma') {
				questions_by_unique_section[section_index].push({
					type: question_type,
					question_id: question_id,
					question: question_text,
					options: options,
					optionPoints: optionPoints,
				});
			} else {
				questions_by_unique_section[section_index].push({
					type: question_type,
					question_id: question_id,
					question: question_text,
					options: options,
				});
			}
		} else {
			const section_index = unique_section_names.indexOf(section_name);
			questions_by_unique_section[section_index].push({
				type: question_type,
				question_id: question_id,
				question: question_text,
			});
		}
	}

	let sections = [];
	//SECTION LOOP
	for (let i = 0; i < unique_section_names.length; i++) {
		const section_name = unique_section_names[i];
		const section_weight = unique_section_weights[i];

		sections.push({
			name: section_name,
			weightage: section_weight,
			questions: questions_by_unique_section[i],
		});
	}
	let result = {
		formName: form_name,
		sections: sections,
		deadline: form_deadline,
	};

	return result;
}

module.exports = studentGetFormService;
