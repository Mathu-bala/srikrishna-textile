import { useState, useEffect, useRef } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { getUserProfile, updateUserProfile } from '@/services/api';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2, Package, User as UserIcon, MapPin, Edit3, Image as ImageIcon, UploadCloud } from 'lucide-react';
import { toast } from 'sonner';

const UserProfile = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<any>(null);
  
  // Edit mode toggles
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [isEditingAddress, setIsEditingAddress] = useState(false);

  // Form states
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [profilePhoto, setProfilePhoto] = useState('');
  
  // Drag & drop state for photo
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Address states
  const [street, setStreet] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [pincode, setPincode] = useState('');
  const [country, setCountry] = useState('India');

  const fetchProfile = async () => {
    try {
      const data = await getUserProfile();
      setProfile(data);
      setName(data.name || '');
      setEmail(data.email || '');
      setPhone(data.phone || '');
      setProfilePhoto(data.profilePhoto || 'https://cdn-icons-png.flaticon.com/512/149/149071.png');

      if (data.address) {
        try {
          const parsed = JSON.parse(data.address);
          setStreet(parsed.street || '');
          setCity(parsed.city || '');
          setState(parsed.state || '');
          setPincode(parsed.pincode || '');
          setCountry(parsed.country || 'India');
        } catch (e) {
          setStreet(data.address);
        }
      }
    } catch (error) {
      toast.error('Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated && (!user || !user.isAdmin)) {
      fetchProfile();
    }
  }, [isAuthenticated, user]);

  if (!isAuthenticated) return <Navigate to="/login" />;
  if (user?.isAdmin) return <Navigate to="/admin/profile" />;

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
      setIsEditingProfile(false);
      fetchProfile();
    } catch (error: any) {
      toast.error(error.message || 'Failed to update profile');
    }
  };

  const handleAddressSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const addressJson = JSON.stringify({ street, city, state, pincode, country });
      await updateUserProfile({ address: addressJson });
      toast.success('Address saved successfully');
      setIsEditingAddress(false);
      fetchProfile();
    } catch (error: any) {
      toast.error(error.message || 'Failed to save address');
    }
  };

  // Image Upload Handlers
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processFile(file);
  };

  const processFile = (file: File) => {
    const reader = new FileReader();
    reader.onloadend = () => setProfilePhoto(reader.result as string);
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
    if (file && file.type.startsWith('image/')) processFile(file);
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
        <div className="max-w-[1000px] mx-auto space-y-6">
          <h1 className="text-2xl md:text-3xl font-display font-bold text-foreground">My Profile</h1>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Left Column: Profile Info & Address */}
            <div className="lg:col-span-2 space-y-6">
              
              {/* Profile Information Card */}
              <div className="bg-white dark:bg-card rounded-[12px] p-6 shadow-[0_4px_24px_rgb(0,0,0,0.06)] border border-border/50 transition-all duration-300">
                <div className="flex justify-between items-start mb-6 border-b border-border/30 pb-4">
                  <h2 className="text-xl font-semibold flex items-center gap-2">
                    <UserIcon className="w-5 h-5 text-primary" /> Profile Information
                  </h2>
                  {!isEditingProfile && (
                    <Button variant="outline" size="sm" onClick={() => setIsEditingProfile(true)}>
                      <Edit3 className="w-4 h-4 mr-2" /> Edit Profile
                    </Button>
                  )}
                </div>

                {!isEditingProfile ? (
                  <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 pt-2">
                    <div className="relative group shrink-0">
                      <img 
                        src={profile?.profilePhoto || 'https://cdn-icons-png.flaticon.com/512/149/149071.png'} 
                        alt="Profile" 
                        className="w-[120px] h-[120px] object-cover rounded-full border-[3px] border-primary/20 shadow-md transition-all"
                      />
                    </div>
                    <div className="space-y-2.5 text-center sm:text-left mt-2">
                      <p className="text-xl font-bold text-foreground">{profile?.name}</p>
                      <p className="text-sm text-foreground/80">{profile?.email}</p>
                      <p className="text-sm text-foreground/80">{profile?.phone || 'No phone number added'}</p>
                      <div className="pt-2">
                        <span className="inline-flex items-center px-3 py-1 bg-primary/10 text-primary text-xs font-semibold rounded-md uppercase tracking-wider">
                          {profile?.isAdmin ? 'Admin' : 'User'}
                        </span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleProfileSubmit} className="space-y-6 animate-in fade-in pt-2">
                    <div className="flex flex-col items-center sm:items-start gap-5 mb-6">
                      <div className="relative group cursor-pointer shrink-0" onClick={() => fileInputRef.current?.click()}>
                        <img 
                          src={profilePhoto || 'https://cdn-icons-png.flaticon.com/512/149/149071.png'} 
                          alt="Profile Preview" 
                          className="w-[120px] h-[120px] object-cover rounded-full border-[3px] border-primary/30 shadow-md group-hover:border-primary/60 transition-colors"
                        />
                        <div className="absolute inset-0 bg-black/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <ImageIcon className="text-white w-6 h-6" />
                        </div>
                      </div>
                      <div 
                        className={`w-full border-2 border-dashed rounded-xl p-4 text-center transition-colors cursor-pointer ${isDragging ? 'border-primary bg-primary/5' : 'border-border/60 hover:border-primary/40 bg-muted/10'}`}
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onDrop={handleDrop}
                        onClick={() => fileInputRef.current?.click()}
                      >
                        <UploadCloud className="mx-auto h-6 w-6 text-muted-foreground mb-2" />
                        <p className="text-sm font-medium text-foreground">Upload Photo</p>
                        <p className="text-xs text-muted-foreground mt-1">Drag & Drop or Click (120x120px)</p>
                        <input type="file" ref={fileInputRef} onChange={handlePhotoUpload} accept="image/*" className="hidden" />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div className="space-y-2 focus-within:text-primary transition-colors">
                        <label className="text-sm font-medium text-foreground/80">Full Name</label>
                        <Input value={name} onChange={(e) => setName(e.target.value)} required className="h-[44px] rounded-[8px] border-border/60 hover:border-border/80 bg-background px-4" />
                      </div>
                      <div className="space-y-2 focus-within:text-primary transition-colors">
                        <label className="text-sm font-medium text-foreground/80">Email Address</label>
                        <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="h-[44px] rounded-[8px] border-border/60 hover:border-border/80 bg-background px-4" />
                      </div>
                      <div className="space-y-2 focus-within:text-primary transition-colors">
                        <label className="text-sm font-medium text-foreground/80">Phone Number</label>
                        <Input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} className="h-[44px] rounded-[8px] border-border/60 hover:border-border/80 bg-background px-4" />
                      </div>
                    </div>

                    <div className="flex justify-end gap-3 mt-6 pt-6 border-t border-border/30">
                      <Button variant="ghost" type="button" onClick={() => { setIsEditingProfile(false); fetchProfile(); }} className="h-[40px] rounded-[8px] px-6 bg-muted/50 hover:bg-muted">Cancel</Button>
                      <Button type="submit" className="h-[40px] rounded-[8px] px-6 bg-gradient-to-r from-primary to-primary-foreground hover:opacity-90 text-white shadow-sm border-0">Save Changes</Button>
                    </div>
                  </form>
                )}
              </div>

              {/* Address Section */}
              <div className="bg-white dark:bg-card rounded-[12px] p-6 shadow-[0_4px_24px_rgb(0,0,0,0.06)] border border-border/50 transition-all duration-300">
                <div className="flex justify-between items-start mb-6 border-b border-border/30 pb-4">
                  <h2 className="text-xl font-semibold flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-secondary" /> Shipping Address
                  </h2>
                  {!isEditingAddress && (
                    <Button variant="outline" size="sm" onClick={() => setIsEditingAddress(true)}>
                      <Edit3 className="w-4 h-4 mr-2" /> {street ? 'Edit Address' : 'Add Address'}
                    </Button>
                  )}
                </div>

                {!isEditingAddress ? (
                  <div className="text-base text-foreground/80 space-y-1.5 pt-2">
                    {street ? (
                      <>
                        <p className="text-foreground font-medium text-lg mb-1">{street}</p>
                        <p>{city}, {state} {pincode}</p>
                        <p>{country}</p>
                      </>
                    ) : (
                      <p className="italic text-muted-foreground/70 bg-muted/20 p-4 rounded-lg text-center border border-dashed border-border/50">No shipping address provided yet.</p>
                    )}
                  </div>
                ) : (
                  <form onSubmit={handleAddressSubmit} className="space-y-5 animate-in fade-in pt-2">
                    <div className="space-y-2 focus-within:text-secondary transition-colors">
                      <label className="text-sm font-medium text-foreground/80">Street Address</label>
                      <Input value={street} onChange={(e) => setStreet(e.target.value)} placeholder="123 Main St, Apartment 4B" required className="h-[44px] rounded-[8px] border-border/60 hover:border-border/80 bg-background px-4" />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div className="space-y-2 focus-within:text-secondary transition-colors">
                        <label className="text-sm font-medium text-foreground/80">City</label>
                        <Input value={city} onChange={(e) => setCity(e.target.value)} placeholder="Mumbai" required className="h-[44px] rounded-[8px] border-border/60 hover:border-border/80 bg-background px-4" />
                      </div>
                      <div className="space-y-2 focus-within:text-secondary transition-colors">
                        <label className="text-sm font-medium text-foreground/80">State/Province</label>
                        <Input value={state} onChange={(e) => setState(e.target.value)} placeholder="Maharashtra" required className="h-[44px] rounded-[8px] border-border/60 hover:border-border/80 bg-background px-4" />
                      </div>
                      <div className="space-y-2 focus-within:text-secondary transition-colors">
                        <label className="text-sm font-medium text-foreground/80">Pincode</label>
                        <Input value={pincode} onChange={(e) => setPincode(e.target.value)} placeholder="400001" required className="h-[44px] rounded-[8px] border-border/60 hover:border-border/80 bg-background px-4" />
                      </div>
                      <div className="space-y-2 focus-within:text-secondary transition-colors">
                        <label className="text-sm font-medium text-foreground/80">Country</label>
                        <Input value={country} onChange={(e) => setCountry(e.target.value)} placeholder="India" required className="h-[44px] rounded-[8px] border-border/60 hover:border-border/80 bg-background px-4" />
                      </div>
                    </div>
                    <div className="flex justify-end gap-3 mt-6 pt-6 border-t border-border/30">
                      <Button variant="ghost" type="button" onClick={() => { setIsEditingAddress(false); fetchProfile(); }} className="h-[40px] rounded-[8px] px-6 bg-muted/50 hover:bg-muted">Cancel</Button>
                      <Button type="submit" className="h-[40px] rounded-[8px] px-6 bg-gradient-to-r from-secondary to-accent hover:opacity-90 text-white shadow-sm border-0">Save Address</Button>
                    </div>
                  </form>
                )}
              </div>

            </div>

            {/* Right Column: Order History Shortcut */}
            <div className="lg:col-span-1 h-full">
               <div className="bg-white dark:bg-card rounded-[12px] shadow-[0_4px_24px_rgb(0,0,0,0.06)] p-8 border border-border/50 h-full max-h-[400px] flex flex-col justify-center items-center text-center group hover:-translate-y-1 transition-transform duration-300">
                 <div className="relative mb-6">
                    <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full group-hover:bg-primary/30 transition-colors" />
                    <div className="bg-primary/10 w-24 h-24 rounded-full flex items-center justify-center relative z-10 border-2 border-primary/20">
                      <Package className="w-12 h-12 text-primary" />
                    </div>
                 </div>
                 <h3 className="text-2xl font-bold font-display mb-3">Order History</h3>
                 <p className="text-sm text-foreground/70 mb-8 leading-relaxed px-4">Track your recent purchases, view invoices, and manage past orders seamlessly.</p>
                 <Button 
                   className="w-full h-[48px] rounded-[8px] bg-gradient-to-r from-primary via-secondary to-primary bg-size-200 hover:bg-pos-100 transition-all duration-500 text-white font-medium text-base shadow-md border-0" 
                   onClick={() => navigate('/my-orders')}
                 >
                   View My Orders
                 </Button>
               </div>
            </div>

          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default UserProfile;
