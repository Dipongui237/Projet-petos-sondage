import { useState,  } from 'react';
import { useSurvey } from '../../contexts/SurveyContext';
import { ChevronDownIcon, ChevronRightIcon, DownloadIcon } from 'lucide-react';
export default function ResponsesView() {
  const {
    responses,
    sections
  } = useSurvey();
  const [expandedUsers, setExpandedUsers] = useState<string[]>([]);
  const toggleUser = (userId: string) => {
    setExpandedUsers(prev => prev.includes(userId) ? prev.filter(id => id !== userId) : [...prev, userId]);
  };
  const isUserExpanded = (userId: string) => expandedUsers.includes(userId);
  const getQuestionText = (questionId: number, sectionId: number) => {
    const section = sections.find(s => s.id === sectionId);
    if (!section) return 'Question inconnue';
    const question = section.questions.find(q => q.id === questionId);
    return question ? question.text : 'Question inconnue';
  };
  const getAnswerDisplay = (answer: any) => {
    if (!answer || !answer.value || answer.value.length === 0) {
      return 'Aucune réponse';
    }
    let result = answer.value.filter((v: string) => v !== 'other').join(', ');
    if (answer.value.includes('other') && answer.otherValue) {
      result += result ? `, Autre: ${answer.otherValue}` : `Autre: ${answer.otherValue}`;
    }
    return result || 'Aucune réponse';
  };
  // Sort responses by submission date (newest first)
  const sortedResponses = [...responses].sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime());
  const exportResponsesToCSV = () => {
    if (responses.length === 0) return;
    // Collect all unique questions across all sections
    const allQuestions: {
      id: number;
      sectionId: number;
      text: string;
    }[] = [];
    sections.forEach(section => {
      section.questions.forEach(question => {
        allQuestions.push({
          id: question.id,
          sectionId: section.id,
          text: question.text
        });
      });
    });
    // Create CSV headers
    let csvContent = 'data:text/csv;charset=utf-8,';
    csvContent += 'Nom,Téléphone,Date de soumission,';
    allQuestions.forEach(question => {
      csvContent += `"${question.text}",`;
    });
    csvContent += '\r\n';
    // Add data rows
    responses.forEach(response => {
      csvContent += `"${response.userName}",`;
      csvContent += `"${response.userPhone}",`;
      csvContent += `"${new Date(response.submittedAt).toLocaleString('fr-FR')}",`;
      allQuestions.forEach(question => {
        const answer = response.answers.find(a => a.questionId === question.id && a.sectionId === question.sectionId);
        csvContent += `"${getAnswerDisplay(answer)}",`;
      });
      csvContent += '\r\n';
    });
    // Create download link
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `responses_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  return <div>
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">
            Réponses au sondage
          </h1>
          <p className="mt-2 text-sm text-gray-700">
            Consultez les réponses des participants au sondage.
          </p>
        </div>
        <button onClick={exportResponsesToCSV} disabled={responses.length === 0} className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm ${responses.length === 0 ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 'text-white bg-blue-700 hover:bg-blue-700'}`}>
          <DownloadIcon className="mr-2 h-4 w-4" />
          Exporter CSV
        </button>
      </div>
      <div className="mt-8 space-y-6">
        {sortedResponses.length > 0 ? sortedResponses.map(response => <div key={response.userId} className="bg-white shadow overflow-hidden sm:rounded-md">
              <div className="px-4 py-5 border-b border-gray-200 sm:px-6 flex justify-between items-center cursor-pointer" onClick={() => toggleUser(response.userId)}>
                <div>
                  <h3 className="text-lg leading-6 font-medium text-gray-900">
                    {response.userName}
                  </h3>
                  <p className="mt-1 max-w-2xl text-sm text-gray-500">
                    {response.userPhone} | Soumis le{' '}
                    {new Date(response.submittedAt).toLocaleString('fr-FR')}
                  </p>
                </div>
                <div>
                  {isUserExpanded(response.userId) ? <ChevronDownIcon className="h-5 w-5 text-gray-500" /> : <ChevronRightIcon className="h-5 w-5 text-gray-500" />}
                </div>
              </div>
              {isUserExpanded(response.userId) && <div className="border-t border-gray-200 px-4 py-5 sm:p-6">
                  <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
                    {response.answers.map(answer => <div key={`${answer.sectionId}-${answer.questionId}`} className="sm:col-span-1">
                        <dt className="text-sm font-medium text-gray-500">
                          {getQuestionText(answer.questionId, answer.sectionId)}
                        </dt>
                        <dd className="mt-1 text-sm text-gray-900">
                          {getAnswerDisplay(answer)}
                        </dd>
                      </div>)}
                  </dl>
                </div>}
            </div>) : <div className="bg-white shadow overflow-hidden sm:rounded-md">
            <div className="px-4 py-5 sm:p-6 text-center">
              <p className="text-gray-500">
                Aucune réponse n'a encore été soumise
              </p>
            </div>
          </div>}
      </div>
    </div>;
}