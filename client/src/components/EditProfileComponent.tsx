// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardHeader,
//   CardTitle,
// } from '@/components/ui/card';
// import { Bell, Lock, Settings, Shield, User } from 'lucide-react';
// import { useState } from 'react';
// import { ChangePasswordUserTab } from './ChangePasswordUserTab';
// import NotificationsComponentTab from './NotificationsComponentTab';
// import PrivacySecurityTab from './PrivacySecurityTab';
// import ProfileInformationTab from './ProfileInformationTab';
//
//
// interface ProfileData {
//   email: string;
//   firstName: string;
//   lastName: string;
//   profilePicture?: string;
//   notificationsEnabled: boolean;
// }
//
// type ActiveTab = 'profile' | 'password' | 'notifications' | 'privacy';
//
// export function ProfileComponent() {
//   const [activeTab, setActiveTab] = useState<ActiveTab>('profile');
//   const [profileData, setProfileData] = useState<ProfileData>({
//     email: '',
//     firstName: '',
//     lastName: '',
//     profilePicture: '',
//     notificationsEnabled: true,
//   });
//
//   const handleNotificationsToggle = (checked: boolean) => {
//     setProfileData((prev) => ({ ...prev, notificationsEnabled: checked }));
//     // TODO: Implement notifications toggle logic
//     console.log('Notifications enabled:', checked);
//   };
//
//   const menuItems = [
//     {
//       id: 'profile' as ActiveTab,
//       label: 'Profile Information',
//       icon: User,
//       description: 'Manage your personal details',
//     },
//     {
//       id: 'password' as ActiveTab,
//       label: 'Password',
//       icon: Lock,
//       description: 'Change your password',
//     },
//     {
//       id: 'notifications' as ActiveTab,
//       label: 'Notifications',
//       icon: Bell,
//       description: 'Control your notifications',
//     },
//     {
//       id: 'privacy' as ActiveTab,
//       label: 'Privacy & Security',
//       icon: Shield,
//       description: 'Privacy settings',
//     },
//   ];
//
//   const renderActiveTab = () => {
//     switch (activeTab) {
//       case 'profile':
//         return <ProfileInformationTab />;
//       case 'password':
//         return <ChangePasswordUserTab />;
//       case 'notifications':
//         return <NotificationsComponentTab />;
//       case 'privacy':
//         return <PrivacySecurityTab />;
//       default:
//         return null;
//     }
//   };
//
//   return (
//     <div className="container max-w-6xl mx-auto p-6">
//       <Card className="bg-background border-border">
//         <CardHeader>
//           <CardTitle className="text-2xl font-bold text-foreground flex items-center gap-2">
//             <Settings className="w-6 h-6" />
//             Account Settings
//           </CardTitle>
//           <CardDescription className="text-muted-foreground">
//             Manage your account settings and preferences
//           </CardDescription>
//         </CardHeader>
//
//         <CardContent className="p-0">
//           <div className="flex flex-col md:flex-row">
//             {/* Vertical Menu */}
//             <div className="md:w-64 border-b md:border-b-0 md:border-r border-border bg-muted/30">
//               <nav className="p-4 space-y-1">
//                 {menuItems.map((item) => {
//                   const Icon = item.icon;
//                   return (
//                     <button
//                       key={item.id}
//                       onClick={() => setActiveTab(item.id)}
//                       className={`w-full flex items-center gap-3 px-3 py-2 text-left rounded-lg transition-colors ${activeTab === item.id
//                           ? 'bg-primary text-primary-foreground shadow-sm'
//                           : 'text-foreground hover:bg-muted'
//                         }`}
//                     >
//                       <Icon className="w-4 h-4" />
//                       <div className="flex-1 min-w-0">
//                         <div className="text-sm font-medium">{item.label}</div>
//                         <div
//                           className={`text-xs ${activeTab === item.id
//                               ? 'text-primary-foreground/80'
//                               : 'text-muted-foreground'
//                             }`}
//                         >
//                           {item.description}
//                         </div>
//                       </div>
//                     </button>
//                   );
//                 })}
//               </nav>
//             </div>
//
//             {/* Content Area */}
//             <div className="flex-1 p-6">{renderActiveTab()}</div>
//           </div>
//         </CardContent>
//       </Card>
//     </div>
//   );
// }
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Bell, CreditCard, Lock, Settings, Shield, User } from 'lucide-react';
import { useState } from 'react';
import { ChangePasswordUserTab } from './ChangePasswordUserTab';
import NotificationsComponentTab from './NotificationsComponentTab';
import PrivacySecurityTab from './PrivacySecurityTab';
import ProfileInformationTab from './ProfileInformationTab';
import SubscriptionManagementTab from './SubscriptionManagementTab'; // We'll create this

interface ProfileData {
  email: string;
  firstName: string;
  lastName: string;
  profilePicture?: string;
  notificationsEnabled: boolean;
}

type ActiveTab = 'profile' | 'password' | 'notifications' | 'privacy' | 'subscription';

export function ProfileComponent() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('profile');
  const [profileData, setProfileData] = useState<ProfileData>({
    email: '',
    firstName: '',
    lastName: '',
    profilePicture: '',
    notificationsEnabled: true,
  });

  const handleNotificationsToggle = (checked: boolean) => {
    setProfileData((prev) => ({ ...prev, notificationsEnabled: checked }));
    // TODO: Implement notifications toggle logic
    console.log('Notifications enabled:', checked);
  };

  const menuItems = [
    {
      id: 'profile' as ActiveTab,
      label: 'Profile Information',
      icon: User,
      description: 'Manage your personal details',
    },
    {
      id: 'subscription' as ActiveTab,
      label: 'Subscription',
      icon: CreditCard,
      description: 'Manage your subscription',
    },
    {
      id: 'password' as ActiveTab,
      label: 'Password',
      icon: Lock,
      description: 'Change your password',
    },
    {
      id: 'notifications' as ActiveTab,
      label: 'Notifications',
      icon: Bell,
      description: 'Control your notifications',
    },
    {
      id: 'privacy' as ActiveTab,
      label: 'Privacy & Security',
      icon: Shield,
      description: 'Privacy settings',
    },
  ];

  const renderActiveTab = () => {
    switch (activeTab) {
      case 'profile':
        return <ProfileInformationTab />;
      case 'subscription':
        return <SubscriptionManagementTab />;
      case 'password':
        return <ChangePasswordUserTab />;
      case 'notifications':
        return <NotificationsComponentTab />;
      case 'privacy':
        return <PrivacySecurityTab />;
      default:
        return null;
    }
  };

  return (
    <div className="container max-w-6xl mx-auto p-6">
      <Card className="bg-background border-border">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-foreground flex items-center gap-2">
            <Settings className="w-6 h-6" />
            Account Settings
          </CardTitle>
          <CardDescription className="text-muted-foreground">
            Manage your account settings and preferences
          </CardDescription>
        </CardHeader>

        <CardContent className="p-0">
          <div className="flex flex-col md:flex-row">
            {/* Vertical Menu */}
            <div className="md:w-64 border-b md:border-b-0 md:border-r border-border bg-muted/30">
              <nav className="p-4 space-y-1">
                {menuItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.id}
                      onClick={() => setActiveTab(item.id)}
                      className={`w-full flex items-center gap-3 px-3 py-2 text-left rounded-lg transition-colors ${activeTab === item.id
                        ? 'bg-primary text-primary-foreground shadow-sm'
                        : 'text-foreground hover:bg-muted'
                        }`}
                    >
                      <Icon className="w-4 h-4" />
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium">{item.label}</div>
                        <div
                          className={`text-xs ${activeTab === item.id
                            ? 'text-primary-foreground/80'
                            : 'text-muted-foreground'
                            }`}
                        >
                          {item.description}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </nav>
            </div>

            {/* Content Area */}
            <div className="flex-1 p-6">{renderActiveTab()}</div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
