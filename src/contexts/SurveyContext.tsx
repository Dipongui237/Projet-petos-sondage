import React, { useEffect, useState, createContext, useContext } from 'react';
export type Answer = {
  questionId: number;
  sectionId: number;
  value: string[];
  otherValue?: string;
};
export type Question = {
  id: number;
  text: string;
  options: string[];
  allowMultiple: boolean;
  hasOther: boolean;
};
export type Section = {
  id: number;
  title: string;
  description: string;
  questions: Question[];
};
export type UserResponse = {
  userId: string;
  userName: string;
  userPhone: string;
  answers: Answer[];
  submittedAt: string;
};
type SurveyContextType = {
  sections: Section[];
  addSection: (section: Omit<Section, 'id'>) => void;
  updateSection: (section: Section) => void;
  deleteSection: (id: number) => void;
  addQuestion: (sectionId: number, question: Omit<Question, 'id'>) => void;
  updateQuestion: (sectionId: number, question: Question) => void;
  deleteQuestion: (sectionId: number, questionId: number) => void;
  responses: UserResponse[];
  submitResponse: (response: Omit<UserResponse, 'submittedAt'>) => void;
  deleteResponse: (userId: string) => void;
};
const SurveyContext = createContext<SurveyContextType | undefined>(undefined);
// Initial survey data
const initialSections: Section[] = [{
  id: 1,
  title: "Informations sur l'assurance actuelle",
  description: "Veuillez nous indiquer votre situation actuelle concernant l'assurance",
  questions: [{
    id: 1,
    text: 'Avez-vous actuellement une assurance ?',
    options: ['Oui', 'Non'],
    allowMultiple: false,
    hasOther: false
  }, {
    id: 2,
    text: "Quels types d'assurance possédez-vous actuellement ?",
    options: ['Santé', 'Habitation', 'Automobile', 'Vie', 'Responsabilité civile'],
    allowMultiple: true,
    hasOther: true
  }]
}, {
  id: 2,
  title: 'Attentes et besoins',
  description: 'Parlez-nous de vos attentes concernant votre future assurance',
  questions: [{
    id: 3,
    text: 'Quelles sont vos priorités concernant une assurance ?',
    options: ['Prix abordable', 'Couverture complète', 'Service client réactif', 'Processus de réclamation simple'],
    allowMultiple: true,
    hasOther: true
  }, {
    id: 4,
    text: 'Quel budget mensuel envisagez-vous pour votre assurance ?',
    options: ['Moins de 50€', 'Entre 50€ et 100€', 'Entre 100€ et 200€', 'Plus de 200€'],
    allowMultiple: false,
    hasOther: false
  }]
}];
export function SurveyProvider({
  children
}: {
  children: React.ReactNode;
}) {
  const [sections, setSections] = useState<Section[]>(initialSections);
  const [responses, setResponses] = useState<UserResponse[]>([]);
  useEffect(() => {
    // Load data from localStorage on initial render
    const savedSections = localStorage.getItem('surveySections');
    const savedResponses = localStorage.getItem('surveyResponses');
    if (savedSections) {
      setSections(JSON.parse(savedSections));
    }
    if (savedResponses) {
      setResponses(JSON.parse(savedResponses));
    }
  }, []);
  // Save to localStorage whenever data changes
  useEffect(() => {
    localStorage.setItem('surveySections', JSON.stringify(sections));
  }, [sections]);
  useEffect(() => {
    localStorage.setItem('surveyResponses', JSON.stringify(responses));
  }, [responses]);
  const addSection = (section: Omit<Section, 'id'>) => {
    const newId = Math.max(0, ...sections.map(s => s.id)) + 1;
    setSections([...sections, {
      ...section,
      id: newId
    }]);
  };
  const updateSection = (section: Section) => {
    setSections(sections.map(s => s.id === section.id ? section : s));
  };
  const deleteSection = (id: number) => {
    setSections(sections.filter(s => s.id !== id));
  };
  const addQuestion = (sectionId: number, question: Omit<Question, 'id'>) => {
    setSections(sections.map(section => {
      if (section.id === sectionId) {
        const newId = Math.max(0, ...section.questions.map(q => q.id)) + 1;
        return {
          ...section,
          questions: [...section.questions, {
            ...question,
            id: newId
          }]
        };
      }
      return section;
    }));
  };
  const updateQuestion = (sectionId: number, question: Question) => {
    setSections(sections.map(section => {
      if (section.id === sectionId) {
        return {
          ...section,
          questions: section.questions.map(q => q.id === question.id ? question : q)
        };
      }
      return section;
    }));
  };
  const deleteQuestion = (sectionId: number, questionId: number) => {
    setSections(sections.map(section => {
      if (section.id === sectionId) {
        return {
          ...section,
          questions: section.questions.filter(q => q.id !== questionId)
        };
      }
      return section;
    }));
  };
  const submitResponse = (response: Omit<UserResponse, 'submittedAt'>) => {
    const newResponse = {
      ...response,
      submittedAt: new Date().toISOString()
    };
    // Replace existing response if user already submitted
    const existingIndex = responses.findIndex(r => r.userId === response.userId);
    if (existingIndex >= 0) {
      setResponses([...responses.slice(0, existingIndex), newResponse, ...responses.slice(existingIndex + 1)]);
    } else {
      setResponses([...responses, newResponse]);
    }
  };
  const deleteResponse = (userId: string) => {
    setResponses(responses.filter(r => r.userId !== userId));
  };
  const value = {
    sections,
    addSection,
    updateSection,
    deleteSection,
    addQuestion,
    updateQuestion,
    deleteQuestion,
    responses,
    submitResponse,
    deleteResponse
  };
  return <SurveyContext.Provider value={value}>{children}</SurveyContext.Provider>;
}
export function useSurvey() {
  const context = useContext(SurveyContext);
  if (context === undefined) {
    throw new Error('useSurvey must be used within a SurveyProvider');
  }
  return context;
}