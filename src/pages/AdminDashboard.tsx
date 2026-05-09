import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  Building2, 
  Plus, 
  Edit3, 
  Trash2, 
  Search, 
  LogOut,
  ChevronLeft,
  ChevronRight,
  X,
  AlertCircle,
  Loader2,
  ExternalLink
} from 'lucide-react';
import { Property } from '../types';
import { api } from '../lib/api';

const ADMIN_STORAGE_KEY = 'estatein_admin_api_key';

export const AdminDashboard: React.FC = () => {
  const [apiKey, setApiKey] = useState(localStorage.getItem(ADMIN_STORAGE_KEY) || '');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authError, setAuthError] = useState('');
  
  const [properties, setProperties] = useState<Property[]>([]);
  const [metrics, setMetrics] = useState<{ totalListings: number, portfolioValue: number, activeSearches: number } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProperty, setEditingProperty] = useState<Property | null>(null);
  const [formLoading, setFormLoading] = useState(false);

  // Auth Verification
  useEffect(() => {
    if (apiKey) {
      verifyAuth();
    }
  }, []);

  const verifyAuth = async (key = apiKey) => {
    if (!key) return;
    try {
      const res = await fetch('/api/health');
      if (res.ok) {
        setIsAuthenticated(true);
        fetchProperties(1, '', key);
        fetchMetrics(key);
      }
    } catch (err) {
      setAuthError('Authentication verification failed.');
    }
  };

  const fetchMetrics = async (key = apiKey) => {
    if (!key) return;
    try {
      const res = await api.get('/api/admin/metrics', key);
      if (res.ok) {
        const data = await res.json();
        setMetrics(data);
      } else {
        const text = await res.text();
        console.warn('Metrics API returned non-ok status:', res.status, text);
      }
    } catch (err) {
      console.error('Failed to fetch metrics:', err);
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const secret = 'estatein-admin-secret-2024';
    const trimmedKey = apiKey.trim();
    if (trimmedKey === secret) {
      localStorage.setItem(ADMIN_STORAGE_KEY, trimmedKey);
      setIsAuthenticated(true);
      setApiKey(trimmedKey);
      fetchProperties(1, '', trimmedKey);
      fetchMetrics(trimmedKey);
    } else {
      setAuthError('Invalid API Key. Access Denied.');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem(ADMIN_STORAGE_KEY);
    setIsAuthenticated(false);
    setApiKey('');
  };

  // Fetch Properties
  const fetchProperties = async (p = page, search = searchTerm, key = apiKey) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/properties?page=${p}&limit=10&search=${search}`);
      const data = await res.json();
      setProperties(data.properties || []);
      setTotalPages(data.totalPages || 1);
    } catch (err) {
      setError('Failed to fetch properties.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this property?')) return;
    
    try {
      const res = await api.delete(`/api/properties/${id}`, apiKey);
      if (res.ok) {
        // Optimized: Synchronized Delete without full re-fetch
        setProperties(prev => prev.filter(p => p.id !== id));
        fetchMetrics(); // Update metrics though as count changed
      } else {
        const text = await res.text();
        console.error('Delete failed:', res.status, text);
        alert(`Failed to delete property: ${res.statusText}`);
      }
    } catch (err) {
      alert('Error deleting property.');
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchProperties(1, searchTerm);
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#0F0F0F] flex items-center justify-center p-6 bg-gradient-to-br from-[#0F0F0F] via-[#141414] to-[#1A1A1A]">
        <div className="w-full max-w-md glass-card p-10 border border-white/10 shadow-2xl">
          <div className="flex justify-center mb-8">
            <div className="w-16 h-16 bg-purple-accent/10 rounded-2xl flex items-center justify-center text-purple-accent border border-purple-accent/20">
              <Building2 size={32} />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-center mb-2">Admin Panel</h1>
          <p className="text-gray-400 text-center text-sm mb-8">Please enter your API Key to access the dashboard</p>
          
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-gray-500">API Key</label>
              <input 
                type="password" 
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="Enter admin secret..."
                className="w-full bg-[#1A1A1A] border border-white/10 rounded-xl p-4 text-sm focus:border-purple-accent outline-none text-white transition-all"
                required
              />
            </div>
            
            {authError && (
              <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 flex items-center gap-3 text-red-500 text-sm">
                <AlertCircle size={18} />
                {authError}
              </div>
            )}
            
            <button type="submit" className="w-full btn-primary py-4 text-sm font-bold shadow-xl shadow-purple-accent/20">
              Verify & Enter
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0F0F0F] text-white flex">
      {/* Sidebar */}
      <aside className="w-72 border-r border-white/5 bg-[#141414] hidden lg:flex flex-col">
        <div className="p-8 border-b border-white/5 flex items-center gap-3">
          <div className="w-10 h-10 bg-purple-accent rounded-xl flex items-center justify-center shadow-lg shadow-purple-accent/20">
            <Building2 size={20} className="text-white" />
          </div>
          <span className="font-black text-xl tracking-tight">Estatein <span className="text-purple-accent">Admin</span></span>
        </div>
        
        <nav className="p-6 flex-1 space-y-2">
          <button className="w-full flex items-center gap-4 px-4 py-3 bg-purple-accent/10 text-purple-accent rounded-xl font-bold text-sm transition-all">
            <LayoutDashboard size={20} /> Dashboard
          </button>
          <button onClick={() => setIsModalOpen(true)} className="w-full flex items-center gap-4 px-4 py-3 text-gray-400 hover:bg-white/5 hover:text-white rounded-xl font-bold text-sm transition-all border border-transparent hover:border-white/5">
            <Plus size={20} /> Add Property
          </button>
          <div className="pt-4 border-t border-white/5 mt-4">
            <a href="/" className="w-full flex items-center gap-4 px-4 py-3 text-gray-500 hover:text-white rounded-xl font-bold text-sm transition-all">
              <ChevronLeft size={18} /> Back to Site
            </a>
          </div>
        </nav>
        
        <div className="p-6 border-t border-white/5">
          <button onClick={handleLogout} className="w-full flex items-center gap-4 px-4 py-3 text-red-500 hover:bg-red-500/10 rounded-xl font-bold text-sm transition-all">
            <LogOut size={20} /> Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto bg-[#0F0F0F]">
        {/* Header */}
        <header className="h-24 px-10 border-b border-white/5 flex items-center justify-between bg-[#141414]/50 backdrop-blur-md sticky top-0 z-40">
          <div>
            <h1 className="text-xl font-bold">Property Management</h1>
            <p className="text-xs text-gray-500">Manage your real estate listings</p>
          </div>
          
          <div className="flex items-center gap-6">
            <form onSubmit={handleSearch} className="relative hidden sm:block">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
              <input 
                type="text" 
                placeholder="Search properties..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-[#1A1A1A] border border-white/5 rounded-full pl-12 pr-6 py-2.5 text-sm focus:border-purple-accent/50 outline-none w-64 transition-all"
              />
            </form>
            <button onClick={() => setIsModalOpen(true)} className="bg-purple-accent px-6 py-2.5 rounded-full text-sm font-bold hover:scale-105 active:scale-95 transition-all shadow-lg shadow-purple-accent/20">
              New Listing
            </button>
          </div>
        </header>

        <div className="p-10">
          {/* Stats Bar */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            <div className="glass-card p-6 border border-white/5">
              <p className="text-gray-500 text-xs font-bold uppercase tracking-widest mb-2">Total Listings</p>
              <h3 className="text-3xl font-black">{metrics?.totalListings || '...'}</h3>
            </div>
            <div className="glass-card p-6 border border-white/5">
              <p className="text-gray-500 text-xs font-bold uppercase tracking-widest mb-2">Portfolio Value</p>
              <h3 className="text-3xl font-black text-purple-accent">
                {metrics ? `$${(metrics.portfolioValue / 1000000).toFixed(1)}M` : '...'}
              </h3>
            </div>
            <div className="glass-card p-6 border border-white/5">
              <p className="text-gray-500 text-xs font-bold uppercase tracking-widest mb-2">Active Searches</p>
              <h3 className="text-3xl font-black">{metrics?.activeSearches || '...'}</h3>
            </div>
          </div>

          {/* Table */}
          <div className="glass-card border border-white/5 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-[#141414] border-b border-white/5">
                  <tr>
                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-gray-500">Property</th>
                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-gray-500">Location</th>
                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-gray-500">Price</th>
                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-gray-500">Details</th>
                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-gray-500 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {loading ? (
                    <tr>
                      <td colSpan={5} className="px-6 py-20 text-center">
                        <Loader2 className="animate-spin inline-block text-purple-accent mb-4" size={32} />
                        <p className="text-gray-400 text-sm">Loading properties...</p>
                      </td>
                    </tr>
                  ) : properties.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-6 py-20 text-center">
                        <p className="text-gray-400">No properties found matching your search.</p>
                      </td>
                    </tr>
                  ) : (
                    properties.map((prop) => (
                      <tr key={prop.id} className="hover:bg-white/[0.02] transition-colors">
                        <td className="px-6 py-5">
                          <div className="flex items-center gap-4">
                            <img 
                              src={prop.image || 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&q=80&w=1200'} 
                              className="w-12 h-12 rounded-lg object-cover bg-[#1A1A1A]" 
                              onError={(e) => {
                                (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&q=80&w=1200';
                              }}
                            />
                            <div>
                              <div className="flex items-center gap-2">
                                <p className="font-bold text-sm">{prop.title}</p>
                                {prop.featured && (
                                  <span className="bg-purple-accent/20 text-purple-accent text-[8px] px-1.5 py-0.5 rounded font-bold uppercase">Featured</span>
                                )}
                              </div>
                              <span className="text-[10px] text-gray-500 uppercase tracking-widest">{prop.type}</span>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-5">
                          <span className="text-sm text-gray-400">{prop.location}</span>
                        </td>
                        <td className="px-6 py-5">
                          <span className="text-sm font-bold text-purple-accent">${prop.price.toLocaleString()}</span>
                        </td>
                        <td className="px-6 py-5">
                          <div className="flex items-center gap-4 text-[10px] text-gray-500 font-bold uppercase tracking-widest">
                            <span>{prop.beds} Beds</span>
                            <span className="w-1 h-1 rounded-full bg-gray-700" />
                            <span>{prop.baths} Baths</span>
                          </div>
                        </td>
                        <td className="px-6 py-5 text-right">
                          <div className="flex items-center justify-end gap-2">
                             <a 
                              href={`/properties/${prop.id}`} 
                              target="_blank" 
                              rel="noreferrer"
                              className="p-2 hover:bg-white/5 rounded-lg text-gray-400 hover:text-white transition-all"
                            >
                              <ExternalLink size={18} />
                            </a>
                            <button 
                              onClick={() => {
                                setEditingProperty(prop);
                                setIsModalOpen(true);
                              }}
                              className="p-2 hover:bg-purple-accent/10 rounded-lg text-gray-400 hover:text-purple-accent transition-all"
                            >
                              <Edit3 size={18} />
                            </button>
                            <button 
                              onClick={() => handleDelete(prop.id)}
                              className="p-2 hover:bg-red-500/10 rounded-lg text-gray-400 hover:text-red-500 transition-all"
                            >
                              <Trash2 size={18} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {!loading && totalPages > 1 && (
              <div className="p-6 bg-[#141414] border-t border-white/5 flex items-center justify-between">
                <p className="text-xs text-gray-500 uppercase tracking-widest font-bold">Page {page} of {totalPages}</p>
                <div className="flex items-center gap-2">
                  <button 
                    disabled={page === 1}
                    onClick={() => {
                      setPage(p => p - 1);
                      fetchProperties(page - 1);
                    }}
                    className="p-2 border border-white/10 rounded-lg hover:bg-white/5 disabled:opacity-30 transition-all"
                  >
                    <ChevronLeft size={20} />
                  </button>
                  <button 
                    disabled={page === totalPages}
                    onClick={() => {
                      setPage(p => p + 1);
                      fetchProperties(page + 1);
                    }}
                    className="p-2 border border-white/10 rounded-lg hover:bg-white/5 disabled:opacity-30 transition-all"
                  >
                    <ChevronRight size={20} />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Property Modal */}
      {isModalOpen && (
        <PropertyModal 
          property={editingProperty} 
          apiKey={apiKey}
          onClose={() => {
            setIsModalOpen(false);
            setEditingProperty(null);
          }} 
          onSuccess={(updatedProp) => {
            setIsModalOpen(false);
            setEditingProperty(null);
            
            if (editingProperty) {
              // Synchronized Edit
              setProperties(prev => prev.map(p => p.id === updatedProp.id ? updatedProp : p));
            } else {
              // Synchronized Add
              setProperties(prev => [updatedProp, ...prev]);
            }
            fetchMetrics();
          }}
        />
      )}
    </div>
  );
};

interface ModalProps {
  property: Property | null;
  apiKey: string;
  onClose: () => void;
  onSuccess: (prop: Property) => void;
}

const PropertyModal: React.FC<ModalProps> = ({ property, apiKey, onClose, onSuccess }) => {
  const [formData, setFormData] = useState<Partial<Property>>(
    property ? { ...property } : {
      title: '',
      description: '',
      price: 0,
      location: '',
      type: 'Apartment',
      beds: 1,
      baths: 1,
      area: '1200 sqft',
      image: '',
      gallery: [],
      amenities: [],
      yearBuilt: 2024,
      tagline: '',
      featured: false
    }
  );
  
  const [galleryStr, setGalleryStr] = useState(property ? (property.gallery as string[]).join(', ') : '');
  const [amenitiesStr, setAmenitiesStr] = useState(property ? (property.amenities as string[]).join(', ') : '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Validation
    if (!formData.title || !formData.price || !formData.location) {
      setError('Please fill required fields (Title, Price, Location)');
      setLoading(false);
      return;
    }

    if (Number(formData.price) <= 0) {
      setError('Price must be a positive number');
      setLoading(false);
      return;
    }

    const payload = {
      ...formData,
      gallery: galleryStr.split(',').map(s => s.trim()).filter(Boolean),
      amenities: amenitiesStr.split(',').map(s => s.trim()).filter(Boolean),
      featured: formData.featured ? 1 : 0
    };

      try {
        const url = property ? `/api/properties/${property.id}` : '/api/properties';
        const res = property 
          ? await api.put(url, payload, apiKey) 
          : await api.post(url, payload, apiKey);

        if (res.ok) {
          const result = await res.json();
          onSuccess(result);
        } else {
          const text = await res.text();
          console.error(`[Admin] API Error (${res.status} ${res.statusText}):`, text);
          
          let errorMessage = 'Operation failed';
          try {
            const data = JSON.parse(text);
            errorMessage = data.message || data.error || errorMessage;
          } catch (e) {
            errorMessage = `Server Error (${res.status}): ${text.slice(0, 100)}`;
          }
          
          setError(errorMessage);
        }
      } catch (err: any) {
      console.error('[Admin] Network Error:', err);
      setError(`Network error: ${err.message || 'Check your connection or console for details.'}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/80 backdrop-blur-sm">
      <div className="bg-[#141414] border border-white/10 w-full max-w-3xl max-h-[90vh] overflow-hidden rounded-3xl flex flex-col shadow-2xl">
        <div className="p-8 border-b border-white/5 flex items-center justify-between">
          <h2 className="text-2xl font-bold">{property ? 'Edit Property' : 'Add New Property'}</h2>
          <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-full text-gray-500 hover:text-white transition-all">
            <X size={24} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-8 overflow-y-auto flex-1 space-y-8 scrollbar-hide">
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 flex items-center gap-3 text-red-500 text-sm">
              <AlertCircle size={18} />
              {error}
            </div>
          )}

          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-gray-500">Property Title *</label>
              <input 
                type="text" 
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
                className="w-full bg-[#0F0F0F] border border-white/5 rounded-xl p-4 text-sm focus:border-purple-accent outline-none"
                placeholder="e.g. Modern Minimalist Villa"
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-gray-500">Price ($) *</label>
              <input 
                type="number" 
                value={formData.price}
                onChange={(e) => setFormData({...formData, price: Number(e.target.value)})}
                className="w-full bg-[#0F0F0F] border border-white/5 rounded-xl p-4 text-sm focus:border-purple-accent outline-none"
                placeholder="0.00"
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-gray-500">Beds</label>
                <input 
                  type="number" 
                  value={formData.beds}
                  onChange={(e) => setFormData({...formData, beds: Number(e.target.value)})}
                  className="w-full bg-[#0F0F0F] border border-white/5 rounded-xl p-4 text-sm focus:border-purple-accent outline-none"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-gray-500">Baths</label>
                <input 
                  type="number" 
                  value={formData.baths}
                  onChange={(e) => setFormData({...formData, baths: Number(e.target.value)})}
                  className="w-full bg-[#0F0F0F] border border-white/5 rounded-xl p-4 text-sm focus:border-purple-accent outline-none"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-gray-500">Area (e.g. 1500 sqft)</label>
                <input 
                  type="text" 
                  value={formData.area}
                  onChange={(e) => setFormData({...formData, area: e.target.value})}
                  className="w-full bg-[#0F0F0F] border border-white/5 rounded-xl p-4 text-sm focus:border-purple-accent outline-none"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-gray-500">Year Built</label>
                <input 
                  type="number" 
                  value={formData.yearBuilt}
                  onChange={(e) => setFormData({...formData, yearBuilt: Number(e.target.value)})}
                  className="w-full bg-[#0F0F0F] border border-white/5 rounded-xl p-4 text-sm focus:border-purple-accent outline-none"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-gray-500">Property Type</label>
              <select 
                value={formData.type}
                onChange={(e) => setFormData({...formData, type: e.target.value})}
                className="w-full bg-[#0F0F0F] border border-white/5 rounded-xl p-4 text-sm focus:border-purple-accent outline-none"
              >
                {['Apartment', 'Villa', 'Townhouse', 'Studio', 'Penthouse', 'Cottage'].map(t => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-gray-500">Tagline</label>
              <input 
                type="text" 
                value={formData.tagline}
                onChange={(e) => setFormData({...formData, tagline: e.target.value})}
                className="w-full bg-[#0F0F0F] border border-white/5 rounded-xl p-4 text-sm focus:border-purple-accent outline-none"
                placeholder="Short highlight..."
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-widest text-gray-500">Location *</label>
            <input 
              type="text" 
              value={formData.location}
              onChange={(e) => setFormData({...formData, location: e.target.value})}
              className="w-full bg-[#0F0F0F] border border-white/5 rounded-xl p-4 text-sm focus:border-purple-accent outline-none"
              placeholder="Full address or city"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-widest text-gray-500">Description</label>
            <textarea 
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              className="w-full bg-[#0F0F0F] border border-white/5 rounded-xl p-4 text-sm focus:border-purple-accent outline-none h-32 resize-none"
              placeholder="Tell about the property..."
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-widest text-gray-500">Main Image URL</label>
            <input 
              type="text" 
              value={formData.image}
              onChange={(e) => setFormData({...formData, image: e.target.value})}
              className="w-full bg-[#0F0F0F] border border-white/5 rounded-xl p-4 text-sm focus:border-purple-accent outline-none"
              placeholder="https://..."
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-widest text-gray-500">Gallery URLs (Comma separated)</label>
            <input 
              type="text" 
              value={galleryStr}
              onChange={(e) => setGalleryStr(e.target.value)}
              className="w-full bg-[#0F0F0F] border border-white/5 rounded-xl p-4 text-sm focus:border-purple-accent outline-none"
              placeholder="url1, url2, url3..."
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-widest text-gray-500">Amenities (Comma separated)</label>
            <input 
              type="text" 
              value={amenitiesStr}
              onChange={(e) => setAmenitiesStr(e.target.value)}
              className="w-full bg-[#0F0F0F] border border-white/5 rounded-xl p-4 text-sm focus:border-purple-accent outline-none"
              placeholder="Wifi, Pool, Parking..."
            />
          </div>

          <div className="flex items-center gap-4 bg-[#0F0F0F] p-4 rounded-xl border border-white/5 group-hover:border-purple-accent/30 transition-all">
             <input 
              type="checkbox" 
              id="featured-check"
              checked={formData.featured}
              onChange={(e) => setFormData({...formData, featured: e.target.checked})}
              className="w-5 h-5 rounded border-white/10 bg-transparent accent-purple-accent cursor-pointer"
            />
            <label htmlFor="featured-check" className="text-sm font-bold cursor-pointer">Mark as Featured Property</label>
          </div>
        </form>
        
        <div className="p-8 border-t border-white/5 bg-[#1A1A1A] flex items-center justify-end gap-4 shadow-inner">
          <button onClick={onClose} className="px-8 py-3 text-sm font-bold text-gray-400 hover:text-white transition-all">
            Cancel
          </button>
          <button 
            disabled={loading}
            onClick={handleSubmit} 
            className="btn-primary px-10 py-3 text-sm font-bold flex items-center gap-2"
          >
            {loading ? <Loader2 className="animate-spin" size={18} /> : (property ? 'Save Changes' : 'Create Listing')}
          </button>
        </div>
      </div>
    </div>
  );
};
