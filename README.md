# Alternative Music Artists API

A RESTful API for managing information about alternative music bands and artists, built with Supabase Edge Functions and PostgreSQL.

## Features

- **Full CRUD Operations**: Create, Read, Update, and Delete artists
- **Pagination**: Efficient data retrieval with page-based pagination
- **Filtering**: Filter artists by genre, country, and active status
- **Soft Delete**: Artists are marked as inactive instead of being permanently deleted
- **Public API**: No authentication required for public access
- **Real-time Updates**: Built on Supabase for real-time capabilities

## Tech Stack

- **Backend**: Supabase Edge Functions (Deno runtime)
- **Database**: PostgreSQL with Row Level Security
- **Frontend**: React + TypeScript + Tailwind CSS
- **API Documentation**: Interactive web interface

## Data Structure

### Artist Schema

```typescript
interface Artist {
  id: string;              // UUID (auto-generated)
  name: string;            // Required
  genre: string;           // Required (e.g., "Indie Rock", "Post-Punk", "Shoegaze")
  formation_year?: number; // Optional
  country?: string;        // Optional
  active: boolean;         // Default: true
  description?: string;    // Optional
  popular_albums?: string[]; // Array of album names
  created_at: string;      // Auto-generated timestamp
  updated_at: string;      // Auto-updated timestamp
}
```

## API Endpoints

Base URL: `https://fartltsfwubdoohzoumw.supabase.co/functions/v1/artists`

### GET /artists
Retrieve all artists with optional pagination and filtering.

**Query Parameters:**
- `page` (number): Page number (default: 1)
- `limit` (number): Items per page (default: 10)
- `genre` (string): Filter by genre
- `country` (string): Filter by country
- `active` (boolean): Filter by active status

**Example:**
```bash
GET /artists?page=1&limit=5&genre=Indie%20Rock&active=true
```

**Response:**
```json
{
  "data": [
    {
      "id": "uuid",
      "name": "Arctic Monkeys",
      "genre": "Indie Rock",
      "formation_year": 2002,
      "country": "UK",
      "active": true,
      "description": "English rock band formed in Sheffield",
      "popular_albums": ["Whatever People Say I Am, That's What I'm Not", "AM"],
      "created_at": "2024-01-01T00:00:00Z",
      "updated_at": "2024-01-01T00:00:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 5,
    "total": 50,
    "totalPages": 10,
    "hasNext": true,
    "hasPrev": false
  }
}
```

### GET /artists/:id
Retrieve a specific artist by ID.

**Response:**
```json
{
  "data": {
    "id": "uuid",
    "name": "The Strokes",
    "genre": "Indie Rock",
    // ... other fields
  }
}
```

### POST /artists
Create a new artist.

**Request Body:**
```json
{
  "name": "The White Stripes",
  "genre": "Garage Rock",
  "formation_year": 1997,
  "country": "USA",
  "description": "American rock duo",
  "popular_albums": ["White Blood Cells", "Elephant"]
}
```

**Response:**
```json
{
  "data": {
    "id": "new-uuid",
    "name": "The White Stripes",
    "genre": "Garage Rock",
    // ... other fields with generated timestamps
  }
}
```

### PUT /artists/:id
Update an existing artist.

**Request Body:**
```json
{
  "description": "Updated description",
  "popular_albums": ["White Blood Cells", "Elephant", "Icky Thump"]
}
```

### DELETE /artists/:id
Soft delete an artist (sets active to false).

**Response:**
```json
{
  "message": "Artist deleted successfully",
  "data": {
    "id": "uuid",
    "active": false,
    // ... other fields
  }
}
```

## Error Handling

All endpoints return appropriate HTTP status codes:

- `200` - Success
- `201` - Created
- `400` - Bad Request (validation errors)
- `404` - Not Found
- `500` - Internal Server Error

Error responses include a descriptive message:

```json
{
  "error": "Name and genre are required"
}
```

## Setup Instructions

### Prerequisites
- Supabase account
- Node.js 18+ (for local development)

### Environment Variables
```bash
SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

### Database Setup
The database schema is automatically created via migrations:

```sql
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
```

### Local Development
1. Clone the repository
2. Install dependencies: `npm install`
3. Start development server: `npm run dev`
4. Open http://localhost:5173

### Deployment
The Edge Functions are automatically deployed with your Supabase project.

## Usage Examples

### Create an Artist
```bash
curl -X POST https://your-project.supabase.co/functions/v1/artists \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Radiohead",
    "genre": "Alternative Rock",
    "formation_year": 1985,
    "country": "UK",
    "description": "English rock band from Abingdon, Oxfordshire",
    "popular_albums": ["OK Computer", "Kid A", "In Rainbows"]
  }'
```

### Get All Artists
```bash
curl https://your-project.supabase.co/functions/v1/artists
```

### Filter by Genre
```bash
curl "https://your-project.supabase.co/functions/v1/artists?genre=Post-Punk&limit=5"
```

### Update an Artist
```bash
curl -X PUT https://your-project.supabase.co/functions/v1/artists/your-artist-id \
  -H "Content-Type: application/json" \
  -d '{
    "popular_albums": ["OK Computer", "Kid A", "In Rainbows", "A Moon Shaped Pool"]
  }'
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

MIT License - see LICENSE file for details.
