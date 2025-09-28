# AI CV Editor

Ứng dụng AI hỗ trợ chỉnh sửa CV với chatbox thông minh, tích hợp OpenAI và Supabase.

## Tính năng chính

- 🤖 **AI Chatbox**: Trò chuyện với AI để nhận lời khuyên về CV
- 📄 **Phân tích PDF**: Upload và phân tích CV tự động
- 👤 **Authentication**: Đăng ký/đăng nhập với Supabase Auth
- 📊 **Dashboard**: Theo dõi lịch sử chat và CV uploads
- 🎨 **Dark Theme**: Giao diện chuyên nghiệp với dark mode

## Setup Environment Variables

1. **Tạo file `.env.local`** từ `.env.example`:
   \`\`\`bash
   cp .env.example .env.local
   \`\`\`

2. **Lấy thông tin từ Supabase Dashboard**:
   - Vào [Supabase Dashboard](https://supabase.com/dashboard)
   - Chọn project của bạn
   - Vào **Settings** → **API**
   - Copy các giá trị sau:

   \`\`\`env
   # Project URL
   NEXT_PUBLIC_SUPABASE_URL=your_project_url
   SUPABASE_URL=your_project_url
   
   # Anon Key  
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
   SUPABASE_ANON_KEY=your_anon_key
   
   # Service Role Key
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
   
   # JWT Secret
   SUPABASE_JWT_SECRET=your_jwt_secret
   \`\`\`

3. **Chạy ứng dụng**:
   \`\`\`bash
   npm install
   npm run dev
   \`\`\`

## Database Setup

Database đã được setup tự động với các bảng:
- `profiles` - Thông tin người dùng
- `conversations` - Cuộc trò chuyện
- `messages` - Tin nhắn chat
- `cv_uploads` - CV đã upload

## Deploy trên Vercel

1. Push code lên GitHub
2. Connect với Vercel
3. Thêm environment variables trong Vercel dashboard
4. Deploy!

## Tech Stack

- **Frontend**: Next.js 14, React, Tailwind CSS
- **Backend**: Next.js API Routes, Supabase
- **AI**: OpenAI API với AI SDK v5
- **Database**: Supabase PostgreSQL
- **Auth**: Supabase Auth
- **Deployment**: Vercel
