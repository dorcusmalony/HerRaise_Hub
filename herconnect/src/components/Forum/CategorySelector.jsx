import { useNavigate } from 'react-router-dom'
import { useLanguage } from '../../hooks/useLanguage'
import styles from './CategorySelector.module.css'

const FORUM_CATEGORIES = {
  'mental-health': {
    id: 'mental-health',
    name: 'Mental Health & Wellbeing',
    description: 'Building confidence, stress management, and self-care support'
  },
  'leadership': {
    id: 'leadership',
    name: 'Leadership & Empowerment',
    description: 'Leadership skills, empowerment, and personal development'
  },
  'education-study': {
    id: 'education-study',
    name: 'Education & Learning',
    description: 'Academic challenges, scholarships, and learning strategies'
  },
  'equality-rights': {
    id: 'equality-rights',
    name: 'Equality, Equity & Rights',
    description: 'Gender equality, equity, rights advocacy, and social justice'
  },
  'career-skills': {
    id: 'career-skills',
    name: 'Career & Skills',
    description: 'Career development, professional skills, and opportunities'
  },
  'womens-health': {
    id: 'womens-health',
    name: "Women's Health",
    description: 'Health, wellness, and reproductive health discussions'
  }
}

export default function CategorySelector({ selectedCategory, onCategoryChange, showAsGrid = false }) {
  const navigate = useNavigate()
  const { t } = useLanguage()
  
  const handleCategoryClick = (categoryId) => {
    // Navigate to dedicated category page
    navigate(`/forum/category/${categoryId}`)
  }
  
  if (showAsGrid) {
    return (
      <div className={styles.forumMain}>
        <div className={styles.forumIntro}>
          <h2 className={styles.forumMainTitle}>{t('Forum Categories')}</h2>
          <p className={styles.forumMainDesc}>{t('Choose a category to explore discussions and connect with the community')}</p>
        </div>
        
        <div className={styles.categoryGrid}>
          {Object.values(FORUM_CATEGORIES).map((category, index) => {
            const backgrounds = [
              'linear-gradient(135deg, #10b981 0%, #059669 100%)', // Green (like edit button)
              'linear-gradient(135deg, #e84393 0%, #d63384 100%)', // Pink (brand pink)
              'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)', // Blue (like home cards)
              '#4b0f77', // Purple (exact footer color)
              'linear-gradient(135deg, #e84393 0%, #d63384 100%)', // Pink (brand pink)
              '#4b0f77', // Purple (exact footer color)
            ]
            return (
            <div 
              key={category.id} 
              className={`${styles.categoryCard} ${selectedCategory === category.id ? styles.selected : ''}`}
              onClick={() => handleCategoryClick(category.id)}
              style={{ 
                cursor: 'pointer',
                background: backgrounds[index]
              }}
            >
              <h4 className={styles.categoryName}>{t(category.name)}</h4>
              <p className={styles.categoryDesc}>{t(category.description)}</p>
              <div className={styles.categoryStats}>
                <span>{t('Explore →')}</span>
              </div>
            </div>
            )
          })}
        </div>
      </div>
    )
  }

  return (
    <div className={styles.categorySelector}>
      <div className={styles.categoryHeader}>
        <h3 className={styles.title}>Forum Categories</h3>
        <p className={styles.subtitle}>Choose a category to explore discussions</p>
      </div>

      <div 
        className={`${styles.categoryItem} ${!selectedCategory ? styles.active : ''}`}
        onClick={() => onCategoryChange(null)}
      >
        <div className={styles.categoryMain}>
          <span className={styles.categoryIcon}>🏠</span>
          <div className={styles.categoryInfo}>
            <h4 className={styles.categoryName}>All Discussions</h4>
            <p className={styles.categoryDesc}>View all forum posts across categories</p>
          </div>
        </div>
      </div>

      {Object.values(FORUM_CATEGORIES).map(category => (
        <div 
          key={category.id}
          className={`${styles.categoryItem} ${selectedCategory === category.id ? styles.active : ''}`}
          onClick={() => onCategoryChange(category.id)}
        >
          <div className={styles.categoryMain}>
            <div className={styles.categoryInfo}>
              <h4 className={styles.categoryName}>{category.name}</h4>
              <p className={styles.categoryDesc}>{category.description}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

export { FORUM_CATEGORIES }