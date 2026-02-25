'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchKBArticles, searchKB } from '@/lib/api';
import { getCategoryIcon, formatCategoryName } from '@/lib/utils';
import Link from 'next/link';
import { TicketCategory } from '@/lib/types';

export default function KnowledgeBasePage() {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<TicketCategory | ''>('');

    const { data: articles, isLoading } = useQuery({
        queryKey: ['kb-articles', selectedCategory],
        queryFn: () => fetchKBArticles({ category: selectedCategory || undefined }),
    });

    const { data: searchResults, isLoading: searching } = useQuery({
        queryKey: ['kb-search', searchQuery],
        queryFn: () => searchKB(searchQuery),
        enabled: searchQuery.length > 2,
    });

    const categories: TicketCategory[] = ['hardware', 'software', 'network', 'access', 'email', 'printer', 'account', 'other'];

    const displayArticles = searchQuery.length > 2 ? searchResults : articles?.data;

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="text-center max-w-3xl mx-auto">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Knowledge Base</h1>
                <p className="text-gray-500">Find answers to common IT issues and solutions</p>
            </div>

            {/* Search */}
            <div className="max-w-3xl mx-auto">
                <div className="relative">
                    <input
                        type="text"
                        placeholder="Search for solutions, FAQs, troubleshooting guides..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-12 pr-4 py-4 border border-gray-300 rounded-xl text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm"
                    />
                    <svg
                        className="w-6 h-6 text-gray-400 absolute left-4 top-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                        />
                    </svg>
                </div>
            </div>

            {/* Category Filter */}
            <div className="flex flex-wrap gap-2 justify-center">
                <button
                    onClick={() => setSelectedCategory('')}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${selectedCategory === ''
                            ? 'bg-blue-600 text-white'
                            : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                        }`}
                >
                    All Categories
                </button>
                {categories.map((category) => (
                    <button
                        key={category}
                        onClick={() => setSelectedCategory(category)}
                        className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2 ${selectedCategory === category
                                ? 'bg-blue-600 text-white'
                                : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                            }`}
                    >
                        <span>{getCategoryIcon(category)}</span>
                        <span>{formatCategoryName(category)}</span>
                    </button>
                ))}
            </div>

            {/* Articles Grid */}
            {isLoading || searching ? (
                <div className="text-center py-12">
                    <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-100 rounded-full mb-4">
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                    </div>
                    <p className="text-gray-500">Loading articles...</p>
                </div>
            ) : displayArticles && displayArticles.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {displayArticles.map((article) => (
                        <Link
                            key={article.id}
                            href={`/dashboard/kb/${article.id}`}
                            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md hover:border-blue-300 transition-all group"
                        >
                            <div className="flex items-start justify-between mb-4">
                                <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-lg flex items-center justify-center text-2xl">
                                    {getCategoryIcon(article.category)}
                                </div>
                                <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                                    {formatCategoryName(article.category)}
                                </span>
                            </div>

                            <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                                {article.title}
                            </h3>

                            <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                                {article.question}
                            </p>

                            <div className="flex items-center justify-between text-xs text-gray-500">
                                <div className="flex items-center space-x-4">
                                    <span className="flex items-center">
                                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                        </svg>
                                        {article.view_count}
                                    </span>
                                    <span className="flex items-center">
                                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
                                        </svg>
                                        {article.helpful_count}
                                    </span>
                                </div>
                                <span className="text-blue-600 group-hover:translate-x-1 transition-transform">
                                    Read more →
                                </span>
                            </div>
                        </Link>
                    ))}
                </div>
            ) : (
                <div className="text-center py-12 bg-white rounded-xl border border-gray-200">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
                        <span className="text-3xl">📚</span>
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No articles found</h3>
                    <p className="text-gray-500">
                        {searchQuery || selectedCategory
                            ? 'Try adjusting your search or filters'
                            : 'No knowledge base articles available yet'}
                    </p>
                </div>
            )}

            {/* Popular Topics */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200 p-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-6 text-center">Popular Topics</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <button className="bg-white rounded-lg p-4 hover:shadow-md transition-shadow text-left">
                        <div className="flex items-center space-x-3 mb-2">
                            <span className="text-2xl">💻</span>
                            <span className="font-medium text-gray-900">Software Issues</span>
                        </div>
                        <p className="text-sm text-gray-600">Common software problems and fixes</p>
                    </button>

                    <button className="bg-white rounded-lg p-4 hover:shadow-md transition-shadow text-left">
                        <div className="flex items-center space-x-3 mb-2">
                            <span className="text-2xl">🌐</span>
                            <span className="font-medium text-gray-900">Network Setup</span>
                        </div>
                        <p className="text-sm text-gray-600">WiFi and connectivity guides</p>
                    </button>

                    <button className="bg-white rounded-lg p-4 hover:shadow-md transition-shadow text-left">
                        <div className="flex items-center space-x-3 mb-2">
                            <span className="text-2xl">🔑</span>
                            <span className="font-medium text-gray-900">Access Control</span>
                        </div>
                        <p className="text-sm text-gray-600">Password and permission help</p>
                    </button>

                    <button className="bg-white rounded-lg p-4 hover:shadow-md transition-shadow text-left">
                        <div className="flex items-center space-x-3 mb-2">
                            <span className="text-2xl">📧</span>
                            <span className="font-medium text-gray-900">Email Configuration</span>
                        </div>
                        <p className="text-sm text-gray-600">Email setup and troubleshooting</p>
                    </button>
                </div>
            </div>
        </div>
    );
}
