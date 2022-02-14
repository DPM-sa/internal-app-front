import React from 'react';

export const CardInfo = ({ title, value = '' }) => {
    return <div className="PostsAdmin-content-actions-item">
        <span>{value}</span>
        <p>{title}</p>
    </div>
}