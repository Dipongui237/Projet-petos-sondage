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
  title: "Informations générales",
  description: "Veuillez nous indiquer votre situation actuelle concernant l'Proection sociale",
  questions: [{
    id: 1,
    text: '1- Quelle est votre profession ?',
    options: ['Médecin', 'Kinésithérapeute', 'Pharmacien', 'Professionnel juridique (précisez : avocat, notaire, autre)'],
    allowMultiple: false,
    hasOther: true
  }, {
    id: 2,
    text: "2- Depuis combien de temps exercez-vous cette profession ?",
    options: ['1ans', '5ans', '10ans'],
    allowMultiple: false,
    hasOther: true
  }, {
    id: 3,
    text: "3-Travaillez-vous en libéral exclusivement ou en mixte (libéral et salarié) ?",
    options: ['libéral', 'mixte'],
    allowMultiple: false,
    hasOther: true
  }]
}, {
  id: 2,
  title: 'Prévisions budgétaires',
  description: '1- Parlez-moi de votre prévoyance individuelle, Mutuelle santé et de votre Retraite ',
  questions: [{
    id: 4,
    text: '2- Disposez-vous actuellement d’un contrat de prévoyance individuelle ?',
    options: ['Oui','Non' ],
    allowMultiple: false,
    hasOther: false
  }, {
    id: 5,
    text: '3- Quel budget mensuel prévoyez-vous ou affectez-vous actuellement à votre contrat de prévoyance individuelle ?',
    options: ['Moins de 50€', 'Entre 50€ et 100€', 'Entre 100€ et 200€', 'Plus de 200€'],
    allowMultiple: false,
    hasOther: false
  }, {
    id: 6,
    text: '4- Disposez-vous actuellement d’une mutuelle santé ?',
    options: ['Oui', 'Non', ],
    allowMultiple: false,
    hasOther: false
  }, {
    id: 7,
    text: '5-Quel budget mensuel prévoyez-vous ou affectez-vous actuellement à votre contrat de mutuelle santé ?',
    options: ['Moins de 50€', 'Entre 50€ et 100€', 'Entre 100€ et 200€', 'Plus de 200€'],
    allowMultiple: false,
    hasOther: false
  }, {
    id: 8,
    text: '6- Disposez-vous actuellement d’un contrat retraite spécifique, en plus des cotisations obligatoires ?',
    options: ['Oui', 'Non'],
    allowMultiple: false,
    hasOther: false
  }, {
    id: 9,
    text: '. 7-Quel budget mensuel prévoyez-vous ou affectez-vous actuellement à votre contrat retraite ?',
    options: ['Moins de 50€', 'Entre 50€ et 100€', 'Entre 100€ et 200€', 'Plus de 200€'],
    allowMultiple: false,
    hasOther: false
  }]
  
}, {
  id: 3,
  title: 'Aperçu des priorités',
  description: 'Parlez-moi de votre prévoyance individuelle, Mutuelle santé et de votre Retraite ',
  questions: [{
    id: 10,
    text: '1- Parmi les trois catégories (prévoyance, mutuelle santé, retraite), laquelle est votre priorité principale ?',
    options: ['Prévoyance individuelle', 'Mutuelle santé', 'Retraite',],
    allowMultiple: true,
    hasOther: false
  }, {
    id: 11,
    text: '2- Souhaitez-vous des informations supplémentaires ou un accompagnement pour optimiser votre protection sociale et votre retraite ?',
    options: ['Oui', 'Non', ],
    allowMultiple: false,
    hasOther: true
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