import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

interface Artist {
  id: string;
  name: string;
  genre: string;
  formation_year?: number;
  country?: string;
  active: boolean;
  description?: string;
  popular_albums?: string[];
  created_at: string;
  updated_at: string;
}

interface ArtistForm {
  name: string;
  genre: string;
  formation_year: string;
  country: string;
  description: string;
  popular_albums: string;
}

const ArtistAPI = () => {
  const [artists, setArtists] = useState<Artist[]>([]);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState<ArtistForm>({
    name: '',
    genre: '',
    formation_year: '',
    country: '',
    description: '',
    popular_albums: ''
  });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const API_BASE_URL = `https://fartltsfwubdoohzoumw.supabase.co/functions/v1/artists`;

  const fetchArtists = async (page = 1) => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('artists', {
        method: 'GET',
        body: null,
      });

      if (error) throw error;

      setArtists(data.data || []);
      setCurrentPage(data.pagination?.page || 1);
      setTotalPages(data.pagination?.totalPages || 1);
    } catch (error) {
      console.error('Error fetching artists:', error);
      toast.error('Failed to fetch artists');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.genre) {
      toast.error('Name and genre are required');
      return;
    }

    setLoading(true);
    try {
      const artistData = {
        name: form.name,
        genre: form.genre,
        formation_year: form.formation_year ? parseInt(form.formation_year) : undefined,
        country: form.country || undefined,
        description: form.description || undefined,
        popular_albums: form.popular_albums ? form.popular_albums.split(',').map(album => album.trim()) : []
      };

      const method = editingId ? 'PUT' : 'POST';
      const { data, error } = await supabase.functions.invoke('artists', {
        method,
        body: editingId ? { id: editingId, ...artistData } : artistData,
      });

      if (error) throw error;

      toast.success(editingId ? 'Artist updated successfully' : 'Artist created successfully');
      resetForm();
      fetchArtists(currentPage);
    } catch (error) {
      console.error('Error saving artist:', error);
      toast.error('Failed to save artist');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (artist: Artist) => {
    setForm({
      name: artist.name,
      genre: artist.genre,
      formation_year: artist.formation_year?.toString() || '',
      country: artist.country || '',
      description: artist.description || '',
      popular_albums: artist.popular_albums?.join(', ') || ''
    });
    setEditingId(artist.id);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this artist?')) return;

    setLoading(true);
    try {
      const { error } = await supabase.functions.invoke('artists', {
        method: 'DELETE',
        body: { id },
      });

      if (error) throw error;

      toast.success('Artist deleted successfully');
      fetchArtists(currentPage);
    } catch (error) {
      console.error('Error deleting artist:', error);
      toast.error('Failed to delete artist');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setForm({
      name: '',
      genre: '',
      formation_year: '',
      country: '',
      description: '',
      popular_albums: ''
    });
    setEditingId(null);
  };

  useEffect(() => {
    fetchArtists();
  }, []);

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold text-foreground">Alternative Music Artists API</h1>
          <p className="text-muted-foreground">RESTful API for managing alternative music bands and artists</p>
          <div className="bg-card p-4 rounded-lg border">
            <p className="text-sm text-muted-foreground">
              API Endpoint: <code className="bg-muted px-2 py-1 rounded">{API_BASE_URL}</code>
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Form */}
          <Card>
            <CardHeader>
              <CardTitle>{editingId ? 'Edit Artist' : 'Add New Artist'}</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <Input
                  placeholder="Artist Name *"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  required
                />
                <Input
                  placeholder="Genre (e.g., Indie Rock, Post-Punk, Shoegaze) *"
                  value={form.genre}
                  onChange={(e) => setForm({ ...form, genre: e.target.value })}
                  required
                />
                <Input
                  type="number"
                  placeholder="Formation Year"
                  value={form.formation_year}
                  onChange={(e) => setForm({ ...form, formation_year: e.target.value })}
                />
                <Input
                  placeholder="Country"
                  value={form.country}
                  onChange={(e) => setForm({ ...form, country: e.target.value })}
                />
                <Textarea
                  placeholder="Description"
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                />
                <Input
                  placeholder="Popular Albums (comma-separated)"
                  value={form.popular_albums}
                  onChange={(e) => setForm({ ...form, popular_albums: e.target.value })}
                />
                <div className="flex gap-2">
                  <Button type="submit" disabled={loading}>
                    {editingId ? 'Update' : 'Create'} Artist
                  </Button>
                  {editingId && (
                    <Button type="button" variant="outline" onClick={resetForm}>
                      Cancel
                    </Button>
                  )}
                </div>
              </form>
            </CardContent>
          </Card>

          {/* API Documentation */}
          <Card>
            <CardHeader>
              <CardTitle>API Endpoints</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Badge variant="secondary">GET</Badge>
                  <code>/artists</code>
                </div>
                <p className="text-sm text-muted-foreground">Get all artists with pagination and filtering</p>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Badge variant="secondary">GET</Badge>
                  <code>/artists/:id</code>
                </div>
                <p className="text-sm text-muted-foreground">Get specific artist by ID</p>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Badge variant="default">POST</Badge>
                  <code>/artists</code>
                </div>
                <p className="text-sm text-muted-foreground">Create a new artist</p>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Badge variant="outline">PUT</Badge>
                  <code>/artists/:id</code>
                </div>
                <p className="text-sm text-muted-foreground">Update existing artist</p>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Badge variant="destructive">DELETE</Badge>
                  <code>/artists/:id</code>
                </div>
                <p className="text-sm text-muted-foreground">Soft delete artist (sets active to false)</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Artists List */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Artists ({artists.length})</CardTitle>
            <Button onClick={() => fetchArtists(currentPage)} disabled={loading}>
              Refresh
            </Button>
          </CardHeader>
          <CardContent>
            {loading ? (
              <p className="text-center text-muted-foreground">Loading...</p>
            ) : artists.length === 0 ? (
              <p className="text-center text-muted-foreground">No artists found</p>
            ) : (
              <div className="space-y-4">
                {artists.map((artist) => (
                  <div key={artist.id} className="border rounded-lg p-4 space-y-2">
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <h3 className="font-semibold text-lg">{artist.name}</h3>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline">{artist.genre}</Badge>
                          {artist.formation_year && (
                            <Badge variant="secondary">{artist.formation_year}</Badge>
                          )}
                          {artist.country && (
                            <Badge variant="secondary">{artist.country}</Badge>
                          )}
                          <Badge variant={artist.active ? "default" : "destructive"}>
                            {artist.active ? "Active" : "Inactive"}
                          </Badge>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" onClick={() => handleEdit(artist)}>
                          Edit
                        </Button>
                        <Button size="sm" variant="destructive" onClick={() => handleDelete(artist.id)}>
                          Delete
                        </Button>
                      </div>
                    </div>
                    {artist.description && (
                      <p className="text-sm text-muted-foreground">{artist.description}</p>
                    )}
                    {artist.popular_albums && artist.popular_albums.length > 0 && (
                      <div className="space-y-1">
                        <p className="text-sm font-medium">Popular Albums:</p>
                        <div className="flex flex-wrap gap-1">
                          {artist.popular_albums.map((album, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {album}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ArtistAPI;