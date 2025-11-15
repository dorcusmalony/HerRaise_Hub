import { useState } from 'react'
import styles from './CategorySelector.module.css'

const FORUM_CATEGORIES = {
  'mental-health': {
    id: 'mental-health',
    name: 'Mental Health & Wellbeing',
    icon: '🧠',
    description: 'Building confidence, stress management, and self-care support'
  },
  'leadership': {
    id: 'leadership',
    name: 'Leadership & Empowerment',
    icon: '👑',
    description: 'Leadership skills, empowerment, and personal development'
  },
  'education-study': {
    id: 'education-study',
    name: 'Education & Learning',
    icon: '📚',
    description: 'Academic challenges, scholarships, and learning strategies'
  },
  'equality-rights': {
    id: 'equality-rights',
    name: 'Equality, Equity & Rights',
    icon: '⚖️',
    description: 'Gender equality, equity, rights advocacy, and social justice'
  },
  'career-skills': {
    id: 'career-skills',
    name: 'Career & Skills',
    icon: '💼',
    description: 'Career development, professional skills, and opportunities'
  },
  'womens-health': {
    id: 'womens-health',
    name: "Women's Health",
    icon: '🌸',
    description: 'Health, wellness, and reproductive health discussions'
  }
}

export default function CategorySelector({ selectedCategory, onCategoryChange, showAsGrid = false }) {
  if (showAsGrid) {
    return (
      <div className={styles.forumMain}>
        <div className={styles.forumIntro}>
          <h2 className={styles.forumMainTitle}>Forum Categories</h2>
          <p className={styles.forumMainDesc}>Choose a category to explore discussions and connect with the community</p>
        </div>
        
        <div className={styles.categoryGrid}>
          {Object.values(FORUM_CATEGORIES).map(category => (
            <div 
              key={category.id} 
              className={`${styles.categoryCard} ${selectedCategory === category.id ? styles.selected : ''}`}
              onClick={() => onCategoryChange(selectedCategory === category.id ? null : category.id)}
            >
              <h4 className={styles.categoryName}>{category.name}</h4>
              <p className={styles.categoryDesc}>{category.description}</p>
              <div className={styles.categoryStats}>
                <span>{selectedCategory === category.id ? 'Selected' : 'Explore'} →</span>
              </div>
            </div>
          ))}
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
            <span className={styles.categoryIcon}>{category.icon}</span>
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