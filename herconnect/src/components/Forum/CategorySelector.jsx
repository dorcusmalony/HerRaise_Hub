import { useState } from 'react'
import styles from './CategorySelector.module.css'

const FORUM_CATEGORIES = {
  'personal-growth': {
    id: 'personal-growth',
    name: 'Personal Growth & Learning',
    icon: '',
    description: 'Self-development, learning, and confidence-building discussions'
  },
  'mental-health': {
    id: 'mental-health',
    name: 'Mental Health & Wellbeing',
    icon: '',
    description: 'Building confidence, stress management, and self-care support'
  },
  'education-study': {
    id: 'education-study',
    name: 'Education & Study Tips',
    icon: '',
    description: 'Academic challenges, scholarships, and learning strategies'
  },
  'career-future': {
    id: 'career-future',
    name: 'Career & Future Opportunities',
    icon: '',
    description: 'Internships, career exploration, and professional development'
  }
}

export default function CategorySelector({ selectedCategory, selectedSubcategory, onCategoryChange, onSubcategoryChange, onCategoryClick, showAll = true }) {
  const [expandedCategory, setExpandedCategory] = useState(selectedCategory || 'personal-growth')

  return (
    <div className={styles.categorySelector}>
      <div className={styles.categoryHeader}>
        <h3 className={styles.title}>Forum Categories</h3>
        <p className={styles.subtitle}>Choose a category to explore discussions</p>
      </div>

      {showAll && (
        <div 
          className={`${styles.categoryItem} ${!selectedCategory ? styles.active : ''}`}
          onClick={() => {
            onCategoryChange(null)
            onSubcategoryChange(null)
          }}
        >
          <div className={styles.categoryMain}>
            <span className={styles.categoryIcon}></span>
            <div className={styles.categoryInfo}>
              <h4 className={styles.categoryName}>All Discussions</h4>
              <p className={styles.categoryDesc}>View all forum posts across categories</p>
            </div>
          </div>
        </div>
      )}

      {Object.values(FORUM_CATEGORIES).map(category => (
        <div key={category.id} className={styles.categoryGroup}>
          <div 
            className={`${styles.categoryItem} ${selectedCategory === category.id ? styles.active : ''}`}
            onClick={() => {
              onCategoryChange(category.id)
              onSubcategoryChange(null)
              if (onCategoryClick) {
                onCategoryClick(category.id)
              }
            }}
          >
            <div className={styles.categoryMain}>
              <span className={styles.categoryIcon}>{category.icon}</span>
              <div className={styles.categoryInfo}>
                <h4 className={styles.categoryName}>{category.name}</h4>
                <p className={styles.categoryDesc}>{category.description}</p>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

export { FORUM_CATEGORIES }