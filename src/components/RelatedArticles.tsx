import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight } from 'lucide-react';

interface Article {
  title: string;
  description: string;
  path: string;
}

interface RelatedArticlesProps {
  articles: Article[];
  title?: string;
}

const RelatedArticles: React.FC<RelatedArticlesProps> = ({ 
  articles, 
  title = "Artículos Relacionados" 
}) => {
  return (
    <section className="mt-16 py-8 border-t border-border">
      <h2 className="text-3xl font-bold mb-6">{title}</h2>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {articles.map((article, index) => (
          <Link key={index} to={article.path} className="group">
            <Card className="h-full hover:shadow-lg transition-all hover:border-primary/40">
              <CardHeader>
                <CardTitle className="text-lg group-hover:text-primary transition-colors">
                  {article.title}
                </CardTitle>
                <CardDescription>{article.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center text-primary text-sm font-medium">
                  Leer más 
                  <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default RelatedArticles;