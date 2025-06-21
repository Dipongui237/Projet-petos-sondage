import React from 'react';
import { Section, Question, Answer } from '../../contexts/SurveyContext';
type SurveySectionProps = {
  section: Section;
  answers: Answer[];
  onChange: (questionId: number, sectionId: number, value: string[], otherValue?: string) => void;
};
export default function SurveySection({
  section,
  answers,
  onChange
}: SurveySectionProps) {
  return <div className="bg-white shadow rounded-lg p-6 mb-8">
      <h2 className="text-xl font-bold text-gray-800 mb-2">{section.title}</h2>
      <p className="text-gray-600 mb-6">{section.description}</p>
      <div className="space-y-6">
        {section.questions.map((question, index) => <QuestionItem key={question.id} question={question} sectionId={section.id} questionNumber={index + 1} answer={answers.find(a => a.questionId === question.id && a.sectionId === section.id)} onChange={onChange} />)}
      </div>
    </div>;
}
type QuestionItemProps = {
  question: Question;
  sectionId: number;
  questionNumber: number;
  answer?: Answer;
  onChange: (questionId: number, sectionId: number, value: string[], otherValue?: string) => void;
};
function QuestionItem({
  question,
  sectionId,
  questionNumber,
  answer,
  onChange
}: QuestionItemProps) {
  const selectedOptions = answer?.value || [];
  const otherValue = answer?.otherValue || '';
  const handleCheckboxChange = (option: string) => {
    let newSelected: string[];
    if (question.allowMultiple) {
      // For multi-select, toggle the option
      newSelected = selectedOptions.includes(option) ? selectedOptions.filter(item => item !== option) : [...selectedOptions, option];
    } else {
      // For single-select, replace with the new option
      newSelected = [option];
    }
    onChange(question.id, sectionId, newSelected, otherValue);
  };
  const handleOtherChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(question.id, sectionId, selectedOptions, e.target.value);
  };
  return <div className="border-t pt-4">
      <p className="font-medium text-gray-700 mb-3">
        <span className="mr-2">{questionNumber}.</span>
        {question.text}
      </p>
      <div className="ml-6 space-y-2">
        {question.options.map(option => <div key={option} className="flex items-center">
            <input type={question.allowMultiple ? 'checkbox' : 'radio'} id={`question-${question.id}-${option}`} name={`question-${question.id}`} checked={selectedOptions.includes(option)} onChange={() => handleCheckboxChange(option)} className={question.allowMultiple ? 'h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded' : 'h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300'} />
            <label htmlFor={`question-${question.id}-${option}`} className="ml-3 block text-sm text-gray-700">
              {option}
            </label>
          </div>)}
        {question.hasOther && <div className="flex items-center">
            <input type={question.allowMultiple ? 'checkbox' : 'radio'} id={`question-${question.id}-other`} name={`question-${question.id}`} checked={selectedOptions.includes('other')} onChange={() => handleCheckboxChange('other')} className={question.allowMultiple ? 'h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded' : 'h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300'} />
            <label htmlFor={`question-${question.id}-other`} className="ml-3 flex items-center">
              <span className="text-sm text-gray-700 mr-2">Autre:</span>
              <input type="text" value={otherValue} onChange={handleOtherChange} onClick={() => {
            if (!selectedOptions.includes('other')) {
              handleCheckboxChange('other');
            }
          }} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm" />
            </label>
          </div>}
      </div>
    </div>;
}