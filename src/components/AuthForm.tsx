import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';

interface AuthFormProps {
  onAuthSuccess: () => void;
}

export const AuthForm: React.FC<AuthFormProps> = ({ onAuthSuccess }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: 'demo@example.com',
    password: 'password',
    firstName: '',
    lastName: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isLogin) {
        // Vérification des identifiants par défaut
        if ((formData.email === 'demo@example.com' && formData.password === 'password') ||
            (formData.email === 'admin@test.com' && formData.password === 'admin123')) {
          setTimeout(() => {
            setLoading(false);
            onAuthSuccess();
          }, 500);
        } else {
          setTimeout(() => {
            setLoading(false);
            alert('Identifiants incorrects. Utilisez: demo@example.com / password');
          }, 500);
        }
      } else {
        // Simulation inscription
        setTimeout(() => {
          setLoading(false);
          alert('Inscription réussie ! Vous pouvez maintenant vous connecter.');
          setIsLogin(true);
          setFormData({ ...formData, password: '' });
        }, 500);
      }
    } catch (error) {
      setLoading(false);
      alert('Erreur: ' + error);
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Card className="w-full max-w-md p-8">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900">
            {isLogin ? 'Connexion' : 'Inscription'}
          </h1>
          <p className="text-gray-600 mt-2">
            {isLogin 
              ? 'Connectez-vous à votre compte' 
              : 'Créez votre compte pour commencer'
            }
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {!isLogin && (
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">Prénom</Label>
                <Input
                  id="firstName"
                  value={formData.firstName}
                  onChange={(e) => handleChange('firstName', e.target.value)}
                  required={!isLogin}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Nom</Label>
                <Input
                  id="lastName"
                  value={formData.lastName}
                  onChange={(e) => handleChange('lastName', e.target.value)}
                  required={!isLogin}
                />
              </div>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => handleChange('email', e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Mot de passe</Label>
            <Input
              id="password"
              type="password"
              value={formData.password}
              onChange={(e) => handleChange('password', e.target.value)}
              required
              minLength={6}
            />
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading 
              ? (isLogin ? 'Connexion...' : 'Inscription...') 
              : (isLogin ? 'Se connecter' : 'S\'inscrire')
            }
          </Button>
        </form>

        <div className="mt-6 text-center">
          <button
            type="button"
            onClick={() => setIsLogin(!isLogin)}
            className="text-blue-600 hover:text-blue-500 text-sm"
          >
            {isLogin 
              ? "Pas de compte ? Inscrivez-vous" 
              : "Déjà un compte ? Connectez-vous"
            }
          </button>
        </div>
      </Card>
    </div>
  );
};


//proleme avec l authentification, revoir cette partie
// import React, { useState } from 'react';
// import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input';
// import { Label } from '@/components/ui/label';
// import { Card } from '@/components/ui/card';
// import { authApi } from '@/services/api';
// import { useToast } from '@/hooks/use-toast';

// interface AuthFormProps {
//   onAuthSuccess: () => void;
// }

// export const AuthForm: React.FC<AuthFormProps> = ({ onAuthSuccess }) => {
//   const [isLogin, setIsLogin] = useState(true);
//   const [loading, setLoading] = useState(false);
//   const [formData, setFormData] = useState({
//     email: '',
//     password: '',
//     firstName: '',
//     lastName: ''
//   });
//   const { toast } = useToast();

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setLoading(true);

//     try {
//       if (isLogin) {
//         await authApi.login({
//           email: formData.email,
//           password: formData.password
//         });
//         toast({
//           title: "Connexion réussie",
//           description: "Vous êtes maintenant connecté.",
//         });
//       } else {
//         await authApi.register({
//           email: formData.email,
//           password: formData.password,
//           firstName: formData.firstName,
//           lastName: formData.lastName
//         });
//         toast({
//           title: "Inscription réussie",
//           description: "Votre compte a été créé. Vous pouvez maintenant vous connecter.",
//         });
//         setIsLogin(true);
//         setFormData({ email: formData.email, password: '', firstName: '', lastName: '' });
//         return;
//       }
//       onAuthSuccess();
//     } catch (error) {
//       toast({
//         title: "Erreur",
//         description: error instanceof Error ? error.message : "Une erreur est survenue",
//         variant: "destructive"
//       });
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleChange = (field: string, value: string) => {
//     setFormData(prev => ({ ...prev, [field]: value }));
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gray-50">
//       <Card className="w-full max-w-md p-8">
//         <div className="text-center mb-8">
//           <h1 className="text-2xl font-bold text-gray-900">
//             {isLogin ? 'Connexion' : 'Inscription'}
//           </h1>
//           <p className="text-gray-600 mt-2">
//             {isLogin 
//               ? 'Connectez-vous à votre compte' 
//               : 'Créez votre compte pour commencer'
//             }
//           </p>
//         </div>

//         <form onSubmit={handleSubmit} className="space-y-6">
//           {!isLogin && (
//             <div className="grid grid-cols-2 gap-4">
//               <div className="space-y-2">
//                 <Label htmlFor="firstName">Prénom</Label>
//                 <Input
//                   id="firstName"
//                   value={formData.firstName}
//                   onChange={(e) => handleChange('firstName', e.target.value)}
//                   required={!isLogin}
//                 />
//               </div>
//               <div className="space-y-2">
//                 <Label htmlFor="lastName">Nom</Label>
//                 <Input
//                   id="lastName"
//                   value={formData.lastName}
//                   onChange={(e) => handleChange('lastName', e.target.value)}
//                   required={!isLogin}
//                 />
//               </div>
//             </div>
//           )}

//           <div className="space-y-2">
//             <Label htmlFor="email">Email</Label>
//             <Input
//               id="email"
//               type="email"
//               value={formData.email}
//               onChange={(e) => handleChange('email', e.target.value)}
//               required
//             />
//           </div>

//           <div className="space-y-2">
//             <Label htmlFor="password">Mot de passe</Label>
//             <Input
//               id="password"
//               type="password"
//               value={formData.password}
//               onChange={(e) => handleChange('password', e.target.value)}
//               required
//               minLength={6}
//             />
//           </div>

//           <Button type="submit" className="w-full" disabled={loading}>
//             {loading 
//               ? (isLogin ? 'Connexion...' : 'Inscription...') 
//               : (isLogin ? 'Se connecter' : 'S\'inscrire')
//             }
//           </Button>
//         </form>

//         <div className="mt-6 text-center">
//           <button
//             type="button"
//             onClick={() => setIsLogin(!isLogin)}
//             className="text-blue-600 hover:text-blue-500 text-sm"
//           >
//             {isLogin 
//               ? "Pas de compte ? Inscrivez-vous" 
//               : "Déjà un compte ? Connectez-vous"
//             }
//           </button>
//         </div>

//         {isLogin && (
//           <div className="mt-4 p-3 bg-blue-50 rounded-md">
//             <p className="text-sm text-blue-800">
//               <strong>Compte de test :</strong><br />
//               Email: demo@example.com<br />
//               Mot de passe: password
//             </p>
//           </div>
//         )}
//       </Card>
//     </div>
//   );
// };
