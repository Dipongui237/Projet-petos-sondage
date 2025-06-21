import { useSurvey } from '../../contexts/SurveyContext';
import { TrashIcon } from 'lucide-react';
export default function UserManagement() {
  const {
    responses,
    deleteResponse
  } = useSurvey();
  // Get unique users from responses
  const users = responses.reduce((acc, response) => {
    const existingUser = acc.find(u => u.id === response.userId);
    if (!existingUser) {
      acc.push({
        id: response.userId,
        name: response.userName,
        phone: response.userPhone,
        submittedAt: response.submittedAt
      });
    }
    return acc;
  }, [] as {
    id: string;
    name: string;
    phone: string;
    submittedAt: string;
  }[]);
  // Sort users by submission date (newest first)
  const sortedUsers = [...users].sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime());
  const handleDeleteUser = (userId: string) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cet utilisateur et ses réponses ?')) {
      deleteResponse(userId);
    }
  };
  return <div>
      <h1 className="text-2xl font-semibold text-gray-900">
        Gestion des utilisateurs
      </h1>
      <p className="mt-2 text-sm text-gray-700">
        Liste des participants au sondage. Vous pouvez supprimer un utilisateur
        et ses réponses.
      </p>
      <div className="mt-8 flex flex-col">
        <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
            <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Nom
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Téléphone
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date de participation
                    </th>
                    <th scope="col" className="relative px-6 py-3">
                      <span className="sr-only">Actions</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {sortedUsers.length > 0 ? sortedUsers.map(user => <tr key={user.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            {user.name}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-500">
                            {user.phone}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-500">
                            {new Date(user.submittedAt).toLocaleString('fr-FR')}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <button onClick={() => handleDeleteUser(user.id)} className="text-red-600 hover:text-red-900">
                            <TrashIcon className="h-5 w-5" />
                          </button>
                        </td>
                      </tr>) : <tr>
                      <td colSpan={4} className="px-6 py-4 text-center text-sm text-gray-500">
                        Aucun utilisateur n'a encore participé au sondage
                      </td>
                    </tr>}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>;
}