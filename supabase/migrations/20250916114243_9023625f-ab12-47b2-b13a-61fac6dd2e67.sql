-- Create the artists table with all required fields
CREATE TABLE public.artists (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  genre TEXT NOT NULL,
  formation_year INTEGER,
  country TEXT,
  active BOOLEAN NOT NULL DEFAULT true,
  description TEXT,
  popular_albums TEXT[] DEFAULT ARRAY[]::TEXT[],
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security for public access
ALTER TABLE public.artists ENABLE ROW LEVEL SECURITY;

-- Create policies for public access (since this is a public API)
CREATE POLICY "Artists are publicly viewable" 
ON public.artists 
FOR SELECT 
USING (true);

CREATE POLICY "Artists can be publicly created" 
ON public.artists 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Artists can be publicly updated" 
ON public.artists 
FOR UPDATE 
USING (true);

CREATE POLICY "Artists can be publicly deleted" 
ON public.artists 
FOR DELETE 
USING (true);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_artists_updated_at
BEFORE UPDATE ON public.artists
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create indexes for better performance
CREATE INDEX idx_artists_genre ON public.artists(genre);
CREATE INDEX idx_artists_country ON public.artists(country);
CREATE INDEX idx_artists_active ON public.artists(active);
CREATE INDEX idx_artists_formation_year ON public.artists(formation_year);