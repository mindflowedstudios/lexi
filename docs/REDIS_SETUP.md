# LexiOS Redis Database Setup Guide

This guide documents the Redis data structures used by LexiOS and how to set up your Upstash database.

## Environment Variables Required

Add these to your `.env.local` file and Vercel project settings:

```bash
REDIS_KV_REST_API_URL=https://your-database.upstash.io
REDIS_KV_REST_API_TOKEN=your-token-here
```

## Redis Key Patterns

### Authentication & Users

| Key Pattern | Type | Description | TTL |
|------------|------|-------------|-----|
| `chat:token:user:{username}:{token}` | String | Active auth token | 90 days |
| `chat:token:last:{username}` | String (JSON) | Grace period token for refresh | 30 days |
| `chat:password:{username}` | String | Bcrypt password hash | None |
| `chat:users:{username}` | String (JSON) | User profile data | None |

### Chat Rooms

| Key Pattern | Type | Description | TTL |
|------------|------|-------------|-----|
| `chat:rooms` | Set | Registry of all room IDs | None |
| `chat:room:{roomId}` | String (JSON) | Room metadata | None |
| `chat:messages:{roomId}` | List | Messages (newest first, max 100) | None |
| `chat:room:users:{roomId}` | Set | Users in a room | None |
| `chat:presence:{roomId}:{username}` | String | User presence | 24 hours |
| `chat:presencez:{roomId}` | Sorted Set | Presence with timestamps | None |

### Rate Limiting

| Key Pattern | Type | Description | TTL |
|------------|------|-------------|-----|
| `rl:chat:b:{username}:short` | String | Short burst counter | 10 sec |
| `rl:chat:b:{username}:long` | String | Long burst counter | 60 sec |
| `rl:{action}:{identifier}` | String | General rate limit counter | 60 sec |
| `rl:block:createUser:{ip}` | String | IP block for user creation | 24 hours |
| `rl:applet-ai:{scope}:{type}:{id}` | String | Applet AI rate limits | 1 hour |

### Shared Applets

| Key Pattern | Type | Description | TTL |
|------------|------|-------------|-----|
| `applet:share:{id}` | String (JSON) | Shared applet data | None |

### Songs (iPod/Karaoke)

| Key Pattern | Type | Description | TTL |
|------------|------|-------------|-----|
| `song:{youtubeId}` | String (JSON) | Song document with lyrics, translations, furigana | None |

## Data Structures

### User Document
```json
{
  "username": "kassam",
  "displayName": "Kassam",
  "createdAt": 1703001234567,
  "lastSeen": 1703001234567
}
```

### Room Document
```json
{
  "id": "general",
  "name": "General",
  "createdAt": 1703001234567,
  "createdBy": "kassam"
}
```

### Message Document
```json
{
  "id": "abc123...",
  "content": "Hello world!",
  "username": "kassam",
  "timestamp": 1703001234567,
  "roomId": "general"
}
```

### Applet Document
```json
{
  "id": "abc123...",
  "content": "<html>...</html>",
  "title": "My Applet",
  "icon": "🎮",
  "username": "kassam",
  "createdAt": 1703001234567,
  "featured": false
}
```

### Song Document
```json
{
  "id": "dQw4w9WgXcQ",
  "title": "Never Gonna Give You Up",
  "artist": "Rick Astley",
  "lyrics": {
    "lrc": "[00:00.00]Lyrics...",
    "parsedLines": [...]
  },
  "translations": {
    "ja": "...",
    "ko": "..."
  },
  "furigana": [...],
  "createdAt": 1703001234567,
  "updatedAt": 1703001234567
}
```

## Initial Setup Steps

1. **Create Upstash Account**: Go to [upstash.com](https://upstash.com) and create a free account

2. **Create Redis Database**:
   - Click "Create Database"
   - Name it "lexios" (or your preferred name)
   - Select your preferred region (closest to your users)
   - Choose "Regional" type for best latency

3. **Get Credentials**:
   - Copy the `UPSTASH_REDIS_REST_URL` as `REDIS_KV_REST_API_URL`
   - Copy the `UPSTASH_REDIS_REST_TOKEN` as `REDIS_KV_REST_API_TOKEN`

4. **Add to Environment**:
   - Create `.env.local` with the credentials
   - Add to Vercel project environment variables

5. **Create Admin User** (optional, done automatically on first login):
   - The first user to register as "kassam" will be the admin
   - Admin has special privileges for managing applets and chat rooms

## Vercel Integration

For easier setup, you can also:
1. Go to Vercel Dashboard → Your Project → Storage
2. Click "Connect Store" → "Upstash Redis"
3. This will automatically configure the environment variables

## Maintenance

### Clearing Rate Limits
If you need to reset rate limits:
```
DEL rl:*
```

### Viewing Active Users
```
SCAN 0 MATCH chat:token:user:* COUNT 100
```

### Checking Room Messages
```
LRANGE chat:messages:{roomId} 0 -1
```
