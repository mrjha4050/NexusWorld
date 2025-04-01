import React from 'react';
import { format } from 'date-fns';
import { NewsArticle } from '@/types';

interface NewsCardProps {
  article: NewsArticle;
}

const NewsCard: React.FC<NewsCardProps> = ({ article }) => {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <a
        href={article.url}
        target="_blank"
        rel="noopener noreferrer"
        className="block hover:opacity-75 transition-opacity"
      >
        <h3 className="text-lg font-semibold text-gray-900 mb-2">{article.title}</h3>
        <p className="text-gray-600 mb-4 line-clamp-2">{article.description}</p>
        <div className="text-sm text-gray-500">
          {format(new Date(article.publishedAt), 'MMM d, yyyy h:mm a')}
        </div>
      </a>
    </div>
  );
};

export default NewsCard; 