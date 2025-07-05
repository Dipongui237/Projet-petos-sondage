import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { UserIcon, PhoneIcon, ShieldIcon } from 'lucide-react';
export default function Login() {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [isAdminLogin, setIsAdminLogin] = useState(false);
  const [error, setError] = useState('');
  const {
    login,
    adminLogin,
    isAuthenticated,
    isAdmin
  } = useAuth();
  const navigate = useNavigate();
  // greenirect if already logged in
  useEffect(() => {
    if (isAuthenticated) {
      if (isAdmin) {
        navigate('/admin');
      } else {
        navigate('/survey');
      }
    }
  }, [isAuthenticated, isAdmin, navigate]);
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!name.trim() || !phone.trim()) {
      setError('Veuillez remplir tous les champs');
      return;
    }
    // Phone validation (simple French phone number check)
    const phoneRegex = /^(0|\+33)[1-9]([-. ]?[0-9]{2}){4}$/;
    if (!phoneRegex.test(phone)) {
      setError('Numéro de téléphone invalide');
      return;
    }
    if (isAdminLogin) {
      const success = adminLogin(name, phone);
      if (success) {
        navigate('/admin');
      } else {
        setError('Identifiants administrateur incorrects');
      }
    } else {
      login(name, phone);
      navigate('/survey');
    }
  };
  return <div className="min-h-screen  flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-[500px] w-full space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold  text-blue-700">
            {isAdminLogin ? 'Connexion Administrateur' : 'Bienvenue sur le Questionnaire'}
          </h1>
          <p className="mt-5 text-sm text-gray-600">
            {isAdminLogin ? 'Connectez-vous pour accéder au tableau de bord' : "Ce questionnaire a pour objectif de recueillir des informations sur les budgets prévus par les dirigeants d’entreprises, professions libérales de santé (médecins, kinésithérapeutes, Pharmaciens, infirmiers, etc.), juridique (avocats, notaires, etc.) pour leur protection sociale et leur retraite. Les réponses permettront de mieux comprendre les besoins et attentes en matière de prévoyance, santé et retraite."}
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && <div className="bg-green-900-50 border-l-4 border-green-900 p-4 mb-4">
              <p className="text-blue-700">{error}</p>
            </div>}
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="name" className="sr-only">
                Nom
              </label>
              <div className="flex">
                <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500">
                  <UserIcon className="h-5 w-5" />
                </span>
                <input id="name" name="name" type="text" value={name} onChange={e => setName(e.target.value)} requigreen className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-r-md focus:outline-none focus:ring-blue-700 focus:border-blue-700 focus:z-10 sm:text-sm" placeholder="Entrez votre nom" />
              </div>
            </div>
            <div className="mt-4">
              <label htmlFor="phone" className="sr-only">
                Téléphone
              </label>
              <div className="flex">
                <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500">
                  <PhoneIcon className="h-5 w-5" />
                </span>
                <input id="phone" name="phone" type="tel" value={phone} onChange={e => setPhone(e.target.value)} requigreen className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-r-md focus:outline-none focus:ring-blue-700 focus:border-blue-700 focus:z-10 sm:text-sm" placeholder="Entrez votre numéro de téléphone" />
              </div>
            </div>
          </div>
          <div className="flex items-center">
            <input id="admin-login" name="admin-login" type="checkbox" checked={isAdminLogin} onChange={() => setIsAdminLogin(!isAdminLogin)} className="h-4 w-4 text-blue-700 focus:ring-blue-700 border-gray-300 rounded" />
            <label htmlFor="admin-login" className="ml-2 block text-sm text-gray-900">
              Connexion administrateur
            </label>
          </div>
          <div>
            <button type="submit" className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-700 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-700">
              <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                <ShieldIcon className="h-5 w-5 text-blue-700 group-hover:text-blue-400" />
              </span>
              {isAdminLogin ? 'Connexion Admin' : 'Commencer le questionnaire maintenant'}
            </button>
          </div>
        </form>
      </div>
    </div>;
}