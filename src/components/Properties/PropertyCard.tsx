import React from 'react';
import {
  PropertyInterface,
  PropertyLogInterface,
  PropertyLogStatusType,
} from '../../services/prismic';
import styles from './propertyCard.module.scss';

export const PropertyCard: React.FC<PropertyInterface> = ({
  title,
  logo,
  log,
}) => {
  const statuses: Record<PropertyLogStatusType, string> = {
    unspecified: 'Не указано',
    normal: 'Работает',
    inaccessible: 'Недоступно',
    obstructing: 'Проблематично',
  };

  const renderStatus = (log: PropertyLogInterface) => {
    const value: Partial<PropertyLogInterface> = {
      status: log.status || 'unspecified',
      blocked: log.blocked || undefined,
      updated: log.updated || undefined,
      reason: log.reason || undefined,
      source: log.source || undefined,
    };
    const blocked = log.blocked ? new Date(log.blocked) : null;
    return (
      <div className={`status ${value.status}`}>
        <span>{statuses[value.status]}</span>
        {blocked && (
          <time dateTime={blocked.toISOString()}>
            {blocked.toLocaleDateString()}
          </time>
        )}
      </div>
    );
  };

  return (
    <article className={styles.propertyCard} title={title}>
      <div className="statuses">
        {log && log.slice(0, 2).map(l => renderStatus(l))}
      </div>
      <div className="logo" style={{ backgroundImage: `url(${logo})` }} />
      <h2>{title}</h2>
    </article>
  );
};
