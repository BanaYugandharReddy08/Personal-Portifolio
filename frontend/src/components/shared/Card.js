import React from 'react';
import './Card.css';

const Card = ({
  imageUrl,
  title,
  subtitle,
  date,
  description,
  tags = [],
  actions,
  className = '',
  onClick,
  children,
}) => {
  const tagList = Array.isArray(tags)
    ? tags
    : typeof tags === 'string'
    ? tags.split(',').map((t) => t.trim()).filter(Boolean)
    : [];

  const formatDate = (d) => {
    const parsed = new Date(d);
    return isNaN(parsed)
      ? d
      : parsed.toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        });
  };

  return (
    <div className={`card ${className}`.trim()} onClick={onClick}>
      {imageUrl !== undefined && (
        <div className="card-image">
          {imageUrl ? (
            <img src={imageUrl} alt={title} />
          ) : (
            <div className="card-placeholder">
              <span>No Image</span>
            </div>
          )}
        </div>
      )}
      <div className="card-details">
        {title && <h3>{title}</h3>}
        {subtitle && <p className="card-subtitle">{subtitle}</p>}
        {date && <p className="card-date">{formatDate(date)}</p>}
        {description && <p className="card-description">{description}</p>}
        {tagList.length > 0 && (
          <div className="technologies">
            {tagList.map((tag, i) => (
              <span key={i} className="tech-tag">
                {tag}
              </span>
            ))}
          </div>
        )}
        {children}
      </div>
      {actions && <div className="card-actions">{actions}</div>}
    </div>
  );
};

export default Card;
