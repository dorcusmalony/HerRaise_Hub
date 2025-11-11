import { useState } from 'react'
import styles from './CategorySelector.module.css'

const FORUM_CATEGORIES = {
  'personal-growth': {
    id: 'personal-growth',
    name: 'Personal Growth & Learning',
    icon: '',
    description: 'For young girls and students to explore self-development, learning, and confidence-building',
    subcategories: {
      'education-study': {
        id: 'education-study',
        name: 'Education & Study Tips',
        icon: '',
        topics: [
          'Academic challenges and solutions',
          'Scholarship opportunities', 
          'Learning strategies and study methods',
          'Homework help and tutoring',
          'School experiences and advice'
        ]
      },
      'mental-health': {
        id: 'mental-health',
        name: 'Mental Health & Wellbeing',
        icon: '',
        topics: [
          'Building confidence and self-esteem',
          'Stress management techniques',
          'Coping with anxiety and pressure',
          'Self-care and mindfulness',
          'Personal growth stories'
        ]
      },
      'career-future': {
        id: 'career-future',
        name: 'Career & Future Opportunities',
        icon: '',
        topics: [
          'Internship experiences and applications',
          'Career exploration and advice',
          'Goal setting and achievement',
          'Professional development',
          'Networking and mentorship opportunities'
        ]
      }
    }
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
              if (expandedCategory === category.id) {
                setExpandedCategory(null)
              } else {
                setExpandedCategory(category.id)
                onCategoryChange(category.id)
                onSubcategoryChange(null)
                if (onCategoryClick) {
                  onCategoryClick(category.id)
                }
              }
            }}
          >
            <div className={styles.categoryMain}>
              <span className={styles.categoryIcon}>{category.icon}</span>
              <div className={styles.categoryInfo}>
                <h4 className={styles.categoryName}>{category.name}</h4>
                <p className={styles.categoryDesc}>{category.description}</p>
              </div>
              <span className={`${styles.expandIcon} ${expandedCategory === category.id ? styles.expanded : ''}`}>
                ▼
              </span>
            </div>
          </div>

          {expandedCategory === category.id && (
            <div className={styles.subcategoriesList}>
              {Object.values(category.subcategories).map(subcategory => (
                <div 
                  key={subcategory.id}
                  className={`${styles.subcategoryItem} ${selectedSubcategory === subcategory.id ? styles.active : ''}`}
                  onClick={(e) => {
                    e.stopPropagation()
                    onSubcategoryChange(subcategory.id)
                    if (onCategoryClick) {
                      onCategoryClick(category.id, subcategory.id)
                    }
                  }}
                >
                  <div className={styles.subcategoryMain}>
                    <span className={styles.subcategoryIcon}>{subcategory.icon}</span>
                    <div className={styles.subcategoryInfo}>
                      <h5 className={styles.subcategoryName}>{subcategory.name}</h5>
                      <div className={styles.topicsList}>
                        {subcategory.topics.slice(0, 3).map((topic, index) => (
                          <span key={index} className={styles.topicTag}>
                            {topic}
                          </span>
                        ))}
                        {subcategory.topics.length > 3 && (
                          <span className={styles.moreTopics}>
                            +{subcategory.topics.length - 3} more
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  )
}

export { FORUM_CATEGORIES }