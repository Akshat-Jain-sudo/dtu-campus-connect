// Extended types for the application
export interface Listing {
  id: string;
  user_id: string;
  title: string;
  description: string | null;
  price: number;
  category_id: string | null;
  condition: 'new' | 'like_new' | 'good' | 'fair' | 'poor' | null;
  status: 'pending' | 'approved' | 'rejected' | 'sold' | 'archived';
  images: string[];
  location: string | null;
  hostel: string | null;
  is_negotiable: boolean;
  views_count: number;
  created_at: string;
  updated_at: string;
  category?: Category;
  seller?: Profile;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  icon: string | null;
  description: string | null;
  created_at: string;
}

export interface Profile {
  id: string;
  user_id: string;
  email: string;
  full_name: string | null;
  roll_number: string | null;
  branch: string | null;
  year: string | null;
  hostel: string | null;
  avatar_url: string | null;
  bio: string | null;
  phone: string | null;
  seller_verified: boolean;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Conversation {
  id: string;
  listing_id: string | null;
  buyer_id: string;
  seller_id: string;
  last_message_at: string;
  created_at: string;
  listing?: Listing;
  buyer?: Profile;
  seller?: Profile;
  last_message?: Message;
}

export interface Message {
  id: string;
  conversation_id: string;
  sender_id: string;
  content: string;
  is_read: boolean;
  created_at: string;
  sender?: Profile;
}

export interface Notification {
  id: string;
  user_id: string;
  type: string;
  title: string;
  message: string | null;
  data: Record<string, unknown>;
  is_read: boolean;
  created_at: string;
}

export interface Review {
  id: string;
  reviewer_id: string;
  reviewed_id: string;
  listing_id: string | null;
  rating: number;
  comment: string | null;
  created_at: string;
  reviewer?: Profile;
}

export interface Service {
  id: string;
  user_id: string;
  title: string;
  description: string | null;
  category: 'tutoring' | 'freelance' | 'assignment_help' | 'internship_referral' | 'other';
  price_type: 'fixed' | 'hourly' | 'negotiable' | 'free';
  price: number | null;
  status: 'active' | 'paused' | 'archived';
  created_at: string;
  updated_at: string;
  provider?: Profile;
}

export interface Resource {
  id: string;
  user_id: string;
  title: string;
  description: string | null;
  subject: string;
  semester: number | null;
  branch: string | null;
  file_url: string | null;
  file_type: string | null;
  downloads_count: number;
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
  uploader?: Profile;
}

export interface Rental {
  id: string;
  user_id: string;
  title: string;
  description: string | null;
  price_per_day: number;
  deposit: number | null;
  category: string | null;
  images: string[];
  availability_status: 'available' | 'rented' | 'unavailable';
  created_at: string;
  updated_at: string;
  owner?: Profile;
}

export interface Report {
  id: string;
  reporter_id: string;
  reported_listing_id: string | null;
  reported_user_id: string | null;
  reason: string;
  description: string | null;
  status: 'pending' | 'reviewed' | 'resolved' | 'dismissed';
  admin_notes: string | null;
  created_at: string;
  resolved_at: string | null;
}

export interface Announcement {
  id: string;
  admin_id: string;
  title: string;
  content: string;
  is_active: boolean;
  priority: 'low' | 'normal' | 'high' | 'urgent';
  created_at: string;
  expires_at: string | null;
}

export interface WishlistItem {
  id: string;
  user_id: string;
  listing_id: string;
  created_at: string;
  listing?: Listing;
}

export interface SavedSearch {
  id: string;
  user_id: string;
  query: string;
  filters: Record<string, unknown>;
  created_at: string;
}

export type AppRole = 'student' | 'seller' | 'admin';
