import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useActiveUser } from '@/hooks/useActiveUser';
import { useSendProfilePhoto } from '@/hooks/useSendProfilePhoto';
import { useUpdateUser } from '@/hooks/useUpdateUser';
import { Edit, Mail, Save } from 'lucide-react';
import { useRef, useState } from 'react';
import { toast } from 'react-toastify';
import Spinner from './Spinner';

export default function ProfileInformationTab() {
  const { data: user, isLoading: userLoading, isError } = useActiveUser();

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [newFirstName, setNewFirstName] = useState(
    user?.name.match(/^(\w+)\s*(.*)$/)?.[1],
  );
  const [newLastName, setNewLastName] = useState(
    user?.name.match(/^(\w+)\s*(.*)$/)?.[2],
  );

  const { mutate: updateUser, isPending: updatePending } = useUpdateUser();
  const { mutate: changeProfilePhoto, isPending: photoPending } =
    useSendProfilePhoto();
  if (userLoading) {
    return <Spinner open />;
  }

  if (!user) {
    return;
  }

  async function handleProfilePictureChange(
    e: React.ChangeEvent<HTMLInputElement>,
  ) {
    e.preventDefault();
    const files = e.target.files;
    if (!files) return;
    console.log('files', files);
    if (files.length > 0) {
      const file = files[0];
      console.log('file', file);

      if (file.size > 5 * 1024 * 1024) {
        toast.error('File size must be less than 5MB');
        return;
      }
      if (!file.type.startsWith('image/')) {
        toast.error('Please select an image file');
        return;
      }
      changeProfilePhoto(file);
    }
  }

  if (photoPending) return <Spinner open />;
  function handlePictureButtonClick() {
    fileInputRef.current?.click();
  }

  function handlePhotoClick() { }
  function handleProfileUpdate(e: React.MouseEvent<HTMLButtonElement>) {
    e.preventDefault();
    console.log('handelign');
    updateUser({
      firstName: newFirstName as string,
      lastName: newLastName as string,
      profilePhoto: user?.profilePhoto as string,
    });

    if (updatePending) return <Spinner open />;
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground mb-2">
          Profile Information
        </h2>
        <p className="text-muted-foreground">
          Update your personal information and profile picture
        </p>
      </div>

      {/* Profile Picture Section */}
      <div className="flex flex-col items-start space-y-4">
        <Label className="text-foreground">Profile Picture</Label>
        <div className="flex items-center gap-6">
          <div className="relative group">
            <Avatar className="relative flex shrink-0 overflow-hidden rounded-full cursor-pointer size-24 md:size-32 border-2 border-border shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105  ">
              <AvatarImage
                className="aspect-square h-full w-full object-cover "
                src={user.profilePhoto}
                alt="Profile image"
                onClick={handlePhotoClick}
              />
              <AvatarFallback>
                {user?.name.slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleProfilePictureChange}
              accept="image/*"
              className="hidden"
            />
            <Button
              size="icon"
              variant="secondary"
              className="absolute bottom-0 right-0 left-30 top-15 rounded-full w-6 h-6 bg-background border border-border"
              onClick={handlePictureButtonClick}
            >
              <Edit className="w-3 h-3 text-foreground" />
            </Button>
          </div>
          <div className="space-y-1">
            <p className="text-sm font-medium text-foreground">
              Upload a new photo
            </p>
            <p className="text-xs text-muted-foreground">
              Recommended: Square image, at least 200x200 pixels
            </p>
          </div>
        </div>
      </div>

      {/* Personal Information */}

      <form>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email" className="text-foreground">
              Email Address
            </Label>
            <div className="flex items-center gap-2">
              <Input
                id="email"
                type="email"
                value={user.email as string}
                disabled
                className="bg-muted text-muted-foreground border-border flex-1"
              />
              <Mail className="w-4 h-4 text-muted-foreground" />
            </div>
            <p className="text-xs text-muted-foreground">
              Email address cannot be changed
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName" className="text-foreground">
                First Name
              </Label>
              <Input
                id="firstName"
                value={newFirstName}
                onChange={(e) => {
                  setNewFirstName(e.target.value);
                }}
                placeholder="Enter your first name"
                className="border-border text-foreground bg-background"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="lastName" className="text-foreground">
                Last Name
              </Label>
              <Input
                id="lastName"
                value={newLastName}
                onChange={(e) => setNewLastName(e.target.value)}
                placeholder="Enter your last name"
                className="border-border text-foreground bg-background"
              />
            </div>
          </div>
        </div>

        <Button
          onClick={handleProfileUpdate}
          className="bg-primary mt-5 text-primary-foreground hover:bg-primary/90"
        >
          <Save className="w-4 h-4 mr-2" />
          Save Profile Changes
        </Button>
      </form>
    </div>
  );
}
