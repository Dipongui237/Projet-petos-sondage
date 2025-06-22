import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useSurvey, Answer } from '../contexts/SurveyContext';
import SurveySection from '../components/survey/SurveySection';
import { LogOutIcon, CheckCircleIcon, ChevronLeftIcon, ChevronRightIcon } from 'lucide-react';
export default function Survey() {
  const {
    currentUser,
    logout
  } = useAuth();
  const {
    sections,
    submitResponse
  } = useSurvey();
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const navigate = useNavigate();
  if (!currentUser) {
    return null; // This should be handled by ProtectedRoute
  }
  const currentSection = sections[currentSectionIndex];
  const isFirstSection = currentSectionIndex === 0;
  const isLastSection = currentSectionIndex === sections.length - 1;
  const handleAnswerChange = (questionId: number, sectionId: number, value: string[], otherValue?: string) => {
    const existingAnswerIndex = answers.findIndex(a => a.questionId === questionId && a.sectionId === sectionId);
    if (existingAnswerIndex >= 0) {
      const updatedAnswers = [...answers];
      updatedAnswers[existingAnswerIndex] = {
        questionId,
        sectionId,
        value,
        otherValue
      };
      setAnswers(updatedAnswers);
    } else {
      setAnswers([...answers, {
        questionId,
        sectionId,
        value,
        otherValue
      }]);
    }
  };
  const handlePrevious = () => {
    if (!isFirstSection) {
      setCurrentSectionIndex(currentSectionIndex - 1);
    }
  };
  const handleNext = () => {
    if (!isLastSection) {
      setCurrentSectionIndex(currentSectionIndex + 1);
    }
  };
  const handleSubmit = () => {
    submitResponse({
      userId: currentUser.id,
      userName: currentUser.name,
      userPhone: currentUser.phone,
      answers
    });
    setIsSubmitted(true);
  };
  const handleLogout = () => {
    logout();
    navigate('/');
  };
  if (isSubmitted) {
    return <div className="min-h-screen bg-gray-50 flex flex-col">
        <header className="bg-white shadow">
          <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900">
              Sondage sur les attentes en matière d'assurance
            </h1>
            <button onClick={handleLogout} className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-yellow-900 hover:bg-yellow-900">
              <LogOutIcon className="mr-2 h-4 w-4" />
              Déconnexion
            </button>
          </div>
        </header>
        <main className="flex-grow flex items-center justify-center p-6">
          <div className="max-w-md w-full bg-white shadow-lg rounded-lg p-8 text-center">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
              <CheckCircleIcon className="h-6 w-6 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Je vous remercie pour vos réponses
            </h2>
            <p className="text-gray-600 mb-6">
              Merci d'avoir répondu à ce questionnaire. Vos réponses m’aideront à mieux comprendre les besoins de 
              couvertures dans votre secteur d’activité professionnelle. 
              <p className=' text-yellow-600 border-l-4'>Richard EDIMO</p>  
            </p>
            <button onClick={handleLogout} className="w-full inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-orange-500 hover:bg-yellow-700">
              Terminer
            </button>
          </div>
        </main>
      </div>;
  }
  return <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">
            Sondage sur les attentes en matière d'assurance
          </h1>
          <div className="flex items-center">
            <span className="mr-4 text-sm text-gray-600">
              Bonjour, {currentUser.name}
            </span>
            <button onClick={handleLogout} className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-yellow-900 hover:bg-yellow-900">
              <LogOutIcon className="mr-2 h-4 w-4" />
              Déconnexion
            </button>
          </div>
        </div>
      </header>
      <main className="flex-grow max-w-4xl w-full mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-lg font-medium text-gray-700">Progression</h2>
            <span className="text-sm text-gray-500">
              Section {currentSectionIndex + 1} sur {sections.length}
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div className="bg-orange-500 h-2.5 rounded-full" style={{
            width: `${(currentSectionIndex + 1) / sections.length * 100}%`
          }}></div>
          </div>
        </div>
        {currentSection && <SurveySection section={currentSection} answers={answers.filter(a => a.sectionId === currentSection.id)} onChange={handleAnswerChange} />}
        <div className="flex justify-between mt-8">
          <button onClick={handlePrevious} disabled={isFirstSection} className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md ${isFirstSection ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}>
            <ChevronLeftIcon className="mr-2 h-4 w-4" />
            Précédent
          </button>
          {isLastSection ? <button onClick={handleSubmit} className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-yellow-700 hover:bg-green-700">
              <CheckCircleIcon className="mr-2 h-4 w-4" />
              Terminer le sondage
            </button> : <button onClick={handleNext} className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-orange-500 hover:bg-yellow-700">
              Suivant
              <ChevronRightIcon className="ml-2 h-4 w-4" />
            </button>}
        </div>
      </main>
    </div>;
}