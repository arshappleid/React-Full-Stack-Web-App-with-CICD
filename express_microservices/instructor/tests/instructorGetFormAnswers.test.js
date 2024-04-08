// Author: Lance Haoxiang Xu (All the code here is written by Lance Haoxiang Xu unless specified otherwise)
import { describe, test, expect } from 'vitest';
const {
	Instructor,
    Student,
	Course,
	EvaluationForm,
    EvaluationAnswer,
	EvaluationQuestion,
	EvaluationSection,
    EvaluationQuestionOption,
} = require('../database/index');

const instructorGetFormAnswersService = require('../services/instructorGetFormAnswersService');
const instructorGetFormService = require('../services/instructorGetFormService');

describe('instructorGetFormAnswers', async () => {
	const instructor_id = 227;
    const student_id1 = 2271;
    const student_id2 = 2272;

	let course_id;
	let form_id1;
    let form_id2;

	let question_id1;
    let question_id2;
    let question_id3;

    let option_id1;
    let option_id2;
    let option_id3;
    let option_id4;
    let option_id5;
    let option_id6;
    let option_id7;

    beforeEach(async () => {
        try {
            await Instructor.create({
                INSTRUCTOR_ID: instructor_id,
                FIRST_NAME: 'FIRST_NAME227',
                MIDDLE_NAME: 'MIDDLE_NAME227',
                LAST_NAME: 'LAST_NAME227',
                EMAIL: 'TEST225@INSTRUCTOR.COM',
                MD5_HASHED_PASSWORD: 'MD5_PASSWORD',
            });
            await Student.create({
                STUDENT_ID: student_id1,
                FIRST_NAME: 'FIRST_NAME227',
                MIDDLE_NAME: 'MIDDLE_NAME227',
                LAST_NAME: 'LAST_NAME227',
                EMAIL: 'STUDENT227@STUDENT.COM',
                MD5_HASHED_PASSWORD: 'MD5_PASSWORD',
            });
            await Student.create({
                STUDENT_ID: student_id2,
                FIRST_NAME: 'FIRST_NAME2271',
                MIDDLE_NAME: 'MIDDLE_NAME2271',
                LAST_NAME: 'LAST_NAME2272',
                EMAIL: 'STUDENT2271@STUDENT.COM',
                MD5_HASHED_PASSWORD: 'MD5_PASSWORD',
            });
            const courseCreated = await Course.create({
                INSTRUCTOR_ID: instructor_id,
                COURSE_NAME: 'TEST_COURSE_NAME227',
                COURSE_CODE: 'COURSE_CODE227',
                COURSE_SEMESTER: 'COURSE_SEMESTER227',
                COURSE_YEAR: 'COURSE_YEAR227',
                COURSE_TERM: 'COURSE_TERM227',
                COURSE_VISIBILITY: 0,
            });
            course_id = courseCreated.get('COURSE_ID');
            const evaluationForm1Created = await EvaluationForm.create({
                FORM_NAME: 'FORM_NAME227',
                COURSE_ID: course_id,
                DEADLINE: '2021-04-30 23:59:59',
                SHARE_FEEDBACK: 0,
                VISIBILITY: 0,
            });
            form_id1 = evaluationForm1Created.get('FORM_ID');
            const evaluationForm2Created = await EvaluationForm.create({
                FORM_NAME: 'FORM_NAME227-2',
                COURSE_ID: course_id,
                DEADLINE: '2021-04-30 23:59:59',
                SHARE_FEEDBACK: 0,
                VISIBILITY: 0,
            });
            form_id2 = evaluationForm2Created.get('FORM_ID');

            // CREATE QUESTIONS
            const evaluationQuestion1Created = await EvaluationQuestion.create({
                FORM_ID: form_id1,
                QUESTION_TYPE: 'mcq',
                QUESTION_TEXT: 'QUESTION_TEXT227-1',
            });
            question_id1 = evaluationQuestion1Created.get('QUESTION_ID');
            const evaluationQuestion2Created = await EvaluationQuestion.create({
                FORM_ID: form_id1,
                QUESTION_TYPE: 'mcq',
                QUESTION_TEXT: 'QUESTION_TEXT227-2',
            });
            question_id2 = evaluationQuestion2Created.get('QUESTION_ID');
            const evaluationQuestion3Created = await EvaluationQuestion.create({
                FORM_ID: form_id2,
                QUESTION_TYPE: 'mcq',
                QUESTION_TEXT: 'QUESTION_TEXT227-3',
            });
            question_id3 = evaluationQuestion3Created.get('QUESTION_ID');

            // CREATE SECTIONS
            await EvaluationSection.create({
                FORM_ID: form_id1,
                QUESTION_ID: question_id1,
                SECTION_NAME: 'SECTION_NAME227-1',
                SECTION_WEIGHT: 40,
            });
            await EvaluationSection.create({
                FORM_ID: form_id1,
                QUESTION_ID: question_id2,
                SECTION_NAME: 'SECTION_NAME227-2',
                SECTION_WEIGHT: 60,
            });
            await EvaluationSection.create({
                FORM_ID: form_id2,
                QUESTION_ID: question_id3,
                SECTION_NAME: 'SECTION_NAME227-3',
                SECTION_WEIGHT: 100,
            });
            
            // CREATE OPTIONS
            const evaluationQuestionOption1Created = await EvaluationQuestionOption.create({
                QUESTION_ID: question_id1,
                OPTION_TEXT: 'OPTION_TEXT227',
                OPTION_POINT: 1,
            });
            option_id1 = evaluationQuestionOption1Created.get('OPTION_ID');
            const evaluationQuestionOption2Created = await EvaluationQuestionOption.create({
                QUESTION_ID: question_id1,
                OPTION_TEXT: 'OPTION_TEXT227-2',
                OPTION_POINT: 2,
            });
            option_id2 = evaluationQuestionOption2Created.get('OPTION_ID');
            const evaluationQuestionOption3Created = await EvaluationQuestionOption.create({
                QUESTION_ID: question_id1,
                OPTION_TEXT: 'OPTION_TEXT227-3',
                OPTION_POINT: 0,
            });
            option_id3 = evaluationQuestionOption3Created.get('OPTION_ID');
            const evaluationQuestionOption4Created = await EvaluationQuestionOption.create({
                QUESTION_ID: question_id2,
                OPTION_TEXT: 'OPTION_TEXT227-4',
                OPTION_POINT: 0,
            });
            option_id4 = evaluationQuestionOption4Created.get('OPTION_ID');
            const evaluationQuestionOption5Created = await EvaluationQuestionOption.create({
                QUESTION_ID: question_id2,
                OPTION_TEXT: 'OPTION_TEXT227-5',
                OPTION_POINT: 1,
            });
            option_id5 = evaluationQuestionOption5Created.get('OPTION_ID');
            const evaluationQuestionOption6Created = await EvaluationQuestionOption.create({
                QUESTION_ID: question_id2,
                OPTION_TEXT: 'OPTION_TEXT227-6',
                OPTION_POINT: 2,
            });
            option_id6 = evaluationQuestionOption6Created.get('OPTION_ID');
            const evaluationQuestionOption7Created = await EvaluationQuestionOption.create({
                QUESTION_ID: question_id3,
                OPTION_TEXT: 'OPTION_TEXT227-7',
                OPTION_POINT: 2,
            });
            option_id7 = evaluationQuestionOption7Created.get('OPTION_ID');

            // CREATE ANSWERS
            await EvaluationAnswer.create({
                FORM_ID: form_id1,
                QUESTION_ID: question_id1,
                EVALUATOR_ID: student_id1,
                EVALUATEE_ID: student_id2,
                ANSWER: 'OPTION_TEXT227-1'
            });
            await EvaluationAnswer.create({
                FORM_ID: form_id1,
                QUESTION_ID: question_id2,
                EVALUATOR_ID: student_id1,
                EVALUATEE_ID: student_id2,
                ANSWER: 'OPTION_TEXT227-5'
            });
        } catch (e) {
            console.log(e);
        }
    });
    afterEach(async () => {
        try {
            await EvaluationAnswer.destroy({
                where: {
                    FORM_ID: form_id2,
                    QUESTION_ID: question_id3,
                    EVALUATOR_ID: student_id1,
                    EVALUATEE_ID: student_id2,
                },
            });
            await EvaluationAnswer.destroy({
                where: {
                    FORM_ID: form_id1,
                    QUESTION_ID: question_id2,
                    EVALUATOR_ID: student_id1,
                    EVALUATEE_ID: student_id2,
                },
            });
            await EvaluationAnswer.destroy({
                where: {
                    FORM_ID: form_id1,
                    QUESTION_ID: question_id1,
                    EVALUATOR_ID: student_id1,
                    EVALUATEE_ID: student_id2,
                },
            });
            await EvaluationSection.destroy({
                where: {
                    FORM_ID: form_id1,
                    QUESTION_ID: question_id1,
                },
            });
            await EvaluationSection.destroy({
                where: {
                    FORM_ID: form_id1,
                    QUESTION_ID: question_id2,
                },
            });
            await EvaluationSection.destroy({
                where: {
                    FORM_ID: form_id2,
                    QUESTION_ID: question_id3,
                },
            });
            await EvaluationQuestionOption.destroy({
                where: {
                    OPTION_ID: option_id1,
                },
            });
            await EvaluationQuestionOption.destroy({
                where: {
                    OPTION_ID: option_id2,
                },
            });
            await EvaluationQuestionOption.destroy({
                where: {
                    OPTION_ID: option_id3,
                },
            });
            await EvaluationQuestionOption.destroy({
                where: {
                    OPTION_ID: option_id4,
                },
            });
            await EvaluationQuestionOption.destroy({
                where: {
                    OPTION_ID: option_id5,
                },
            });
            await EvaluationQuestionOption.destroy({
                where: {
                    OPTION_ID: option_id6,
                },
            });
            await EvaluationQuestionOption.destroy({
                where: {
                    OPTION_ID: option_id7,
                },
            });
            await EvaluationQuestion.destroy({
                where: {
                    QUESTION_ID: question_id1,
                },
            });
            await EvaluationQuestion.destroy({
                where: {
                    QUESTION_ID: question_id2,
                },
            });
            await EvaluationQuestion.destroy({
                where: {
                    QUESTION_ID: question_id3,
                },
            });
            await EvaluationForm.destroy({
                where: {
                    FORM_ID: form_id1,
                },
            });
            await EvaluationForm.destroy({
                where: {
                    FORM_ID: form_id2,
                },
            });
            await Course.destroy({
                where: {
                    COURSE_ID: course_id,
                },
            });
            await Student.destroy({
                where: {
                    STUDENT_ID: student_id2,
                },
            });
            await Student.destroy({
                where: {
                    STUDENT_ID: student_id1,
                },
            });
            await Instructor.destroy({
                where: {
                    INSTRUCTOR_ID: instructor_id,
                },
            });
        } catch (e) {
            console.log(e);
        }
    });
    test('Undefined Variable', async () => {
		const result = await instructorGetFormService(
			undefined,
			undefined,
            undefined,
        );
		expect(result.status).toBe('error');
		expect(result.message).toBe(
			'Undefined values passed to Service Function'
		);
	});
	test('Empty Variable', async () => {
		const result = await instructorGetFormService('', '', '');

		expect(result.status).toBe('error');
		expect(result.message).toBe('Empty values passed');
	});
    test('instructorGetFormService', async () => {
        const result = await instructorGetFormService(instructor_id, course_id, form_id1);

        expect(result.formName).toBe('FORM_NAME227');
        expect(result.sections.length).toBe(2);

        expect(result.sections[0].name).toBe('SECTION_NAME227-1'); 
        expect(result.sections[1].name).toBe('SECTION_NAME227-2'); 

        expect(result.sections[0].weightage).toBe(40);
        expect(result.sections[0].questions.length).toBe(1);

        expect(result.sections[0].questions[0].question).toBe('QUESTION_TEXT227-1');
        expect(result.sections[1].questions[0].question).toBe('QUESTION_TEXT227-2');

        expect(result.sections[0].questions[0].type).toBe('mcq');
        expect(result.sections[0].questions[0].options.length).toBe(3);
        expect(result.sections[0].questions[0].options[0]).toBe('OPTION_TEXT227');
        expect(result.sections[0].questions[0].options[1]).toBe('OPTION_TEXT227-2');
    });
    test('instructorGetFormAnswerService', async () => {
        const result = await instructorGetFormAnswersService(instructor_id, course_id, form_id1, student_id2, student_id1);

        expect(result.formName).toBe('FORM_NAME227');
        expect(result.sections.length).toBe(2);

        expect(result.sections[0].questions.length).toBe(1);

        expect(result.sections[0].questions[0].question).toBe('QUESTION_TEXT227-1');
        expect(result.sections[0].questions[0].selectedOptionText[0]).toBe('OPTION_TEXT227-1');

        console.log(result);

        const answer = await EvaluationAnswer.findOne({
            where: {
                FORM_ID: form_id1,
                QUESTION_ID: question_id1,
                EVALUATOR_ID: student_id1,
                EVALUATEE_ID: student_id2,
            },
        });
        expect(answer.ANSWER).toBe('OPTION_TEXT227-1');
    });
    test('No answer found', async () => {
        const result = await instructorGetFormAnswersService(instructor_id, course_id, form_id2, student_id2, student_id2);

        expect(result.status).toBe('error');
        expect(result.message).toBe('No answers found');
    });
});

