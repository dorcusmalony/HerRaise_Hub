# HerRaise Hub - Empowering Young Women Through Education & Mentorship

HerRaise Hub is a comprehensive web platform dedicated to empowering young women and girls in South Sudan through education, mentorship, and community support. Our mission is to help them rise beyond societal limitations and build independent, confident lives.



- **Demo Video**: [Video](https://drive.google.com/file/d/1ROINI9SjfMhSCjbGzl_SbEgTljj9ka_C/view?usp=sharing)

##  Links


- **Live Platform**: [Live website](https://her-raise-hub.vercel.app)


##  About HerRaise Hub

HerRaise Hub is a women-led initiative that provides a safe, supportive, and inspiring digital space where young women can:
- Connect with inspiring mentors and role models
- Access educational resources and opportunities
- Share their work and get feedback from the community
- Participate in meaningful discussions about their challenges and aspirations
- Find scholarships, internships, and career opportunities

### Our Vision
A South Sudan where every girl grows with courage, education, and purpose, free to dream, lead, and transform her community.

### Our Mission
To empower and mentor young women and girls in South Sudan to rise beyond societal limitations through education, storytelling, and mentorship, helping them realize their worth and build independent, confident lives.

##  Key Features

###  **Home Page**
- Inspiring hero section with call-to-action
- Featured mentors showcase
- Step-by-step guide on how the platform works
- Community impact statistics and goals

###  **About Page**
- Detailed mission and vision statements
- Core values and community guidelines
- Success stories and testimonials from community members
- 2030 goal: Reach 10,000 girls with educational opportunities

###  **Community Forum**
- Category-based discussions (Mental Health, Leadership, Education, Career, etc.)
- User tagging system with @ mentions
- Like and comment functionality
- Multi-language support (English/Arabic)

###  **ShareZone**
- Upload and share projects, essays, videos, and resumes
- Get feedback from mentors and peers
- Showcase academic and creative work
- File management with categorization

###  **Multi-Language Support**
- Full English and Arabic translations
- Right-to-left (RTL) layout support for Arabic
- Professional language switcher with flags
- Cultural adaptation including Arabic-Indic numerals

###  **User Features**
- User authentication (register, login, password reset)
- Profile management
- Mentorship connections
- Notification system

## 🛠 Technical Stack

### Frontend
- **React 18** with Vite for fast development
- **Bootstrap 5** for responsive design
- **React Router** for navigation
- **Custom hooks** for language management
- **CSS Modules** for component styling

### Backend Integration
- RESTful API integration
- JWT token authentication
- File upload capabilities
- Real-time notifications

### Key Technologies
- Modern ES6+ JavaScript
- Responsive web design
- Progressive Web App features
- Cross-browser compatibility

### ShareZone External Links Support
ShareZone now supports sharing external links alongside file uploads:

**Supported Platforms:**
- Google Docs and Google Drive links
- Microsoft OneDrive shares
- Dropbox file shares
- Any external URL

**API Usage Example:**
```json
POST /api/sharezone
{
  "title": "My Research Paper",
  "content": "Check out my latest research",
  "category": "essays",
  "externalLink": "https://docs.google.com/document/d/abc123"
}
```

**Features:**
- Users can choose between file upload OR external link
- Update support - modify links after posting
- Proper display of both uploaded files and external links
- Link validation and security checks

##  Getting Started

### Prerequisites
- Node.js 18+ recommended
- npm (or yarn/pnpm)

### Installation

1. **Clone the repository**
   ```bash
   git clone [repository-url]
   cd HerRaise_Hub/herconnect
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   Create a `.env` file in the project root:
   ```env
   VITE_API_URL=http://localhost:10000
   

4. **Start development server**
   ```bash
   npm run dev
   ```
   Open http://localhost:5173 in your browser

### Build for Production
```bash
npm run build
npm run preview
```

##  Internationalization

The platform supports multiple languages with complete translations:

- **English**: Default language with full feature coverage
- **Arabic**: Complete translation with RTL layout support


### Language Features
- Dynamic language switching
- Cultural number formatting (Arabic-Indic numerals)
- RTL layout automatic adjustment
- Professional language selector with country flags

##  Responsive Design

HerRaise Hub is fully responsive and works seamlessly across:
- Desktop computers (1200px+)
- Tablets (768px - 1199px)
- Mobile phones (320px - 767px)
- All modern browsers (Chrome, Firefox, Safari, Edge)

##  Design System

### Color Palette
- **Primary**: #E84393 (Brand Magenta)
- **Secondary**: #667eea (Blue)
- **Accent Colors**: Gold, Purple, Orange for categories
- **Neutral**: Grays for text and backgrounds

### Typography
- Clean, readable fonts optimized for both English and Arabic
- Proper font weights and sizes for accessibility
- Consistent spacing and hierarchy

##  Security Features

- JWT token-based authentication
- Secure password handling
- Input validation and sanitization
- CORS protection
- Safe file upload with type validation

##  Community Impact

### Current Goals
- **2030 Target**: Reach 10,000 girls with educational opportunities
- **Focus Areas**: 
  - Gender inequality
  - Gender-based violence prevention
  - Early marriage prevention
  - Educational opportunity access

### Success Metrics
- User engagement and retention
- Mentorship connections made
- Educational opportunities accessed
- Community discussions and support

##  Contributing

We welcome contributions to improve HerRaise Hub:

1. **Bug Reports**: Open issues with detailed descriptions
2. **Feature Requests**: Suggest new features that align with our mission
3. **Code Contributions**: Submit PRs with clear descriptions
4. **Translations**: Help expand language support
5. **Documentation**: Improve guides and documentation

### Development Guidelines
- Follow existing code style and patterns
- Write clear, descriptive commit messages
- Test changes thoroughly before submitting
- Update documentation for new features

##  Support & Contact

For questions, support, or collaboration opportunities:
- **Issues**: Use GitHub issues for bug reports and feature requests
- **Email**: herraisehub@gmail.com
- **Community**: Join our platform discussions

##  License

This project is developed to empower young women in South Sudan. Please respect the mission and values when using or contributing to this codebase.

##  Acknowledgments

- **Mentors and Community Members**: For sharing their stories and expertise
- **Contributors**: Developers, designers, and translators who made this possible
- **Partners**: Organizations supporting women's education in South Sudan
- **Users**: Young women who inspire us with their courage and determination

---

**HerRaise Hub** - Because when you rise, your community rises with you. 
