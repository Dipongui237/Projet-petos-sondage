import { useState } from 'react';
import { useSurvey, Section, Question } from '../../contexts/SurveyContext';
import { PlusIcon, TrashIcon, SaveIcon, PlusCircleIcon, ChevronDownIcon, ChevronUpIcon } from 'lucide-react';
export default function QuestionEditor() {
  const {
    sections,
    addSection,
    updateSection,
    deleteSection,
    addQuestion,
    updateQuestion,
    deleteQuestion
  } = useSurvey();
  const [expandedSections, setExpandedSections] = useState<number[]>(sections.map(s => s.id));
  const [editingSectionId, setEditingSectionId] = useState<number | null>(null);
  const [newSectionTitle, setNewSectionTitle] = useState('');
  const [newSectionDescription, setNewSectionDescription] = useState('');
  const [editingQuestionData, setEditingQuestionData] = useState<{
    sectionId: number;
    questionId: number | null;
    text: string;
    options: string[];
    allowMultiple: boolean;
    hasOther: boolean;
  } | null>(null);
  const toggleSection = (sectionId: number) => {
    setExpandedSections(prev => prev.includes(sectionId) ? prev.filter(id => id !== sectionId) : [...prev, sectionId]);
  };
  const isSectionExpanded = (sectionId: number) => expandedSections.includes(sectionId);
  const handleAddSection = () => {
    addSection({
      title: 'Nouvelle section',
      description: 'Description de la nouvelle section',
      questions: []
    });
  };
  const handleEditSection = (section: Section) => {
    setEditingSectionId(section.id);
    setNewSectionTitle(section.title);
    setNewSectionDescription(section.description);
  };
  const handleSaveSection = () => {
    if (!editingSectionId) return;
    const section = sections.find(s => s.id === editingSectionId);
    if (!section) return;
    updateSection({
      ...section,
      title: newSectionTitle,
      description: newSectionDescription
    });
    setEditingSectionId(null);
    setNewSectionTitle('');
    setNewSectionDescription('');
  };
  const handleCancelEditSection = () => {
    setEditingSectionId(null);
    setNewSectionTitle('');
    setNewSectionDescription('');
  };
  const handleDeleteSection = (sectionId: number) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette section et toutes ses questions ?')) {
      deleteSection(sectionId);
    }
  };
  const handleAddQuestion = (sectionId: number) => {
    setEditingQuestionData({
      sectionId,
      questionId: null,
      text: '',
      options: [''],
      allowMultiple: false,
      hasOther: false
    });
  };
  const handleEditQuestion = (sectionId: number, question: Question) => {
    setEditingQuestionData({
      sectionId,
      questionId: question.id,
      text: question.text,
      options: [...question.options],
      allowMultiple: question.allowMultiple,
      hasOther: question.hasOther
    });
  };
  const handleSaveQuestion = () => {
    if (!editingQuestionData) return;
    const {
      sectionId,
      questionId,
      text,
      options,
      allowMultiple,
      hasOther
    } = editingQuestionData;
    // Filter out empty options
    const filteredOptions = options.filter(opt => opt.trim() !== '');
    if (filteredOptions.length === 0) {
      alert('Veuillez ajouter au moins une option de réponse');
      return;
    }
    if (questionId === null) {
      // Add new question
      addQuestion(sectionId, {
        text,
        options: filteredOptions,
        allowMultiple,
        hasOther
      });
    } else {
      // Update existing question
      updateQuestion(sectionId, {
        id: questionId,
        text,
        options: filteredOptions,
        allowMultiple,
        hasOther
      });
    }
    setEditingQuestionData(null);
  };
  const handleCancelEditQuestion = () => {
    setEditingQuestionData(null);
  };
  const handleDeleteQuestion = (sectionId: number, questionId: number) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette question ?')) {
      deleteQuestion(sectionId, questionId);
    }
  };
  const handleAddOption = () => {
    if (!editingQuestionData) return;
    setEditingQuestionData({
      ...editingQuestionData,
      options: [...editingQuestionData.options, '']
    });
  };
  const handleChangeOption = (index: number, value: string) => {
    if (!editingQuestionData) return;
    const newOptions = [...editingQuestionData.options];
    newOptions[index] = value;
    setEditingQuestionData({
      ...editingQuestionData,
      options: newOptions
    });
  };
  const handleDeleteOption = (index: number) => {
    if (!editingQuestionData) return;
    setEditingQuestionData({
      ...editingQuestionData,
      options: editingQuestionData.options.filter((_, i) => i !== index)
    });
  };
  return <div>
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">
            Éditeur de sondage
          </h1>
          <p className="mt-2 text-sm text-gray-700">
            Gérez les sections et les questions du sondage.
          </p>
        </div>
        <button onClick={handleAddSection} className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-orange-500 hover:bg-yellow-700">
          <PlusIcon className="mr-2 h-4 w-4" />
          Ajouter une section
        </button>
      </div>
      {/* Section editor modal */}
      {editingSectionId !== null && <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"></div>
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                  Modifier la section
                </h3>
                <div className="mb-4">
                  <label htmlFor="section-title" className="block text-sm font-medium text-gray-700">
                    Titre
                  </label>
                  <input type="text" id="section-title" value={newSectionTitle} onChange={e => setNewSectionTitle(e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm" />
                </div>
                <div className="mb-4">
                  <label htmlFor="section-description" className="block text-sm font-medium text-gray-700">
                    Description
                  </label>
                  <textarea id="section-description" value={newSectionDescription} onChange={e => setNewSectionDescription(e.target.value)} rows={3} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"></textarea>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button type="button" onClick={handleSaveSection} className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-orange-500 text-base font-medium text-white hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm">
                  Enregistrer
                </button>
                <button type="button" onClick={handleCancelEditSection} className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm">
                  Annuler
                </button>
              </div>
            </div>
          </div>
        </div>}
      {/* Question editor modal */}
      {editingQuestionData !== null && <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"></div>
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                  {editingQuestionData.questionId === null ? 'Ajouter une question' : 'Modifier la question'}
                </h3>
                <div className="mb-4">
                  <label htmlFor="question-text" className="block text-sm font-medium text-gray-700">
                    Question
                  </label>
                  <input type="text" id="question-text" value={editingQuestionData.text} onChange={e => setEditingQuestionData({
                ...editingQuestionData,
                text: e.target.value
              })} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm" />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Options de réponse
                  </label>
                  {editingQuestionData.options.map((option, index) => <div key={index} className="flex items-center mb-2">
                      <input type="text" value={option} onChange={e => handleChangeOption(index, e.target.value)} className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm" />
                      <button type="button" onClick={() => handleDeleteOption(index)} className="ml-2 text-red-600 hover:text-red-900">
                        <TrashIcon className="h-5 w-5" />
                      </button>
                    </div>)}
                  <button type="button" onClick={handleAddOption} className="mt-2 inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-blue-700 bg-orange-100 hover:bg-orange-200">
                    <PlusIcon className="mr-1 h-4 w-4" />
                    Ajouter une option
                  </button>
                </div>
                <div className="mb-4 flex items-center">
                  <input id="allow-multiple" type="checkbox" checked={editingQuestionData.allowMultiple} onChange={e => setEditingQuestionData({
                ...editingQuestionData,
                allowMultiple: e.target.checked
              })} className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded" />
                  <label htmlFor="allow-multiple" className="ml-2 block text-sm text-gray-700">
                    Autoriser plusieurs réponses
                  </label>
                </div>
                <div className="mb-4 flex items-center">
                  <input id="has-other" type="checkbox" checked={editingQuestionData.hasOther} onChange={e => setEditingQuestionData({
                ...editingQuestionData,
                hasOther: e.target.checked
              })} className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded" />
                  <label htmlFor="has-other" className="ml-2 block text-sm text-gray-700">
                    Inclure un champ "Autre"
                  </label>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button type="button" onClick={handleSaveQuestion} className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-orange-500 text-base font-medium text-white hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm">
                  Enregistrer
                </button>
                <button type="button" onClick={handleCancelEditQuestion} className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm">
                  Annuler
                </button>
              </div>
            </div>
          </div>
        </div>}
      <div className="mt-8 space-y-6">
        {sections.length > 0 ? sections.map(section => <div key={section.id} className="bg-white shadow overflow-hidden sm:rounded-md">
              <div className="px-4 py-5 border-b border-gray-200 sm:px-6 flex justify-between items-center cursor-pointer" onClick={() => toggleSection(section.id)}>
                <div>
                  <h3 className="text-lg leading-6 font-medium text-gray-900">
                    {section.title}
                  </h3>
                  <p className="mt-1 max-w-2xl text-sm text-gray-500">
                    {section.description}
                  </p>
                </div>
                <div className="flex items-center">
                  {isSectionExpanded(section.id) ? <ChevronUpIcon className="h-5 w-5 text-gray-500" /> : <ChevronDownIcon className="h-5 w-5 text-gray-500" />}
                </div>
              </div>
              {isSectionExpanded(section.id) && <div className="border-t border-gray-200 px-4 py-5 sm:p-6">
                  <div className="flex justify-between items-center mb-4">
                    <div className="flex space-x-2">
                      <button onClick={e => {
                e.stopPropagation();
                handleEditSection(section);
              }} className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-blue-700 bg-orange-100 hover:bg-orange-200">
                        <SaveIcon className="mr-1 h-4 w-4" />
                        Modifier la section
                      </button>
                      <button onClick={e => {
                e.stopPropagation();
                handleDeleteSection(section.id);
              }} className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-red-700 bg-red-100 hover:bg-red-200">
                        <TrashIcon className="mr-1 h-4 w-4" />
                        Supprimer la section
                      </button>
                    </div>
                    <button onClick={e => {
              e.stopPropagation();
              handleAddQuestion(section.id);
            }} className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-green-700 bg-green-100 hover:bg-green-200">
                      <PlusCircleIcon className="mr-1 h-4 w-4" />
                      Ajouter une question
                    </button>
                  </div>
                  {section.questions.length > 0 ? <ul className="divide-y divide-gray-200">
                      {section.questions.map((question, index) => <li key={question.id} className="py-4">
                          <div className="flex justify-between items-start">
                            <div>
                              <p className="text-sm font-medium text-gray-900">
                                {index + 1}. {question.text}
                              </p>
                              <div className="mt-2 text-sm text-gray-500">
                                <p>Options: {question.options.join(', ')}</p>
                                <p className="mt-1">
                                  {question.allowMultiple ? 'Choix multiple autorisé' : 'Choix unique'}{' '}
                                  |
                                  {question.hasOther ? " Option 'Autre' incluse" : " Pas d'option 'Autre'"}
                                </p>
                              </div>
                            </div>
                            <div className="flex space-x-2">
                              <button onClick={() => handleEditQuestion(section.id, question)} className="text-blue-600 hover:text-blue-900">
                                <SaveIcon className="h-5 w-5" />
                              </button>
                              <button onClick={() => handleDeleteQuestion(section.id, question.id)} className="text-red-600 hover:text-red-900">
                                <TrashIcon className="h-5 w-5" />
                              </button>
                            </div>
                          </div>
                        </li>)}
                    </ul> : <div className="text-center py-4 text-sm text-gray-500">
                      Aucune question dans cette section
                    </div>}
                </div>}
            </div>) : <div className="bg-white shadow overflow-hidden sm:rounded-md">
            <div className="px-4 py-5 sm:p-6 text-center">
              <p className="text-gray-500">Aucune section n'a été créée</p>
            </div>
          </div>}
      </div>
    </div>;
}