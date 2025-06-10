import React, { useState } from 'react';
import { Calendar, Edit2, Trash2, Check, X } from 'lucide-react';
import { Todo, UpdateTodoRequest } from '../../types';

interface TodoItemProps {
  todo: Todo;
  onToggleComplete: (id: string, completed: boolean) => Promise<void>;
  onUpdate: (id: string, updates: UpdateTodoRequest) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}

export const TodoItem: React.FC<TodoItemProps> = ({
  todo,
  onToggleComplete,
  onUpdate,
  onDelete,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    title: todo.title,
    description: todo.description,
    priority: todo.priority,
    due_date: todo.due_date || '',
  });

  const handleEdit = async () => {
    try {
      await onUpdate(todo.id, editForm);
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to update todo:', error);
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return null;
    return new Date(dateString).toLocaleDateString();
  };

  const isOverdue = todo.due_date && new Date(todo.due_date) < new Date() && !todo.completed;

  if (isEditing) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="space-y-4">
          <input
            type="text"
            value={editForm.title}
            onChange={(e) => setEditForm(prev => ({ ...prev, title: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Task title"
          />
          
          <textarea
            value={editForm.description}
            onChange={(e) => setEditForm(prev => ({ ...prev, description: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            rows={3}
            placeholder="Task description"
          />
          
          <div className="flex flex-col sm:flex-row gap-4">
            <select
              value={editForm.priority}
              onChange={(e) => setEditForm(prev => ({ ...prev, priority: e.target.value as any }))}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="low">Low Priority</option>
              <option value="medium">Medium Priority</option>
              <option value="high">High Priority</option>
            </select>
            
            <input
              type="date"
              value={editForm.due_date}
              onChange={(e) => setEditForm(prev => ({ ...prev, due_date: e.target.value }))}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          <div className="flex gap-2">
            <button
              onClick={handleEdit}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center"
            >
              <Check className="h-4 w-4 mr-2" />
              Save
            </button>
            <button
              onClick={() => setIsEditing(false)}
              className="bg-gray-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-gray-700 transition-colors flex items-center"
            >
              <X className="h-4 w-4 mr-2" />
              Cancel
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-white rounded-xl shadow-sm border border-gray-200 p-6 transition-all duration-200 hover:shadow-md ${
      todo.completed ? 'opacity-75' : ''
    } ${isOverdue ? 'border-l-4 border-l-red-500' : ''}`}>
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-4 flex-1">
          <button
            onClick={() => onToggleComplete(todo.id, !todo.completed)}
            className={`mt-1 flex-shrink-0 h-5 w-5 rounded border-2 border-gray-300 flex items-center justify-center transition-colors ${
              todo.completed
                ? 'bg-blue-600 border-blue-600 text-white'
                : 'hover:border-blue-500'
            }`}
          >
            {todo.completed && <Check className="h-3 w-3" />}
          </button>
          
          <div className="flex-1 min-w-0">
            <h3 className={`text-lg font-medium ${
              todo.completed 
                ? 'line-through text-gray-500' 
                : 'text-gray-900'
            }`}>
              {todo.title}
            </h3>
            
            {todo.description && (
              <p className={`mt-1 text-sm ${
                todo.completed 
                  ? 'line-through text-gray-400' 
                  : 'text-gray-600'
              }`}>
                {todo.description}
              </p>
            )}
            
            <div className="flex items-center gap-3 mt-3">
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getPriorityColor(todo.priority)}`}>
                {todo.priority} priority
              </span>
              
              {todo.due_date && (
                <div className={`flex items-center text-xs ${
                  isOverdue 
                    ? 'text-red-600' 
                    : todo.completed 
                    ? 'text-gray-400' 
                    : 'text-gray-500'
                }`}>
                  <Calendar className="h-3 w-3 mr-1" />
                  {formatDate(todo.due_date)}
                  {isOverdue && (
                    <span className="ml-1 text-red-600 font-medium">(Overdue)</span>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setIsEditing(true)}
            className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
            title="Edit task"
          >
            <Edit2 className="h-4 w-4" />
          </button>
          
          <button
            onClick={() => onDelete(todo.id)}
            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            title="Delete task"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
};