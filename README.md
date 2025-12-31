# NoteSphere 📚

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Next.js](https://img.shields.io/badge/Next.js-13.5%2B-black?logo=next.js)](https://nextjs.org/)
[![Prisma](https://img.shields.io/badge/Prisma-ORM-brightgreen?logo=prisma)](https://prisma.io/)

A modern academic notes sharing platform where students can discover, share, and collaborate on course materials.


## Features ✨

- **Semester-Based Organization**  
  Browse notes by academic semesters (Sem 1, Sem 2, Sem 3 etc.)
  
- **Subject-Centric Collections**  
  Find resources for specific courses (e.g., CS101, MATH201)

- **Rich Note Types**  
  Supports PDFs, PPTs, handwritten notes, and lecture summaries

- **Social Learning**  
  - Like and comment on helpful resources
  - Track most downloaded notes

- **Admin Moderation**  
  Quality control with PENDING/APPROVED/REJECTED workflow

## Tech Stack 🛠️

| Component       | Technology |
|----------------|------------|
| Frontend       | Next.js 15 (App Router) |
| Styling        | Tailwind CSS + shadcn/ui |
| Authentication | Clerk |
| Database       | PostgreSQL (NeonDB) |
| ORM            | Prisma |
| Deployment     | Vercel |

## Getting Started 🚀

### Prerequisites
- Node.js 18+
- PostgreSQL database
- Clerk account (for auth)

### Installation
1. Clone the repo:
   ```bash
   git clone https://github.com/your-username/notesphere.git
   cd notesphere