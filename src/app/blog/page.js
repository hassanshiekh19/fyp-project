'use client'
import React, { useState } from 'react';
import { Search, Calendar, User, Heart, MessageSquare, Plus, X, Save } from 'lucide-react';

const BlogSection = () => {
  const [blogs, setBlogs] = useState([
    {
      id: 1,
      title: "Understanding Melanoma: Early Detection and Prevention",
      excerpt: "Learn about the ABCDE rule for identifying potential melanoma and the importance of regular skin checks...",
      author: "Dr. Sarah Johnson",
      date: "2024-06-15",
      category: "Research",
      image: "/api/placeholder/400/250",
      likes: 24,
      comments: 8,
      content: "Melanoma is one of the most serious forms of skin cancer, but early detection can significantly improve outcomes..."
    },
    {
      id: 2,
      title: "AI in Dermatology: Revolutionizing Skin Disease Diagnosis",
      excerpt: "Explore how artificial intelligence is transforming the field of dermatology and improving diagnostic accuracy...",
      author: "Dr. Michael Chen",
      date: "2024-06-10",
      category: "Technology",
      image: "/api/placeholder/400/250",
      likes: 42,
      comments: 15,
      content: "The integration of AI technology in dermatology has opened new possibilities for early and accurate diagnosis..."
    },
    {
      id: 3,
      title: "Common Skin Conditions: A Comprehensive Guide",
      excerpt: "A detailed overview of the most common skin conditions, their symptoms, and treatment options...",
      author: "Dr. Emily Rodriguez",
      date: "2024-06-05",
      category: "Education",
      image: "/api/placeholder/400/250",
      likes: 31,
      comments: 12,
      content: "Understanding common skin conditions is crucial for both healthcare providers and patients..."
    }
  ]);

  const [selectedBlog, setSelectedBlog] = useState(null);
  const [showNewBlogForm, setShowNewBlogForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [newBlog, setNewBlog] = useState({
    title: '',
    excerpt: '',
    author: '',
    category: 'Education',
    content: ''
  });

  const categories = ['All', 'Research', 'Technology', 'Education', 'Case Studies'];

  const filteredBlogs = blogs.filter(blog => {
    const matchesSearch = blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         blog.excerpt.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || blog.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleNewBlogSubmit = () => {
    if (newBlog.title && newBlog.excerpt && newBlog.author && newBlog.content) {
      const blogToAdd = {
        ...newBlog,
        id: blogs.length + 1,
        date: new Date().toISOString().split('T')[0],
        likes: 0,
        comments: 0,
        image: "/api/placeholder/400/250"
      };
      setBlogs([blogToAdd, ...blogs]);
      setNewBlog({ title: '', excerpt: '', author: '', category: 'Education', content: '' });
      setShowNewBlogForm(false);
    }
  };

  const BlogCard = ({ blog }) => (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <div className="h-48 bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center">
        <div className="text-gray-500 text-sm">Blog Image</div>
      </div>
      <div className="p-6">
        <div className="flex items-center justify-between mb-2">
          <span className="px-3 py-1 bg-blue-100 text-blue-800 text-xs font-semibold rounded-full">
            {blog.category}
          </span>
          <div className="flex items-center text-gray-500 text-sm">
            <Calendar size={14} className="mr-1" />
            {blog.date}
          </div>
        </div>
        <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2">{blog.title}</h3>
        <p className="text-gray-600 mb-4 line-clamp-3">{blog.excerpt}</p>
        <div className="flex items-center justify-between">
          <div className="flex items-center text-gray-500 text-sm">
            <User size={14} className="mr-1" />
            {blog.author}
          </div>
          <div className="flex items-center space-x-4 text-gray-500 text-sm">
            <div className="flex items-center">
              <Heart size={14} className="mr-1" />
              {blog.likes}
            </div>
            <div className="flex items-center">
              <MessageSquare size={14} className="mr-1" />
              {blog.comments}
            </div>
          </div>
        </div>
        <button
          onClick={() => setSelectedBlog(blog)}
          className="w-full mt-4 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors duration-200"
        >
          Read More
        </button>
      </div>
    </div>
  );

  const BlogModal = ({ blog, onClose }) => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-start mb-4">
            <h1 className="text-2xl font-bold text-gray-900">{blog.title}</h1>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X size={24} />
            </button>
          </div>
          <div className="flex items-center space-x-4 mb-6 text-gray-600">
            <div className="flex items-center">
              <User size={16} className="mr-2" />
              {blog.author}
            </div>
            <div className="flex items-center">
              <Calendar size={16} className="mr-2" />
              {blog.date}
            </div>
            <span className="px-3 py-1 bg-blue-100 text-blue-800 text-xs font-semibold rounded-full">
              {blog.category}
            </span>
          </div>
          <div className="h-64 bg-gradient-to-br from-blue-100 to-purple-100 rounded-lg mb-6 flex items-center justify-center">
            <div className="text-gray-500">Blog Image</div>
          </div>
          <div className="prose max-w-none">
            <p className="text-gray-700 leading-relaxed mb-4">{blog.content}</p>
            <p className="text-gray-700 leading-relaxed mb-4">
              This comprehensive article explores the latest developments in skin disease detection and treatment. 
              Our research team has compiled extensive information to help both medical professionals and patients 
              understand the complexities of dermatological conditions.
            </p>
            <p className="text-gray-700 leading-relaxed">
              For more detailed information and personalized advice, please consult with qualified dermatologists 
              and healthcare providers. Early detection and proper treatment are key to managing skin conditions effectively.
            </p>
          </div>
          <div className="flex items-center justify-between pt-6 border-t mt-6">
            <div className="flex items-center space-x-4">
              <button className="flex items-center text-gray-600 hover:text-red-600 transition-colors">
                <Heart size={20} className="mr-2" />
                {blog.likes} Likes
              </button>
              <button className="flex items-center text-gray-600 hover:text-blue-600 transition-colors">
                <MessageSquare size={20} className="mr-2" />
                {blog.comments} Comments
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const NewBlogForm = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Create New Blog Post</h2>
            <button
              onClick={() => setShowNewBlogForm(false)}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X size={24} />
            </button>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
              <input
                type="text"
                value={newBlog.title}
                onChange={(e) => setNewBlog({...newBlog, title: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Author</label>
              <input
                type="text"
                value={newBlog.author}
                onChange={(e) => setNewBlog({...newBlog, author: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
              <select
                value={newBlog.category}
                onChange={(e) => setNewBlog({...newBlog, category: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {categories.filter(cat => cat !== 'All').map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Excerpt</label>
              <textarea
                value={newBlog.excerpt}
                onChange={(e) => setNewBlog({...newBlog, excerpt: e.target.value})}
                rows="3"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Content</label>
              <textarea
                value={newBlog.content}
                onChange={(e) => setNewBlog({...newBlog, content: e.target.value})}
                rows="8"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div className="flex space-x-4">
              <button
                type="button"
                onClick={handleNewBlogSubmit}
                className="flex items-center bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Save size={16} className="mr-2" />
                Publish Blog
              </button>
              <button
                type="button"
                onClick={() => setShowNewBlogForm(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Dermatology Research & Education Hub
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Stay updated with the latest research, technology, and educational content in skin disease detection and treatment
          </p>
        </div>

        {/* Search and Filter Bar */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search blogs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {categories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
          <button
            onClick={() => setShowNewBlogForm(true)}
            className="flex items-center bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus size={16} className="mr-2" />
            New Blog
          </button>
        </div>

        {/* Blog Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredBlogs.map(blog => (
            <BlogCard key={blog.id} blog={blog} />
          ))}
        </div>

        {/* No Results */}
        {filteredBlogs.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No blogs found matching your criteria.</p>
          </div>
        )}

        {/* Modals */}
        {selectedBlog && (
          <BlogModal blog={selectedBlog} onClose={() => setSelectedBlog(null)} />
        )}
        {showNewBlogForm && <NewBlogForm />}
      </div>
    </div>
  );
};

export default BlogSection;