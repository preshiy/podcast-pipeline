# 🎙️ Podcast Episode Metadata Pipeline

A full-stack app that searches podcasts from iTunes API, normalizes metadata, calculates publishing frequency scores and ranks by consistency.

## ✨ Features
- Search podcasts by topic or keyword
- Fetches data from iTunes API
- Normalizes podcast metadata
- Calculates frequency and consistency scores
- Saves and caches data in PostgreSQL
- Ranks podcasts from most to least consistent
- Beautiful React dashboard with purple theme

## 🛠️ Tech Stack
- **Backend:** Node.js, Express.js
- **Database:** PostgreSQL
- **Frontend:** React, Vite
- **API:** iTunes Search API

## 📊 How Scoring Works
| Episodes | Score |
|----------|-------|
| 500+ | 10/10 |
| 200-499 | 8/10 |
| 100-199 | 6/10 |
| 50-99 | 4/10 |
| 10-49 | 2/10 |

## 🔗 API Endpoints
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/podcasts/search/:query` | Search and save podcasts |
| GET | `/api/podcasts/ranked` | Get all podcasts ranked by score |

## 📦 Installation

### Backend
```bash
git clone https://github.com/preshiy/podcast-pipeline.git
cd podcast-pipeline
npm install
```

Create `.env` file: