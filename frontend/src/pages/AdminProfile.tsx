import { useState, useEffect, useRef } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { getUserProfile, updateUserProfile } from '@/services/api';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2, UploadCloud, Image as ImageIcon } from 'lucide-react';
import { toast } from 'sonner';

const AdminProfile = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  
  // Form states
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [profilePhoto, setProfilePhoto] = useState('');
  
  // Drag & drop state
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchProfile = async () => {
    try {
      const data = await getUserProfile();
      setName(data.name || '');
      setEmail(data.email || '');
      setPhone(data.phone || '');
      setProfilePhoto(data.profilePhoto || 'https://cdn-icons-png.flaticon.com/512/149/149071.png');
    } catch (error) {
      toast.error('Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated && user?.isAdmin) {
      fetchProfile();
    }
  }, [isAuthenticated, user]);

  if (!isAuthenticated) return <Navigate to="/login" />;
  if (!user?.isAdmin) return <Navigate to="/profile" />;

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateUserProfile({
        name,
        email,
        phone,
        profilePhoto
      });
      toast.success('Profile updated successfully');
      fetchProfile();
    } catch (error: any) {
      toast.error(error.message || 'Failed to update admin profile');
    }
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const processFile = (file: File) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      setProfilePhoto(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/')) {
      processFile(file);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <main className="flex-grow flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-muted/20">
      <Header />
      <main className="flex-grow py-8 px-4 sm:px-6">
        <div className="max-w-[700px] mx-auto">
          <h1 className="text-2xl sm:text-3xl font-display font-bold text-foreground text-center mb-6">Admin Profile</h1>

          <div className="bg-white dark:bg-card rounded-[12px] p-6 sm:p-8 shadow-[0_4px_24px_rgb(0,0,0,0.06)] border border-border/50 transition-all duration-300">
            <form onSubmit={handleProfileSubmit}>
              
              {/* Profile Photo Section */}
              <div className="flex flex-col items-center justify-center space-y-5 mb-8">
                <div className="relative group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                  <img 
                    src={profilePhoto || 'https://cdn-icons-png.flaticon.com/512/149/149071.png'} 
                    alt="Profile" 
                    className="w-[120px] h-[120px] object-cover rounded-full border-[3px] border-muted/50 shadow-md transition-all group-hover:border-primary/50"
                  />
                  <div className="absolute inset-0 bg-black/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <ImageIcon className="text-white w-6 h-6" />
                  </div>
                </div>

                <div 
                  className={`w-full max-w-sm border-2 border-dashed rounded-xl p-5 text-center transition-colors cursor-pointer ${isDragging ? 'border-primary bg-primary/5' : 'border-border/60 hover:border-primary/40 bg-muted/10'}`}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                >
                  <UploadCloud className="mx-auto h-7 w-7 text-muted-foreground mb-2" />
                  <p className="text-sm font-medium text-foreground">Upload Profile Photo</p>
                  <p className="text-xs text-muted-foreground mt-1">Drag & Drop or Click to browse</p>
                  <input 
                    type="file" 
                    ref={fileInputRef}
                    onChange={handlePhotoUpload}
                    accept="image/*"
                    className="hidden"
                  />
                </div>
              </div>

              {/* Form Fields Section */}
              <div className="space-y-5">
                <div className="space-y-1.5 focus-within:text-blue-500 transition-colors">
                  <label className="text-sm font-medium text-foreground/80">Admin Name</label>
                  <Input 
                    value={name} 
                    onChange={(e) => setName(e.target.value)} 
                    required 
                    className="h-[42px] rounded-[8px] border-border/60 hover:border-border/80 text-foreground transition-all px-4 bg-background"
                  />
                </div>
                
                <div className="space-y-1.5 focus-within:text-blue-500 transition-colors">
                  <label className="text-sm font-medium text-foreground/80">Email Address</label>
                  <Input 
                    type="email"
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)} 
                    required
                    className="h-[42px] rounded-[8px] border-border/60 hover:border-border/80 text-foreground transition-all px-4 bg-background"
                  />
                </div>
                
                <div className="space-y-1.5 focus-within:text-blue-500 transition-colors">
                  <label className="text-sm font-medium text-foreground/80">Phone Number</label>
                  <Input 
                    type="tel"
                    value={phone} 
                    onChange={(e) => setPhone(e.target.value)} 
                    className="h-[42px] rounded-[8px] border-border/60 hover:border-border/80 text-foreground transition-all px-4 bg-background"
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end gap-3 mt-8 pt-6 border-t border-border/30">
                <Button 
                  type="button" 
                  onClick={() => { fetchProfile(); toast.info('Changes discarded'); }}
                  variant="ghost"
                  className="h-[40px] rounded-[8px] bg-gray-100 hover:bg-gray-200 text-gray-700 dark:bg-muted dark:hover:bg-muted/80 dark:text-foreground transition-colors px-6"
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  className="h-[40px] rounded-[8px] bg-gradient-to-r from-blue-600 to-blue-400 hover:opacity-90 text-white border-0 shadow-sm transition-opacity px-6"
                >
                  Save Changes
                </Button>
              </div>
            </form>
          </div>
          
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default AdminProfile;
