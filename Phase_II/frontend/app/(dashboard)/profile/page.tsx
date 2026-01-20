'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getUser, getToken } from '@/lib/auth';
import AvatarUpload from '@/components/ui/AvatarUpload';
import {
  User,
  Mail,
  Calendar,
  Edit3,
  Settings,
  Trophy,
  Target,
  TrendingUp,
  BarChart3,
  Activity,
  Clock,
  CheckSquare,
  Save,
  X,
  RefreshCw,
  AlertTriangle,
  MapPin,
  Link as LinkIcon,
  Github,
  Twitter,
  Linkedin,
  Plus,
  Bell
} from 'lucide-react';

interface UserStats {
  total_tasks: number;
  completed_tasks: number;
  active_tasks: number;
  completion_rate: number;
  streak: number;
  tasks_this_week: number;
  tasks_this_month: number;
  best_streak: number;
  avg_completion_time: number;
  productivity_score: number;
}

interface Activity {
  action: string;
  task_title: string;
  timestamp: string;
  icon: string;
  color: string;
  type: 'completed' | 'created' | 'updated' | 'deleted';
}

interface WeeklyData {
  day: string;
  count: number;
  date: string;
}

// Static color mapping to fix Tailwind dynamic class generation issue
const colorMap = {
  blue: {
    bg: 'from-blue-50 to-blue-100 border-blue-200',
    icon: 'bg-blue-500',
    text: 'text-blue-600',
    gradient: 'from-blue-500 to-blue-600',
    light: 'bg-blue-50',
    ring: 'ring-blue-500'
  },
  emerald: {
    bg: 'from-emerald-50 to-emerald-100 border-emerald-200',
    icon: 'bg-emerald-500',
    text: 'text-emerald-600',
    gradient: 'from-emerald-500 to-emerald-600',
    light: 'bg-emerald-50',
    ring: 'ring-emerald-500'
  },
  purple: {
    bg: 'from-purple-50 to-purple-100 border-purple-200',
    icon: 'bg-purple-500',
    text: 'text-purple-600',
    gradient: 'from-purple-500 to-purple-600',
    light: 'bg-purple-50',
    ring: 'ring-purple-500'
  },
  amber: {
    bg: 'from-amber-50 to-amber-100 border-amber-200',
    icon: 'bg-amber-500',
    text: 'text-amber-600',
    gradient: 'from-amber-500 to-amber-600',
    light: 'bg-amber-50',
    ring: 'ring-amber-500'
  },
  rose: {
    bg: 'from-rose-50 to-rose-100 border-rose-200',
    icon: 'bg-rose-500',
    text: 'text-rose-600',
    gradient: 'from-rose-500 to-rose-600',
    light: 'bg-rose-50',
    ring: 'ring-rose-500'
  },
  indigo: {
    bg: 'from-indigo-50 to-indigo-100 border-indigo-200',
    icon: 'bg-indigo-500',
    text: 'text-indigo-600',
    gradient: 'from-indigo-500 to-indigo-600',
    light: 'bg-indigo-50',
    ring: 'ring-indigo-500'
  }
} as const;

/**
 * Professional Profile Page - Clean Business Design
 *
 * Features:
 * - Clean, professional design with consistent light theme
 * - User statistics and analytics
 * - Activity timeline
 * - Profile editing capabilities
 * - Responsive design
 */
export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [stats, setStats] = useState<UserStats>({
    total_tasks: 0,
    completed_tasks: 0,
    active_tasks: 0,
    completion_rate: 0,
    streak: 0,
    tasks_this_week: 0,
    tasks_this_month: 0,
    best_streak: 0,
    avg_completion_time: 0,
    productivity_score: 0,
  });
  const [activity, setActivity] = useState<Activity[]>([]);
  const [weeklyData, setWeeklyData] = useState<WeeklyData[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'activity' | 'settings'>('overview');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    bio: '',
    location: '',
    website: '',
    github: '',
    twitter: '',
    linkedin: '',
  });
  const [userSettings, setUserSettings] = useState({
    email_notifications: true,
    push_notifications: true,
    weekly_summary: false,
    theme: 'light',
    language: 'en',
    timezone: 'UTC',
  });
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

  useEffect(() => {
    const currentUser = getUser();
    if (!currentUser) {
      router.push('/signin');
      return;
    }
    setUser(currentUser);
    fetchUserData();

    // Ensure page stays at top
    window.scrollTo(0, 0);
  }, [router]);

  // Prevent scroll restoration and keep page at top
  useEffect(() => {
    // Disable scroll restoration
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }

    // Force scroll to top
    window.scrollTo(0, 0);

    // Keep checking and forcing scroll to top for first 500ms
    const scrollInterval = setInterval(() => {
      window.scrollTo(0, 0);
    }, 50);

    setTimeout(() => {
      clearInterval(scrollInterval);
    }, 500);

    return () => {
      clearInterval(scrollInterval);
    };
  }, []);

  const fetchUserData = async () => {
    const token = getToken();
    if (!token) {
      router.push('/signin');
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      // Fetch full user profile (including avatar_url)
      const profileResponse = await fetch('http://localhost:8000/api/users/me', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (profileResponse.ok) {
        const profileData = await profileResponse.json();
        setUser(profileData);
        setAvatarUrl(profileData.avatar_url);

        // Update localStorage with avatar_url so other components can access it
        if (typeof window !== 'undefined') {
          const currentUser = localStorage.getItem('user');
          if (currentUser) {
            const userData = JSON.parse(currentUser);
            userData.avatar_url = profileData.avatar_url;
            localStorage.setItem('user', JSON.stringify(userData));
          }
        }

        // Update form data with profile info
        setFormData({
          name: profileData.name || '',
          email: profileData.email || '',
          bio: profileData.bio || '',
          location: profileData.location || '',
          website: profileData.website || '',
          github: profileData.github || '',
          twitter: profileData.twitter || '',
          linkedin: profileData.linkedin || '',
        });

        // Update user settings
        if (profileData.settings) {
          setUserSettings(profileData.settings);
        }
      }

      // Fetch user statistics from backend
      const statsResponse = await fetch('http://localhost:8000/api/users/me/stats', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!statsResponse.ok) {
        throw new Error('Failed to fetch user statistics');
      }

      const statsData = await statsResponse.json();
      setStats(statsData);

    } catch (err) {
      console.error('Error fetching user data:', err);
      setError('Failed to load profile data. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    const token = getToken();
    if (!token) return;

    try {
      const response = await fetch('http://localhost:8000/api/users/me', {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const updatedUser = await response.json();
        setUser(updatedUser);
        setIsEditing(false);
        // Refresh user data to get updated info including avatar
        await fetchUserData();
      } else {
        const errorData = await response.json();
        setError(errorData.detail || 'Failed to update profile');
      }
    } catch (err) {
      console.error('Error updating profile:', err);
      setError('Failed to update profile');
    }
  };

  const handleSettingsUpdate = async (newSettings: any) => {
    const token = getToken();
    if (!token) return;

    try {
      const response = await fetch('http://localhost:8000/api/users/me/settings', {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newSettings),
      });

      if (response.ok) {
        const result = await response.json();
        setUserSettings(result.settings);
      } else {
        const errorData = await response.json();
        setError(errorData.detail || 'Failed to update settings');
      }
    } catch (err) {
      console.error('Error updating settings:', err);
      setError('Failed to update settings');
    }
  };

  const handleAvatarChange = async (newAvatarUrl: string | null) => {
    setAvatarUrl(newAvatarUrl);
    // Update user object as well
    if (user) {
      setUser({ ...user, avatar_url: newAvatarUrl });
    }
    // Refresh user data to ensure avatar persists
    await fetchUserData();
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-48 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-32"></div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 animate-pulse">
              <div className="h-32 bg-gray-200 rounded-full w-32 mx-auto mb-4"></div>
              <div className="h-6 bg-gray-200 rounded w-24 mx-auto mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-32 mx-auto"></div>
            </div>
            <div className="lg:col-span-2 space-y-6">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 animate-pulse">
                  <div className="h-6 bg-gray-200 rounded w-32 mb-4"></div>
                  <div className="space-y-3">
                    <div className="h-4 bg-gray-200 rounded"></div>
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white rounded-lg shadow-sm border border-red-200 p-8 text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertTriangle className="w-8 h-8 text-red-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Something went wrong</h3>
            <p className="text-gray-600 mb-6">{error}</p>
            <button
              onClick={fetchUserData}
              className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Ensure we always render something, even if user data is loading
  const displayUser = user || { name: 'User', email: 'Loading...' };
  const displayStats = stats || {
    total_tasks: 0,
    completed_tasks: 0,
    active_tasks: 0,
    completion_rate: 0,
    streak: 0,
    tasks_this_week: 0,
    tasks_this_month: 0,
    best_streak: 0,
    avg_completion_time: 0,
    productivity_score: 0,
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50/30 to-blue-50/40 p-4 md:p-6 perspective-container">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Premium Colorful Header */}
        <div className="relative overflow-hidden bg-gradient-to-r from-emerald-500 via-emerald-600 to-emerald-600 hover:to-emerald-700 rounded-2xl shadow-3d-xl p-6 md:p-8 card-3d-lift hover-shadow-3d">
          <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent"></div>
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>

          <div className="relative flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center shadow-lg">
                  <User className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl md:text-3xl font-bold text-white">
                    Profile Dashboard
                  </h1>
                  <p className="text-sm text-white/80 mt-1">Manage your account and track your productivity</p>
                </div>
              </div>
            </div>

            {/* Productivity Score Card */}
            <div className="relative">
              <div className="bg-white/20 backdrop-blur-md p-5 rounded-xl border border-white/30 shadow-xl">
                <div className="text-center">
                  <div className="relative inline-flex items-center justify-center w-16 h-16 mb-3">
                    <svg className="w-16 h-16 transform -rotate-90" viewBox="0 0 36 36">
                      <path
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        fill="none"
                        stroke="rgba(255,255,255,0.3)"
                        strokeWidth="2"
                      />
                      <path
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        fill="none"
                        stroke="white"
                        strokeWidth="2"
                        strokeDasharray={`${displayStats.productivity_score}, 100`}
                        className="transition-all duration-1000 ease-out"
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-xl font-bold text-white">
                        {displayStats.productivity_score}
                      </span>
                    </div>
                  </div>
                  <div className="text-xs font-semibold text-white">Productivity Score</div>
                  <div className="text-xs text-white/70 mt-1">
                    {displayStats.productivity_score >= 80 ? '🔥 Excellent' :
                     displayStats.productivity_score >= 60 ? '⚡ Good' :
                     displayStats.productivity_score >= 40 ? '📈 Fair' : '🌱 Getting Started'}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Colorful Navigation Tabs */}
        <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-3d-xl border border-white/50 p-2 card-3d-lift hover-shadow-3d">
          <div className="flex gap-2 overflow-x-auto">
            {[
              { id: 'overview', label: 'Overview', icon: BarChart3, gradient: 'from-emerald-500 to-teal-600' },
              { id: 'activity', label: 'Activity', icon: Activity, gradient: 'from-blue-500 to-indigo-600' },
              { id: 'settings', label: 'Settings', icon: Settings, gradient: 'from-purple-500 to-pink-600' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`relative flex items-center gap-2 px-5 py-3 rounded-lg font-medium transition-all duration-300 whitespace-nowrap ${
                  activeTab === tab.id
                    ? `bg-gradient-to-r ${tab.gradient} text-white shadow-lg transform scale-105`
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Sidebar - Professional Profile Card */}
          <div className="space-y-6">
            <div className="relative overflow-hidden bg-white rounded-2xl shadow-3d-xl border border-gray-200 p-6 hover-shadow-3d card-3d-lift transition-all duration-500">
              <div className="relative text-center mb-6">
                {/* Avatar Section */}
                <div className="mb-6">
                  <div className="relative inline-block">
                    <AvatarUpload
                      currentAvatarUrl={avatarUrl}
                      onAvatarChange={handleAvatarChange}
                      size="lg"
                    />
                    {/* Online Status Indicator */}
                    <div className="absolute bottom-2 right-2 w-5 h-5 bg-green-500 border-3 border-white rounded-full shadow-md"></div>
                  </div>
                </div>

                {/* User Info */}
                <div className="space-y-3">
                  <h2 className="text-xl font-bold text-gray-900">
                    {displayUser?.name || displayUser?.email?.split('@')[0] || 'User'}
                  </h2>
                  <div className="inline-flex items-center gap-2 bg-gray-50 px-4 py-2 rounded-lg border border-gray-200">
                    <Mail className="w-4 h-4 text-gray-600" />
                    <span className="text-sm font-medium text-gray-700">{displayUser?.email}</span>
                  </div>

                  {/* Enhanced Bio */}
                  {user?.bio && (
                    <div className="relative">
                      <div className="absolute inset-0 bg-gradient-to-r from-gray-50/50 to-blue-50/50 rounded-2xl blur"></div>
                      <p className="relative text-gray-700 bg-white/50 backdrop-blur-sm rounded-2xl p-6 border border-white/30 shadow-sm">
                        {user.bio}
                      </p>
                    </div>
                  )}

                  {/* Enhanced Location and Website */}
                  <div className="space-y-3">
                    {user?.location && (
                      <div className="flex items-center justify-center gap-3 text-gray-600 bg-white/50 backdrop-blur-sm rounded-xl p-3 border border-white/30">
                        <div className="w-8 h-8 bg-gradient-to-r from-rose-500 to-pink-600 rounded-lg flex items-center justify-center">
                          <MapPin className="w-4 h-4 text-white" />
                        </div>
                        <span className="font-medium">{user.location}</span>
                      </div>
                    )}
                    {user?.website && (
                      <div className="flex items-center justify-center gap-3 text-gray-600 bg-white/50 backdrop-blur-sm rounded-xl p-3 border border-white/30">
                        <div className="w-8 h-8 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
                          <LinkIcon className="w-4 h-4 text-white" />
                        </div>
                        <a
                          href={user.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-medium text-indigo-600 hover:text-indigo-700 underline transition-colors"
                        >
                          {user.website.replace(/^https?:\/\//, '')}
                        </a>
                      </div>
                    )}
                  </div>

                  {/* Enhanced Social Links */}
                  {(user?.github || user?.twitter || user?.linkedin) && (
                    <div className="flex justify-center gap-4 pt-4">
                      {user?.github && (
                        <a
                          href={`https://github.com/${user.github}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="group relative w-12 h-12 bg-gradient-to-r from-gray-700 to-gray-900 hover:from-gray-800 hover:to-black rounded-xl flex items-center justify-center transition-all duration-300 transform hover:scale-110 shadow-lg hover:shadow-xl"
                        >
                          <Github className="w-6 h-6 text-white group-hover:scale-110 transition-transform" />
                          <div className="absolute inset-0 bg-white/20 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                        </a>
                      )}
                      {user?.twitter && (
                        <a
                          href={`https://twitter.com/${user.twitter.replace('@', '')}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="group relative w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 rounded-xl flex items-center justify-center transition-all duration-300 transform hover:scale-110 shadow-lg hover:shadow-xl"
                        >
                          <Twitter className="w-6 h-6 text-white group-hover:scale-110 transition-transform" />
                          <div className="absolute inset-0 bg-white/20 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                        </a>
                      )}
                      {user?.linkedin && (
                        <a
                          href={`https://linkedin.com/in/${user.linkedin}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="group relative w-12 h-12 bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900 rounded-xl flex items-center justify-center transition-all duration-300 transform hover:scale-110 shadow-lg hover:shadow-xl"
                        >
                          <Linkedin className="w-6 h-6 text-white group-hover:scale-110 transition-transform" />
                          <div className="absolute inset-0 bg-white/20 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                        </a>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Enhanced Quick Stats with Modern Cards */}
              <div className="space-y-4 mb-8">
                {[
                  {
                    label: 'Member since',
                    value: displayUser?.created_at ? new Date(displayUser.created_at).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : 'Jan 2026',
                    icon: Calendar,
                    color: 'blue'
                  },
                  { label: 'Current Streak', value: `${displayStats.streak} days`, icon: Trophy, color: 'emerald' },
                  { label: 'Completion Rate', value: `${displayStats.completion_rate}%`, icon: Target, color: 'purple' }
                ].map((stat, index) => (
                  <div key={index} className={`group relative overflow-hidden bg-gradient-to-r ${colorMap[stat.color as keyof typeof colorMap].bg} rounded-2xl border hover:shadow-lg transition-all duration-300 transform hover:scale-102`}>
                    <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <div className="relative flex items-center justify-between p-5">
                      <div className="flex items-center gap-4">
                        <div className={`w-12 h-12 ${colorMap[stat.color as keyof typeof colorMap].icon} rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform`}>
                          <stat.icon className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <span className="text-sm font-medium text-gray-600">{stat.label}</span>
                          <div className="font-bold text-lg text-gray-900">{stat.value}</div>
                        </div>
                      </div>
                      <div className={`w-2 h-12 ${colorMap[stat.color as keyof typeof colorMap].icon} rounded-full opacity-30 group-hover:opacity-60 transition-opacity`}></div>
                    </div>
                  </div>
                ))}
              </div>
              {/* Enhanced Action Buttons */}
              <div className="relative space-y-4">
                <button
                  onClick={() => setIsEditing(!isEditing)}
                  className="group relative w-full py-4 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white rounded-2xl font-semibold transition-all duration-300 flex items-center justify-center gap-3 shadow-xl hover:shadow-2xl transform hover:scale-105 overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <div className="absolute inset-0 bg-gradient-to-r from-emerald-400/20 to-blue-400/20 opacity-0 group-hover:opacity-100 transition-opacity animate-pulse"></div>
                  {isEditing ? <X className="w-6 h-6 relative z-10" /> : <Edit3 className="w-6 h-6 relative z-10" />}
                  <span className="relative z-10">{isEditing ? 'Cancel Edit' : 'Edit Profile'}</span>
                </button>

                <button
                  onClick={() => setActiveTab('settings')}
                  className="group relative w-full py-4 bg-white/50 backdrop-blur-sm hover:bg-white/70 text-gray-900 rounded-2xl font-semibold transition-all duration-300 flex items-center justify-center gap-3 border border-white/30 hover:border-white/50 shadow-lg hover:shadow-xl transform hover:scale-105 overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-gray-50/50 to-blue-50/50 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <Settings className="w-6 h-6 relative z-10 text-gray-700 group-hover:text-gray-900" />
                  <span className="relative z-10">Account Settings</span>
                </button>
              </div>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-2 space-y-8">
            {/* Enhanced Edit Form */}
            {isEditing && (
              <div className="relative overflow-hidden bg-white/70 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-8">
                {/* Background Pattern */}
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-blue-500/5"></div>
                <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-emerald-400/10 to-blue-400/10 rounded-full blur-3xl"></div>

                <div className="relative">
                  <h3 className="text-xl font-bold text-gray-900 mb-8 flex items-center gap-4">
                    <div className="w-10 h-10 bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg">
                      <Edit3 className="w-5 h-5 text-white" />
                    </div>
                    Edit Profile
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-2">
                      <label className="block text-sm font-bold text-gray-700 mb-3">Name</label>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full px-6 py-4 bg-white/50 backdrop-blur-sm border border-white/30 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-gray-900 transition-all duration-300 hover:shadow-lg shadow-sm"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="block text-sm font-bold text-gray-700 mb-3">Email</label>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full px-6 py-4 bg-white/50 backdrop-blur-sm border border-white/30 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-gray-900 transition-all duration-300 hover:shadow-lg shadow-sm"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="block text-sm font-bold text-gray-700 mb-3">Location</label>
                      <input
                        type="text"
                        value={formData.location}
                        onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                        placeholder="City, Country"
                        className="w-full px-6 py-4 bg-white/50 backdrop-blur-sm border border-white/30 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-gray-900 transition-all duration-300 hover:shadow-lg shadow-sm"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="block text-sm font-bold text-gray-700 mb-3">Website</label>
                      <input
                        type="url"
                        value={formData.website}
                        onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                        placeholder="https://yourwebsite.com"
                        className="w-full px-6 py-4 bg-white/50 backdrop-blur-sm border border-white/30 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-gray-900 transition-all duration-300 hover:shadow-lg shadow-sm"
                      />
                    </div>
                    <div className="md:col-span-2 space-y-2">
                      <label className="block text-sm font-bold text-gray-700 mb-3">Bio</label>
                      <textarea
                        value={formData.bio}
                        onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                        rows={4}
                        className="w-full px-6 py-4 bg-white/50 backdrop-blur-sm border border-white/30 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-gray-900 transition-all duration-300 hover:shadow-lg shadow-sm resize-none"
                        placeholder="Tell us about yourself..."
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="block text-sm font-bold text-gray-700 mb-3">GitHub</label>
                      <input
                        type="text"
                        value={formData.github}
                        onChange={(e) => setFormData({ ...formData, github: e.target.value })}
                        placeholder="username"
                        className="w-full px-6 py-4 bg-white/50 backdrop-blur-sm border border-white/30 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-gray-900 transition-all duration-300 hover:shadow-lg shadow-sm"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="block text-sm font-bold text-gray-700 mb-3">Twitter</label>
                      <input
                        type="text"
                        value={formData.twitter}
                        onChange={(e) => setFormData({ ...formData, twitter: e.target.value })}
                        placeholder="@username"
                        className="w-full px-6 py-4 bg-white/50 backdrop-blur-sm border border-white/30 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-gray-900 transition-all duration-300 hover:shadow-lg shadow-sm"
                      />
                    </div>
                  </div>

                  <div className="mt-10 flex gap-6">
                    <button
                      onClick={handleSave}
                      className="group relative flex-1 py-4 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white rounded-2xl font-bold transition-all duration-300 flex items-center justify-center gap-3 shadow-xl hover:shadow-2xl transform hover:scale-105 overflow-hidden"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                      <Save className="w-6 h-6 relative z-10" />
                      <span className="relative z-10">Save Changes</span>
                    </button>
                    <button
                      onClick={() => setIsEditing(false)}
                      className="group relative px-8 py-4 bg-white/50 backdrop-blur-sm hover:bg-white/70 text-gray-900 rounded-2xl font-bold transition-all duration-300 border border-white/30 hover:border-white/50 shadow-lg hover:shadow-xl transform hover:scale-105 overflow-hidden"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-gray-50/50 to-blue-50/50 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                      <span className="relative z-10">Cancel</span>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Tab Content */}
            {activeTab === 'overview' && (
              <>
                {/* Enhanced Statistics Grid with Modern 3D Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {[
                    { label: 'Total Tasks', value: displayStats.total_tasks, icon: BarChart3, color: 'blue', bgColor: 'from-blue-500 to-blue-600', trend: '+12%' },
                    { label: 'Completed', value: displayStats.completed_tasks, icon: CheckSquare, color: 'emerald', bgColor: 'from-emerald-500 to-emerald-600', trend: '+8%' },
                    { label: 'Active', value: displayStats.active_tasks, icon: Clock, color: 'amber', bgColor: 'from-amber-500 to-amber-600', trend: '+3%' },
                    { label: 'This Week', value: displayStats.tasks_this_week, icon: Target, color: 'purple', bgColor: 'from-purple-500 to-purple-600', trend: '+15%' },
                  ].map((stat, index) => (
                    <div
                      key={index}
                      className="group relative overflow-hidden bg-white/70 backdrop-blur-xl rounded-3xl shadow-3d-xl border border-white/20 p-6 hover-shadow-3d card-3d-lift transition-all duration-500"
                    >
                      {/* Background Decoration */}
                      <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${stat.bgColor} opacity-5 rounded-full blur-2xl group-hover:opacity-10 transition-opacity`}></div>
                      <div className="absolute bottom-0 left-0 w-20 h-20 bg-gradient-to-tr from-white/20 to-transparent rounded-full blur-xl"></div>

                      <div className="relative">
                        {/* Header with Icon and Trend */}
                        <div className="flex items-center justify-between mb-6">
                          <div className={`relative w-14 h-14 bg-gradient-to-r ${stat.bgColor} rounded-2xl flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform duration-300`}>
                            <div className="absolute inset-0 bg-white/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                            <stat.icon className="w-7 h-7 text-white relative z-10" />
                          </div>
                          <div className={`px-3 py-1 bg-gradient-to-r ${colorMap[stat.color as keyof typeof colorMap].light} rounded-full border ${colorMap[stat.color as keyof typeof colorMap].ring} ring-1 ring-opacity-20`}>
                            <span className={`text-xs font-bold ${colorMap[stat.color as keyof typeof colorMap].text}`}>
                              {stat.trend}
                            </span>
                          </div>
                        </div>

                        {/* Main Value */}
                        <div className="mb-4">
                          <div className="text-3xl font-bold text-gray-900 mb-2 group-hover:scale-105 transition-transform duration-300">
                            {stat.value}
                          </div>
                          <div className="text-sm font-semibold text-gray-600">{stat.label}</div>
                        </div>

                        {/* Progress Bar */}
                        <div className="relative">
                          <div className="w-full bg-gray-200/50 rounded-full h-3 overflow-hidden">
                            <div
                              className={`bg-gradient-to-r ${stat.bgColor} h-3 rounded-full transition-all duration-1000 ease-out shadow-sm`}
                              style={{
                                width: `${Math.min((stat.value / Math.max(displayStats.total_tasks, 1)) * 100, 100)}%`,
                                animationDelay: `${index * 200}ms`
                              }}
                            >
                              <div className="absolute inset-0 bg-white/30 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
                            </div>
                          </div>
                          <div className="absolute -top-1 right-0 w-2 h-5 bg-white rounded-full shadow-sm opacity-0 group-hover:opacity-100 transition-opacity"></div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Enhanced Activity Chart with Modern Design */}
                <div className="relative overflow-hidden bg-white/70 backdrop-blur-xl rounded-3xl shadow-3d-xl border border-white/20 p-8 card-3d-lift hover-shadow-3d">
                  {/* Background Pattern */}
                  <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 via-blue-500/5 to-purple-500/5"></div>
                  <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-emerald-400/10 to-blue-400/10 rounded-full blur-3xl"></div>

                  <div className="relative">
                    <div className="flex items-center justify-between mb-10">
                      <h3 className="text-xl font-bold text-gray-900 flex items-center gap-4">
                        <div className="w-10 h-10 bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg">
                          <TrendingUp className="w-5 h-5 text-white" />
                        </div>
                        Activity Overview
                      </h3>
                      <div className="flex items-center gap-2 bg-white/50 backdrop-blur-sm rounded-full px-4 py-2 border border-white/30">
                        <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                        <span className="text-sm font-medium text-gray-700">Live Data</span>
                      </div>
                    </div>

                    {/* Enhanced Stats Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
                      {[
                        { label: 'This Week', value: displayStats.tasks_this_week, sublabel: 'tasks completed', color: 'emerald', icon: Calendar },
                        { label: 'This Month', value: displayStats.tasks_this_month, sublabel: 'tasks completed', color: 'blue', icon: BarChart3 },
                        { label: 'Best Streak', value: displayStats.best_streak, sublabel: 'days in a row', color: 'purple', icon: Trophy }
                      ].map((item, index) => (
                        <div key={index} className={`group relative overflow-hidden text-center p-8 bg-gradient-to-br ${colorMap[item.color as keyof typeof colorMap].bg} rounded-2xl border hover:shadow-xl transition-all duration-500 transform hover:scale-105`}>
                          <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                          <div className="absolute top-4 right-4 opacity-10 group-hover:opacity-20 transition-opacity">
                            <item.icon className="w-16 h-16" />
                          </div>

                          <div className="relative">
                            <div className={`inline-flex items-center justify-center w-16 h-16 ${colorMap[item.color as keyof typeof colorMap].icon} rounded-2xl mb-6 shadow-lg group-hover:scale-110 transition-transform`}>
                              <item.icon className="w-8 h-8 text-white" />
                            </div>
                            <p className="text-sm font-semibold text-gray-600 mb-3">{item.label}</p>
                            <p className={`text-3xl font-bold ${colorMap[item.color as keyof typeof colorMap].text} mb-3 group-hover:scale-110 transition-transform`}>
                              {item.value}
                            </p>
                            <p className="text-sm text-gray-600 font-medium">{item.sublabel}</p>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Enhanced Weekly Activity Bar Chart */}
                    <div className="relative bg-white/50 backdrop-blur-sm rounded-2xl p-8 border border-white/30 shadow-lg">
                      <div className="flex items-center justify-between mb-8">
                        <h4 className="text-xl font-bold text-gray-800">Last 7 Days Activity</h4>
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-2">
                            <div className="w-3 h-3 bg-gradient-to-r from-emerald-500 to-emerald-400 rounded-full"></div>
                            <span className="text-sm text-gray-600">Tasks Completed</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-end justify-between gap-4 h-48">
                        {weeklyData.length > 0 ? (
                          weeklyData.map((data, index) => {
                            const maxCount = Math.max(...weeklyData.map(d => d.count), 1);
                            const height = Math.max((data.count / maxCount) * 100, 8);
                            return (
                              <div key={index} className="flex-1 flex flex-col items-center gap-4 group">
                                <div className="relative w-full flex flex-col items-center">
                                  {/* Tooltip */}
                                  <div className="absolute -top-12 bg-gray-900 text-white text-sm px-3 py-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity shadow-lg z-10">
                                    <div className="text-center">
                                      <div className="font-bold">{data.count}</div>
                                      <div className="text-xs">tasks</div>
                                    </div>
                                    <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
                                  </div>

                                  {/* Bar */}
                                  <div
                                    className="w-full bg-gradient-to-t from-emerald-600 via-emerald-500 to-emerald-400 rounded-t-2xl transition-all duration-700 hover:from-emerald-700 hover:via-emerald-600 hover:to-emerald-500 cursor-pointer shadow-lg relative overflow-hidden group-hover:shadow-xl"
                                    style={{ height: `${height}%` }}
                                  >
                                    <div className="absolute inset-0 bg-gradient-to-t from-white/0 via-white/10 to-white/30 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                    <div className="absolute top-0 left-0 w-full h-1 bg-white/50 rounded-full"></div>
                                  </div>
                                </div>

                                {/* Day Label */}
                                <div className="text-center">
                                  <span className="text-sm font-semibold text-gray-700 group-hover:text-gray-900 transition-colors">
                                    {data.day}
                                  </span>
                                  <div className="text-xs text-gray-500 mt-1">
                                    {new Date(data.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                  </div>
                                </div>
                              </div>
                            );
                          })
                        ) : (
                          <div className="flex-1 text-center py-16">
                            <div className="w-24 h-24 bg-gradient-to-r from-gray-200 to-gray-300 rounded-full flex items-center justify-center mx-auto mb-6">
                              <TrendingUp className="w-12 h-12 text-gray-400" />
                            </div>
                            <p className="text-xl font-semibold text-gray-600 mb-2">No activity data available</p>
                            <p className="text-gray-500">Start completing tasks to see your progress here</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}

            {activeTab === 'activity' && (
              <div className="relative overflow-hidden bg-white/70 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-8">
                {/* Background Pattern */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-indigo-500/5 to-purple-500/5"></div>
                <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-blue-400/10 to-purple-400/10 rounded-full blur-3xl"></div>

                <div className="relative">
                  <div className="flex items-center justify-between mb-10">
                    <h3 className="text-xl font-bold text-gray-900 flex items-center gap-4">
                      <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                        <Activity className="w-5 h-5 text-white" />
                      </div>
                      Recent Activity
                    </h3>
                    <div className="flex items-center gap-2 bg-white/50 backdrop-blur-sm rounded-full px-4 py-2 border border-white/30">
                      <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                      <span className="text-sm font-medium text-gray-700">Real-time Updates</span>
                    </div>
                  </div>

                  <div className="space-y-6">
                    {activity.length > 0 ? (
                      activity.map((item, index) => (
                        <div
                          key={index}
                          className="group relative overflow-hidden bg-white/50 backdrop-blur-sm rounded-2xl p-6 border border-white/30 hover:bg-white/70 hover:shadow-xl transition-all duration-300 transform hover:scale-102"
                        >
                          {/* Background Decoration */}
                          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-400/5 to-purple-400/5 rounded-full blur-2xl group-hover:opacity-100 opacity-50 transition-opacity"></div>

                          <div className="relative flex items-start gap-6">
                            {/* Enhanced Activity Icon */}
                            <div className="relative shrink-0">
                              <div className={`w-16 h-16 rounded-2xl flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform duration-300 ${
                                item.type === 'completed' ? 'bg-gradient-to-r from-emerald-500 to-emerald-600' :
                                item.type === 'created' ? 'bg-gradient-to-r from-blue-500 to-blue-600' :
                                item.type === 'updated' ? 'bg-gradient-to-r from-amber-500 to-amber-600' :
                                'bg-gradient-to-r from-red-500 to-red-600'
                              }`}>
                                <div className="absolute inset-0 bg-white/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                {item.type === 'completed' ? <CheckSquare className="w-8 h-8 text-white relative z-10" /> :
                                 item.type === 'created' ? <Plus className="w-8 h-8 text-white relative z-10" /> :
                                 item.type === 'updated' ? <Edit3 className="w-8 h-8 text-white relative z-10" /> :
                                 <X className="w-8 h-8 text-white relative z-10" />}
                              </div>

                              {/* Activity Type Badge */}
                              <div className={`absolute -bottom-2 -right-2 px-2 py-1 rounded-full text-xs font-bold text-white shadow-lg ${
                                item.type === 'completed' ? 'bg-emerald-500' :
                                item.type === 'created' ? 'bg-blue-500' :
                                item.type === 'updated' ? 'bg-amber-500' : 'bg-red-500'
                              }`}>
                                {item.type}
                              </div>
                            </div>

                            {/* Activity Content */}
                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between gap-4 mb-3">
                                <h4 className="text-xl font-bold text-gray-900 group-hover:text-gray-800 transition-colors">
                                  {item.action}
                                </h4>
                                <div className="flex items-center gap-2 text-gray-500">
                                  <Clock className="w-4 h-4" />
                                  <span className="text-sm font-medium">
                                    {new Date(item.timestamp).toLocaleDateString('en-US', {
                                      month: 'short',
                                      day: 'numeric',
                                      hour: '2-digit',
                                      minute: '2-digit'
                                    })}
                                  </span>
                                </div>
                              </div>

                              <div className="bg-white/50 backdrop-blur-sm rounded-xl p-4 border border-white/30 group-hover:bg-white/70 transition-colors">
                                <p className="text-gray-800 font-semibold text-lg truncate">
                                  {item.task_title}
                                </p>
                                <div className="flex items-center gap-4 mt-3">
                                  <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold ${
                                    item.type === 'completed' ? 'bg-emerald-100 text-emerald-700' :
                                    item.type === 'created' ? 'bg-blue-100 text-blue-700' :
                                    item.type === 'updated' ? 'bg-amber-100 text-amber-700' :
                                    'bg-red-100 text-red-700'
                                  }`}>
                                    <div className={`w-2 h-2 rounded-full ${
                                      item.type === 'completed' ? 'bg-emerald-500' :
                                      item.type === 'created' ? 'bg-blue-500' :
                                      item.type === 'updated' ? 'bg-amber-500' : 'bg-red-500'
                                    }`}></div>
                                    Task {item.type}
                                  </div>
                                  <div className="text-xs text-gray-500">
                                    {Math.floor(Math.random() * 5) + 1} minutes ago
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-20">
                        <div className="relative inline-flex items-center justify-center w-32 h-32 mb-8">
                          <div className="absolute inset-0 bg-gradient-to-r from-blue-200 to-purple-200 rounded-full blur opacity-50"></div>
                          <div className="relative w-24 h-24 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full flex items-center justify-center border border-white/50 shadow-lg">
                            <Activity className="w-12 h-12 text-blue-500" />
                          </div>
                        </div>
                        <h4 className="text-2xl font-bold text-gray-700 mb-4">No recent activity</h4>
                        <p className="text-gray-500 mb-8 max-w-md mx-auto">
                          Start creating and completing tasks to see your activity timeline here. Your productivity journey begins with the first step!
                        </p>
                        <button
                          onClick={() => router.push('/tasks')}
                          className="group relative inline-flex items-center gap-3 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white px-8 py-4 rounded-2xl font-bold transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:scale-105 overflow-hidden"
                        >
                          <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                          <Plus className="w-6 h-6 relative z-10" />
                          <span className="relative z-10">Create Your First Task</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'settings' && (
              <div className="space-y-8">
                {/* Enhanced Account Settings */}
                <div className="relative overflow-hidden bg-white/70 backdrop-blur-xl rounded-3xl shadow-3d-xl border border-white/20 p-8 card-3d-lift hover-shadow-3d">
                  {/* Background Pattern */}
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-indigo-500/5 to-blue-500/5"></div>
                  <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-purple-400/10 to-indigo-400/10 rounded-full blur-3xl"></div>

                  <div className="relative">
                    <div className="flex items-center justify-between mb-10">
                      <h3 className="text-xl font-bold text-gray-900 flex items-center gap-4">
                        <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                          <Settings className="w-5 h-5 text-white" />
                        </div>
                        Account Settings
                      </h3>
                      <div className="flex items-center gap-2 bg-white/50 backdrop-blur-sm rounded-full px-4 py-2 border border-white/30">
                        <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
                        <span className="text-sm font-medium text-gray-700">Preferences</span>
                      </div>
                    </div>

                    <div className="space-y-6">
                      {[
                        {
                          title: 'Email Notifications',
                          description: 'Receive email updates about your tasks and deadlines',
                          key: 'email_notifications',
                          icon: Mail,
                          color: 'emerald'
                        },
                        {
                          title: 'Push Notifications',
                          description: 'Get notified about due dates and reminders',
                          key: 'push_notifications',
                          icon: Bell,
                          color: 'blue'
                        },
                        {
                          title: 'Weekly Summary',
                          description: 'Receive weekly productivity reports and insights',
                          key: 'weekly_summary',
                          icon: BarChart3,
                          color: 'purple'
                        }
                      ].map((setting, index) => (
                        <div key={index} className="group relative overflow-hidden bg-white/50 backdrop-blur-sm rounded-2xl p-6 border border-white/30 hover:bg-white/70 hover:shadow-xl transition-all duration-300">
                          {/* Background Decoration */}
                          <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${colorMap[setting.color as keyof typeof colorMap].gradient} opacity-5 rounded-full blur-2xl group-hover:opacity-10 transition-opacity`}></div>

                          <div className="relative flex items-center justify-between">
                            <div className="flex items-center gap-6">
                              {/* Enhanced Icon */}
                              <div className={`w-16 h-16 bg-gradient-to-r ${colorMap[setting.color as keyof typeof colorMap].gradient} rounded-2xl flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform duration-300`}>
                                <div className="absolute inset-0 bg-white/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                <setting.icon className="w-8 h-8 text-white relative z-10" />
                              </div>

                              {/* Setting Info */}
                              <div className="space-y-2">
                                <h4 className="text-xl font-bold text-gray-900 group-hover:text-gray-800 transition-colors">
                                  {setting.title}
                                </h4>
                                <p className="text-gray-600 font-medium max-w-md">
                                  {setting.description}
                                </p>
                                <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold ${colorMap[setting.color as keyof typeof colorMap].light} ${colorMap[setting.color as keyof typeof colorMap].text}`}>
                                  <div className={`w-2 h-2 rounded-full ${colorMap[setting.color as keyof typeof colorMap].icon}`}></div>
                                  {userSettings[setting.key as keyof typeof userSettings] ? 'Enabled' : 'Disabled'}
                                </div>
                              </div>
                            </div>

                            {/* Enhanced Toggle Switch */}
                            <label className="relative inline-flex items-center cursor-pointer group/toggle">
                              <input
                                type="checkbox"
                                className="sr-only peer"
                                checked={userSettings[setting.key as keyof typeof userSettings] as boolean}
                                onChange={(e) => {
                                  const newSettings = {
                                    ...userSettings,
                                    [setting.key]: e.target.checked
                                  };
                                  setUserSettings(newSettings);
                                  handleSettingsUpdate({ [setting.key]: e.target.checked });
                                }}
                              />
                              <div className="relative w-16 h-9 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300/50 rounded-full peer transition-all duration-300 peer-checked:after:translate-x-7 peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-8 after:w-8 after:transition-all after:shadow-lg peer-checked:bg-gradient-to-r peer-checked:from-purple-500 peer-checked:to-indigo-600 shadow-inner group-hover/toggle:shadow-lg">
                                {/* Toggle Indicator */}
                                <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent rounded-full opacity-0 peer-checked:opacity-100 transition-opacity"></div>

                                {/* On/Off Icons */}
                                <div className="absolute top-1/2 left-2 transform -translate-y-1/2 w-5 h-5 flex items-center justify-center">
                                  <div className={`w-3 h-3 rounded-full transition-all duration-300 ${
                                    userSettings[setting.key as keyof typeof userSettings] ? 'bg-transparent' : 'bg-gray-400'
                                  }`}></div>
                                </div>
                                <div className="absolute top-1/2 right-2 transform -translate-y-1/2 w-5 h-5 flex items-center justify-center">
                                  <div className={`w-3 h-3 rounded-full transition-all duration-300 ${
                                    userSettings[setting.key as keyof typeof userSettings] ? 'bg-white' : 'bg-transparent'
                                  }`}></div>
                                </div>
                              </div>
                            </label>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Enhanced Danger Zone */}
                <div className="relative overflow-hidden bg-white/70 backdrop-blur-xl rounded-3xl shadow-2xl border border-red-200/50 p-8">
                  {/* Background Pattern */}
                  <div className="absolute inset-0 bg-gradient-to-br from-red-500/5 via-orange-500/5 to-pink-500/5"></div>
                  <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-red-400/10 to-pink-400/10 rounded-full blur-3xl"></div>

                  <div className="relative">
                    <div className="flex items-center justify-between mb-10">
                      <h3 className="text-xl font-bold text-red-700 flex items-center gap-4">
                        <div className="w-10 h-10 bg-gradient-to-r from-red-500 to-red-600 rounded-xl flex items-center justify-center shadow-lg">
                          <AlertTriangle className="w-5 h-5 text-white" />
                        </div>
                        Danger Zone
                      </h3>
                      <div className="flex items-center gap-2 bg-red-50/50 backdrop-blur-sm rounded-full px-4 py-2 border border-red-200/50">
                        <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                        <span className="text-sm font-medium text-red-700">Irreversible Actions</span>
                      </div>
                    </div>

                    <div className="space-y-6">
                      {/* Export Data Button */}
                      <button className="group relative w-full overflow-hidden bg-white/50 backdrop-blur-sm hover:bg-white/70 border border-red-200/50 hover:border-red-300/50 rounded-2xl p-6 text-left transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-102">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-orange-400/5 to-red-400/5 rounded-full blur-2xl group-hover:opacity-100 opacity-50 transition-opacity"></div>

                        <div className="relative flex items-center gap-6">
                          <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform duration-300">
                            <div className="absolute inset-0 bg-white/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                            <RefreshCw className="w-8 h-8 text-white relative z-10" />
                          </div>
                          <div className="flex-1">
                            <h4 className="text-xl font-bold text-red-700 mb-2 group-hover:text-red-800 transition-colors">
                              Export All Data
                            </h4>
                            <p className="text-red-600 font-medium">
                              Download all your tasks and activity data in JSON format
                            </p>
                            <div className="flex items-center gap-2 mt-3">
                              <div className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-xs font-bold">
                                Safe Action
                              </div>
                              <div className="text-xs text-red-500">
                                No data will be deleted
                              </div>
                            </div>
                          </div>
                          <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center group-hover:bg-red-200 transition-colors">
                            <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                          </div>
                        </div>
                      </button>

                      {/* Delete Account Button */}
                      <button className="group relative w-full overflow-hidden bg-red-50/50 backdrop-blur-sm hover:bg-red-100/50 border border-red-300/50 hover:border-red-400/50 rounded-2xl p-6 text-left transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-102">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-red-400/10 to-pink-400/10 rounded-full blur-2xl group-hover:opacity-100 opacity-70 transition-opacity"></div>

                        <div className="relative flex items-center gap-6">
                          <div className="w-16 h-16 bg-gradient-to-r from-red-600 to-red-700 rounded-2xl flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform duration-300">
                            <div className="absolute inset-0 bg-white/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                            <AlertTriangle className="w-8 h-8 text-white relative z-10" />
                          </div>
                          <div className="flex-1">
                            <h4 className="text-xl font-bold text-red-700 mb-2 group-hover:text-red-800 transition-colors">
                              Delete Account
                            </h4>
                            <p className="text-red-600 font-medium">
                              Permanently delete your account and all associated data
                            </p>
                            <div className="flex items-center gap-2 mt-3">
                              <div className="px-3 py-1 bg-red-200 text-red-800 rounded-full text-xs font-bold">
                                ⚠️ Irreversible
                              </div>
                              <div className="text-xs text-red-600">
                                This action cannot be undone
                              </div>
                            </div>
                          </div>
                          <div className="w-8 h-8 bg-red-200 rounded-full flex items-center justify-center group-hover:bg-red-300 transition-colors">
                            <AlertTriangle className="w-4 h-4 text-red-600" />
                          </div>
                        </div>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}









